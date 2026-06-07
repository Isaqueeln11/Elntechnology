import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  FolderOpen,
  LifeBuoy,
  MessageSquare,
  PackagePlus,
  Plus,
  Save,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { notificationIsUnread, useNotifications } from '../../hooks/useNotifications';

type RecordBase = {
  id: string;
  title?: string;
  status?: string;
  client?: string;
  clientEmail?: string;
  ownerId?: string;
};

type ProjectRecord = RecordBase & {
  name?: string;
  budget?: string;
  deadline?: string;
  technician?: string;
  progress?: string;
  description?: string;
};

type TicketRecord = RecordBase & {
  priority?: string;
  message?: string;
};

type DocumentRecord = RecordBase & {
  category?: string;
  url?: string;
};

type InvoiceRecord = RecordBase & {
  amount?: string;
  dueDate?: string;
};

type OrderRecord = RecordBase & {
  type?: string;
  budget?: string;
  notes?: string;
};

const tabs = [
  { id: 'overview', label: 'Visão geral', icon: CheckCircle2 },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'orders', label: 'Solicitações', icon: ShoppingBag },
  { id: 'support', label: 'Suporte', icon: LifeBuoy },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'billing', label: 'Faturamento', icon: CreditCard },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'settings', label: 'Meu perfil', icon: Settings },
];

const inputClass =
  'mt-2 w-full rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-[#159AFD]/10 dark:border-white/10 dark:bg-[#070A1F]/70 dark:text-white';
const panelClass = 'rounded-md border border-[#D8E2EC] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.045)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-none';

function formatDate(value?: string) {
  if (!value) return 'Não informado';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

function recordList<T extends RecordBase>(snapshot: { docs: Array<{ id: string; data: () => unknown }> }) {
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) }) as T);
}

function mergeRecords<T extends RecordBase>(first: T[], second: T[]) {
  return Array.from(new Map([...first, ...second].map((item) => [item.id, item])).values());
}

function progressValue(value?: string) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function StatusPill({ value = 'Novo' }: { value?: string }) {
  const normalized = value.toLowerCase();
  const color = normalized.includes('pago') || normalized.includes('conclu') || normalized.includes('resolvido') || normalized.includes('lida')
    ? 'bg-emerald-500/15 text-emerald-500'
    : normalized.includes('atras') || normalized.includes('urgente') || normalized.includes('recusado')
      ? 'bg-rose-500/15 text-rose-500'
      : normalized.includes('aguard') || normalized.includes('pendente')
        ? 'bg-amber-500/15 text-amber-500'
        : 'bg-[#159AFD]/15 text-[#159AFD]';

  return <span className={`rounded-md px-3 py-1 text-xs font-black ${color}`}>{value}</span>;
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className={`${panelClass} p-8 text-center`}>
      <p className="font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} required={required} />
    </label>
  );
}

function ClientDashboard() {
  const { user, updateUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || user?.preferences?.dashboardStartPage || 'overview');
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [status, setStatus] = useState('');
  const [loadError, setLoadError] = useState('');
  const { notifications, unreadCount, error: notificationError, markRead } = useNotifications(user?.role, user?.id, user?.email);
  const [orderForm, setOrderForm] = useState({ title: '', type: 'Novo projeto', budget: '', notes: '' });
  const [ticketForm, setTicketForm] = useState({ title: '', priority: 'Média', message: '' });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    avatar: user?.avatar || '',
    theme: user?.preferences?.theme || user?.theme || 'dark',
    dashboardDensity: user?.preferences?.dashboardDensity || 'comfortable',
    dashboardStartPage: user?.preferences?.dashboardStartPage || 'overview',
  });

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab && tabs.some((tab) => tab.id === requestedTab) && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
      return;
    }
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('overview');
      return;
    }
    if (requestedTab !== activeTab) setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || '',
      company: user.company || '',
      avatar: user.avatar || '',
      theme: user.preferences?.theme || user.theme || 'dark',
      dashboardDensity: user.preferences?.dashboardDensity || 'comfortable',
      dashboardStartPage: user.preferences?.dashboardStartPage || 'overview',
    });
  }, [user]);

  useEffect(() => {
    if (!user?.id || !user.email) return;
    setLoadError('');
    const subscriptions: Array<() => void> = [];

    function subscribeOwned<T extends RecordBase>(collectionName: string, setter: React.Dispatch<React.SetStateAction<T[]>>) {
      let byOwner: T[] = [];
      let byEmail: T[] = [];
      const emit = () => setter(mergeRecords(byOwner, byEmail));
      const onError = () => setLoadError('Alguns dados não puderam ser carregados. Publique as regras atualizadas do Firestore.');

      subscriptions.push(
        onSnapshot(query(collection(db, collectionName), where('ownerId', '==', user!.id)), (snapshot) => {
          byOwner = recordList<T>(snapshot);
          emit();
        }, onError),
        onSnapshot(query(collection(db, collectionName), where('clientEmail', '==', user!.email.toLowerCase())), (snapshot) => {
          byEmail = recordList<T>(snapshot);
          emit();
        }, onError),
      );
    }

    subscribeOwned<ProjectRecord>('projetos', setProjects);
    subscribeOwned<TicketRecord>('supportTickets', setTickets);
    subscribeOwned<DocumentRecord>('documents', setDocuments);
    subscribeOwned<InvoiceRecord>('invoices', setInvoices);
    subscribeOwned<OrderRecord>('orders', setOrders);

    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  const totals = useMemo(() => ({
    activeProjects: projects.filter((item) => item.status !== 'Concluído').length,
    openTickets: tickets.filter((item) => item.status !== 'Resolvido').length,
    pendingInvoices: invoices.filter((item) => !['Pago', 'Cancelado'].includes(item.status || '')).length,
    unreadNotifications: unreadCount,
  }), [invoices, projects, tickets, unreadCount]);

  async function createClientRecord(collectionName: 'orders' | 'supportTickets', data: object, successMessage: string) {
    if (!user) return;
    setStatus('Salvando...');
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        client: user.name,
        clientEmail: user.email.toLowerCase(),
        ownerId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      try {
        const typedData = data as { title?: string; type?: string; message?: string; notes?: string };
        const isOrder = collectionName === 'orders';
        await addDoc(collection(db, 'notifications'), {
          title: isOrder ? 'Nova solicitação de cliente' : 'Novo ticket de suporte',
          message: `${user.name} (${user.email}) enviou ${isOrder ? 'uma solicitação' : 'um ticket'}: ${typedData.title || typedData.type || 'Sem título'}. ${typedData.notes || typedData.message || ''}`.trim(),
          target: 'Admin',
          status: 'Nova',
          type: isOrder ? 'client-order' : 'client-support',
          userId: user.id,
          ownerId: user.id,
          clientEmail: user.email.toLowerCase(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch {
        // O pedido principal foi salvo; a notificação depende das regras publicadas.
      }
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
      setStatus('Não foi possível marcar a notificação como lida. Publique as regras atualizadas do Firestore.');
    }
  }

  async function handleProfileSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Salvando perfil...');
    const response = await updateUserProfile({
      name: profileForm.name,
      company: profileForm.company,
      avatar: profileForm.avatar,
      theme: profileForm.theme as 'dark' | 'light',
      preferences: {
        ...(user?.preferences || {
          notifyNewUsers: true,
          notifyStatusChanges: true,
          theme: profileForm.theme as 'dark' | 'light',
          dashboardDensity: 'comfortable',
          dashboardStartPage: 'overview',
        }),
        theme: profileForm.theme as 'dark' | 'light',
        dashboardDensity: profileForm.dashboardDensity as 'comfortable' | 'compact',
        dashboardStartPage: profileForm.dashboardStartPage,
      },
    });
    setStatus(response.message);
  }

  function openTab(tab: string) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-md bg-[#0D0F52] px-4 py-3 text-sm font-black text-white transition hover:bg-[#159AFD] dark:bg-[#159AFD] dark:hover:bg-[#508AD0]';
  const secondaryButton = 'inline-flex items-center justify-center gap-2 rounded-md border border-[#CBD8E6] bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:bg-sky-50 hover:text-[#0D0F52] dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5';

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Projetos ativos', value: totals.activeProjects, icon: FolderOpen, tab: 'projects' },
          { label: 'Tickets abertos', value: totals.openTickets, icon: LifeBuoy, tab: 'support' },
          { label: 'Cobranças pendentes', value: totals.pendingInvoices, icon: CreditCard, tab: 'billing' },
          { label: 'Novas notificações', value: totals.unreadNotifications, icon: Bell, tab: 'notifications' },
        ].map(({ label, value, icon: Icon, tab }) => (
          <button key={label} type="button" onClick={() => openTab(tab)} className={`${panelClass} p-5 text-left transition hover:border-[#159AFD]/50`}>
            <Icon className="h-6 w-6 text-[#159AFD]" />
            <p className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className={`${panelClass} p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Projetos recentes</h2>
              <p className="mt-1 text-sm text-slate-500">Acompanhamento real dos projetos vinculados à sua conta.</p>
            </div>
            <button type="button" onClick={() => openTab('projects')} className={secondaryButton}>Ver todos</button>
          </div>
          <div className="mt-5 space-y-3">
            {projects.slice(0, 3).map((project) => (
              <article key={project.id} className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070A1F]/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950 dark:text-white">{project.name || project.title || 'Projeto sem título'}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.technician || 'Técnico ainda não definido'}</p>
                  </div>
                  <StatusPill value={project.status} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-[#159AFD]" style={{ width: `${progressValue(project.progress)}%` }} />
                </div>
              </article>
            ))}
            {projects.length === 0 && <EmptyState title="Nenhum projeto vinculado ainda" text="Quando a ELN vincular um projeto ao seu e-mail, ele aparecerá aqui automaticamente." />}
          </div>
        </section>

        <aside className={`${panelClass} p-5 sm:p-6`}>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Ações rápidas</h2>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => openTab('orders')} className={primaryButton}><PackagePlus className="h-4 w-4" /> Solicitar projeto</button>
            <button type="button" onClick={() => openTab('support')} className={secondaryButton}><MessageSquare className="h-4 w-4" /> Abrir suporte</button>
            <button type="button" onClick={() => openTab('documents')} className={secondaryButton}><FileText className="h-4 w-4" /> Ver documentos</button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderProjects = () => projects.length === 0
    ? <EmptyState title="Nenhum projeto encontrado" text="Solicite um novo projeto. Quando aprovado, o andamento aparecerá nesta área." action={<button type="button" onClick={() => openTab('orders')} className={primaryButton}><Plus className="h-4 w-4" /> Nova solicitação</button>} />
    : (
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className={`${panelClass} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">{project.name || project.title || 'Projeto sem título'}</h3>
                <p className="mt-1 text-sm text-slate-500">{project.technician || 'Responsável ainda não definido'}</p>
              </div>
              <StatusPill value={project.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description || 'Sem descrição adicionada.'}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3 dark:bg-[#070A1F]/60"><span className="block text-slate-500">Prazo</span><strong className="mt-1 block">{formatDate(project.deadline)}</strong></div>
              <div className="rounded-md bg-slate-50 p-3 dark:bg-[#070A1F]/60"><span className="block text-slate-500">Valor</span><strong className="mt-1 block">{project.budget || 'A definir'}</strong></div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs font-bold text-slate-500"><span>Progresso</span><span>{progressValue(project.progress)}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-[#159AFD]" style={{ width: `${progressValue(project.progress)}%` }} /></div>
            </div>
          </article>
        ))}
      </div>
    );

  const renderOrders = () => (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <form
        className={`${panelClass} p-5`}
        onSubmit={async (event) => {
          event.preventDefault();
          await createClientRecord('orders', { ...orderForm, status: 'Novo' }, 'Solicitação enviada para análise.');
          setOrderForm({ title: '', type: 'Novo projeto', budget: '', notes: '' });
        }}
      >
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Nova solicitação</h2>
        <p className="mt-1 text-sm text-slate-500">Peça projeto, manutenção ou atualização sem sair do painel.</p>
        <div className="mt-5 space-y-4">
          <Field label="Título" value={orderForm.title} onChange={(title) => setOrderForm({ ...orderForm, title })} placeholder="Ex.: Automação de iluminação" />
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo
            <select className={inputClass} value={orderForm.type} onChange={(event) => setOrderForm({ ...orderForm, type: event.target.value })}>
              {['Novo projeto', 'Manutenção', 'Atualização OTA', 'Documento', 'Suporte'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <Field label="Valor previsto" value={orderForm.budget} onChange={(budget) => setOrderForm({ ...orderForm, budget })} placeholder="Opcional" required={false} />
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Detalhes
            <textarea className={`${inputClass} resize-none`} rows={5} value={orderForm.notes} onChange={(event) => setOrderForm({ ...orderForm, notes: event.target.value })} required />
          </label>
          <button className={`w-full ${primaryButton}`}><Plus className="h-4 w-4" /> Enviar solicitação</button>
        </div>
      </form>
      <section className={`${panelClass} p-5`}>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Minhas solicitações</h2>
        <div className="mt-5 space-y-3">
          {orders.map((item) => (
            <article key={item.id} className="rounded-md border border-slate-200 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">{item.title || 'Solicitação'}</h3><p className="mt-1 text-sm text-slate-500">{item.type || 'Novo projeto'} · {item.budget || 'Valor em análise'}</p></div><StatusPill value={item.status} /></div>
              {item.notes && <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.notes}</p>}
            </article>
          ))}
          {orders.length === 0 && <EmptyState title="Nenhuma solicitação enviada" text="Use o formulário para enviar sua primeira solicitação." />}
        </div>
      </section>
    </div>
  );

  const renderSupport = () => (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <form
        className={`${panelClass} p-5`}
        onSubmit={async (event) => {
          event.preventDefault();
          await createClientRecord('supportTickets', { ...ticketForm, status: 'Aberto' }, 'Ticket aberto com sucesso.');
          setTicketForm({ title: '', priority: 'Média', message: '' });
        }}
      >
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Abrir suporte</h2>
        <p className="mt-1 text-sm text-slate-500">Descreva claramente o problema para agilizar o atendimento.</p>
        <div className="mt-5 space-y-4">
          <Field label="Assunto" value={ticketForm.title} onChange={(title) => setTicketForm({ ...ticketForm, title })} />
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Prioridade
            <select className={inputClass} value={ticketForm.priority} onChange={(event) => setTicketForm({ ...ticketForm, priority: event.target.value })}>
              {['Baixa', 'Média', 'Alta', 'Urgente'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mensagem
            <textarea className={`${inputClass} resize-none`} rows={6} value={ticketForm.message} onChange={(event) => setTicketForm({ ...ticketForm, message: event.target.value })} required />
          </label>
          <button className={`w-full ${primaryButton}`}><MessageSquare className="h-4 w-4" /> Abrir ticket</button>
        </div>
      </form>
      <section className={`${panelClass} p-5`}>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">Meus tickets</h2>
        <div className="mt-5 space-y-3">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-md border border-slate-200 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">{ticket.title || 'Ticket sem título'}</h3><p className="mt-1 text-sm text-slate-500">Prioridade {ticket.priority || 'Média'}</p></div><StatusPill value={ticket.status} /></div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{ticket.message || 'Sem mensagem.'}</p>
            </article>
          ))}
          {tickets.length === 0 && <EmptyState title="Nenhum ticket aberto" text="Quando precisar de suporte, abra um ticket pelo formulário." />}
        </div>
      </section>
    </div>
  );

  const renderDocuments = () => documents.length === 0
    ? <EmptyState title="Nenhum documento disponível" text="Contratos, manuais e arquivos vinculados ao seu e-mail aparecerão aqui." />
    : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((item) => (
          <article key={item.id} className={`${panelClass} p-5`}>
            <FileText className="h-7 w-7 text-[#159AFD]" />
            <p className="mt-4 text-xs font-black uppercase text-[#159AFD]">{item.category || 'Documento'}</p>
            <h3 className="mt-2 font-black text-slate-950 dark:text-white">{item.title || 'Documento sem título'}</h3>
            {item.url ? <a className={`mt-5 w-full ${primaryButton}`} href={item.url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> Abrir documento</a> : <p className="mt-4 text-sm text-slate-500">Arquivo ainda não anexado.</p>}
          </article>
        ))}
      </div>
    );

  const renderBilling = () => invoices.length === 0
    ? <EmptyState title="Nenhuma cobrança disponível" text="Valores e vencimentos vinculados à sua conta aparecerão aqui." />
    : (
      <div className="grid gap-4 md:grid-cols-2">
        {invoices.map((item) => (
          <article key={item.id} className={`${panelClass} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-slate-500">Vencimento {formatDate(item.dueDate)}</p><h3 className="mt-2 font-black text-slate-950 dark:text-white">{item.title || 'Cobrança'}</h3></div><StatusPill value={item.status} /></div>
            <p className="mt-6 text-3xl font-black text-[#159AFD]">{item.amount || 'R$ 0,00'}</p>
          </article>
        ))}
      </div>
    );

  const renderNotifications = () => notifications.length === 0
    ? <EmptyState title="Nenhuma notificação" text="Avisos importantes da ELN aparecerão nesta área." />
    : (
      <div className="space-y-3">
        {notifications.map((item) => (
          <article key={item.id} className={`${panelClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between`}>
            <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-slate-950 dark:text-white">{item.title || 'Notificação'}</h3><StatusPill value={notificationIsUnread(item, user?.id) ? item.status : 'Lida'} /></div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.message || 'Sem mensagem.'}</p></div>
            {notificationIsUnread(item, user?.id) && <button type="button" onClick={() => markNotificationRead(item.id)} className={secondaryButton}>Marcar lida</button>}
          </article>
        ))}
      </div>
    );

  const renderSettings = () => (
    <form onSubmit={handleProfileSubmit} className={`${panelClass} mx-auto max-w-3xl p-5 sm:p-6`}>
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-center">
        <img src={profileForm.avatar} alt={profileForm.name} className="h-20 w-20 rounded-md border border-[#159AFD]/30 object-cover" />
        <div><h2 className="text-xl font-black text-slate-950 dark:text-white">Meu perfil e preferências</h2><p className="mt-1 text-sm text-slate-500">{user?.email}</p></div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Nome" value={profileForm.name} onChange={(name) => setProfileForm({ ...profileForm, name })} />
        <Field label="Empresa" value={profileForm.company} onChange={(company) => setProfileForm({ ...profileForm, company })} />
        <div className="sm:col-span-2"><Field label="URL da foto" value={profileForm.avatar} onChange={(avatar) => setProfileForm({ ...profileForm, avatar })} placeholder="https://..." required={false} /></div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Tema
          <select className={inputClass} value={profileForm.theme} onChange={(event) => setProfileForm({ ...profileForm, theme: event.target.value })}><option value="dark">Modo noturno</option><option value="light">Modo claro</option></select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Densidade do painel
          <select className={inputClass} value={profileForm.dashboardDensity} onChange={(event) => setProfileForm({ ...profileForm, dashboardDensity: event.target.value })}><option value="comfortable">Confortável</option><option value="compact">Compacta</option></select>
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 sm:col-span-2">Página inicial do painel
          <select className={inputClass} value={profileForm.dashboardStartPage} onChange={(event) => setProfileForm({ ...profileForm, dashboardStartPage: event.target.value })}>{tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}</select>
        </label>
      </div>
      <button className={`mt-5 ${primaryButton}`}><Save className="h-4 w-4" /> Salvar perfil</button>
    </form>
  );

  const renderActiveTab = () => {
    if (activeTab === 'projects') return renderProjects();
    if (activeTab === 'orders') return renderOrders();
    if (activeTab === 'support') return renderSupport();
    if (activeTab === 'documents') return renderDocuments();
    if (activeTab === 'billing') return renderBilling();
    if (activeTab === 'notifications') return renderNotifications();
    if (activeTab === 'settings') return renderSettings();
    return renderOverview();
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <DashboardLayout>
      <div className="client-dashboard space-y-6">
        <header className={`${panelClass} flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#159AFD]/15 text-[#159AFD]"><CurrentIcon className="h-6 w-6" /></div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Área do cliente</p><h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{currentTab.label}</h1><p className="mt-1 text-sm text-slate-500">Olá, {user?.name}. Aqui aparecem somente dados reais vinculados à sua conta.</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3 dark:border-white/10"><img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-md object-cover" /><div><p className="text-sm font-black text-slate-950 dark:text-white">{user?.name}</p><p className="text-xs text-slate-500">{user?.email}</p></div></div>
        </header>

        {(status || loadError || notificationError) && <div role="status" className={`rounded-md border p-3 text-sm font-semibold ${loadError || notificationError ? 'border-amber-400/30 bg-amber-500/10 text-amber-600 dark:text-amber-200' : 'border-[#159AFD]/30 bg-[#159AFD]/10 text-[#0D0F52] dark:text-sky-200'}`}>{loadError || notificationError || status}</div>}

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className={`${panelClass} h-fit p-2 lg:sticky lg:top-24`}>
            <nav className="mobile-scrollbar flex gap-1 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => openTab(id)} className={`flex min-h-11 flex-none items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition lg:w-full ${activeTab === id ? 'bg-[#0D0F52] text-white shadow-sm dark:bg-[#159AFD]' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0D0F52] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>
              ))}
            </nav>
          </aside>
          <main className="min-w-0">{renderActiveTab()}</main>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ClientDashboard;
