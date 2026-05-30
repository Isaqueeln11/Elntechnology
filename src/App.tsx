import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  ArrowRight,
  BarChart3,
  Box,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Instagram,
  Mail,
  Menu,
  Microscope,
  Moon,
  MonitorPlay,
  Package,
  Phone,
  Printer,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Login';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ExplorarSolucoes from './pages/ExplorarSolucoes';
import IniciarProjeto from './pages/IniciarProjeto';
import Inovacoes from './pages/Inovacoes';
import PCBs from './pages/PCBs';
import {
  AtividadesAnalisePage,
  DesenvolvimentosPage,
  EquipePage,
  MelhoriasPage,
  NoticiasInovacoesPage,
  ProdutosPage,
  ProjetosDesenvolvidos,
  VideosFuturoPage,
} from './pages/CompanyPages';
import { db } from './firebase';
import logoUrl from '../ELN TECHNOLOGY.svg';

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Soluções', href: '#servicos' },
  { label: 'Contato', href: '#contato' },
];

const services = [
  {
    icon: Wifi,
    title: 'IoT e automação',
    description: 'Sensores, dashboards e automação conectada para acompanhar tudo pelo painel.',
    items: ['ESP32 e Arduino', 'Painel web', 'Alertas e relatórios'],
  },
  {
    icon: Printer,
    title: 'Impressão 3D',
    description: 'Protótipos, suportes, caixas e peças sob medida para validar ideias rápido.',
    items: ['Modelagem', 'Protótipo', 'Ajuste técnico'],
  },
  {
    icon: Bot,
    title: 'Robôs e sistemas inteligentes',
    description: 'Robótica educacional, assistiva ou operacional com sensores, motores e controle.',
    items: ['Robôs móveis', 'Motores', 'Automação'],
  },
  {
    icon: CircuitBoard,
    title: 'Eletrônica e PCBs',
    description: 'Circuitos, placas, firmware e integração entre hardware e software.',
    items: ['PCB', 'Firmware', 'Testes'],
  },
];

const projectCards = [
  {
    title: 'Casa conectada',
    tag: 'IoT',
    text: 'Automação de iluminação, sensores de presença, temperatura e controle remoto seguro.',
    icon: Cpu,
  },
  {
    title: 'Protótipo funcional',
    tag: '3D + eletrônica',
    text: 'Da ideia ao produto: desenho técnico, impressão 3D, circuito e testes em bancada.',
    icon: Box,
  },
  {
    title: 'Robô personalizado',
    tag: 'Robótica',
    text: 'Robô para estudo, apresentação, rotina operacional ou prova de conceito.',
    icon: Bot,
  },
];

const process = [
  'Entendimento da ideia e objetivo',
  'Desenho da solução e escolha dos componentes',
  'Protótipo, testes e ajustes',
  'Entrega organizada com orientação de uso',
];

const aboutItems = [
  {
    icon: CircuitBoard,
    title: 'Hardware e software juntos',
    text: 'A equipe pensa no circuito, no firmware, no painel e na experiência de uso como uma solução única.',
  },
  {
    icon: Microscope,
    title: 'Protótipos testados',
    text: 'Cada entrega passa por montagem, validação e ajustes para reduzir erro antes do uso real.',
  },
  {
    icon: ShieldCheck,
    title: 'Atendimento direto',
    text: 'O cliente fala com quem entende o projeto, acompanha as etapas e recebe orientação para evoluir.',
  },
];

const siteAreas = [
  {
    icon: CircuitBoard,
    title: 'Projetos desenvolvidos',
    text: 'Publique projetos prontos, fotos, links, arquivos e resultado final.',
    href: '/projetos-desenvolvidos',
  },
  {
    icon: Wrench,
    title: 'Melhorias',
    text: 'Organize correções, prioridades, segurança e próximas funções.',
    href: '/melhorias',
  },
  {
    icon: Users,
    title: 'Equipe',
    text: 'Mostre administrador, técnicos, parceiros, cargos e responsabilidades.',
    href: '/equipe',
  },
  {
    icon: BarChart3,
    title: 'Atividades e análise',
    text: 'Acompanhe atividades, indicadores, eventos e relatórios.',
    href: '/atividades-analise',
  },
  {
    icon: Rocket,
    title: 'Desenvolvimentos',
    text: 'Liste firmware, painel, hardware, OTA e versões em construção.',
    href: '/desenvolvimentos',
  },
  {
    icon: Package,
    title: 'Produtos',
    text: 'Monte catálogo com produtos, equipamentos, serviços e valores.',
    href: '/produtos',
  },
  {
    icon: MonitorPlay,
    title: 'Vídeos e futuro',
    text: 'Espaço para demonstrações, novidades, roadmap e vídeos futuros.',
    href: '/videos-futuro',
  },
  {
    icon: Sparkles,
    title: 'Notícias e inovações',
    text: 'Publique novidades, lançamentos, comunicados e evoluções do sistema.',
    href: '/noticias-inovacoes',
  },
];

const defaultAreasSection = {
  eyebrow: 'Espaços do site',
  title: 'Áreas para acompanhar projetos, equipe, produtos e novidades.',
  description: 'Conteúdo organizado em páginas separadas, com informações publicadas pela administração.',
  buttonLabel: 'Ver notícias e inovações',
  buttonHref: '/noticias-inovacoes',
};

function BrandName({ className = '' }: { className?: string }) {
  return (
    <span className={`notranslate ${className}`} translate="no">
      ELN Technology
    </span>
  );
}

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState('IoT e automação');
  const [showAllAreas, setShowAllAreas] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState('');
  const [areasSection, setAreasSection] = React.useState(defaultAreasSection);
  const { isDark, toggleTheme } = useTheme();
  const activeService = services.find((service) => service.title === selectedService) || services[0];
  const visibleAreas = showAllAreas ? siteAreas : siteAreas.slice(0, 4);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteSettings', 'areasSection'), (snapshot) => {
      if (!snapshot.exists()) return;
      setAreasSection({ ...defaultAreasSection, ...snapshot.data() });
    });

    return unsubscribe;
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const type = data.get('type')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    const text = encodeURIComponent(
      `Olá, sou ${name || 'um cliente'}.\nWhatsApp: ${phone || 'não informado'}\nProjeto: ${type || 'não informado'}\n\n${message || ''}`,
    );

    window.open(`https://wa.me/5581997092380?text=${text}`, '_blank', 'noopener,noreferrer');
    setFormStatus(
      name
        ? `${name}, sua solicitacao foi preparada no WhatsApp.`
        : 'Solicitacao preparada no WhatsApp.',
    );
    event.currentTarget.reset();
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F7FBFF] text-slate-950'}`}>
      <header className={`fixed inset-x-0 top-0 z-50 border-b shadow-sm backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#080B24]/92' : 'border-sky-100/70 bg-white/90'}`}>
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="ELN Technology">
            <img src={logoUrl} alt="ELN Technology" className="h-12 w-28 object-contain sm:w-36" />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={`text-sm font-semibold transition hover:text-sky-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/10' : 'border-sky-100 text-slate-700 hover:bg-sky-50'}`}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className={`rounded-md px-4 py-2 text-sm font-semibold transition hover:text-sky-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Login
            </Link>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-[#0D0F52]"
            >
              Iniciar projeto
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border lg:hidden ${isDark ? 'border-white/10 text-white' : 'border-sky-100 text-slate-900'}`}
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className={`border-t px-4 py-4 lg:hidden ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-sky-100 bg-white'}`}>
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-3 font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={toggleTheme} className={`rounded-md px-3 py-3 text-left font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}>
                {isDark ? 'Modo claro' : 'Modo noturno'}
              </button>
              <Link to="/login" className={`rounded-md px-3 py-3 font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}>
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="inicio">
        <section className={`relative overflow-hidden pt-28 ${isDark ? 'bg-[#070A1F]' : 'bg-white'}`}>
          <div className={`absolute inset-0 circuit-grid ${isDark ? 'opacity-25' : 'opacity-70'}`} />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24">
            <div className="relative z-10">
              <div className={`mb-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-bold ${
                isDark ? 'border-white/10 bg-white/5 text-sky-100' : 'border-sky-100 bg-sky-50 text-[#0D0F52]'
              }`}>
                <Sparkles className="h-4 w-4 text-[#159AFD]" />
                Inovação em tecnologia para tirar ideias do papel
              </div>

              <h1 className={`max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                <BrandName />
                <span className="mt-3 block text-[#159AFD]">IoT, impressão 3D, robôs e eletrônica.</span>
              </h1>

              <p className={`mt-6 max-w-2xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Automação, protótipos, sistemas embarcados e soluções inteligentes em um site mais direto, organizado e fácil de navegar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D0F52] px-6 py-4 font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#159AFD]"
                >
                  Solicitar orçamento
                  <Send className="h-5 w-5" />
                </a>
                <a
                  href="#servicos"
                  className={`inline-flex items-center justify-center gap-2 rounded-md border px-6 py-4 font-bold transition hover:-translate-y-0.5 hover:border-[#159AFD] hover:text-[#159AFD] ${
                    isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-sky-200 bg-white text-[#0D0F52]'
                  }`}
                >
                  Ver soluções
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>

              <div className={`mt-10 flex flex-wrap gap-3 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                {['Projetos sob medida', 'Painel web', 'OTA e firmware'].map((item) => (
                  <span key={item} className={`rounded-md border px-4 py-3 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white/90'}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative mx-auto max-w-xl">
                <div className={`absolute -inset-6 rounded-full border hero-spin ${isDark ? 'border-sky-400/20' : 'border-sky-100'}`} />
                <div className={`relative overflow-hidden rounded-md border p-5 shadow-2xl ${
                  isDark ? 'border-white/10 bg-white/[0.04] shadow-black/20' : 'border-sky-100 bg-white shadow-sky-900/10'
                }`}>
                  <img src={logoUrl} alt="Logo ELN Technology" className="w-full object-contain" />
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      ['Protótipos', 'rápidos'],
                      ['Sistemas', 'conectados'],
                      ['Hardware', 'sob medida'],
                      ['Entrega', 'organizada'],
                    ].map(([top, bottom]) => (
                      <div key={top} className={`rounded-md px-4 py-3 text-white ${isDark ? 'bg-sky-500/15 ring-1 ring-sky-400/20' : 'bg-slate-950'}`}>
                        <div className="text-sm font-bold">{top}</div>
                        <div className="text-xs text-sky-200">{bottom}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className={`${isDark ? 'bg-[#0B102C]' : 'bg-[#F7FBFF]'} py-20`}>
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Sobre nós</p>
              <h2 className={`mt-3 text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                Uma equipe focada em transformar ideia em sistema funcionando.
              </h2>
              <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                A <BrandName /> une eletrônica, impressão 3D, automação, robótica e desenvolvimento web em projetos prontos para uso.
              </p>
              <div className={`mt-8 rounded-md border p-5 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white'}`}>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Administrador</p>
                <h3 className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Isaque Domingos Santana Silva</h3>
                <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Responsável por organizar clientes, projetos, valores, técnicos, atualizações OTA e entregas dentro do painel administrativo.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {aboutItems.map(({ icon: Icon, title, text }) => (
                <article key={title} className={`rounded-md border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#159AFD] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{title}</h3>
                      <p className={`mt-2 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="areas" className={`${isDark ? 'bg-[#080B24]' : 'bg-white'} py-20`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl border p-6 sm:p-8 lg:p-10 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-sky-100 bg-[#F7FBFF]'}`}>
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{areasSection.eyebrow}</p>
                <h2 className={`mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                  {areasSection.title}
                </h2>
                <p className={`mt-5 max-w-3xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {areasSection.description}
                </p>
              </div>
              <Link
                to={areasSection.buttonHref || '/noticias-inovacoes'}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]"
              >
                {areasSection.buttonLabel || 'Ver novidades'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleAreas.map(({ icon: Icon, title, text, href }) => (
                <Link
                  key={href}
                  to={href}
                  className={`group rounded-md border p-6 transition hover:-translate-y-1 hover:border-[#159AFD] ${
                    isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-sky-100 bg-[#F7FBFF] shadow-sm hover:bg-white'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-5 text-xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{title}</h3>
                  <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#159AFD]">
                    Abrir página
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllAreas((value) => !value)}
                className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-black transition ${
                  isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-sky-200 bg-white text-[#0D0F52] hover:border-[#159AFD] hover:text-[#159AFD]'
                }`}
              >
                {showAllAreas ? 'Mostrar menos' : 'Ver todas as áreas'}
                <ChevronRight className={`h-4 w-4 transition ${showAllAreas ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </div>
            </div>
          </div>
        </section>

        <section id="servicos" className={`${isDark ? 'bg-[#0B102C]' : 'bg-[#EEF7FF]'} py-20`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Serviços</p>
                <h2 className={`mt-3 text-3xl font-black sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Soluções principais, sem excesso de informação.</h2>
                <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Escolha uma área e veja só o necessário para entender o serviço.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {services.map((service) => (
                    <button
                      key={service.title}
                      type="button"
                      onClick={() => setSelectedService(service.title)}
                      className={`rounded-md px-4 py-3 text-sm font-bold transition ${
                        selectedService === service.title
                          ? 'bg-[#0D0F52] text-white shadow-lg shadow-slate-900/15'
                          : isDark
                            ? 'bg-white/5 text-slate-200 hover:bg-white/10'
                            : 'bg-white text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <article className={`rounded-md border border-[#159AFD] p-7 shadow-xl ${
                  isDark ? 'bg-white/[0.04] shadow-black/20' : 'bg-white shadow-sky-900/10'
                }`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                    {React.createElement(activeService.icon, { className: 'h-7 w-7' })}
                  </div>
                  <h3 className={`mt-5 text-2xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{activeService.title}</h3>
                  <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{activeService.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {activeService.items.map((item) => (
                      <span key={item} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${
                        isDark ? 'bg-sky-400/10 text-sky-100' : 'bg-sky-50 text-[#0D0F52]'
                      }`}>
                        <CheckCircle2 className="h-4 w-4 text-[#159AFD]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="processo" className={`${isDark ? 'bg-[#070A1F]' : 'bg-white'} py-20`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Processo</p>
                <h2 className={`mt-3 text-3xl font-black sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Da ideia ao protótipo funcionando.</h2>
                <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  A entrega fica organizada em etapas para você acompanhar o andamento e entender cada decisão técnica.
                </p>
              </div>

              <div className="relative">
                <div className={`absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px sm:block ${isDark ? 'bg-sky-400/20' : 'bg-sky-200'}`} />
                <div className="space-y-5">
                  {process.map((step, index) => (
                    <div key={step} className={`relative flex gap-5 rounded-md border p-5 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-[#F7FBFF]'
                    }`}>
                      <div className="z-10 flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#0D0F52] font-black text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{step}</h3>
                        <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {index === 0 && 'Você explica a necessidade, o uso esperado e o tipo de resultado desejado.'}
                          {index === 1 && 'Definimos arquitetura, componentes, materiais, custo e tempo de produção.'}
                          {index === 2 && 'Montamos a primeira versão, medimos, corrigimos e melhoramos a solução.'}
                          {index === 3 && 'Você recebe o projeto de forma limpa, com funcionamento validado e próximo passo claro.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className="bg-[#0D0F52] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-sky-300">Aplicações</p>
                <h2 className="mt-3 text-3xl font-black sm:text-5xl">Exemplos simples do que pode ser desenvolvido.</h2>
              </div>
              <a href="#contato" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-[#0D0F52] transition hover:bg-sky-100">
                Conversar sobre projeto
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {projectCards.map((project) => {
                const Icon = project.icon;
                return (
                  <article key={project.title} className="rounded-md border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-md border border-sky-300/30 px-3 py-1 text-xs font-black uppercase text-sky-200">{project.tag}</span>
                    </div>
                    <h3 className="mt-6 text-2xl font-black">{project.title}</h3>
                    <p className="mt-3 leading-7 text-sky-100">{project.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contato" className="bg-[#EEF7FF] py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Contato</p>
              <h2 className="mt-3 max-w-3xl break-words text-3xl font-black leading-tight text-[#0D0F52] sm:text-4xl lg:text-5xl">
                Conte sua ideia para a <BrandName />.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Use o formulário para organizar o pedido. Ele funciona na página e deixa a solicitação pronta para retorno.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=elntechnologyinnovations@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-bold text-[#0D0F52] hover:text-[#159AFD]"
                >
                  <Mail className="h-5 w-5" />
                  elntechnologyinnovations@gmail.com
                </a>
                <a
                  href="https://wa.me/5581997092380"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-bold text-[#0D0F52] hover:text-[#159AFD]"
                >
                  <Phone className="h-5 w-5" />
                  WhatsApp: +55 (81) 99709-2380
                </a>
                <a
                  href="https://instagram.com/eln_technology"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-bold text-[#0D0F52] hover:text-[#159AFD]"
                >
                  <Instagram className="h-5 w-5" />
                  @eln_technology
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-md border border-sky-100 bg-white p-6 shadow-xl shadow-sky-900/10">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Nome
                  <input name="name" required className="mt-2 w-full rounded-md border border-sky-100 px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100" />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  WhatsApp
                  <input name="phone" required className="mt-2 w-full rounded-md border border-sky-100 px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100" />
                </label>
              </div>

              <label className="mt-4 block text-sm font-bold text-slate-700">
                Tipo de projeto
                <select name="type" className="mt-2 w-full rounded-md border border-sky-100 px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100">
                  <option>IoT e automação</option>
                  <option>Impressão 3D</option>
                  <option>Robótica</option>
                  <option>Eletrônica e PCB</option>
                  <option>Outro projeto de tecnologia</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-bold text-slate-700">
                Descreva sua ideia
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full resize-none rounded-md border border-sky-100 px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-6 py-4 font-black text-white transition hover:bg-[#0D0F52]">
                Enviar solicitacao
                <Zap className="h-5 w-5" />
              </button>

              {formStatus && <p className="mt-4 rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{formStatus}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-sky-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="" className="h-10 w-24 object-contain" />
            <BrandName className="font-semibold" />
          </div>
          <span>(c) 2026 <BrandName />. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explorar-solucoes" element={<ExplorarSolucoes />} />
            <Route path="/iniciar-projeto" element={<IniciarProjeto />} />
            <Route path="/inovacoes" element={<Inovacoes />} />
            <Route path="/pcbs" element={<PCBs />} />
            <Route path="/projetos-desenvolvidos" element={<ProjetosDesenvolvidos />} />
            <Route path="/melhorias" element={<MelhoriasPage />} />
            <Route path="/equipe" element={<EquipePage />} />
            <Route path="/atividades-analise" element={<AtividadesAnalisePage />} />
            <Route path="/desenvolvimentos" element={<DesenvolvimentosPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/videos-futuro" element={<VideosFuturoPage />} />
            <Route path="/noticias-inovacoes" element={<NoticiasInovacoesPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/dashboard/paginas" element={<Navigate to="/dashboard?tab=sitePages" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
