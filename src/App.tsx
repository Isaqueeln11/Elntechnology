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
  Globe2,
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
  Store,
  Sun,
  Users,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { db } from './firebase';
import logoUrl from '../ELN TECHNOLOGY.svg';
import SiteFooter from './components/SiteFooter';

const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const Login = React.lazy(() => import('./Login'));
const Register = React.lazy(() => import('./Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const ExplorarSolucoes = React.lazy(() => import('./pages/ExplorarSolucoes'));
const IniciarProjeto = React.lazy(() => import('./pages/IniciarProjeto'));
const Inovacoes = React.lazy(() => import('./pages/Inovacoes'));
const PCBs = React.lazy(() => import('./pages/PCBs'));
const ProjetosDesenvolvidos = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.ProjetosDesenvolvidos })));
const MelhoriasPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.MelhoriasPage })));
const EquipePage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.EquipePage })));
const AtividadesAnalisePage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.AtividadesAnalisePage })));
const DesenvolvimentosPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.DesenvolvimentosPage })));
const EstudosPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.EstudosPage })));
const ProdutosPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.ProdutosPage })));
const LojasPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.LojasPage })));
const VideosFuturoPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.VideosFuturoPage })));
const NoticiasInovacoesPage = React.lazy(() => import('./pages/CompanyPages').then((module) => ({ default: module.NoticiasInovacoesPage })));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const TechnicalStudyPage = React.lazy(() => import('./pages/TechnicalStudyPage'));

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Soluções', href: '#servicos' },
  { label: 'Estudos', href: '/estudos' },
  { label: 'Contato', href: '#contato' },
  { label: 'Loja', href: '/lojas' },
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
    text: 'Conheça projetos concluídos, soluções aplicadas e resultados entregues.',
    href: '/projetos-desenvolvidos',
  },
  {
    icon: Wrench,
    title: 'Melhorias',
    text: 'Acompanhe correções, recursos novos e evolução das soluções ELN.',
    href: '/melhorias',
  },
  {
    icon: Users,
    title: 'Equipe',
    text: 'Conheça as pessoas, especialidades e responsabilidades por trás dos projetos.',
    href: '/equipe',
  },
  {
    icon: BarChart3,
    title: 'Atividades e análise',
    text: 'Veja atividades recentes, indicadores e resultados importantes.',
    href: '/atividades-analise',
  },
  {
    icon: Rocket,
    title: 'Desenvolvimentos',
    text: 'Acompanhe firmware, hardware, painéis e atualizações em desenvolvimento.',
    href: '/desenvolvimentos',
  },
  {
    icon: Cpu,
    title: 'Base técnica',
    text: 'Guarde estudos de placas, módulos, datasheets, links, pinagem e anotações.',
    href: '/estudos',
  },
  {
    icon: Package,
    title: 'Produtos',
    text: 'Consulte produtos, equipamentos, serviços disponíveis e valores.',
    href: '/produtos',
  },
  {
    icon: MonitorPlay,
    title: 'Vídeos e futuro',
    text: 'Veja demonstrações reais, bastidores e próximos lançamentos.',
    href: '/videos-futuro',
  },
  {
    icon: Sparkles,
    title: 'Notícias e inovações',
    text: 'Acompanhe novidades, lançamentos e comunicados da ELN Technology.',
    href: '/noticias-inovacoes',
  },
  {
    icon: Store,
    title: 'Loja',
    text: 'Canais oficiais e atendimento para compra ficam aqui, sem ocupar o foco principal.',
    href: '/lojas',
  },
];

const defaultAreasSection = {
  eyebrow: 'Espaços do site',
  title: 'Áreas para acompanhar projetos, equipe, produtos e novidades.',
  description: 'Conteúdo organizado em páginas separadas, com informações publicadas pela administração.',
  buttonLabel: 'Ver notícias e inovações',
  buttonHref: '/noticias-inovacoes',
};

type Language = 'pt' | 'en' | 'es';

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'pt', label: 'PT' },
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
];

const copy = {
  pt: {
    nav: { '#sobre': 'Sobre', '#areas': 'Áreas', '#servicos': 'Soluções', '#contato': 'Contato', '/estudos': 'Estudos', '/lojas': 'Loja' },
    login: 'Login',
    startProject: 'Iniciar projeto',
    themeLight: 'Modo claro',
    themeDark: 'Modo noturno',
    heroTitle: 'Tecnologia sob medida.',
    heroText: 'Projetos de IoT, automação, impressão 3D, robótica e eletrônica com organização, teste e acompanhamento.',
    quote: 'Solicitar orçamento',
    solutions: 'Ver soluções',
    aboutEyebrow: 'Sobre nós',
    aboutTitle: 'Uma equipe focada em transformar ideia em sistema funcionando.',
    aboutText: 'A ELN Technology une eletrônica, impressão 3D, automação, robótica e desenvolvimento web em projetos prontos para uso.',
    admin: 'Equipe e operação',
    adminText: 'Organização de clientes, projetos, valores, técnicos, atualizações OTA e entregas dentro do painel administrativo.',
    areasFallbackButton: 'Ver novidades',
    openPage: 'Abrir página',
    showMore: 'Ver todas as áreas',
    showLess: 'Mostrar menos',
    improvementsEyebrow: 'Melhorias recomendadas',
    improvementsTitle: 'Próximos ajustes que mais deixam o sistema profissional.',
    improvementsText: 'Uma lista curta para evoluir o site sem encher a primeira tela de informação.',
    servicesEyebrow: 'Serviços',
    servicesTitle: 'Soluções principais, sem excesso de informação.',
    servicesText: 'Escolha uma área e veja só o necessário para entender o serviço.',
    processEyebrow: 'Processo',
    processTitle: 'Da ideia ao protótipo funcionando.',
    processText: 'A entrega fica organizada em etapas para você acompanhar o andamento e entender cada decisão técnica.',
    contactEyebrow: 'Contato',
    contactTitle: 'Conte sua ideia para a ELN Technology.',
    contactText: 'Use o formulário para organizar o pedido. Ele funciona na página e deixa a solicitação pronta para retorno.',
    name: 'Nome',
    phone: 'WhatsApp',
    projectType: 'Tipo de projeto',
    message: 'Descreva sua ideia',
    submit: 'Enviar solicitação',
  },
  en: {
    nav: { '#sobre': 'About', '#areas': 'Areas', '#servicos': 'Solutions', '#contato': 'Contact', '/estudos': 'Studies', '/lojas': 'Store' },
    login: 'Login',
    startProject: 'Start project',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    heroTitle: 'Custom technology.',
    heroText: 'IoT, automation, 3D printing, robotics and electronics projects with planning, testing and clear follow-up.',
    quote: 'Request quote',
    solutions: 'See solutions',
    aboutEyebrow: 'About us',
    aboutTitle: 'A team focused on turning ideas into working systems.',
    aboutText: 'ELN Technology brings electronics, 3D printing, automation, robotics and web development into ready-to-use projects.',
    admin: 'Team and operation',
    adminText: 'Organization of clients, projects, values, technicians, OTA updates and deliveries inside the admin panel.',
    areasFallbackButton: 'See updates',
    openPage: 'Open page',
    showMore: 'See all areas',
    showLess: 'Show less',
    improvementsEyebrow: 'Recommended improvements',
    improvementsTitle: 'Next adjustments that make the system feel more professional.',
    improvementsText: 'A short list to evolve the site without overloading the first screen.',
    servicesEyebrow: 'Services',
    servicesTitle: 'Main solutions, without information overload.',
    servicesText: 'Choose an area and see only what matters to understand the service.',
    processEyebrow: 'Process',
    processTitle: 'From idea to working prototype.',
    processText: 'The delivery is organized in steps so you can follow progress and understand each technical decision.',
    contactEyebrow: 'Contact',
    contactTitle: 'Tell ELN Technology your idea.',
    contactText: 'Use the form to organize the request. It prepares a message for follow-up.',
    name: 'Name',
    phone: 'WhatsApp',
    projectType: 'Project type',
    message: 'Describe your idea',
    submit: 'Send request',
  },
  es: {
    nav: { '#sobre': 'Nosotros', '#areas': 'Áreas', '#servicos': 'Soluciones', '#contato': 'Contacto', '/estudos': 'Estudios', '/lojas': 'Tienda' },
    login: 'Acceder',
    startProject: 'Iniciar proyecto',
    themeLight: 'Modo claro',
    themeDark: 'Modo nocturno',
    heroTitle: 'Tecnología a medida.',
    heroText: 'Proyectos de IoT, automatización, impresión 3D, robótica y electrónica con organización, pruebas y seguimiento.',
    quote: 'Solicitar presupuesto',
    solutions: 'Ver soluciones',
    aboutEyebrow: 'Sobre nosotros',
    aboutTitle: 'Un equipo enfocado en convertir ideas en sistemas funcionando.',
    aboutText: 'ELN Technology une electrónica, impresión 3D, automatización, robótica y desarrollo web en proyectos listos para usar.',
    admin: 'Equipo y operación',
    adminText: 'Organización de clientes, proyectos, valores, técnicos, actualizaciones OTA y entregas dentro del panel administrativo.',
    areasFallbackButton: 'Ver novedades',
    openPage: 'Abrir página',
    showMore: 'Ver todas las áreas',
    showLess: 'Mostrar menos',
    improvementsEyebrow: 'Mejoras recomendadas',
    improvementsTitle: 'Próximos ajustes que hacen el sistema más profesional.',
    improvementsText: 'Una lista corta para evolucionar el sitio sin llenar la primera pantalla.',
    servicesEyebrow: 'Servicios',
    servicesTitle: 'Soluciones principales, sin exceso de información.',
    servicesText: 'Elige un área y ve solo lo necesario para entender el servicio.',
    processEyebrow: 'Proceso',
    processTitle: 'De la idea al prototipo funcionando.',
    processText: 'La entrega se organiza por etapas para que puedas seguir el avance y entender cada decisión técnica.',
    contactEyebrow: 'Contacto',
    contactTitle: 'Cuéntale tu idea a ELN Technology.',
    contactText: 'Usa el formulario para organizar el pedido. Deja el mensaje listo para seguimiento.',
    name: 'Nombre',
    phone: 'WhatsApp',
    projectType: 'Tipo de proyecto',
    message: 'Describe tu idea',
    submit: 'Enviar solicitud',
  },
} satisfies Record<Language, Record<string, string | Record<string, string>>>;

function BrandName({ className = '' }: { className?: string }) {
  return (
    <span className={`notranslate ${className}`} translate="no">
      ELN Technology
    </span>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A1F] px-4 text-white">
      <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-5 py-4">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#159AFD]" />
        <span className="font-bold">Carregando ELN Technology...</span>
      </div>
    </div>
  );
}

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState('IoT e automação');
  const [showAllAreas, setShowAllAreas] = React.useState(false);
  const [language, setLanguage] = React.useState<Language>(() => {
    const savedLanguage = localStorage.getItem('eln-language');
    return savedLanguage === 'en' || savedLanguage === 'es' ? savedLanguage : 'pt';
  });
  const [formStatus, setFormStatus] = React.useState('');
  const [areasSection, setAreasSection] = React.useState(defaultAreasSection);
  const { isDark, toggleTheme } = useTheme();
  const activeService = services.find((service) => service.title === selectedService) || services[0];
  const visibleAreas = showAllAreas ? siteAreas : siteAreas.slice(0, 3);
  const t = copy[language];
  const navCopy = t.nav as Record<string, string>;

  React.useEffect(() => {
    localStorage.setItem('eln-language', language);
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
  }, [language]);

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
        ? `${name}, sua solicitação foi preparada no WhatsApp.`
        : 'Solicitação preparada no WhatsApp.',
    );
    event.currentTarget.reset();
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F7FBFF] text-slate-950'}`}>
      <header className={`fixed inset-x-0 top-0 z-50 border-b shadow-sm backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#080B24]/92' : 'border-sky-100/70 bg-white/90'}`}>
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="ELN Technology">
            <img src={logoUrl} alt="" className="h-10 w-16 flex-none object-contain" />
            <BrandName className={`hidden truncate text-base font-black sm:block ${isDark ? 'text-white' : 'text-[#0D0F52]'}`} />
          </a>

          <div className={`hidden items-center gap-1 rounded-md border p-1 min-[1120px]:flex ${
            isDark ? 'border-white/10 bg-white/[0.03]' : 'border-sky-100 bg-sky-50/70'
          }`}>
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link key={link.href} to={link.href} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-[#159AFD]/10 hover:text-[#159AFD] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {link.href === '/lojas' ? <Store className="h-4 w-4 text-[#159AFD]" /> : <Cpu className="h-4 w-4 text-[#159AFD]" />}
                  {navCopy[link.href] || link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={`rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-[#159AFD]/10 hover:text-[#159AFD] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {navCopy[link.href] || link.label}
                </a>
              )
            ))}
          </div>

          <div className="hidden items-center gap-3 min-[1120px]:flex">
            <label className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold ${
              isDark ? 'border-white/10 text-slate-200' : 'border-sky-100 text-slate-700'
            }`}>
              <Globe2 className="h-4 w-4 text-[#159AFD]" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className={`bg-transparent text-sm font-bold outline-none ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                aria-label="Escolher idioma"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="text-slate-950">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/10' : 'border-sky-100 text-slate-700 hover:bg-sky-50'}`}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className={`rounded-md px-2 py-2 text-sm font-semibold transition hover:text-sky-500 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.login}
            </Link>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-[#0D0F52]"
            >
              {t.startProject}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border min-[1120px]:hidden ${isDark ? 'border-white/10 text-white' : 'border-sky-100 text-slate-900'}`}
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className={`border-t px-4 py-4 min-[1120px]:hidden ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-sky-100 bg-white'}`}>
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 rounded-md bg-[#159AFD]/12 px-3 py-3 font-black text-[#159AFD]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.href === '/lojas' ? <Store className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
                    {navCopy[link.href] || link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-3 font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {navCopy[link.href] || link.label}
                  </a>
                )
              ))}
              <label className={`flex items-center gap-2 rounded-md px-3 py-3 font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}>
                <Globe2 className="h-4 w-4 text-[#159AFD]" />
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className={`w-full bg-transparent font-semibold outline-none ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                  aria-label="Escolher idioma"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-slate-950">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={toggleTheme} className={`rounded-md px-3 py-3 text-left font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}>
                {isDark ? t.themeLight : t.themeDark}
              </button>
              <Link to="/login" className={`rounded-md px-3 py-3 font-semibold ${isDark ? 'text-slate-200 hover:bg-white/10' : 'text-slate-700 hover:bg-sky-50'}`}>
                {t.login}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="inicio">
        <section className={`relative overflow-hidden pt-28 ${isDark ? 'bg-[#070A1F]' : 'bg-white'}`}>
          <div className={`absolute inset-0 circuit-grid ${isDark ? 'opacity-15' : 'opacity-35'}`} />
          <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
            <div className="relative z-10">
              <img src={logoUrl} alt="ELN Technology" className="mx-auto mb-8 h-20 w-48 object-contain sm:h-24 sm:w-60" />

              <h1 className={`mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                <BrandName />
                <span className="mt-3 block text-[#159AFD]">{t.heroTitle}</span>
              </h1>

              <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.heroText}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-6 py-4 font-black text-white shadow-xl shadow-sky-500/20 transition hover:bg-[#0D0F52]"
                >
                  {t.quote}
                  <Send className="h-5 w-5" />
                </a>
                <Link
                  to="/estudos"
                  className={`inline-flex items-center justify-center gap-2 rounded-md border px-6 py-4 font-bold transition hover:border-[#159AFD] hover:text-[#159AFD] ${
                    isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-sky-200 bg-white text-[#0D0F52]'
                  }`}
                >
                  Base técnica
                  <Cpu className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className={`${isDark ? 'bg-[#0B102C]' : 'bg-[#F7FBFF]'} py-20`}>
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{t.aboutEyebrow}</p>
              <h2 className={`mt-3 text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                {t.aboutTitle}
              </h2>
              <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.aboutText}
              </p>
              <div className={`mt-8 rounded-md border p-5 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white'}`}>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{t.admin}</p>
                <h3 className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Gestão técnica e atendimento direto</h3>
                <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.adminText}
                </p>
                <Link to="/equipe" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline">
                  Conhecer equipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
            <div className={`rounded-md border p-6 sm:p-8 lg:p-10 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-sky-100 bg-[#F7FBFF]'}`}>
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
                {areasSection.buttonLabel || t.areasFallbackButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleAreas.map(({ icon: Icon, title, text, href }) => (
                <Link
                  key={href}
                  to={href}
                  className={`group rounded-md border p-6 transition hover:border-[#159AFD] ${
                    isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-sky-100 bg-[#F7FBFF] shadow-sm hover:bg-white'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-5 text-xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{title}</h3>
                  <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#159AFD]">
                    {t.openPage}
                    <ChevronRight className="h-4 w-4" />
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
                {showAllAreas ? t.showLess : t.showMore}
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
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{t.servicesEyebrow}</p>
                <h2 className={`mt-3 text-3xl font-black sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{t.servicesTitle}</h2>
                <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.servicesText}
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
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{t.processEyebrow}</p>
                <h2 className={`mt-3 text-3xl font-black sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{t.processTitle}</h2>
                <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.processText}
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
                  <article key={project.title} className="rounded-md border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:bg-white/20">
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

        <section id="contato" className={`${isDark ? 'bg-[#0B102C]' : 'bg-[#EEF7FF]'} py-20`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{t.contactEyebrow}</p>
              <h2 className={`mt-3 max-w-3xl break-words text-3xl font-black leading-tight sm:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                {t.contactTitle}
              </h2>
              <p className={`mt-5 text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.contactText}
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=elntechnologyinnovations@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 font-bold hover:text-[#159AFD] ${isDark ? 'text-slate-100' : 'text-[#0D0F52]'}`}
                >
                  <Mail className="h-5 w-5" />
                  elntechnologyinnovations@gmail.com
                </a>
                <a
                  href="https://wa.me/5581997092380"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 font-bold hover:text-[#159AFD] ${isDark ? 'text-slate-100' : 'text-[#0D0F52]'}`}
                >
                  <Phone className="h-5 w-5" />
                  WhatsApp: +55 (81) 99709-2380
                </a>
                <a
                  href="https://instagram.com/eln_technology"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 font-bold hover:text-[#159AFD] ${isDark ? 'text-slate-100' : 'text-[#0D0F52]'}`}
                >
                  <Instagram className="h-5 w-5" />
                  @eln_technology
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`rounded-md border p-6 shadow-xl ${
              isDark ? 'border-white/10 bg-white/[0.04] shadow-black/20' : 'border-sky-100 bg-white shadow-sky-900/10'
            }`}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {t.name}
                  <input name="name" required className={`mt-2 w-full rounded-md border px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100 ${
                    isDark ? 'border-white/10 bg-slate-950/60 text-white' : 'border-sky-100 bg-white text-slate-950'
                  }`} />
                </label>
                <label className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {t.phone}
                  <input name="phone" required className={`mt-2 w-full rounded-md border px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100 ${
                    isDark ? 'border-white/10 bg-slate-950/60 text-white' : 'border-sky-100 bg-white text-slate-950'
                  }`} />
                </label>
              </div>

              <label className={`mt-4 block text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t.projectType}
                <select name="type" className={`mt-2 w-full rounded-md border px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100 ${
                  isDark ? 'border-white/10 bg-slate-950/60 text-white' : 'border-sky-100 bg-white text-slate-950'
                }`}>
                  <option>IoT e automação</option>
                  <option>Impressão 3D</option>
                  <option>Robótica</option>
                  <option>Eletrônica e PCB</option>
                  <option>Outro projeto de tecnologia</option>
                </select>
              </label>

              <label className={`mt-4 block text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t.message}
                <textarea
                  name="message"
                  required
                  rows={5}
                  className={`mt-2 w-full resize-none rounded-md border px-4 py-3 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100 ${
                    isDark ? 'border-white/10 bg-slate-950/60 text-white' : 'border-sky-100 bg-white text-slate-950'
                  }`}
                />
              </label>

              <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-6 py-4 font-black text-white transition hover:bg-[#0D0F52]">
                {t.submit}
                <Zap className="h-5 w-5" />
              </button>

              {formStatus && <p className="mt-4 rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{formStatus}</p>}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <React.Suspense fallback={<PageLoader />}>
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
              <Route path="/estudos" element={<EstudosPage />} />
              <Route path="/estudos/:studyId" element={<TechnicalStudyPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/produto/:productId" element={<ProductDetailPage />} />
              <Route path="/lojas" element={<LojasPage />} />
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
          </React.Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
