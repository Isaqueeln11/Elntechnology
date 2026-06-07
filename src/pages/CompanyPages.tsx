import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  Cpu,
  Hammer,
  Home,
  MonitorPlay,
  Moon,
  Package,
  Rocket,
  Search,
  Star,
  Store,
  Sun,
  Users,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';
import { formatStorePrice, isDemoStoreProduct, type StoreProduct } from '../data/storeCatalog';
import logoUrl from '../../ELN TECHNOLOGY.svg';
import SiteFooter from '../components/SiteFooter';

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
        items: ['Nome do projeto', 'Cliente ou aplicação', 'Componentes usados', 'Resultado entregue'],
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
        items: ['Tela corrigida', 'Data da correção', 'Responsável', 'Como validar'],
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
    title: 'Equipe ELN Technology: pessoas, responsabilidades e atendimento.',
    description:
      'Conheça quem organiza os projetos, acompanha clientes, configura equipamentos e mantém a evolução técnica da ELN Technology.',
    icon: Users,
    highlight: 'Equipe cadastrada pelo painel admin, com cargo, especialidade, contato e atividades.',
    sections: [
      {
        title: 'Administração',
        text: 'Gestão de clientes, projetos, valores, equipe, entregas, atualizações OTA e comunicação.',
        items: ['Gestão do painel', 'Atendimento', 'Projetos', 'Entregas'],
      },
      {
        title: 'Técnicos e apoio',
        text: 'Profissionais e parceiros que podem atuar em manutenção, montagem, testes e suporte.',
        items: ['Especialidade', 'Contato', 'Atividades', 'Histórico'],
      },
      {
        title: 'Parceiros',
        text: 'Fornecedores, colaboradores externos e canais que ajudam em hardware, software e produção.',
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
    highlight: 'Cada desenvolvimento pode ter etapa, prioridade, responsável, versão e data prevista.',
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
  lojas: {
    key: 'lojas',
    eyebrow: 'Loja oficial',
    title: 'Tecnologia pronta para o seu próximo projeto.',
    description:
      'Conheça placas, controladores, protótipos e serviços técnicos com atendimento direto da ELN Technology.',
    icon: Store,
    highlight: 'A vitrine mostra produtos cadastrados pelo painel admin e mantém contato direto por WhatsApp.',
    sections: [
      {
        title: 'Lojas oficiais',
        text: 'Liste canais próprios ou autorizados para venda e atendimento.',
        items: ['Nome da loja', 'Link oficial', 'WhatsApp', 'Produtos'],
      },
      {
        title: 'Parceiros',
        text: 'Organize empresas parceiras, revendedores e pontos de apoio técnico.',
        items: ['Empresa', 'Cidade', 'Contato', 'Tipo de parceria'],
      },
      {
        title: 'Links de compra',
        text: 'Centralize links de marketplaces, catálogos e páginas externas confiáveis.',
        items: ['Produto', 'Preço', 'Disponibilidade', 'URL'],
      },
    ],
    workflow: ['Cadastrar loja', 'Adicionar contato', 'Vincular produtos', 'Publicar canal oficial'],
  },
  videos: {
    key: 'videos',
    eyebrow: 'Vídeos e futuro',
    title: 'Espaço para publicar vídeos, novidades e próximos lançamentos.',
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
        text: 'Organize o que vem depois: app, novos produtos, melhorias e integrações.',
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
        text: 'Atualizações de sistema, novas funções, produtos e tecnologias em teste.',
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
  estudos: {
    key: 'estudos',
    eyebrow: 'Base técnica',
    title: 'Estudos, placas, módulos e referências técnicas organizadas.',
    description:
      'Registre o que foi estudado: ESP32, sensores, displays, links úteis, datasheets, configuração rápida, pinagem e observações práticas.',
    icon: Cpu,
    highlight: 'Cada estudo pode ter foto, modelo, especificações, links, notas e ficha técnica em página própria.',
    sections: [
      {
        title: 'Placas e módulos',
        text: 'Organiza ESP32, sensores, displays, módulos de câmera, relés, fontes e componentes usados nos projetos.',
        items: ['Modelo', 'Chip', 'Memória', 'Conectividade'],
      },
      {
        title: 'Configuração rápida',
        text: 'Guarda passos de setup, bibliotecas, IDE, drivers, tensão, portas e comandos testados.',
        items: ['IDE', 'Bibliotecas', 'Alimentação', 'Primeiro teste'],
      },
      {
        title: 'Links e anotações',
        text: 'Centraliza datasheets, lojas, vídeos, repositórios e observações para consulta futura.',
        items: ['Datasheet', 'Pinagem', 'Repositório', 'Notas'],
      },
    ],
    workflow: ['Cadastrar estudo', 'Adicionar especificações', 'Vincular links', 'Publicar ficha'],
  },
};

const quickLinks = [
  { label: 'Projetos', to: '/projetos-desenvolvidos', icon: CircuitBoard },
  { label: 'Melhorias', to: '/melhorias', icon: Wrench },
  { label: 'Equipe', to: '/equipe', icon: Users },
  { label: 'Análise', to: '/atividades-analise', icon: BarChart3 },
  { label: 'Estudos', to: '/estudos', icon: Cpu },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Vídeos', to: '/videos-futuro', icon: MonitorPlay },
  { label: 'Notícias', to: '/noticias-inovacoes', icon: Rocket },
  { label: 'Loja', to: '/lojas', icon: Store },
];

const defaultTeamMembers: StoreProduct[] = [
  {
    id: 'team-admin-isaque',
    page: 'equipe',
    type: 'Administrador',
    title: 'Isaque Domingos Santana Silva',
    description:
      'Responsável pela organização do painel administrativo, atendimento aos clientes, projetos, valores, técnicos, atualizações OTA e entregas da ELN Technology.',
    category: 'Administração',
    status: 'Publicado',
    features: 'Painel administrativo\nProjetos e clientes\nAtualizações OTA\nComunicação e entregas',
  },
];

function StoreProductVisual({ item, isDark }: { item: StoreProduct; isDark: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(item.imageUrl) && !imageFailed;

  if (showImage) {
    return (
      <img
        src={item.imageUrl}
        alt={item.title || 'Produto ELN Technology'}
        loading="lazy"
        onError={() => setImageFailed(true)}
        referrerPolicy="no-referrer"
        className="aspect-[16/9] w-full border-b border-white/10 bg-white object-contain p-3"
      />
    );
  }

  return (
    <div className={`flex aspect-[16/9] items-center justify-center border-b ${isDark ? 'border-white/10 bg-[#0D0F52]' : 'border-sky-100 bg-[#EEF7FF]'}`}>
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-md border border-[#159AFD]/30 bg-[#159AFD]/10 text-[#159AFD]">
          {item.type === 'Serviço' ? <Wrench className="h-10 w-10" /> : <Package className="h-10 w-10" />}
        </div>
        <p className={`mt-3 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {item.sku || 'ELN Technology'}
        </p>
      </div>
    </div>
  );
}

function contentLines(value?: string) {
  return (value || '').split('\n').map((item) => item.trim()).filter(Boolean);
}

function CompanyPage({ data }: { data: PageData }) {
  const { isDark, toggleTheme } = useTheme();
  const [contentItems, setContentItems] = useState<StoreProduct[]>([]);
  const [loadError, setLoadError] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState('Todos');
  const Icon = data.icon;
  const isStorePage = ['lojas', 'produtos'].includes(data.key);
  const isTeamPage = data.key === 'equipe';
  const isStudyPage = data.key === 'estudos';
  const publishedItems = useMemo(
    () => contentItems.filter((item) => item.page === data.key && item.status !== 'Rascunho'),
    [contentItems, data.key],
  );
  const teamItems = useMemo(
    () => {
      const publishedTeam = contentItems.filter((item) => item.page === 'equipe' && item.status !== 'Rascunho');
      return publishedTeam.length ? publishedTeam : defaultTeamMembers;
    },
    [contentItems],
  );
  const storeItems = useMemo(() => {
    if (!isStorePage) return [];
    const items = contentItems.filter((item) => ['lojas', 'produtos'].includes(item.page || '') && item.status !== 'Rascunho' && !isDemoStoreProduct(item));
    return items.sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)));
  }, [contentItems, isStorePage]);
  const storeCategories = useMemo(
    () => ['Todos', ...Array.from(new Set(storeItems.map((item) => item.category).filter((category): category is string => Boolean(category))))],
    [storeItems],
  );
  const filteredStoreItems = useMemo(() => {
    const query = storeSearch.trim().toLocaleLowerCase('pt-BR');
    return storeItems.filter((item) => {
      const matchesCategory = storeCategory === 'Todos' || item.category === storeCategory;
      const searchableText = [item.title, item.description, item.type, item.category, item.sku, item.marketplace].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [storeCategory, storeItems, storeSearch]);
  const footerHighlights = isStorePage
    ? [
        { icon: Store, label: 'Canal oficial' },
        { icon: Package, label: 'Produtos sob medida' },
        { icon: Clock3, label: 'Orçamento rápido' },
        { icon: Users, label: 'Atendimento direto' },
      ]
    : [
        { icon: Clock3, label: 'Histórico organizado' },
        { icon: Boxes, label: 'Espaço para anexos' },
        { icon: Activity, label: 'Status por etapa' },
        { icon: Rocket, label: 'Pronto para crescer' },
      ];
  const displayedPublicItems = isTeamPage ? teamItems : publishedItems;
  const publicSectionTitle = isTeamPage ? 'Equipe e responsáveis cadastrados' : isStudyPage ? 'Estudos publicados pelo painel' : 'Conteúdos adicionados pelo painel';
  const publicSectionText = isTeamPage
    ? 'Membros, funções e responsabilidades que você publicar no admin aparecem aqui.'
    : isStudyPage
      ? 'Cadastre placas, módulos, links, especificações e observações pelo admin para montar sua base técnica.'
    : 'Esta área vai mostrar os documentos, vídeos, produtos e novidades publicados pela ELN Technology.';

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'siteContent'),
      (snapshot) => {
        setLoadError('');
        setContentItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as StoreProduct));
      },
      () => setLoadError('Não foi possível carregar os conteúdos publicados. Confira as regras do Firestore.'),
    );

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
          <div className={`mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 ${isStorePage ? 'lg:grid-cols-[1.15fr_0.85fr] lg:items-center' : 'lg:grid-cols-[1fr_0.75fr]'}`}>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">{data.eyebrow}</p>
              <h1 className={`mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                {data.title}
              </h1>
              <p className={`mt-5 max-w-3xl text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{data.description}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={isStorePage ? '#vitrine' : '#conteúdos'}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]"
                >
                  {isStorePage ? 'Ver produtos disponíveis' : 'Ver conteúdos publicados'}
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

            {isStorePage ? (
              <aside className={`rounded-md border p-6 sm:p-7 ${isDark ? 'border-white/10 bg-white/[0.08]' : 'border-sky-100 bg-[#EEF7FF]'}`}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                    <Store className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">Atendimento oficial</p>
                    <h2 className="mt-1 text-xl font-black">Compre com orientação técnica</h2>
                  </div>
                </div>
                <p className={`mt-5 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Tire dúvidas, solicite adaptações e receba uma proposta adequada ao seu projeto.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { value: `${storeItems.length}`, label: 'soluções' },
                    { value: 'OTA', label: 'firmware' },
                    { value: 'Direto', label: 'suporte' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-md border px-3 py-4 text-center ${isDark ? 'border-white/10 bg-[#070A1F]/60' : 'border-sky-100 bg-white'}`}>
                      <p className="text-lg font-black text-[#159AFD]">{item.value}</p>
                      <p className={`mt-1 text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <a href="#vitrine" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52]">
                  Explorar produtos
                  <ArrowRight className="h-4 w-4" />
                </a>
              </aside>
            ) : isTeamPage ? (
              <aside className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/10' : 'border-sky-100 bg-[#EEF7FF]'}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                  <Users className="h-7 w-7" />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-widest text-[#159AFD]">Equipe publicada pelo painel</p>
                <h2 className="mt-2 text-2xl font-black">Responsabilidades, contatos e funções em um só lugar</h2>
                <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Cadastre membros no admin para mostrar quem atende, quem executa projetos e quais áreas cada pessoa acompanha.
                </p>
                <div className="mt-6 grid gap-3">
                  {['Administração', 'Técnicos', 'Parceiros', 'Atendimento e suporte'].map((step) => (
                    <div key={step} className={`flex items-center gap-3 rounded-md border p-3 ${isDark ? 'border-white/10 bg-[#070A1F]/60' : 'border-sky-100 bg-white'}`}>
                      <CheckCircle2 className="h-5 w-5 flex-none text-[#159AFD]" />
                      <span className="font-bold">{step}</span>
                    </div>
                  ))}
                </div>
              </aside>
            ) : (
              <aside className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/10' : 'border-sky-100 bg-[#EEF7FF]'}`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#159AFD] text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-black">Resumo da área</h2>
                <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{data.highlight}</p>
                <div className="mt-6 grid gap-3">
                  {data.sections.map((section) => (
                    <div key={section.title} className={`flex items-center gap-3 rounded-md border p-3 ${isDark ? 'border-white/10 bg-[#070A1F]/60' : 'border-sky-100 bg-white'}`}>
                      <CheckCircle2 className="h-5 w-5 flex-none text-[#159AFD]" />
                      <span className="font-bold">{section.title}</span>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>

        <section className={`py-10 ${isStorePage ? 'hidden' : ''}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {quickLinks.map(({ label, to, icon: LinkIcon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex min-h-24 items-center gap-3 rounded-md border p-4 font-black transition ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-sky-100 bg-white text-[#0D0F52] hover:border-[#159AFD]'}`}
                >
                  <LinkIcon className="h-5 w-5 text-[#159AFD]" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {isStorePage && (
          <section id="vitrine" className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className={`rounded-md border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/[0.045]' : 'border-sky-100 bg-white shadow-sm'}`}>
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Vitrine oficial</p>
                    <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>
                      Produtos e serviços disponíveis
                    </h2>
                    <p className={`mt-2 max-w-2xl leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Compare soluções, consulte detalhes técnicos e fale diretamente com a equipe.
                    </p>
                  </div>
                  <a href="https://wa.me/5581997092380?text=Olá,%20quero%20falar%20com%20a%20ELN%20Technology" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-[#159AFD]/30 px-4 py-3 text-sm font-black text-[#159AFD] transition hover:bg-[#159AFD]/10">
                    Atendimento da loja
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-5 grid gap-3 border-b border-slate-200 pb-5 dark:border-white/10 lg:grid-cols-[1fr_auto]">
                  <label className={`flex min-h-12 items-center gap-3 rounded-md border px-4 ${isDark ? 'border-white/10 bg-[#070A1F]/70 text-white' : 'border-sky-100 bg-[#F7FBFF] text-[#0D0F52]'}`}>
                    <Search className="h-5 w-5 flex-none text-[#159AFD]" />
                    <input
                      type="search"
                      value={storeSearch}
                      onChange={(event) => setStoreSearch(event.target.value)}
                      placeholder="Buscar produto, serviço ou categoria"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {storeCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setStoreCategory(category)}
                        className={`min-h-12 rounded-md border px-4 text-sm font-black transition ${
                          storeCategory === category
                            ? 'border-[#159AFD] bg-[#159AFD] text-white'
                            : isDark
                              ? 'border-white/10 bg-[#070A1F]/70 text-slate-200 hover:border-[#159AFD]/50'
                              : 'border-sky-100 bg-white text-[#0D0F52] hover:border-[#159AFD]/50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <p className={`mt-5 text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {filteredStoreItems.length} item(ns) encontrado(s)
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStoreItems.map((item) => (
                    <article key={item.id} className={`flex min-h-64 flex-col overflow-hidden rounded-md border transition ${isDark ? 'border-white/10 bg-[#070A1F]/70 hover:bg-[#070A1F]' : 'border-sky-100 bg-[#F7FBFF] hover:bg-white'}`}>
                      <StoreProductVisual item={item} isDark={isDark} />
                      <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] text-white">
                          {item.type === 'Loja' ? <Store className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-3 py-1 text-xs font-black uppercase text-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              Destaque
                            </span>
                          )}
                          <span className="rounded-md bg-[#159AFD]/15 px-3 py-1 text-xs font-black uppercase text-[#159AFD]">
                            {item.category || item.type || 'Produto'}
                          </span>
                        </div>
                      </div>
                      <h3 className={`mt-5 text-xl font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{item.title}</h3>
                      {(item.sku || item.marketplace) && (
                        <div className={`mt-3 grid gap-2 rounded-md border p-3 text-xs font-bold ${isDark ? 'border-white/10 bg-white/[0.035] text-slate-300' : 'border-sky-100 bg-white text-slate-600'}`}>
                          {item.sku && <span>Código: {item.sku}</span>}
                          {item.marketplace && <span>Canal: {item.marketplace}</span>}
                        </div>
                      )}
                      <p className={`mt-3 flex-1 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.description}</p>
                      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
                        <div>
                          <p className="text-xs font-black uppercase text-slate-500">Valor</p>
                          <p className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>{formatStorePrice(item)}</p>
                        </div>
                        <span className={`rounded-md px-3 py-2 text-xs font-black ${
                          item.availability === 'Indisponível'
                            ? 'bg-rose-500/15 text-rose-500'
                            : 'bg-emerald-500/15 text-emerald-500'
                        }`}>
                          {item.availability || 'Disponível'}
                        </span>
                      </div>
                      <a
                        href={item.url || `https://wa.me/5581997092380?text=${encodeURIComponent(`Olá, quero saber sobre ${item.title || 'um produto da ELN Technology'}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 font-black text-white transition hover:bg-[#0D0F52]"
                      >
                        {item.url ? 'Abrir link de compra' : 'Comprar ou consultar'}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <Link
                        to={`/produto/${item.id}`}
                        className={`mt-2 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-black transition ${
                          isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-sky-100 bg-white text-[#0D0F52] hover:border-[#159AFD]'
                        }`}
                      >
                        Ver detalhes técnicos
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      </div>
                    </article>
                  ))}
                  {filteredStoreItems.length === 0 && (
                    <div className={`rounded-md border p-8 text-center md:col-span-2 lg:col-span-3 ${isDark ? 'border-white/10 bg-[#070A1F]/70' : 'border-sky-100 bg-[#F7FBFF]'}`}>
                      <Search className="mx-auto h-8 w-8 text-[#159AFD]" />
                      <p className="mt-4 font-black">Nenhum produto real publicado ainda.</p>
                      <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Entre no painel admin, abra Conteúdo público, clique em Cadastrar produto real e salve com status Publicado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {!isStorePage && (
          <>
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
                  {publicSectionTitle}
                </h2>
              </div>
              <Link to={isTeamPage ? '/#contato' : '/noticias-inovacoes'} className="inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]">
                {isTeamPage ? 'Falar com a equipe' : 'Ver notícias'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadError ? (
              <div className={`rounded-md border p-6 ${isDark ? 'border-rose-400/30 bg-rose-500/10 text-rose-100' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                <p className="font-black">{loadError}</p>
              </div>
            ) : displayedPublicItems.length === 0 ? (
              <div className={`rounded-md border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white shadow-sm'}`}>
                <p className="font-black">Nenhum conteúdo publicado ainda.</p>
                <p className={`mt-2 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {publicSectionText}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {displayedPublicItems.map((item) => (
                  <article key={item.id} className={`overflow-hidden rounded-md border ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-white shadow-sm'}`}>
                    {item.imageUrl && <StoreProductVisual item={item} isDark={isDark} />}
                    <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-md bg-[#159AFD]/15 px-3 py-1 text-xs font-black uppercase text-[#159AFD]">
                        {item.category || item.type || 'Conteúdo'}
                      </span>
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${isDark ? 'bg-[#070A1F] text-slate-300' : 'bg-[#EEF7FF] text-[#0D0F52]'}`}>
                        {item.status || 'Publicado'}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black">{item.title || 'Sem título'}</h3>
                    {(item.sku || item.marketplace) && (
                      <p className={`mt-2 text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {[item.sku, item.marketplace].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className={`mt-3 leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.description || 'Sem descrição.'}</p>
                    {contentLines(item.features).length > 0 && (
                      <div className="mt-4 grid gap-2">
                        {contentLines(item.features).slice(0, 4).map((feature) => (
                          <span key={feature} className={`rounded-md px-3 py-2 text-sm font-bold ${isDark ? 'bg-[#070A1F] text-slate-200' : 'bg-[#EEF7FF] text-[#0D0F52]'}`}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.price && <p className="mt-4 text-lg font-black text-[#159AFD]">{formatStorePrice(item)}</p>}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline">
                        Abrir link
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                    {isStudyPage && (
                      <Link to={`/estudos/${item.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#159AFD] hover:underline">
                        Abrir ficha técnica
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
          </>
        )}

        <section className={`border-t py-16 ${isDark ? 'border-white/10 bg-[#080B24]' : 'border-sky-100 bg-white'}`}>
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {footerHighlights.map(({ icon: FooterIcon, label }) => (
              <div key={label} className={`rounded-md border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-[#F7FBFF]'}`}>
                <FooterIcon className="h-7 w-7 text-[#159AFD]" />
                <p className="mt-3 font-black">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
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

export function EstudosPage() {
  return <CompanyPage data={pages.estudos} />;
}

export function ProdutosPage() {
  return <CompanyPage data={pages.produtos} />;
}

export function LojasPage() {
  return <CompanyPage data={pages.lojas} />;
}

export function VideosFuturoPage() {
  return <CompanyPage data={pages.videos} />;
}

export function NoticiasInovacoesPage() {
  return <CompanyPage data={pages.noticias} />;
}
