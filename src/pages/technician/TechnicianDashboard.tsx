import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  CheckCircle2,
  FileText,
  FolderOpen,
  Gauge,
  MessageSquare,
  Play,
  UserCheck,
  Wrench,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { notificationIsUnread, useNotifications } from '../../hooks/useNotifications';

type BaseRecord = {
  id: string;
  title?: string;
  status?: string;
  client?: string;
  clientEmail?: string;
  technician?: string;
  technicianEmail?: string;
};

type ProjectRecord = BaseRecord & {
  name?: string;
  description?: string;
  deadline?: string;
  progress?: string;
  budget?: string;
};

type TicketRecord = BaseRecord & {
  priority?: string;
  message?: string;
};

type DocumentRecord = BaseRecord & {
  category?: string;
  url?: string;
};

const tabs = [
  { id: 'overview', label: 'Visão geral', icon: Gauge },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'support', label: 'Suporte', icon: Wrench },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'notifications', label: 'Notificações', icon: Bell },
];

const panelClass = 'dashboard-surface rounded-md border shadow-[0_5px_18px_rgba(15,23,42,0.045)] dark:shadow-none';
const primaryButton = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0D0F52]';
const secondaryButton = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#0D0F52] dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5';

function recordList<T extends BaseRecord>(snapshot: { docs: Array<{ id: string; data: () => unknown }> }) {
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) }) as T);
}

function progressValue(value?: string) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function formatDate(value?: string) {
  if (!value) return 'Não informado';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

function StatusPill({ value = 'Novo' }: { value?: string }) {
  const normalized = value.toLowerCase();
  const color = normalized.includes('conclu') || normalized.includes('resolvido') || normalized.includes('lida')
    ? 'bg-emerald-500/15 text-emerald-500'
    : normalized.includes('urgente') || normalized.includes('atras')
      ? 'bg-rose-500/15 text-rose-500'
      : normalized.includes('aguard') || normalized.includes('pendente')
        ? 'bg-amber-500/15 text-amber-500'
        : 'bg-[#159AFD]/15 text-[#159AFD]';

  return <span className={`rounded-md px-3 py-1 text-xs font-black ${color}`}>{value}</span>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className={`${panelClass} p-8 text-center`}>
      <p className="font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [status, setStatus] = useState('');
  const [loadError, setLoadError] = useState('');
  const { notifications, unreadCount, error: notificationError, markRead } = useNotifications(user?.role, user?.id, user?.email);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab && tabs.some((tab) => tab.id === requestedTab) && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
      return;
    }
    if (!tabs.some((tab) => tab.id === activeTab)) setActiveTab('overview');
  }, [activeTab, searchParams]);

  useEffect(() => {
    const onError = () => setLoadError('Não foi possível carregar todos os dados. Publique as regras atualizadas do Firestore.');
    const subscriptions = [
      onSnapshot(collection(db, 'projetos'), (snapshot) => setProjects(recordList<ProjectRecord>(snapshot)), onError),
      onSnapshot(collection(db, 'supportTickets'), (snapshot) => setTickets(recordList<TicketRecord>(snapshot)), onError),
      onSnapshot(collection(db, 'documents'), (snapshot) => setDocuments(recordList<DocumentRecord>(snapshot)), onError),
    ];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, []);

  const visibleProjects = useMemo(() => {
    const identity = [user?.name, user?.email].filter(Boolean).map((value) => value!.toLowerCase());
    const assigned = projects.filter((item) => {
      const technician = `${item.technician || ''} ${item.technicianEmail || ''}`.toLowerCase();
      return !technician.trim() || identity.some((value) => technician.includes(value));
    });
    return assigned.length ? assigned : projects;
  }, [projects, user?.email, user?.name]);

  const visibleTickets = useMemo(() => {
    const identity = [user?.name, user?.email].filter(Boolean).map((value) => value!.toLowerCase());
    return tickets.filter((item) => {
      const technician = `${item.technician || ''} ${item.technicianEmail || ''}`.toLowerCase();
      return !technician.trim() || identity.some((value) => technician.includes(value));
    });
  }, [tickets, user?.email, user?.name]);

  const totals = useMemo(() => {
    const activeProjects = visibleProjects.filter((item) => !String(item.status).toLowerCase().includes('conclu')).length;
    const openTickets = visibleTickets.filter((item) => !String(item.status).toLowerCase().includes('resolvido')).length;
    const completedProjects = visibleProjects.filter((item) => String(item.status).toLowerCase().includes('conclu')).length;
    const averageProgress = visibleProjects.length
      ? Math.round(visibleProjects.reduce((sum, item) => sum + progressValue(item.progress), 0) / visibleProjects.length)
      : 0;
    return { activeProjects, openTickets, completedProjects, averageProgress };
  }, [visibleProjects, visibleTickets]);

  function openTab(tab: string) {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function updateRecord(collectionName: 'projetos' | 'supportTickets', id: string, data: object, successMessage: string) {
    setStatus('Salvando atualização...');
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        technician: user?.name || '',
        technicianEmail: user?.email?.toLowerCase() || '',
        updatedAt: serverTimestamp(),
      });
      setStatus(successMessage);
    } catch {
      setStatus('Não foi possível salvar. Publique as regras atualizadas do Firestore e tente novamente.');
    }
  }

  async function markNotificationRead(id: string) {
    try {
      await markRead(id);
      setStatus('Notificação marcada como lida.');
    } catch {
      setStatus('Não foi possível marcar a notificação como lida.');
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Projetos ativos', value: totals.activeProjects, icon: FolderOpen, tab: 'projects' },
          { label: 'Tickets abertos', value: totals.openTickets, icon: Wrench, tab: 'support' },
          { label: 'Projetos concluídos', value: totals.completedProjects, icon: CheckCircle2, tab: 'reports' },
          { label: 'Progresso médio', value: `${totals.averageProgress}%`, icon: BarChart3, tab: 'reports' },
        ].map(({ label, value, icon: Icon, tab }) => (
          <button key={label} type="button" onClick={() => openTab(tab)} className={`${panelClass} p-5 text-left transition hover:border-[#159AFD]/50`}>
            <Icon className="h-6 w-6 text-[#159AFD]" />
            <p className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <section className={`${panelClass} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Trabalho atual</h2>
              <p className="mt-1 text-sm text-slate-500">Projetos reais cadastrados e atribuídos pela administração.</p>
            </div>
            <button type="button" onClick={() => openTab('projects')} className={secondaryButton}>Ver projetos</button>
          </div>
          <div className="mt-5 space-y-3">
            {visibleProjects.slice(0, 4).map((project) => (
              <article key={project.id} className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950 dark:text-white">{project.name || project.title || 'Projeto sem título'}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.client || project.clientEmail || 'Cliente não informado'}</p>
                  </div>
                  <StatusPill value={project.status} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-[#159AFD]" style={{ width: `${progressValue(project.progress)}%` }} />
                </div>
              </article>
            ))}
            {visibleProjects.length === 0 && <EmptyState title="Nenhum projeto disponível" text="Quando a administração cadastrar ou atribuir um projeto, ele aparecerá aqui." />}
          </div>
        </section>

        <aside className={`${panelClass} p-5 sm:p-6`}>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Ações rápidas</h2>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => openTab('projects')} className={primaryButton}><Play className="h-4 w-4" /> Atualizar projeto</button>
            <button type="button" onClick={() => openTab('support')} className={secondaryButton}><MessageSquare className="h-4 w-4" /> Atender suporte</button>
            <button type="button" onClick={() => openTab('documents')} className={secondaryButton}><FileText className="h-4 w-4" /> Consultar documentos</button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderProjects = () => visibleProjects.length === 0
    ? <EmptyState title="Nenhum projeto encontrado" text="Os projetos cadastrados pela administração aparecem aqui em tempo real." />
    : (
      <div className="grid gap-5 xl:grid-cols-2">
        {visibleProjects.map((project) => {
          const progress = progressValue(project.progress);
          return (
            <article key={project.id} className={`${panelClass} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">{project.name || project.title || 'Projeto sem título'}</h2>
                  <p className="mt-1 text-sm text-slate-500">{project.client || project.clientEmail || 'Cliente não informado'}</p>
                </div>
                <StatusPill value={project.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description || 'Sem descrição cadastrada.'}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="dashboard-soft-surface rounded-md border p-3"><span className="block text-slate-500">Prazo</span><strong className="mt-1 block">{formatDate(project.deadline)}</strong></div>
                <div className="dashboard-soft-surface rounded-md border p-3"><span className="block text-slate-500">Progresso</span><strong className="mt-1 block">{progress}%</strong></div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-[#159AFD]" style={{ width: `${progress}%` }} /></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => updateRecord('projetos', project.id, { status: 'Em andamento', progress: String(Math.min(100, progress + 10)) }, 'Progresso atualizado.')} className={primaryButton}>Avançar 10%</button>
                <button type="button" onClick={() => updateRecord('projetos', project.id, { status: 'Concluído', progress: '100' }, 'Projeto concluído.')} className={secondaryButton}>Marcar concluído</button>
              </div>
            </article>
          );
        })}
      </div>
    );

  const renderSupport = () => visibleTickets.length === 0
    ? <EmptyState title="Nenhum ticket disponível" text="Novos pedidos de suporte aparecem aqui em tempo real." />
    : (
      <div className="grid gap-5 xl:grid-cols-2">
        {visibleTickets.map((ticket) => (
          <article key={ticket.id} className={`${panelClass} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-black text-slate-950 dark:text-white">{ticket.title || 'Ticket sem título'}</h2>
                <p className="mt-1 text-sm text-slate-500">{ticket.client || ticket.clientEmail || 'Cliente não informado'} · Prioridade {ticket.priority || 'Média'}</p>
              </div>
              <StatusPill value={ticket.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{ticket.message || 'Sem mensagem cadastrada.'}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => updateRecord('supportTickets', ticket.id, { status: 'Em atendimento' }, 'Ticket assumido para atendimento.')} className={primaryButton}><UserCheck className="h-4 w-4" /> Atender</button>
              <button type="button" onClick={() => updateRecord('supportTickets', ticket.id, { status: 'Resolvido' }, 'Ticket marcado como resolvido.')} className={secondaryButton}><CheckCircle2 className="h-4 w-4" /> Resolver</button>
            </div>
          </article>
        ))}
      </div>
    );

  const renderDocuments = () => documents.length === 0
    ? <EmptyState title="Nenhum documento disponível" text="Manuais, referências e arquivos cadastrados pela administração aparecem aqui." />
    : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((item) => (
          <article key={item.id} className={`${panelClass} p-5`}>
            <FileText className="h-7 w-7 text-[#159AFD]" />
            <p className="mt-4 text-xs font-black uppercase text-[#159AFD]">{item.category || 'Documento'}</p>
            <h2 className="mt-2 font-black text-slate-950 dark:text-white">{item.title || 'Documento sem título'}</h2>
            <p className="mt-2 text-sm text-slate-500">{item.client || item.clientEmail || 'Documento interno'}</p>
            {item.url
              ? <a href={item.url} target="_blank" rel="noreferrer" className={`mt-5 w-full ${primaryButton}`}>Abrir documento</a>
              : <p className="mt-5 text-sm text-slate-500">Link ainda não adicionado.</p>}
          </article>
        ))}
      </div>
    );

  const renderReports = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={`${panelClass} p-5 sm:p-6`}>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Indicadores reais</h2>
        <div className="mt-5 space-y-4">
          {[
            { label: 'Projetos ativos', value: totals.activeProjects },
            { label: 'Projetos concluídos', value: totals.completedProjects },
            { label: 'Tickets abertos', value: totals.openTickets },
            { label: 'Progresso médio', value: `${totals.averageProgress}%` },
          ].map((item) => (
            <div key={item.label} className="dashboard-soft-surface flex items-center justify-between rounded-md border p-4">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
              <strong className="text-xl text-[#159AFD]">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className={`${panelClass} p-5 sm:p-6`}>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Origem dos dados</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Este painel não usa números de demonstração. Projetos, tickets, documentos e indicadores são calculados diretamente das coleções do Firestore.
        </p>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="dashboard-soft-surface rounded-md border p-4"><strong>{visibleProjects.length}</strong> projeto(s) disponível(is)</div>
          <div className="dashboard-soft-surface rounded-md border p-4"><strong>{visibleTickets.length}</strong> ticket(s) disponível(is)</div>
          <div className="dashboard-soft-surface rounded-md border p-4"><strong>{documents.length}</strong> documento(s) disponível(is)</div>
        </div>
      </section>
    </div>
  );

  const renderNotifications = () => notifications.length === 0
    ? <EmptyState title="Nenhuma notificação" text="Avisos direcionados à equipe técnica aparecem aqui." />
    : (
      <div className="space-y-3">
        {notifications.map((item) => (
          <article key={item.id} className={`${panelClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between`}>
            <div>
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-slate-950 dark:text-white">{item.title || 'Notificação'}</h2><StatusPill value={notificationIsUnread(item, user?.id) ? item.status : 'Lida'} /></div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.message || 'Sem mensagem.'}</p>
            </div>
            {notificationIsUnread(item, user?.id) && <button type="button" onClick={() => markNotificationRead(item.id)} className={secondaryButton}>Marcar lida</button>}
          </article>
        ))}
      </div>
    );

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <DashboardLayout>
      <div className="technician-dashboard space-y-6">
        <header className={`${panelClass} flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#159AFD]/15 text-[#159AFD]"><CurrentIcon className="h-6 w-6" /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Painel técnico</p>
              <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{currentTab.label}</h1>
              <p className="mt-1 text-sm text-slate-500">Olá, {user?.name}. Dados sincronizados com o Firestore.</p>
            </div>
          </div>
          <button type="button" onClick={() => openTab('notifications')} className="relative flex items-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-[#159AFD] dark:border-white/10 dark:text-slate-300">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
        </header>

        {(status || loadError || notificationError) && (
          <div role="status" className={`rounded-md border p-3 text-sm font-semibold ${loadError || notificationError ? 'border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-200' : 'border-[#159AFD]/30 bg-[#159AFD]/10 text-[#0D0F52] dark:text-sky-200'}`}>
            {loadError || notificationError || status}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className={`${panelClass} h-fit p-2 lg:sticky lg:top-24`}>
            <nav className="mobile-scrollbar flex gap-1 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => openTab(id)} className={`flex min-h-11 flex-none items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition lg:w-full ${activeTab === id ? 'bg-[#0D0F52] text-white shadow-sm dark:bg-[#159AFD]' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0D0F52] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>
          <main className="min-w-0">
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'support' && renderSupport()}
            {activeTab === 'documents' && renderDocuments()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'overview' && renderOverview()}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
