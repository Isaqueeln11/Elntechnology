import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  FolderOpen,
  MessageSquare,
  PackagePlus,
  Plus,
  Settings,
  Trash2,
  UploadCloud,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import DashboardLayout from '../../components/DashboardLayout';
import OtaAdminPanel from '../../components/OtaAdminPanel';

type CollectionName = 'clientes' | 'projetos' | 'technicians' | 'supportTickets' | 'documents' | 'invoices' | 'orders' | 'notifications';

interface BaseRecord {
  id: string;
}

interface ClientRecord extends BaseRecord {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface ProjectRecord extends BaseRecord {
  name?: string;
  client?: string;
  status?: string;
  budget?: string;
  deadline?: string;
  technician?: string;
  progress?: string;
  description?: string;
}

interface TechnicianRecord extends BaseRecord {
  name?: string;
  email?: string;
  specialty?: string;
  phone?: string;
}

interface TicketRecord extends BaseRecord {
  title?: string;
  client?: string;
  priority?: string;
  status?: string;
  message?: string;
}

interface DocumentRecord extends BaseRecord {
  title?: string;
  client?: string;
  category?: string;
  url?: string;
}

interface InvoiceRecord extends BaseRecord {
  title?: string;
  client?: string;
  amount?: string;
  dueDate?: string;
  status?: string;
}

interface OrderRecord extends BaseRecord {
  title?: string;
  client?: string;
  type?: string;
  budget?: string;
  status?: string;
  notes?: string;
}

interface NotificationRecord extends BaseRecord {
  title?: string;
  message?: string;
  target?: string;
  status?: string;
}

const tabs = [
  { id: 'overview', label: 'Visao Geral', icon: BarChart3 },
  { id: 'orders', label: 'Pedidos', icon: PackagePlus },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'technicians', label: 'Tecnicos', icon: Users },
  { id: 'support', label: 'Suporte', icon: MessageSquare },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'billing', label: 'Faturamento', icon: CreditCard },
  { id: 'notifications', label: 'Notificacoes', icon: Bell },
  { id: 'ota', label: 'Codigos OTA', icon: UploadCloud },
  { id: 'settings', label: 'Meu Perfil', icon: Settings },
];

const inputClass = 'mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none transition focus:border-[#159AFD]';

function toMoney(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function moneyNumber(value?: string) {
  if (!value) return 0;
  const normalized = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function asList<T extends BaseRecord>(snapshot: { docs: Array<{ id: string; data: () => unknown }> }) {
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) }) as T);
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-gray-300">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} required={required} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block text-sm font-medium text-gray-300">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-medium text-gray-300">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className={`${inputClass} resize-none`} />
    </label>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-8 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">{text}</p>
    </div>
  );
}

function StatusPill({ value }: { value?: string }) {
  const color = value === 'Pago' || value === 'Concluido' || value === 'Resolvido' || value === 'Enviada' ? 'text-emerald-200 bg-emerald-500/15' : 'text-sky-200 bg-sky-500/15';
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{value || 'Aberto'}</span>;
}

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState('');

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianRecord[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [projectForm, setProjectForm] = useState({ name: '', client: '', status: 'Planejamento', budget: '', deadline: '', technician: '', progress: '0', description: '' });
  const [technicianForm, setTechnicianForm] = useState({ name: '', email: '', specialty: '', phone: '' });
  const [ticketForm, setTicketForm] = useState({ title: '', client: '', priority: 'Media', status: 'Aberto', message: '' });
  const [documentForm, setDocumentForm] = useState({ title: '', client: '', category: 'Contrato', url: '' });
  const [invoiceForm, setInvoiceForm] = useState({ title: '', client: '', amount: '', dueDate: '', status: 'Pendente' });
  const [orderForm, setOrderForm] = useState({ title: '', client: '', type: 'Novo projeto', budget: '', status: 'Novo', notes: '' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', target: 'Todos', status: 'Rascunho' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', company: user?.company || '', avatar: user?.avatar || '' });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', company: user?.company || '', avatar: user?.avatar || '' });
  }, [user]);

  useEffect(() => {
    const subscriptions = [
      onSnapshot(collection(db, 'clientes'), (snapshot) => setClients(asList<ClientRecord>(snapshot))),
      onSnapshot(collection(db, 'projetos'), (snapshot) => setProjects(asList<ProjectRecord>(snapshot))),
      onSnapshot(collection(db, 'technicians'), (snapshot) => setTechnicians(asList<TechnicianRecord>(snapshot))),
      onSnapshot(collection(db, 'supportTickets'), (snapshot) => setTickets(asList<TicketRecord>(snapshot))),
      onSnapshot(collection(db, 'documents'), (snapshot) => setDocuments(asList<DocumentRecord>(snapshot))),
      onSnapshot(collection(db, 'invoices'), (snapshot) => setInvoices(asList<InvoiceRecord>(snapshot))),
      onSnapshot(collection(db, 'orders'), (snapshot) => setOrders(asList<OrderRecord>(snapshot))),
      onSnapshot(collection(db, 'notifications'), (snapshot) => setNotifications(asList<NotificationRecord>(snapshot))),
    ];

    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, []);

  const totals = useMemo(() => {
    const projectRevenue = projects.reduce((sum, project) => sum + moneyNumber(project.budget), 0);
    const invoiceRevenue = invoices.filter((invoice) => invoice.status === 'Pago').reduce((sum, invoice) => sum + moneyNumber(invoice.amount), 0);
    const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolvido').length;
    return { projectRevenue, invoiceRevenue, openTickets };
  }, [invoices, projects, tickets]);

  async function createRecord<T extends object>(collectionName: CollectionName, data: T, reset: () => void, message: string) {
    await addDoc(collection(db, collectionName), { ...data, createdBy: user?.id || '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    reset();
    setStatus(message);
  }

  async function removeRecord(collectionName: CollectionName, id: string) {
    await deleteDoc(doc(db, collectionName, id));
    setStatus('Registro removido.');
  }

  async function changeStatus(collectionName: CollectionName, id: string, nextStatus: string) {
    await updateDoc(doc(db, collectionName, id), { status: nextStatus, updatedAt: serverTimestamp() });
    setStatus('Status atualizado.');
  }

  function handleAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Escolha um arquivo de imagem.');
      return;
    }
    if (file.size > 700 * 1024) {
      setStatus('Use uma foto com ate 700 KB para salvar no perfil.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((current) => ({ ...current, avatar: String(reader.result) }));
      setStatus('Foto carregada. Clique em salvar perfil para gravar.');
    };
    reader.readAsDataURL(file);
  }

  const stats = [
    { label: 'Clientes', value: String(clients.length), icon: Users },
    { label: 'Projetos Ativos', value: String(projects.filter((project) => project.status !== 'Concluido').length), icon: FolderOpen },
    { label: 'Tickets Abertos', value: String(totals.openTickets), icon: MessageSquare },
    { label: 'Faturado Pago', value: toMoney(totals.invoiceRevenue), icon: CreditCard },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
            <stat.icon className="mb-4 h-8 w-8 text-[#159AFD]" />
            <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <EmptyState title="Pedidos recentes" text={`${orders.length} pedido(s) cadastrado(s) no sistema.`} />
        <EmptyState title="Receita de projetos" text={toMoney(totals.projectRevenue)} />
        <EmptyState title="Notificacoes" text={`${notifications.length} notificacao(oes) criadas.`} />
      </div>
    </div>
  );

  const renderClients = () => (
    <CrudPanel
      title="Adicionar cliente"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('clientes', clientForm, () => setClientForm({ name: '', email: '', phone: '', company: '' }), 'Cliente cadastrado.');
      }}
      form={
        <>
          <Field label="Nome" value={clientForm.name} onChange={(name) => setClientForm({ ...clientForm, name })} />
          <Field label="Email" type="email" value={clientForm.email} onChange={(email) => setClientForm({ ...clientForm, email })} />
          <Field label="Telefone" value={clientForm.phone} onChange={(phone) => setClientForm({ ...clientForm, phone })} />
          <Field label="Empresa" value={clientForm.company} onChange={(company) => setClientForm({ ...clientForm, company })} />
        </>
      }
      emptyText="Nenhum cliente cadastrado."
      items={clients.map((client) => ({
        id: client.id,
        title: client.name || 'Cliente sem nome',
        subtitle: `${client.company || 'Sem empresa'} - ${client.email || 'sem email'}`,
        meta: client.phone || '',
        remove: () => removeRecord('clientes', client.id),
      }))}
    />
  );

  const renderProjects = () => (
    <CrudPanel
      title="Adicionar projeto"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord(
          'projetos',
          projectForm,
          () => setProjectForm({ name: '', client: '', status: 'Planejamento', budget: '', deadline: '', technician: '', progress: '0', description: '' }),
          'Projeto cadastrado.',
        );
      }}
      form={
        <>
          <Field label="Nome do projeto" value={projectForm.name} onChange={(name) => setProjectForm({ ...projectForm, name })} />
          <Field label="Cliente" value={projectForm.client} onChange={(client) => setProjectForm({ ...projectForm, client })} />
          <SelectField label="Status" value={projectForm.status} onChange={(statusValue) => setProjectForm({ ...projectForm, status: statusValue })} options={['Planejamento', 'Em andamento', 'Aguardando cliente', 'Concluido']} />
          <Field label="Valor" placeholder="R$ 0,00" value={projectForm.budget} onChange={(budget) => setProjectForm({ ...projectForm, budget })} />
          <Field label="Prazo" type="date" value={projectForm.deadline} onChange={(deadline) => setProjectForm({ ...projectForm, deadline })} required={false} />
          <Field label="Tecnico responsavel" value={projectForm.technician} onChange={(technician) => setProjectForm({ ...projectForm, technician })} required={false} />
          <Field label="Progresso (%)" type="number" value={projectForm.progress} onChange={(progress) => setProjectForm({ ...projectForm, progress })} />
          <TextAreaField label="Descricao" value={projectForm.description} onChange={(description) => setProjectForm({ ...projectForm, description })} />
        </>
      }
      emptyText="Nenhum projeto cadastrado."
      items={projects.map((project) => ({
        id: project.id,
        title: project.name || 'Projeto sem nome',
        subtitle: `${project.client || 'Cliente nao informado'} - ${project.status || 'Planejamento'}`,
        meta: `${project.budget || 'R$ 0'} / ${project.progress || '0'}%`,
        status: project.status,
        actions: [
          { label: 'Concluir', onClick: () => changeStatus('projetos', project.id, 'Concluido') },
          { label: 'Andamento', onClick: () => changeStatus('projetos', project.id, 'Em andamento') },
        ],
        remove: () => removeRecord('projetos', project.id),
      }))}
    />
  );

  const renderTechnicians = () => (
    <CrudPanel
      title="Adicionar tecnico"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('technicians', technicianForm, () => setTechnicianForm({ name: '', email: '', specialty: '', phone: '' }), 'Tecnico cadastrado.');
      }}
      form={
        <>
          <Field label="Nome" value={technicianForm.name} onChange={(name) => setTechnicianForm({ ...technicianForm, name })} />
          <Field label="Email" type="email" value={technicianForm.email} onChange={(email) => setTechnicianForm({ ...technicianForm, email })} />
          <Field label="Especialidade" value={technicianForm.specialty} onChange={(specialty) => setTechnicianForm({ ...technicianForm, specialty })} />
          <Field label="Telefone" value={technicianForm.phone} onChange={(phone) => setTechnicianForm({ ...technicianForm, phone })} />
        </>
      }
      emptyText="Nenhum tecnico cadastrado."
      items={technicians.map((technician) => ({
        id: technician.id,
        title: technician.name || 'Tecnico sem nome',
        subtitle: `${technician.specialty || 'Sem especialidade'} - ${technician.email || 'sem email'}`,
        meta: technician.phone || '',
        remove: () => removeRecord('technicians', technician.id),
      }))}
    />
  );

  const renderTickets = () => (
    <CrudPanel
      title="Abrir ticket de suporte"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('supportTickets', ticketForm, () => setTicketForm({ title: '', client: '', priority: 'Media', status: 'Aberto', message: '' }), 'Ticket cadastrado.');
      }}
      form={
        <>
          <Field label="Titulo" value={ticketForm.title} onChange={(title) => setTicketForm({ ...ticketForm, title })} />
          <Field label="Cliente" value={ticketForm.client} onChange={(client) => setTicketForm({ ...ticketForm, client })} />
          <SelectField label="Prioridade" value={ticketForm.priority} onChange={(priority) => setTicketForm({ ...ticketForm, priority })} options={['Baixa', 'Media', 'Alta', 'Urgente']} />
          <SelectField label="Status" value={ticketForm.status} onChange={(statusValue) => setTicketForm({ ...ticketForm, status: statusValue })} options={['Aberto', 'Em atendimento', 'Aguardando cliente', 'Resolvido']} />
          <TextAreaField label="Mensagem" value={ticketForm.message} onChange={(message) => setTicketForm({ ...ticketForm, message })} />
        </>
      }
      emptyText="Nenhum ticket de suporte."
      items={tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title || 'Ticket sem titulo',
        subtitle: `${ticket.client || 'Sem cliente'} - ${ticket.priority || 'Media'}`,
        meta: ticket.message || '',
        status: ticket.status,
        actions: [
          { label: 'Atender', onClick: () => changeStatus('supportTickets', ticket.id, 'Em atendimento') },
          { label: 'Resolver', onClick: () => changeStatus('supportTickets', ticket.id, 'Resolvido') },
        ],
        remove: () => removeRecord('supportTickets', ticket.id),
      }))}
    />
  );

  const renderDocuments = () => (
    <CrudPanel
      title="Adicionar documento"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('documents', documentForm, () => setDocumentForm({ title: '', client: '', category: 'Contrato', url: '' }), 'Documento cadastrado.');
      }}
      form={
        <>
          <Field label="Titulo" value={documentForm.title} onChange={(title) => setDocumentForm({ ...documentForm, title })} />
          <Field label="Cliente/Projeto" value={documentForm.client} onChange={(client) => setDocumentForm({ ...documentForm, client })} />
          <SelectField label="Categoria" value={documentForm.category} onChange={(category) => setDocumentForm({ ...documentForm, category })} options={['Contrato', 'Manual', 'Nota tecnica', 'Arquivo do projeto', 'Outro']} />
          <Field label="Link do arquivo" value={documentForm.url} onChange={(url) => setDocumentForm({ ...documentForm, url })} placeholder="https://..." />
        </>
      }
      emptyText="Nenhum documento cadastrado."
      items={documents.map((documentItem) => ({
        id: documentItem.id,
        title: documentItem.title || 'Documento sem titulo',
        subtitle: `${documentItem.client || 'Geral'} - ${documentItem.category || 'Outro'}`,
        meta: documentItem.url || 'Sem link',
        link: documentItem.url,
        remove: () => removeRecord('documents', documentItem.id),
      }))}
    />
  );

  const renderBilling = () => (
    <CrudPanel
      title="Adicionar faturamento"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('invoices', invoiceForm, () => setInvoiceForm({ title: '', client: '', amount: '', dueDate: '', status: 'Pendente' }), 'Faturamento cadastrado.');
      }}
      form={
        <>
          <Field label="Titulo" value={invoiceForm.title} onChange={(title) => setInvoiceForm({ ...invoiceForm, title })} />
          <Field label="Cliente" value={invoiceForm.client} onChange={(client) => setInvoiceForm({ ...invoiceForm, client })} />
          <Field label="Valor" value={invoiceForm.amount} onChange={(amount) => setInvoiceForm({ ...invoiceForm, amount })} placeholder="R$ 0,00" />
          <Field label="Vencimento" type="date" value={invoiceForm.dueDate} onChange={(dueDate) => setInvoiceForm({ ...invoiceForm, dueDate })} required={false} />
          <SelectField label="Status" value={invoiceForm.status} onChange={(statusValue) => setInvoiceForm({ ...invoiceForm, status: statusValue })} options={['Pendente', 'Enviado', 'Pago', 'Atrasado', 'Cancelado']} />
        </>
      }
      emptyText="Nenhum faturamento cadastrado."
      items={invoices.map((invoice) => ({
        id: invoice.id,
        title: invoice.title || 'Fatura sem titulo',
        subtitle: `${invoice.client || 'Sem cliente'} - vence ${invoice.dueDate || 'sem data'}`,
        meta: invoice.amount || 'R$ 0,00',
        status: invoice.status,
        actions: [
          { label: 'Pago', onClick: () => changeStatus('invoices', invoice.id, 'Pago') },
          { label: 'Atrasado', onClick: () => changeStatus('invoices', invoice.id, 'Atrasado') },
        ],
        remove: () => removeRecord('invoices', invoice.id),
      }))}
    />
  );

  const renderOrders = () => (
    <CrudPanel
      title="Novo pedido"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('orders', orderForm, () => setOrderForm({ title: '', client: '', type: 'Novo projeto', budget: '', status: 'Novo', notes: '' }), 'Pedido cadastrado.');
      }}
      form={
        <>
          <Field label="Titulo" value={orderForm.title} onChange={(title) => setOrderForm({ ...orderForm, title })} />
          <Field label="Cliente" value={orderForm.client} onChange={(client) => setOrderForm({ ...orderForm, client })} />
          <SelectField label="Tipo" value={orderForm.type} onChange={(type) => setOrderForm({ ...orderForm, type })} options={['Novo projeto', 'Manutencao', 'Atualizacao OTA', 'Documento', 'Suporte']} />
          <Field label="Valor previsto" value={orderForm.budget} onChange={(budget) => setOrderForm({ ...orderForm, budget })} placeholder="R$ 0,00" />
          <SelectField label="Status" value={orderForm.status} onChange={(statusValue) => setOrderForm({ ...orderForm, status: statusValue })} options={['Novo', 'Em analise', 'Aprovado', 'Recusado', 'Concluido']} />
          <TextAreaField label="Observacoes" value={orderForm.notes} onChange={(notes) => setOrderForm({ ...orderForm, notes })} />
        </>
      }
      emptyText="Nenhum pedido cadastrado."
      items={orders.map((order) => ({
        id: order.id,
        title: order.title || 'Pedido sem titulo',
        subtitle: `${order.client || 'Sem cliente'} - ${order.type || 'Novo projeto'}`,
        meta: order.budget || 'R$ 0,00',
        status: order.status,
        actions: [
          { label: 'Aprovar', onClick: () => changeStatus('orders', order.id, 'Aprovado') },
          { label: 'Concluir', onClick: () => changeStatus('orders', order.id, 'Concluido') },
        ],
        remove: () => removeRecord('orders', order.id),
      }))}
    />
  );

  const renderNotifications = () => (
    <CrudPanel
      title="Criar notificacao"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('notifications', notificationForm, () => setNotificationForm({ title: '', message: '', target: 'Todos', status: 'Rascunho' }), 'Notificacao criada.');
      }}
      form={
        <>
          <Field label="Titulo" value={notificationForm.title} onChange={(title) => setNotificationForm({ ...notificationForm, title })} />
          <SelectField label="Destino" value={notificationForm.target} onChange={(target) => setNotificationForm({ ...notificationForm, target })} options={['Todos', 'Clientes', 'Tecnicos', 'Admin']} />
          <SelectField label="Status" value={notificationForm.status} onChange={(statusValue) => setNotificationForm({ ...notificationForm, status: statusValue })} options={['Rascunho', 'Enviada']} />
          <TextAreaField label="Mensagem" value={notificationForm.message} onChange={(message) => setNotificationForm({ ...notificationForm, message })} />
        </>
      }
      emptyText="Nenhuma notificacao criada."
      items={notifications.map((notification) => ({
        id: notification.id,
        title: notification.title || 'Notificacao sem titulo',
        subtitle: `${notification.target || 'Todos'} - ${notification.status || 'Rascunho'}`,
        meta: notification.message || '',
        status: notification.status,
        actions: [{ label: 'Enviar', onClick: () => changeStatus('notifications', notification.id, 'Enviada') }],
        remove: () => removeRecord('notifications', notification.id),
      }))}
    />
  );

  const renderProfile = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await updateUserProfile(profileForm);
          setStatus(result.message);
        }}
        className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6"
      >
        <h3 className="mb-5 text-xl font-semibold text-white">Meu perfil de admin</h3>
        <div className="space-y-4">
          <Field label="Nome" value={profileForm.name} onChange={(name) => setProfileForm({ ...profileForm, name })} />
          <Field label="Empresa" value={profileForm.company} onChange={(company) => setProfileForm({ ...profileForm, company })} />
          <Field label="URL da foto" value={profileForm.avatar} onChange={(avatar) => setProfileForm({ ...profileForm, avatar })} required={false} />
          <label className="block text-sm font-medium text-gray-300">
            Enviar foto do computador
            <input type="file" accept="image/*" onChange={handleAvatarFile} className="mt-2 w-full rounded-lg border border-dashed border-[#159AFD]/30 bg-black/30 p-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#159AFD] file:px-4 file:py-2 file:font-semibold file:text-white" />
          </label>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">Salvar perfil</button>
        </div>
      </form>
      <div className="rounded-xl border border-[#159AFD]/30 bg-black/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">Previa</h3>
        <div className="flex items-center gap-4">
          <img src={profileForm.avatar || user?.avatar} alt={profileForm.name} className="h-20 w-20 rounded-full border-2 border-[#159AFD] object-cover" />
          <div>
            <p className="text-lg font-semibold text-white">{profileForm.name || user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500">{profileForm.company || user?.company}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Painel Administrativo</h1>
            <p className="mt-1 text-gray-400">Bem-vindo, {user?.name}. Role: {user?.role}</p>
          </div>
          <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full border-2 border-[#159AFD] object-cover" />
        </div>

        {status && <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-200">{status}</div>}

        <div className="mobile-scrollbar flex space-x-1 overflow-x-auto rounded-xl border border-[#159AFD]/30 bg-[#0D0F52]/30 p-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-none items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all ${activeTab === tab.id ? 'bg-[#159AFD] text-white' : 'text-gray-400 hover:bg-[#159AFD]/20 hover:text-white'}`}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'technicians' && renderTechnicians()}
        {activeTab === 'support' && renderTickets()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'ota' && <OtaAdminPanel />}
        {activeTab === 'settings' && renderProfile()}
      </div>
    </DashboardLayout>
  );
};

function CrudPanel({
  title,
  form,
  onSubmit,
  items,
  emptyText,
}: {
  title: string;
  form: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    meta?: string;
    status?: string;
    link?: string;
    actions?: Array<{ label: string; onClick: () => void }>;
    remove: () => void;
  }>;
  emptyText: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={onSubmit} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">{title}</h3>
        <div className="space-y-4">
          {form}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">
            <Plus className="h-5 w-5" />
            Salvar
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <EmptyState title={emptyText} text="Cadastre o primeiro registro pelo formulario ao lado." />}
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-[#159AFD]/30 bg-black/20 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  {item.status && <StatusPill value={item.status} />}
                </div>
                <p className="mt-1 text-sm text-gray-400">{item.subtitle}</p>
                {item.meta && <p className="mt-1 break-words text-sm text-gray-500">{item.meta}</p>}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-[#159AFD] hover:text-white">
                    Abrir documento
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.actions?.map((action) => (
                  <button key={action.label} type="button" onClick={action.onClick} className="rounded-lg border border-[#159AFD]/30 px-3 py-2 text-sm text-sky-200 hover:bg-[#159AFD]/10">
                    {action.label}
                  </button>
                ))}
                <button type="button" onClick={item.remove} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
