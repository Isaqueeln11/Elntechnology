import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
  ProdutosPage,
  ProjetosDesenvolvidos,
  VideosFuturoPage,
} from './pages/CompanyPages';
import logoUrl from '../ELN TECHNOLOGY.svg';

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Areas', href: '#areas' },
  { label: 'Servicos', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

const services = [
  {
    icon: Wifi,
    title: 'IoT e automacao',
    description:
      'Sensores, dashboards, comunicacao wireless e monitoramento em tempo real para casas, empresas e industrias.',
    items: ['ESP32, Arduino e Raspberry Pi', 'Controle por app ou painel web', 'Alertas e relatorios inteligentes'],
  },
  {
    icon: Printer,
    title: 'Impressao 3D',
    description:
      'Prototipos, pecas sob medida, suportes, caixas para placas e modelos funcionais para validar ideias rapido.',
    items: ['Modelagem para fabricacao', 'Prototipagem rapida', 'Acabamento e ajustes tecnicos'],
  },
  {
    icon: Bot,
    title: 'Robos e sistemas inteligentes',
    description:
      'Projetos de robotica educacional, assistiva e industrial com controle, sensores, motores e programacao.',
    items: ['Robos moveis e bracos roboticos', 'Controle de motores', 'Visao e automacao de tarefas'],
  },
  {
    icon: CircuitBoard,
    title: 'Eletronica e PCBs',
    description:
      'Desenvolvimento de circuitos, placas, firmware e integracao completa entre hardware e software.',
    items: ['Esquematico e layout PCB', 'Firmware embarcado', 'Montagem e testes'],
  },
];

const projectCards = [
  {
    title: 'Casa conectada',
    tag: 'IoT',
    text: 'Automacao de iluminacao, sensores de presenca, temperatura e controle remoto seguro.',
    icon: Cpu,
  },
  {
    title: 'Prototipo funcional',
    tag: '3D + eletronica',
    text: 'Da ideia ao produto: desenho tecnico, impressao 3D, circuito e testes em bancada.',
    icon: Box,
  },
  {
    title: 'Robo personalizado',
    tag: 'Robotica',
    text: 'Robo para estudo, apresentacao, rotina operacional ou prova de conceito.',
    icon: Bot,
  },
];

const process = [
  'Entendimento da ideia e objetivo',
  'Desenho da solucao e escolha dos componentes',
  'Prototipo, testes e ajustes',
  'Entrega organizada com orientacao de uso',
];

const featureItems = [
  { icon: ShieldCheck, label: 'Projeto com testes' },
  { icon: Wrench, label: 'Montagem organizada' },
  { icon: Microscope, label: 'Detalhe tecnico' },
  { icon: Rocket, label: 'Ideia pronta para crescer' },
];

const aboutItems = [
  {
    icon: CircuitBoard,
    title: 'Hardware e software juntos',
    text: 'A equipe pensa no circuito, no firmware, no painel e na experiencia de uso como uma solucao unica.',
  },
  {
    icon: Microscope,
    title: 'Prototipos testados',
    text: 'Cada entrega passa por montagem, validacao e ajustes para reduzir erro antes do uso real.',
  },
  {
    icon: ShieldCheck,
    title: 'Atendimento direto',
    text: 'O cliente fala com quem entende o projeto, acompanha as etapas e recebe orientacao para evoluir.',
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
    text: 'Organize correcoes, prioridades, seguranca e proximas funcoes.',
    href: '/melhorias',
  },
  {
    icon: Users,
    title: 'Equipe',
    text: 'Mostre administrador, tecnicos, parceiros, cargos e responsabilidades.',
    href: '/equipe',
  },
  {
    icon: BarChart3,
    title: 'Atividades e analise',
    text: 'Acompanhe atividades, indicadores, eventos e relatorios.',
    href: '/atividades-analise',
  },
  {
    icon: Rocket,
    title: 'Desenvolvimentos',
    text: 'Liste firmware, painel, hardware, OTA e versoes em construcao.',
    href: '/desenvolvimentos',
  },
  {
    icon: Package,
    title: 'Produtos',
    text: 'Monte catalogo com produtos, equipamentos, servicos e valores.',
    href: '/produtos',
  },
  {
    icon: MonitorPlay,
    title: 'Videos e futuro',
    text: 'Espaco para demonstracoes, novidades, roadmap e videos futuros.',
    href: '/videos-futuro',
  },
];

function BrandName({ className = '' }: { className?: string }) {
  return (
    <span className={`notranslate ${className}`} translate="no">
      ELN Technology
    </span>
  );
}

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState('IoT e automacao');
  const [formStatus, setFormStatus] = React.useState('');
  const { isDark, toggleTheme } = useTheme();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const type = data.get('type')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    const text = encodeURIComponent(
      `Ola, sou ${name || 'um cliente'}.\nWhatsApp: ${phone || 'nao informado'}\nProjeto: ${type || 'nao informado'}\n\n${message || ''}`,
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
        <section className="relative overflow-hidden bg-white pt-28">
          <div className="absolute inset-0 circuit-grid opacity-70" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-[#0D0F52]">
                <Sparkles className="h-4 w-4 text-[#159AFD]" />
                Inovacao em tecnologia para tirar ideias do papel
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#0D0F52] sm:text-5xl lg:text-7xl">
                <BrandName />
                <span className="mt-3 block text-[#159AFD]">IoT, impressao 3D, robos e eletronica.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Criamos solucoes sob medida para automacao, prototipos, sistemas embarcados e projetos inteligentes.
                Tudo organizado, testado e pensado para funcionar no mundo real.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D0F52] px-6 py-4 font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#159AFD]"
                >
                  Solicitar orcamento
                  <Send className="h-5 w-5" />
                </a>
                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-sky-200 bg-white px-6 py-4 font-bold text-[#0D0F52] transition hover:-translate-y-0.5 hover:border-[#159AFD] hover:text-[#159AFD]"
                >
                  Ver solucoes
                  <ChevronRight className="h-5 w-5" />
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                {['IoT', 'Robos', '3D'].map((item, index) => (
                  <div key={item} className="rounded-md border border-sky-100 bg-white/90 p-4 shadow-sm">
                    <div className="text-2xl font-black text-[#159AFD]">{index + 1}+</div>
                    <div className="mt-1 text-xs font-bold uppercase text-slate-500">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-6 rounded-full border border-sky-100 hero-spin" />
                <div className="relative overflow-hidden rounded-md border border-sky-100 bg-white p-5 shadow-2xl shadow-sky-900/10">
                  <img src={logoUrl} alt="Logo ELN Technology" className="w-full object-contain" />
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      ['Prototipos', 'rapidos'],
                      ['Sistemas', 'conectados'],
                      ['Hardware', 'sob medida'],
                      ['Entrega', 'organizada'],
                    ].map(([top, bottom]) => (
                      <div key={top} className="rounded-md bg-slate-950 px-4 py-3 text-white">
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

        <section id="sobre" className="bg-[#F7FBFF] py-20">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Sobre nos</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#0D0F52] sm:text-5xl">
                Uma equipe focada em transformar ideia em sistema funcionando.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A <BrandName /> nasceu para unir eletronica, impressao 3D, automacao, robotica e desenvolvimento web em projetos prontos para uso.
                O trabalho e conduzido por Isaque Domingos Santana Silva, fundador e administrador da ELN, com apoio tecnico conforme a necessidade de cada solucao.
              </p>
              <div className="mt-8 rounded-md border border-sky-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Administrador</p>
                <h3 className="mt-2 text-2xl font-black text-[#0D0F52]">Isaque Domingos Santana Silva</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Responsavel por organizar clientes, projetos, valores, tecnicos, atualizacoes OTA e entregas dentro do painel administrativo.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {aboutItems.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-md border border-sky-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#159AFD] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#0D0F52]">{title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="areas" className={`${isDark ? 'bg-[#080B24]' : 'bg-white'} py-20`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Espacos do site</p>
                <h2 className={`mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                  Subpaginas prontas para organizar conteudo, equipe, produtos e evolucao.
                </h2>
                <p className={`mt-5 max-w-3xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Cada area agora tem sua propria pagina, com espaco para fotos, videos, status, arquivos, valores e informacoes que voce for cadastrando.
                </p>
              </div>
              <Link
                to="/dashboard?tab=sitePages"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]"
              >
                Abrir admin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {siteAreas.map(({ icon: Icon, title, text, href }) => (
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
                    Abrir pagina
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="servicos" className="bg-[#EEF7FF] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Servicos</p>
                <h2 className="mt-3 text-3xl font-black text-[#0D0F52] sm:text-5xl">Tudo separado, claro e pronto para evoluir.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Escolha uma area para ver como a <BrandName /> pode estruturar seu projeto com tecnologia, design tecnico e testes.
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
                          : 'bg-white text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isActive = selectedService === service.title;
                  return (
                    <article
                      key={service.title}
                      className={`rounded-md border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isActive ? 'border-[#159AFD] ring-4 ring-sky-100' : 'border-sky-100'
                      }`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-5 text-xl font-black text-[#0D0F52]">{service.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
                      <ul className="mt-5 space-y-3">
                        {service.items.map((item) => (
                          <li key={item} className="flex gap-3 text-sm font-semibold text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#159AFD]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="processo" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Processo</p>
                <h2 className="mt-3 text-3xl font-black text-[#0D0F52] sm:text-5xl">Da ideia ao prototipo funcionando.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  A entrega fica organizada em etapas para voce acompanhar o andamento e entender cada decisao tecnica.
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-sky-200 sm:block" />
                <div className="space-y-5">
                  {process.map((step, index) => (
                    <div key={step} className="relative flex gap-5 rounded-md border border-sky-100 bg-[#F7FBFF] p-5">
                      <div className="z-10 flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#0D0F52] font-black text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0D0F52]">{step}</h3>
                        <p className="mt-2 text-slate-600">
                          {index === 0 && 'Voce explica a necessidade, o uso esperado e o tipo de resultado desejado.'}
                          {index === 1 && 'Definimos arquitetura, componentes, materiais, custo e tempo de producao.'}
                          {index === 2 && 'Montamos a primeira versao, medimos, corrigimos e melhoramos a solucao.'}
                          {index === 3 && 'Voce recebe o projeto de forma limpa, com funcionamento validado e proximo passo claro.'}
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
                <p className="text-sm font-black uppercase tracking-widest text-sky-300">Aplicacoes</p>
                <h2 className="mt-3 text-3xl font-black sm:text-5xl">Projetos que o site ja apresenta com clareza.</h2>
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

        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {featureItems.map(({ icon: Icon, label }) => {
              return (
                <div key={label} className="flex items-center gap-4 rounded-md border border-sky-100 bg-[#F7FBFF] p-5">
                  <Icon className="h-7 w-7 text-[#159AFD]" />
                  <span className="font-black text-[#0D0F52]">{label}</span>
                </div>
              );
            })}
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
                Use o formulario para organizar o pedido. Ele funciona na pagina e deixa a solicitacao pronta para retorno.
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
                  <option>IoT e automacao</option>
                  <option>Impressao 3D</option>
                  <option>Robotica</option>
                  <option>Eletronica e PCB</option>
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
