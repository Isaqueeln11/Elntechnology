import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  Hammer,
  Home,
  MonitorPlay,
  Moon,
  Package,
  Rocket,
  Sun,
  Users,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import logoUrl from '../../ELN TECHNOLOGY.svg';

type PageData = {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof CircuitBoard;
  highlight: string;
  sections: Array<{
    title: string;
    text: string;
    items: string[];
  }>;
  workflow: string[];
};

const pages: Record<string, PageData> = {
  projetos: {
    eyebrow: 'Projetos desenvolvidos',
    title: 'Galeria organizada para publicar os projetos reais da ELN Technology.',
    description:
      'Aqui ficam os projetos finalizados, prototipos, fotos, status, componentes usados, videos e links de entrega. A pagina ja esta pronta para receber os conteudos oficiais.',
    icon: CircuitBoard,
    highlight: 'Espaco para cadastrar nome, cliente, status, imagens, codigo, firmware e resultado final.',
    sections: [
      {
        title: 'Projetos finalizados',
        text: 'Area para listar projetos entregues com resumo tecnico, fotos e data de conclusao.',
        items: ['Nome do projeto', 'Cliente ou aplicacao', 'Componentes usados', 'Resultado entregue'],
      },
      {
        title: 'Prototipos em teste',
        text: 'Organizacao dos prototipos que ainda estao em validacao antes da entrega.',
        items: ['Versao atual', 'Pendencias', 'Testes realizados', 'Proximo ajuste'],
      },
      {
        title: 'Arquivos e codigos',
        text: 'Referencia para guardar links de repositorio, firmware, manual e arquivos de apoio.',
        items: ['GitHub', 'Arquivo .bin', 'Manual tecnico', 'Historico de versoes'],
      },
    ],
    workflow: ['Cadastrar projeto', 'Adicionar fotos e descricao', 'Vincular arquivos', 'Publicar como concluido'],
  },
  melhorias: {
    eyebrow: 'Melhorias',
    title: 'Controle claro das melhorias que entram no site, no painel e nos equipamentos.',
    description:
      'Uma pagina para registrar o que precisa melhorar, o que ja foi corrigido e o que vai entrar em futuras versoes.',
    icon: Wrench,
    highlight: 'Ideal para acompanhar bugs, ajustes visuais, seguranca, responsividade e novas funcoes.',
    sections: [
      {
        title: 'Correcoes',
        text: 'Lista de problemas encontrados e resolvidos no sistema.',
        items: ['Tela corrigida', 'Data da correcao', 'Responsavel', 'Como validar'],
      },
      {
        title: 'Melhorias futuras',
        text: 'Ideias que ainda vao entrar no roadmap da ELN Technology.',
        items: ['Prioridade', 'Impacto', 'Prazo previsto', 'Dependencias'],
      },
      {
        title: 'Seguranca',
        text: 'Area para registrar regras, ajustes de acesso e protecoes extras.',
        items: ['Firebase Rules', 'Acesso admin', 'Login seguro', 'Auditoria'],
      },
    ],
    workflow: ['Registrar melhoria', 'Definir prioridade', 'Implementar', 'Testar e publicar'],
  },
  equipe: {
    eyebrow: 'Equipe',
    title: 'Pagina para apresentar quem faz parte da ELN Technology.',
    description:
      'Aqui voce pode mostrar administrador, tecnicos, parceiros e funcoes de cada pessoa no sistema.',
    icon: Users,
    highlight: 'Espaco para foto, cargo, especialidade, contato interno e atividades de cada tecnico.',
    sections: [
      {
        title: 'Administracao',
        text: 'Informacoes do responsavel pelo painel, clientes, projetos e configuracoes.',
        items: ['Nome', 'Foto', 'Contato', 'Permissoes'],
      },
      {
        title: 'Tecnicos',
        text: 'Lista de profissionais que podem receber chamados, tarefas e projetos.',
        items: ['Especialidade', 'Status', 'Projetos ativos', 'Historico'],
      },
      {
        title: 'Parceiros',
        text: 'Espaco para colaboradores externos, fornecedores e apoio tecnico.',
        items: ['Empresa', 'Servico', 'Contato', 'Observacoes'],
      },
    ],
    workflow: ['Cadastrar membro', 'Definir cargo', 'Vincular atividades', 'Atualizar perfil'],
  },
  atividades: {
    eyebrow: 'Atividades e analise',
    title: 'Painel publico para organizar atividades, indicadores e analises.',
    description:
      'Essa pagina centraliza movimentos do projeto, atividades recentes, dados importantes e leitura do que esta acontecendo.',
    icon: BarChart3,
    highlight: 'Base pronta para evoluir com graficos, historico de eventos e indicadores reais do dashboard.',
    sections: [
      {
        title: 'Atividades recentes',
        text: 'Linha do tempo com criacao de cliente, projeto, pedido, documento e suporte.',
        items: ['Evento', 'Usuario', 'Data', 'Status'],
      },
      {
        title: 'Analise operacional',
        text: 'Espaco para visualizar quantidade de projetos, valores, tecnicos e chamados.',
        items: ['Clientes', 'Projetos', 'Faturamento', 'Tickets'],
      },
      {
        title: 'Relatorios',
        text: 'Base para mostrar relatorios por periodo e exportacoes futuras.',
        items: ['Mensal', 'Semanal', 'Por cliente', 'Por tecnico'],
      },
    ],
    workflow: ['Coletar dados', 'Analisar status', 'Gerar relatorio', 'Tomar decisao'],
  },
  desenvolvimentos: {
    eyebrow: 'Desenvolvimentos',
    title: 'Area para mostrar o que esta em desenvolvimento agora.',
    description:
      'Use esta pagina para organizar sistemas web, firmware, placas, automacoes, app, testes e novas funcionalidades.',
    icon: Hammer,
    highlight: 'Cada desenvolvimento pode ter etapa, prioridade, responsavel, versao e data prevista.',
    sections: [
      {
        title: 'Firmware e OTA',
        text: 'Controle das versoes dos equipamentos, arquivos .bin e historico de atualizacao.',
        items: ['Versao', 'Link do release', 'SHA-256', 'Equipamento alvo'],
      },
      {
        title: 'Sistema web',
        text: 'Melhorias no dashboard, login, cadastro, perfil, documentos e notificacoes.',
        items: ['Tela', 'Funcao', 'Status', 'Validacao'],
      },
      {
        title: 'Hardware',
        text: 'Projetos de placas, sensores, gabinetes e prototipos fisicos.',
        items: ['PCB', 'Sensores', 'Impressao 3D', 'Testes'],
      },
    ],
    workflow: ['Planejar', 'Construir', 'Testar', 'Lancar versao'],
  },
  produtos: {
    eyebrow: 'Produtos',
    title: 'Catalogo para exibir produtos, equipamentos e solucoes da ELN Technology.',
    description:
      'Pagina para organizar produtos prontos, kits, servicos recorrentes, placas, automacoes e equipamentos com OTA.',
    icon: Package,
    highlight: 'Cada produto pode ter foto, preco, descricao, especificacao, manual e botao de contato.',
    sections: [
      {
        title: 'Equipamentos',
        text: 'Produtos fisicos como controladores, placas, sensores e automacoes.',
        items: ['Foto', 'Modelo', 'Estoque', 'Manual'],
      },
      {
        title: 'Servicos',
        text: 'Servicos de desenvolvimento, suporte, instalacao, impressao 3D e manutencao.',
        items: ['Descricao', 'Valor', 'Prazo', 'Garantia'],
      },
      {
        title: 'Kits e prototipos',
        text: 'Kits personalizados para estudo, teste ou demonstracao tecnica.',
        items: ['Itens inclusos', 'Aplicacao', 'Nivel tecnico', 'Entrega'],
      },
    ],
    workflow: ['Cadastrar produto', 'Adicionar foto', 'Definir valor', 'Publicar no site'],
  },
  videos: {
    eyebrow: 'Videos e futuro',
    title: 'Espaco para publicar videos, novidades e proximos lancamentos.',
    description:
      'Uma pagina preparada para demonstracoes, videos do YouTube, bastidores, roadmap e apresentacoes futuras.',
    icon: MonitorPlay,
    highlight: 'Pronto para receber links de video, thumbnails, descricao e chamadas para novos produtos.',
    sections: [
      {
        title: 'Videos demonstrativos',
        text: 'Mostre equipamentos funcionando, testes, montagem e resultados.',
        items: ['YouTube', 'Instagram', 'Thumbnail', 'Descricao'],
      },
      {
        title: 'Roadmap',
        text: 'Organize o que vem depois: app, novos produtos, melhorias e integracoes.',
        items: ['Proximo lancamento', 'Meta', 'Status', 'Data prevista'],
      },
      {
        title: 'Novidades',
        text: 'Area para comunicados, atualizacoes e conteudos futuros da marca.',
        items: ['Titulo', 'Resumo', 'Link', 'Publicacao'],
      },
    ],
    workflow: ['Gravar conteudo', 'Adicionar link', 'Publicar destaque', 'Atualizar roadmap'],
  },
};

const quickLinks = [
  { label: 'Projetos', to: '/projetos-desenvolvidos', icon: CircuitBoard },
  { label: 'Melhorias', to: '/melhorias', icon: Wrench },
  { label: 'Equipe', to: '/equipe', icon: Users },
  { label: 'Analise', to: '/atividades-analise', icon: BarChart3 },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Videos', to: '/videos-futuro', icon: MonitorPlay },
];

function CompanyPage({ data }: { data: PageData }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = data.icon;

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#070A1F] text-white' : 'bg-[#F7FBFF] text-slate-950'}`}>
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#080B24]/92' : 'border-sky-100 bg-white/92'}`}>
        <nav className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="ELN Technology" className="h-11 w-28 object-contain" />
            <span className="notranslate text-sm font-black sm:text-base" translate="no">
              ELN Technology
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold transition ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/10' : 'border-sky-100 text-slate-700 hover:bg-sky-50'}`}
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/10' : 'border-sky-100 text-slate-700 hover:bg-sky-50'}`}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className={`border-b py-14 sm:py-20 ${isDark ? 'border-white/10 bg-[#0D0F52]' : 'border-sky-100 bg-white'}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{data.eyebrow}</p>
              <h1 className={`mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                {data.title}
              </h1>
              <p className={`mt-5 max-w-3xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{data.description}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]"
                >
                  Abrir dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#contato"
                  className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-black transition ${isDark ? 'border-white/15 text-white hover:bg-white/10' : 'border-sky-200 text-[#0D0F52] hover:bg-sky-50'}`}
                >
                  Falar com a ELN
                </Link>
              </div>
            </div>

            <aside className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/10' : 'border-sky-100 bg-[#EEF7FF]'}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Como usar este espaco</h2>
              <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{data.highlight}</p>
              <div className="mt-6 grid gap-3">
                {data.workflow.map((step, index) => (
                  <div key={step} className={`flex items-center gap-3 rounded-md border p-3 ${isDark ? 'border-white/10 bg-[#070A1F]/60' : 'border-sky-100 bg-white'}`}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0D0F52] text-sm font-black text-white">{index + 1}</span>
                    <span className="font-bold">{step}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {quickLinks.map(({ label, to, icon: LinkIcon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex min-h-24 items-center gap-3 rounded-md border p-4 font-black transition hover:-translate-y-0.5 ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-sky-100 bg-white text-[#0D0F52] hover:border-[#159AFD]'}`}
                >
                  <LinkIcon className="h-5 w-5 text-[#159AFD]" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {data.sections.map((section) => (
              <article key={section.title} className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white shadow-sm'}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-[#159AFD] text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{section.title}</h2>
                    <p className={`mt-2 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{section.text}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {section.items.map((item) => (
                    <span key={item} className={`rounded-md px-3 py-2 text-sm font-bold ${isDark ? 'bg-[#070A1F] text-slate-200' : 'bg-[#EEF7FF] text-[#0D0F52]'}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`border-t py-16 ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-sky-100 bg-white'}`}>
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { icon: Clock3, label: 'Historico organizado' },
              { icon: Boxes, label: 'Espaco para anexos' },
              { icon: Activity, label: 'Status por etapa' },
              { icon: Rocket, label: 'Pronto para crescer' },
            ].map(({ icon: FooterIcon, label }) => (
              <div key={label} className={`rounded-md border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-[#F7FBFF]'}`}>
                <FooterIcon className="h-7 w-7 text-[#159AFD]" />
                <p className="mt-3 font-black">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function ProjetosDesenvolvidos() {
  return <CompanyPage data={pages.projetos} />;
}

export function MelhoriasPage() {
  return <CompanyPage data={pages.melhorias} />;
}

export function EquipePage() {
  return <CompanyPage data={pages.equipe} />;
}

export function AtividadesAnalisePage() {
  return <CompanyPage data={pages.atividades} />;
}

export function DesenvolvimentosPage() {
  return <CompanyPage data={pages.desenvolvimentos} />;
}

export function ProdutosPage() {
  return <CompanyPage data={pages.produtos} />;
}

export function VideosFuturoPage() {
  return <CompanyPage data={pages.videos} />;
}
