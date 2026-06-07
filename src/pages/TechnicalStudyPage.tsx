import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Cpu,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  List,
  Moon,
  Pin,
  Sun,
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';
import type { StoreProduct } from '../data/storeCatalog';
import logoUrl from '../../ELN TECHNOLOGY.svg';
import SiteFooter from '../components/SiteFooter';

function lines(value?: string) {
  return (value || '').split('\n').map((item) => item.trim()).filter(Boolean);
}

function rows(value?: string) {
  return lines(value).map((item) => {
    const index = item.indexOf(':');
    return index > 0
      ? { label: item.slice(0, index).trim(), value: item.slice(index + 1).trim() }
      : { label: 'Nota', value: item };
  });
}

const sections = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'especificacoes', label: 'Especificações' },
  { id: 'configuracao', label: 'Configuração rápida' },
  { id: 'pinagem', label: 'Pinagem e notas' },
  { id: 'links', label: 'Links úteis' },
];

export default function TechnicalStudyPage() {
  const { studyId = '' } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const [study, setStudy] = useState<StoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'siteContent', studyId),
      (snapshot) => {
        const data = snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as StoreProduct) : null;
        setStudy(data?.page === 'estudos' && data.status !== 'Rascunho' ? data : null);
        setIsLoading(false);
      },
      () => {
        setStudy(null);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [studyId]);

  useEffect(() => {
    setImageFailed(false);
  }, [study?.imageUrl]);

  const specs = useMemo(() => rows(study?.specifications), [study?.specifications]);
  const notes = useMemo(() => lines(study?.features), [study?.features]);
  const panel = isDark ? 'border-white/10 bg-[#0B102C]' : 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]';
  const muted = isDark ? 'text-slate-300' : 'text-slate-600';

  if (isLoading) {
    return <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}><p className="font-black">Carregando estudo...</p></div>;
  }

  if (!study) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}>
        <div className={`max-w-lg rounded-md border p-8 text-center ${panel}`}>
          <Cpu className="mx-auto h-10 w-10 text-[#159AFD]" />
          <h1 className="mt-5 text-2xl font-black">Estudo não encontrado</h1>
          <Link to="/estudos" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white"><ArrowLeft className="h-4 w-4" /> Voltar para estudos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}>
      <header className={`sticky top-0 z-40 border-b ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-slate-200 bg-white'}`}>
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="ELN Technology" className="h-10 w-24 object-contain" />
            <span className="notranslate hidden font-black sm:block" translate="no">ELN Technology</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/estudos" className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold ${isDark ? 'border-white/10 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <ArrowLeft className="h-4 w-4" />
              Estudos
            </Link>
            <button type="button" onClick={toggleTheme} className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${isDark ? 'border-white/10 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`} aria-label="Alternar tema">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <main className="min-w-0 space-y-6">
          <section id="visao-geral" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <Link to="/estudos" className="inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline"><ArrowLeft className="h-4 w-4" /> Voltar aos estudos</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className={`flex aspect-square items-center justify-center overflow-hidden rounded-md border ${isDark ? 'border-white/10 bg-[#070A1F]' : 'border-slate-200 bg-slate-50'}`}>
                {study.imageUrl && !imageFailed ? (
                  <img src={study.imageUrl} alt={study.title || 'Estudo ELN Technology'} onError={() => setImageFailed(true)} className="h-full w-full object-contain p-4" />
                ) : (
                  <Cpu className="h-24 w-24 text-[#159AFD]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#159AFD]/15 px-3 py-1 text-xs font-black uppercase text-[#159AFD]">{study.category || 'Estudo técnico'}</span>
                  {study.sku && <span className={`rounded-md px-3 py-1 text-xs font-black uppercase ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{study.sku}</span>}
                </div>
                <h1 className={`mt-5 text-3xl font-black leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>{study.title}</h1>
                <p className={`mt-5 text-base leading-8 ${muted}`}>{study.description || 'Estudo técnico registrado pela ELN Technology.'}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {specs.slice(0, 5).map((item) => <span key={`${item.label}-${item.value}`} className={`rounded-md border px-3 py-2 text-xs font-black ${isDark ? 'border-white/10 bg-[#070A1F] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{item.value}</span>)}
                </div>
              </div>
            </div>
          </section>

          <section id="especificacoes" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Ficha técnica</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Especificações</h2>
            <div className="mt-6 overflow-hidden rounded-md border border-slate-200 dark:border-white/10">
              {(specs.length ? specs : [{ label: 'Categoria', value: study.category || 'Estudo técnico' }, { label: 'Modelo', value: study.sku || study.title || 'A definir' }]).map((item, index) => (
                <div key={`${item.label}-${index}`} className={`grid gap-2 px-4 py-4 sm:grid-cols-[190px_1fr] ${index % 2 === 0 ? isDark ? 'bg-white/[0.035]' : 'bg-slate-50' : ''}`}>
                  <span className="text-sm font-black text-[#159AFD]">{item.label}</span>
                  <span className={`text-sm font-semibold ${muted}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="configuracao" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Configuração rápida</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Passos e testes</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(notes.length ? notes : ['Anote aqui bibliotecas, IDE, tensão, drivers, portas, comandos e resultado dos testes.']).map((note) => (
                <div key={note} className={`rounded-md border p-4 text-sm font-semibold leading-6 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>{note}</div>
              ))}
            </div>
          </section>

          <section id="pinagem" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Pinagem e notas</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Observações práticas</h2>
            <p className={`mt-4 leading-8 ${muted}`}>
              Use o campo de especificações para guardar pinagem, dimensões, tensão, comunicação, memória, consumo e limitações encontradas no estudo.
            </p>
          </section>

          <section id="links" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Referências</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Links úteis</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {study.datasheetUrl && <a href={study.datasheetUrl} target="_blank" rel="noreferrer" className={`flex items-center justify-between gap-3 rounded-md border p-4 font-black ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><span className="inline-flex items-center gap-3"><FileText className="h-5 w-5 text-[#159AFD]" /> Datasheet</span><ExternalLink className="h-4 w-4" /></a>}
              {study.url && <a href={study.url} target="_blank" rel="noreferrer" className={`flex items-center justify-between gap-3 rounded-md border p-4 font-black ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><span className="inline-flex items-center gap-3"><LinkIcon className="h-5 w-5 text-[#159AFD]" /> Referência principal</span><ExternalLink className="h-4 w-4" /></a>}
            </div>
          </section>
        </main>

        <aside className="hidden lg:block">
          <nav className={`sticky top-24 rounded-md border p-5 ${panel}`}>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-white/10"><List className="h-5 w-5 text-[#159AFD]" /><span className="font-black">Conteúdo</span></div>
            <div className="mt-3 grid gap-1">
              {sections.map((section) => <a key={section.id} href={`#${section.id}`} className={`rounded-md border-l-2 border-transparent px-3 py-3 text-sm font-semibold hover:border-[#159AFD] hover:text-[#159AFD] ${muted}`}>{section.label}</a>)}
            </div>
            <div className={`mt-5 rounded-md border p-4 ${isDark ? 'border-white/10 bg-[#070A1F]' : 'border-slate-200 bg-slate-50'}`}>
              <Pin className="h-5 w-5 text-[#159AFD]" />
              <p className="mt-3 text-xs font-black uppercase text-slate-500">Modelo</p>
              <p className="mt-1 break-all text-sm font-black">{study.sku || study.id}</p>
            </div>
          </nav>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
