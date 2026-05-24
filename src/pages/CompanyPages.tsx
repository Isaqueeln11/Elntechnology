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
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';
import logoUrl from '../../ELN TECHNOLOGY.svg';

type PageData = {
  key: string;
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

type SiteContentItem = {
  id: string;
  page?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  status?: string;
};

const pages: Record<string, PageData> = {
  projetos: {
    key: 'projetos',
    eyebrow: 'Projetos desenvolvidos',
    title: 'Galeria organizada para publicar os projetos reais da ELN Technology.',
    description:
      'Aqui ficam os projetos finalizados, protótipos, fotos, status, componentes usados, vídeos e links de entrega. A página já está pronta para receber os conteúdos oficiais.',
    icon: CircuitBoard,
    highlight: 'Espaço para cadastrar nome, cliente, status, imagens, código, firmware e resultado final.',
    sections: [
      {
        title: 'Projetos finalizados',
        text: 'Área para listar projetos entregues com resumo técnico, fotos e data de conclusão.',
        items: ['Nome do projeto', 'Cliente ou aplicacao', 'Componentes usados', 'Resultado entregue'],
      },
      {
        title: 'Protótipos em teste',
        text: 'Organização dos protótipos que ainda estão em validação antes da entrega.',
        items: ['Versão atual', 'Pendências', 'Testes realizados', 'Próximo ajuste'],
      },
      {
        title: 'Arquivos e códigos',
        text: 'Referência para guardar links de repositório, firmware, manual e arquivos de apoio.',
        items: ['GitHub', 'Arquivo .bin', 'Manual técnico', 'Histórico de versões'],
      },
    ],
    workflow: ['Cadastrar projeto', 'Adicionar fotos e descrição', 'Vincular arquivos', 'Publicar como concluído'],
  },
  melhorias: {
    key: 'melhorias',
    eyebrow: 'Melhorias',
    title: 'Controle claro das melhorias que entram no site, no painel e nos equipamentos.',
    description:
      'Uma página para registrar o que precisa melhorar, o que já foi corrigido e o que vai entrar em futuras versões.',
    icon: Wrench,
    highlight: 'Ideal para acompanhar bugs, ajustes visuais, segurança, responsividade e novas funções.',
    sections: [
      {
        title: 'Correções',
        text: 'Lista de problemas encontrados e resolvidos no sistema.',
        items: ['Tela corrigida', 'Data da correcao', 'Responsável', 'Como validar'],
      },
      {
        title: 'Melhorias futuras',
        text: 'Ideias que ainda vão entrar no roadmap da ELN Technology.',
        items: ['Prioridade', 'Impacto', 'Prazo previsto', 'Dependências'],
      },
      {
        title: 'Segurança',
        text: 'Área para registrar regras, ajustes de acesso e proteções extras.',
        items: ['Firebase Rules', 'Acesso admin', 'Login seguro', 'Auditoria'],
      },
    ],
    workflow: ['Registrar melhoria', 'Definir prioridade', 'Implementar', 'Testar e publicar'],
  },
  equipe: {
    key: 'equipe',
    eyebrow: 'Equipe',
    title: 'Página para apresentar quem faz parte da ELN Technology.',
    description:
      'Aqui você pode mostrar administrador, técnicos, parceiros e funções de cada pessoa no sistema.',
    icon: Users,
    highlight: 'Espaço para foto, cargo, especialidade, contato interno e atividades de cada técnico.',
    sections: [
      {
        title: 'Administração',
        text: 'Informações do responsável pelo painel, clientes, projetos e configurações.',
        items: ['Nome', 'Foto', 'Contato', 'Permissões'],
      },
      {
        title: 'Técnicos',
        text: 'Lista de profissionais que podem receber chamados, tarefas e projetos.',
        items: ['Especialidade', 'Status', 'Projetos ativos', 'Histórico'],
      },
      {
        title: 'Parceiros',
        text: 'Espaço para colaboradores externos, fornecedores e apoio técnico.',
        items: ['Empresa', 'Serviço', 'Contato', 'Observações'],
      },
    ],
    workflow: ['Cadastrar membro', 'Definir cargo', 'Vincular atividades', 'Atualizar perfil'],
  },
  atividades: {
    key: 'atividades',
    eyebrow: 'Atividades e análise',
    title: 'Painel público para organizar atividades, indicadores e análises.',
    description:
      'Essa página centraliza movimentos do projeto, atividades recentes, dados importantes e leitura do que está acontecendo.',
    icon: BarChart3,
    highlight: 'Base pronta para evoluir com gráficos, histórico de eventos e indicadores reais do dashboard.',
    sections: [
      {
        title: 'Atividades recentes',
        text: 'Linha do tempo com criacao de cliente, projeto, pedido, documento e suporte.',
        items: ['Evento', 'Usuário', 'Data', 'Status'],
      },
      {
        title: 'Análise operacional',
        text: 'Espaço para visualizar quantidade de projetos, valores, técnicos e chamados.',
        items: ['Clientes', 'Projetos', 'Faturamento', 'Tickets'],
      },
      {
        title: 'Relatórios',
        text: 'Base para mostrar relatórios por periodo e exportacoes futuras.',
        items: ['Mensal', 'Semanal', 'Por cliente', 'Por técnico'],
      },
    ],
    workflow: ['Coletar dados', 'Analisar status', 'Gerar relatório', 'Tomar decisão'],
  },
  desenvolvimentos: {
    key: 'desenvolvimentos',
    eyebrow: 'Desenvolvimentos',
    title: 'Área para mostrar o que está em desenvolvimento agora.',
    description:
      'Use está página para organizar sistemas web, firmware, placas, automações, app, testes e novas funcionalidades.',
    icon: Hammer,
    highlight: 'Cada desenvolvimento pode ter etapa, prioridade, responsável, versao e data prevista.',
    sections: [
      {
        title: 'Firmware e OTA',
        text: 'Controle das versões dos equipamentos, arquivos .bin e histórico de atualizacao.',
        items: ['Versão', 'Link do release', 'SHA-256', 'Equipamento alvo'],
      },
      {
        title: 'Sistema web',
        text: 'Melhorias no dashboard, login, cadastro, perfil, documentos e notificações.',
        items: ['Tela', 'Função', 'Status', 'Validação'],
      },
      {
        title: 'Hardware',
        text: 'Projetos de placas, sensores, gabinetes e protótipos fisicos.',
        items: ['PCB', 'Sensores', 'Impressão 3D', 'Testes'],
      },
    ],
    workflow: ['Planejar', 'Construir', 'Testar', 'Lançar versão'],
  },
  produtos: {
    key: 'produtos',
    eyebrow: 'Produtos',
    title: 'Catálogo para exibir produtos, equipamentos e soluções da ELN Technology.',
    description:
      'Página para organizar produtos prontos, kits, serviços recorrentes, placas, automações e equipamentos com OTA.',
    icon: Package,
    highlight: 'Cada produto pode ter foto, preço, descrição, especificacao, manual e botão de contato.',
    sections: [
      {
        title: 'Equipamentos',
        text: 'Produtos fisicos como controladores, placas, sensores e automações.',
        items: ['Foto', 'Modelo', 'Estoque', 'Manual'],
      },
      {
        title: 'Serviços',
        text: 'Serviços de desenvolvimento, suporte, instalação, impressão 3D e manutenção.',
        items: ['Descrição', 'Valor', 'Prazo', 'Garantia'],
      },
      {
        title: 'Kits e protótipos',
        text: 'Kits personalizados para estudo, teste ou demonstração técnica.',
        items: ['Itens inclusos', 'Aplicação', 'Nível técnico', 'Entrega'],
      },
    ],
    workflow: ['Cadastrar produto', 'Adicionar foto', 'Definir valor', 'Publicar no site'],
  },
  videos: {
    key: 'videos',
    eyebrow: 'Vídeos e futuro',
    title: 'Espaço para publicar vídeos, novidades e proximos lançamentos.',
    description:
      'Uma página preparada para demonstrações, vídeos do YouTube, bastidores, roadmap e apresentacoes futuras.',
    icon: MonitorPlay,
    highlight: 'Pronto para receber links de vídeo, thumbnails, descrição e chamadas para novos produtos.',
    sections: [
      {
        title: 'Vídeos demonstrativos',
        text: 'Mostre equipamentos funcionando, testes, montagem e resultados.',
        items: ['YouTube', 'Instagram', 'Thumbnail', 'Descrição'],
      },
      {
        title: 'Roadmap',
        text: 'Organize o que vem depois: app, novos produtos, melhorias e integracoes.',
        items: ['Próximo lançamento', 'Meta', 'Status', 'Data prevista'],
      },
      {
        title: 'Novidades',
        text: 'Área para comunicados, atualizações e conteúdos futuros da marca.',
        items: ['Título', 'Resumo', 'Link', 'Publicação'],
      },
    ],
    workflow: ['Gravar conteúdo', 'Adicionar link', 'Publicar destaque', 'Atualizar roadmap'],
  },
  noticias: {
    key: 'noticias',
    eyebrow: 'Notícias e inovações',
    title: 'Novidades, lançamentos e melhorias publicadas pela ELN Technology.',
    description:
      'Aqui você acompanha comunicados, atualizações do sistema, vídeos, lançamentos, evoluções de produtos e notícias importantes.',
    icon: Rocket,
    highlight: 'Espaço para publicar novidades pelo admin sem mexer no código do site.',
    sections: [
      {
        title: 'Notícias',
        text: 'Comunicados oficiais sobre a empresa, projetos, eventos e novidades.',
        items: ['Título', 'Resumo', 'Data', 'Link'],
      },
      {
        title: 'Inovações',
        text: 'Atualizacoes de sistema, novas funções, produtos e tecnologias em teste.',
        items: ['Melhoria', 'Produto', 'Versão', 'Resultado'],
      },
      {
        title: 'Conteúdos futuros',
        text: 'Espaço para vídeos, artigos, demonstrações e materiais de divulgação.',
        items: ['Vídeo', 'Imagem', 'Documento', 'Publicação'],
      },
    ],
    workflow: ['Criar novidade', 'Adicionar mídia', 'Publicar no site', 'Atualizar quando evoluir'],
  },
};

const quickLinks = [
  { label: 'Projetos', to: '/projetos-desenvolvidos', icon: CircuitBoard },
  { label: 'Melhorias', to: '/melhorias', icon: Wrench },
  { label: 'Equipe', to: '/equipe', icon: Users },
  { label: 'Análise', to: '/atividades-análise', icon: BarChart3 },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Vídeos', to: '/videos-futuro', icon: MonitorPlay },
  { label: 'Notícias', to: '/notícias-inovações', icon: Rocket },
];

function CompanyPage({ data }: { data: PageData }) {
  const { isDark, toggleTheme } = useTheme();
  const [contentItems, setContentItems] = useState<SiteContentItem[]>([]);
  const Icon = data.icon;
  const publishedItems = useMemo(
    () => contentItems.filter((item) => item.page === data.key && item.status !== 'Rascunho'),
    [contentItems, data.key],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'siteContent'), (snapshot) => {
      setContentItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as SiteContentItem));
    });

    return unsubscribe;
  }, []);

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
                <a
                  href="#conteúdos"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]"
                >
                  Ver conteúdos publicados
                  <ArrowRight className="h-4 w-4" />
                </a>
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

        <section id="conteúdos" className="pb-16">
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

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Publicado pelo admin</p>
                <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                  Conteúdos adicionados pelo painel
                </h2>
              </div>
              <Link to="/notícias-inovações" className="inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]">
                Ver notícias
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {publishedItems.length === 0 ? (
              <div className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white shadow-sm'}`}>
                <p className="font-black">Nenhum conteúdo publicado ainda.</p>
                <p className={`mt-2 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Esta área vai mostrar os documentos, vídeos, produtos e novidades publicados pela ELN Technology.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {publishedItems.map((item) => (
                  <article key={item.id} className={`rounded-md border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white shadow-sm'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-md bg-[#159AFD]/15 px-3 py-1 text-xs font-black uppercase text-[#159AFD]">
                        {item.type || 'Conteúdo'}
                      </span>
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${isDark ? 'bg-[#070A1F] text-slate-300' : 'bg-[#EEF7FF] text-[#0D0F52]'}`}>
                        {item.status || 'Publicado'}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black">{item.title || 'Sem título'}</h3>
                    <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.description || 'Sem descrição.'}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline">
                        Abrir link
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`border-t py-16 ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-sky-100 bg-white'}`}>
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { icon: Clock3, label: 'Histórico organizado' },
              { icon: Boxes, label: 'Espaço para anexos' },
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

export function NoticiasInovacoesPage() {
  return <CompanyPage data={pages.noticias} />;
}
