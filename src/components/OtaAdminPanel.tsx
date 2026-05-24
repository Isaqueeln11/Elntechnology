import React, { useMemo, useState } from 'react';
import { CheckCircle, Copy, Cpu, Download, FileCode2, Plus, Trash2, UploadCloud } from 'lucide-react';

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

const releasesStorageKey = 'eln-ota-releases';

const defaultReleases: FirmwareRelease[] = [
  {
    id: 'esp32-gateway-1-0-0',
    deviceId: 'esp32-gateway',
    deviceName: 'Gateway IoT ESP32',
    board: 'esp32',
    version: '1.0.0',
    binUrl: '/firmware/esp32-gateway-1.0.0.bin',
    sha256: 'preencha-o-sha256-do-binario-real',
    size: '0',
    notes: 'Primeira versao publicada para teste OTA.',
    active: true,
    createdAt: '2026-05-24',
  },
];

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

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return Date.now().toString();
}

function readReleases(): FirmwareRelease[] {
  try {
    const stored = window.localStorage?.getItem(releasesStorageKey);
    return stored ? JSON.parse(stored) : defaultReleases;
  } catch {
    return defaultReleases;
  }
}

function writeReleases(releases: FirmwareRelease[]) {
  try {
    window.localStorage?.setItem(releasesStorageKey, JSON.stringify(releases));
  } catch {
    // Local-only admin data until the project has a backend.
  }
}

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
    devices,
  };
}

const OtaAdminPanel = () => {
  const [releases, setReleases] = useState<FirmwareRelease[]>(() => readReleases());
  const [form, setForm] = useState(emptyForm);
  const [copyStatus, setCopyStatus] = useState('');

  const manifest = useMemo(() => makeManifest(releases), [releases]);
  const manifestJson = useMemo(() => JSON.stringify(manifest, null, 2), [manifest]);

  function saveReleases(nextReleases: FirmwareRelease[]) {
    setReleases(nextReleases);
    writeReleases(nextReleases);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextRelease: FirmwareRelease = {
      ...form,
      id: createId(),
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    saveReleases([nextRelease, ...releases]);
    setForm({
      ...emptyForm,
      deviceId: form.deviceId,
      deviceName: form.deviceName,
      board: form.board,
      binUrl: form.binUrl.replace(form.version, 'NOVA-VERSAO'),
    });
  }

  function toggleRelease(id: string) {
    saveReleases(
      releases.map((release) => (
        release.id === id ? { ...release, active: !release.active } : release
      )),
    );
  }

  function removeRelease(id: string) {
    saveReleases(releases.filter((release) => release.id !== id));
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
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#159AFD]/20 text-[#159AFD]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Novo firmware OTA</h3>
              <p className="text-sm text-gray-400">Cadastre a versao e o caminho do arquivo .bin publicado no site.</p>
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

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white transition hover:bg-[#508AD0]">
              <Plus className="h-5 w-5" />
              Adicionar firmware
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
                <p className="text-sm text-gray-400">Endpoint sugerido: /ota/manifest.json</p>
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
                    {release.deviceId} / {release.board} / {release.createdAt}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => toggleRelease(release.id)}
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
