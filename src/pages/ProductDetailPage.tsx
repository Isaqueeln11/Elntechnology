import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FileText,
  List,
  Moon,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Tag,
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';
import { formatStorePrice, isDemoStoreProduct, marketplaceNotice, type StoreProduct } from '../data/storeCatalog';
import logoUrl from '../../ELN TECHNOLOGY.svg';
import SiteFooter from '../components/SiteFooter';

function lines(value?: string) {
  return (value || '').split('\n').map((item) => item.trim()).filter(Boolean);
}

function specificationRows(value?: string) {
  return lines(value).map((item) => {
    const separator = item.indexOf(':');
    return separator > 0
      ? { label: item.slice(0, separator).trim(), value: item.slice(separator + 1).trim() }
      : { label: 'Detalhe', value: item };
  });
}

const sections = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'valor', label: 'Valor e compra' },
  { id: 'especificacoes', label: 'Especificações técnicas' },
  { id: 'recursos', label: 'Recursos e aplicações' },
  { id: 'links', label: 'Links úteis' },
];

export default function ProductDetailPage() {
  const { productId = '' } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'siteContent', productId),
      (snapshot) => {
        const data = snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as StoreProduct) : null;
        const isPublicProduct = data && ['lojas', 'produtos'].includes(data.page || '') && data.status !== 'Rascunho' && !isDemoStoreProduct(data);
        setProduct(isPublicProduct ? data : null);
        setIsLoading(false);
      },
      () => {
        setProduct(null);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [productId]);

  useEffect(() => {
    setImageFailed(false);
  }, [product?.imageUrl]);

  const specs = useMemo(() => specificationRows(product?.specifications), [product?.specifications]);
  const features = useMemo(() => lines(product?.features), [product?.features]);
  const purchaseUrl = product?.url || `https://wa.me/5581997092380?text=${encodeURIComponent(`Olá, quero saber sobre ${product?.title || 'um produto da ELN Technology'}`)}`;
  const externalMarketplaceNotice = product ? marketplaceNotice(product) : '';
  const panel = isDark ? 'border-white/10 bg-white/[0.045]' : 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]';
  const muted = isDark ? 'text-slate-300' : 'text-slate-600';

  if (isLoading) {
    return <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}><p className="font-black">Carregando produto...</p></div>;
  }

  if (!product) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}>
        <div className={`max-w-lg rounded-md border p-8 text-center ${panel}`}>
          <Package className="mx-auto h-10 w-10 text-[#159AFD]" />
          <h1 className="mt-5 text-2xl font-black">Produto não encontrado</h1>
          <Link to="/lojas" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white"><ArrowLeft className="h-4 w-4" /> Voltar para loja</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F1F5F9] text-slate-950'}`}>
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#080B24]/94' : 'border-slate-200 bg-white/95'}`}>
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="ELN Technology" className="h-10 w-24 object-contain" />
            <span className="notranslate hidden font-black sm:block" translate="no">ELN Technology</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/lojas" className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`}>
              <ArrowLeft className="h-4 w-4" />
              Loja
            </Link>
            <button type="button" onClick={toggleTheme} className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`} aria-label="Alternar tema">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <nav className={`mobile-scrollbar flex gap-2 overflow-x-auto rounded-md border p-2 lg:hidden ${panel}`}>
          {sections.map((section) => <a key={section.id} href={`#${section.id}`} className={`flex-none rounded-md px-3 py-2 text-xs font-black ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>{section.label}</a>)}
        </nav>
        <main className="min-w-0 space-y-6">
          <section id="visao-geral" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <Link to="/lojas" className="inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline"><ArrowLeft className="h-4 w-4" /> Voltar para produtos</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className={`flex aspect-square items-center justify-center overflow-hidden rounded-md border ${isDark ? 'border-white/10 bg-[#0B102C]' : 'border-slate-200 bg-slate-50'}`}>
                {product.imageUrl && !imageFailed ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title || 'Produto ELN Technology'}
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center">
                    <Cpu className="mx-auto h-20 w-20 text-[#159AFD]" />
                    <p className={`mt-3 px-4 text-xs font-black uppercase tracking-widest ${muted}`}>{product.sku || 'ELN Technology'}</p>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-[#159AFD]/15 px-3 py-1 text-xs font-black uppercase text-[#159AFD]">{product.category || product.type || 'Produto'}</span>
                  {product.featured && <span className="rounded-md bg-amber-400/15 px-3 py-1 text-xs font-black uppercase text-amber-500">Destaque</span>}
                  <span className={`rounded-md px-3 py-1 text-xs font-black uppercase ${product.availability === 'Indisponível' ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'}`}>{product.availability || 'Disponível'}</span>
                </div>
                <h1 className={`mt-5 text-3xl font-black leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>{product.title}</h1>
                <p className={`mt-2 text-sm font-bold ${muted}`}>
                  {product.type || 'Produto'} {product.sku ? `· ${product.sku}` : ''} {product.marketplace ? `· ${product.marketplace}` : ''}
                </p>
                <p className={`mt-5 text-base leading-8 ${muted}`}>{product.description || 'Produto desenvolvido pela ELN Technology.'}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {specs.slice(0, 4).map((item) => <span key={`${item.label}-${item.value}`} className={`rounded-md border px-3 py-2 text-xs font-black ${isDark ? 'border-white/10 bg-[#0B102C] text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{item.value}</span>)}
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-md border p-5 sm:p-6 ${panel}`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">ELN Technology</p>
                <h2 className={`mt-2 text-xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Projeto, suporte e evolução em um só atendimento</h2>
                <p className={`mt-2 text-sm ${muted}`}>Converse diretamente com a equipe para tirar dúvidas técnicas e adaptar a solução.</p>
              </div>
              <a href={purchaseUrl} target="_blank" rel="noreferrer" className="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white hover:bg-[#0D0F52]">Falar com especialista <ArrowRight className="h-4 w-4" /></a>
            </div>
          </section>

          <section id="sobre" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Sobre</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Sobre {product.title}</h2>
            <div className={`mt-6 border-l-2 border-[#159AFD] pl-5 leading-8 ${muted}`}>
              <p>{product.description || 'Solução criada para atender aplicações reais com organização técnica, testes e suporte da ELN Technology.'}</p>
              <p className="mt-4">A configuração final pode ser personalizada conforme a necessidade do projeto, ambiente de uso e integrações desejadas.</p>
            </div>
          </section>

          <section id="valor" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Valor e compra</p><p className={`mt-3 text-3xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>{formatStorePrice(product)}</p><p className={`mt-2 text-sm ${muted}`}>{product.marketplace ? `${product.marketplace} · ` : ''}{product.availability || 'Disponível para consulta'}</p></div>
              <a href={purchaseUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D0F52] px-6 py-4 font-black text-white hover:bg-[#159AFD] dark:bg-[#159AFD]"><ShoppingCart className="h-5 w-5" /> {externalMarketplaceNotice ? 'Abrir marketplace' : 'Comprar ou consultar'}</a>
            </div>
            {externalMarketplaceNotice && (
              <div className={`mt-6 rounded-md border p-4 text-sm font-bold leading-6 ${isDark ? 'border-amber-300/25 bg-amber-400/10 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                {externalMarketplaceNotice}
              </div>
            )}
          </section>

          <section id="especificacoes" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Ficha técnica</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Especificações técnicas</h2>
            <div className="mt-6 overflow-hidden rounded-md border border-slate-200 dark:border-white/10">
              {(specs.length ? specs : [{ label: 'Categoria', value: product.category || 'Produto ELN Technology' }, { label: 'Disponibilidade', value: product.availability || 'Sob consulta' }]).map((item, index) => (
                <div key={`${item.label}-${index}`} className={`grid gap-2 px-4 py-4 sm:grid-cols-[180px_1fr] ${index % 2 === 0 ? isDark ? 'bg-white/[0.035]' : 'bg-slate-50' : ''}`}>
                  <span className="text-sm font-black text-[#159AFD]">{item.label}</span><span className={`text-sm font-semibold ${muted}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="recursos" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Aplicações</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Recursos e possibilidades</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(features.length ? features : ['Configuração personalizada', 'Suporte técnico ELN Technology', 'Documentação organizada', 'Evolução conforme a necessidade']).map((feature) => (
                <div key={feature} className={`flex items-start gap-3 rounded-md border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#159AFD]" /><span className="font-bold">{feature}</span></div>
              ))}
            </div>
          </section>

          <section id="links" className={`rounded-md border p-5 sm:p-8 ${panel}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Referências</p>
            <h2 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#101A2E]'}`}>Links úteis</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.datasheetUrl && <a href={product.datasheetUrl} target="_blank" rel="noreferrer" className={`flex items-center justify-between gap-3 rounded-md border p-4 font-black ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><span className="inline-flex items-center gap-3"><FileText className="h-5 w-5 text-[#159AFD]" /> Datasheet</span><ExternalLink className="h-4 w-4" /></a>}
              <a href={purchaseUrl} target="_blank" rel="noreferrer" className={`flex items-center justify-between gap-3 rounded-md border p-4 font-black ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><span className="inline-flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#159AFD]" /> Atendimento oficial</span><ExternalLink className="h-4 w-4" /></a>
            </div>
          </section>
        </main>

        <aside className="hidden lg:block">
          <nav className={`sticky top-24 rounded-md border p-5 ${panel}`}>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-white/10"><List className="h-5 w-5 text-[#159AFD]" /><span className="font-black">Conteúdo</span></div>
            <div className="mt-3 grid gap-1">
              {sections.map((section) => <a key={section.id} href={`#${section.id}`} className={`rounded-md border-l-2 border-transparent px-3 py-3 text-sm font-semibold transition hover:border-[#159AFD] hover:text-[#159AFD] ${muted}`}>{section.label}</a>)}
            </div>
            <div className={`mt-5 rounded-md border p-4 ${isDark ? 'border-white/10 bg-[#0B102C]' : 'border-slate-200 bg-slate-50'}`}><Tag className="h-5 w-5 text-[#159AFD]" /><p className="mt-3 text-xs font-black uppercase text-slate-500">Código</p><p className="mt-1 break-all text-sm font-black">{product.sku || product.id}</p></div>
          </nav>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
