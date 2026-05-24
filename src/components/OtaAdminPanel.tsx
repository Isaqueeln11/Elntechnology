import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { CheckCircle, Copy, Cpu, Database, Download, FileCode2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { db } from '../firebase';

interface FirmwareRelease {
  id: string;
  deviceId: string;
  deviceName: string;
  board: string;
  version: string;
  binUrl: string;
  sha256: string;
  size: string;
  notes: string;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  deviceId: 'esp32-gateway',
  deviceName: 'Gateway IoT ESP32',
  board: 'esp32',
  version: '',
  binUrl: '/firmware/esp32-gateway-1.0.1.bin',
  sha256: '',
  size: '',
  notes: '',
};

function makeManifest(releases: FirmwareRelease[]) {
  const activeReleases = releases.filter((release) => release.active);
  const devices = activeReleases.reduce<Record<string, unknown>>((acc, release) => {
    acc[release.deviceId] = {
      name: release.deviceName,
      board: release.board,
      latestVersion: release.version,
      firmware: {
        version: release.version,
        url: release.binUrl,
        sha256: release.sha256,
        size: Number(release.size) || 0,
        notes: release.notes,
      },
    };

    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    strategy: 'deviceId',
    source: 'firestore',
    devices,
  };
}

const OtaAdminPanel = () => {
  const [releases, setReleases] = useState<FirmwareRelease[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [copyStatus, setCopyStatus] = useState('');
  const [databaseStatus, setDatabaseStatus] = useState('Conectando ao Firestore...');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'firmwareReleases'),
      (snapshot) => {
        const nextReleases = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }) as FirmwareRelease)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setReleases(nextReleases);
        setDatabaseStatus('Dados sincronizados com Firestore.');
      },
      () => {
        setDatabaseStatus('Nao foi possivel conectar ao Firestore. Verifique as regras do banco.');
      },
    );

    return unsubscribe;
  }, []);

  const manifest = useMemo(() => makeManifest(releases), [releases]);
  const manifestJson = useMemo(() => JSON.stringify(manifest, null, 2), [manifest]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await addDoc(collection(db, 'firmwareReleases'), {
        ...form,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setForm({
        ...emptyForm,
        deviceId: form.deviceId,
        deviceName: form.deviceName,
        board: form.board,
        binUrl: form.binUrl.replace(form.version, 'NOVA-VERSAO'),
      });
      setDatabaseStatus('Firmware salvo no Firestore.');
    } catch {
      setDatabaseStatus('Erro ao salvar no Firestore. Verifique permissao e conexao.');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleRelease(release: FirmwareRelease) {
    try {
      await updateDoc(doc(db, 'firmwareReleases', release.id), {
        active: !release.active,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setDatabaseStatus('Erro ao atualizar firmware no Firestore.');
    }
  }

  async function removeRelease(id: string) {
    try {
      await deleteDoc(doc(db, 'firmwareReleases', id));
    } catch {
      setDatabaseStatus('Erro ao remover firmware do Firestore.');
    }
  }

  async function copyManifest() {
    try {
      await navigator.clipboard.writeText(manifestJson);
      setCopyStatus('Manifesto copiado.');
    } catch {
      setCopyStatus('Nao foi possivel copiar automaticamente.');
    }
  }

  const downloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(manifestJson)}`;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#159AFD]/30 bg-[#159AFD]/10 p-4 text-sm font-semibold text-sky-100">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 flex-none text-[#159AFD]" />
          <span>{databaseStatus}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#159AFD]/20 text-[#159AFD]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Novo firmware OTA</h3>
              <p className="text-sm text-gray-400">Cadastre a versao no banco Firestore.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-300">
                ID do equipamento
                <input
                  value={form.deviceId}
                  onChange={(event) => setForm({ ...form, deviceId: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                  placeholder="esp32-gateway"
                  required
                />
              </label>

              <label className="text-sm font-medium text-gray-300">
                Nome
                <input
                  value={form.deviceName}
                  onChange={(event) => setForm({ ...form, deviceName: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                  placeholder="Gateway IoT ESP32"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-gray-300">
                Placa
                <input
                  value={form.board}
                  onChange={(event) => setForm({ ...form, board: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                  placeholder="esp32"
                  required
                />
              </label>

              <label className="text-sm font-medium text-gray-300">
                Versao
                <input
                  value={form.version}
                  onChange={(event) => setForm({ ...form, version: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                  placeholder="1.0.1"
                  required
                />
              </label>

              <label className="text-sm font-medium text-gray-300">
                Tamanho
                <input
                  value={form.size}
                  onChange={(event) => setForm({ ...form, size: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                  placeholder="1048576"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-300">
              URL do .bin
              <input
                value={form.binUrl}
                onChange={(event) => setForm({ ...form, binUrl: event.target.value })}
                className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                placeholder="/firmware/esp32-gateway-1.0.1.bin"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-300">
              SHA-256
              <input
                value={form.sha256}
                onChange={(event) => setForm({ ...form, sha256: event.target.value })}
                className="mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                placeholder="hash do arquivo binario"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-300">
              Notas
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                className="mt-2 h-24 w-full resize-none rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none focus:border-[#159AFD]"
                placeholder="Correcoes, melhorias e observacoes da versao"
              />
            </label>

            <button
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white transition hover:bg-[#508AD0] disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              <Plus className="h-5 w-5" />
              {isSaving ? 'Salvando...' : 'Adicionar firmware'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#159AFD]/20 text-[#159AFD]">
                <FileCode2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Manifesto do equipamento</h3>
                <p className="text-sm text-gray-400">Gerado com os dados ativos do Firestore.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={copyManifest}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#159AFD]/30 px-3 py-2 text-sm text-gray-200 hover:bg-[#159AFD]/20"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
              <a
                href={downloadHref}
                download="manifest.json"
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0D0F52] hover:bg-sky-100"
              >
                <Download className="h-4 w-4" />
                Baixar
              </a>
            </div>
          </div>

          {copyStatus && <p className="mb-3 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300">{copyStatus}</p>}

          <pre className="max-h-[520px] overflow-auto rounded-lg border border-[#159AFD]/20 bg-black/40 p-4 text-xs leading-6 text-sky-100">
            {manifestJson}
          </pre>
        </section>
      </div>

      <section className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#159AFD]/20 text-[#159AFD]">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Versoes cadastradas</h3>
            <p className="text-sm text-gray-400">Somente versoes ativas entram no manifesto.</p>
          </div>
        </div>

        <div className="space-y-3">
          {releases.length === 0 && (
            <div className="rounded-lg border border-[#159AFD]/20 bg-black/20 p-5 text-sm text-gray-300">
              Nenhum firmware salvo no Firestore ainda.
            </div>
          )}

          {releases.map((release) => (
            <article key={release.id} className="rounded-lg border border-[#159AFD]/20 bg-black/20 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-semibold text-white">{release.deviceName}</h4>
                    <span className="rounded-full bg-[#159AFD]/20 px-3 py-1 text-xs font-semibold text-[#159AFD]">
                      {release.version}
                    </span>
                    {release.active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <CheckCircle className="h-3 w-3" />
                        ativo
                      </span>
                    )}
                  </div>
                  <p className="mt-2 break-all text-sm text-gray-400">{release.binUrl}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {release.deviceId} / {release.board} / {release.createdAt.slice(0, 10)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => toggleRelease(release)}
                    className="rounded-lg border border-[#159AFD]/30 px-3 py-2 text-sm text-gray-200 hover:bg-[#159AFD]/20"
                  >
                    {release.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRelease(release.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OtaAdminPanel;
