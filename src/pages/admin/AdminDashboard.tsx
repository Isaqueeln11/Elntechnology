import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  CreditCard,
  Cpu,
  FileText,
  FolderOpen,
  MessageSquare,
  MonitorPlay,
  PackagePlus,
  Plus,
  Settings,
  Store,
  Trash2,
  UploadCloud,
  UserPlus,
  Users,
} from 'lucide-react';
import type { ThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import type { UserPreferences } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { db } from '../../firebase';
import { formatStorePrice, isPublishedStoreProduct, isStoreProductPage, marketplaceNotice, normalizeContentValue } from '../../data/storeCatalog';
import DashboardLayout from '../../components/DashboardLayout';
import OtaAdminPanel from '../../components/OtaAdminPanel';

type CollectionName = 'clientes' | 'projetos' | 'technicians' | 'supportTickets' | 'documents' | 'invoices' | 'orders' | 'notifications' | 'siteContent';

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
  clientEmail?: string;
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
  clientEmail?: string;
  priority?: string;
  status?: string;
  message?: string;
}

interface DocumentRecord extends BaseRecord {
  title?: string;
  client?: string;
  clientEmail?: string;
  category?: string;
  url?: string;
}

interface InvoiceRecord extends BaseRecord {
  title?: string;
  client?: string;
  clientEmail?: string;
  amount?: string;
  dueDate?: string;
  status?: string;
}

interface OrderRecord extends BaseRecord {
  title?: string;
  client?: string;
  clientEmail?: string;
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
  type?: string;
  userId?: string;
  clientEmail?: string;
}

interface UserRecord extends BaseRecord {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  theme?: ThemeMode;
  preferences?: UserPreferences;
  createdAt?: unknown;
}

interface SystemEventRecord extends BaseRecord {
  title?: string;
  message?: string;
  type?: string;
  createdAt?: unknown;
}

interface SiteContentRecord extends BaseRecord {
  page?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  status?: string;
  price?: string;
  currency?: 'BRL' | 'USD';
  marketplace?: string;
  category?: string;
  imageUrl?: string;
  availability?: string;
  featured?: boolean;
  sku?: string;
  specifications?: string;
  features?: string;
  datasheetUrl?: string;
  technicalContent?: string;
  pinout?: string;
  setupGuide?: string;
  relatedProducts?: string;
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: BarChart3, description: 'Resumo operacional do sistema' },
  { id: 'orders', label: 'Pedidos', icon: PackagePlus, description: 'Novas demandas e aprovações' },
  { id: 'store', label: 'Produtos da loja', icon: Store, description: 'Produtos, serviços, imagens, links, códigos, preços e vitrine pública' },
  { id: 'clients', label: 'Clientes', icon: Users, description: 'Cadastro e contatos comerciais' },
  { id: 'projects', label: 'Projetos', icon: FolderOpen, description: 'Prazos, valores e andamento' },
  { id: 'technicians', label: 'Técnicos', icon: Users, description: 'Equipe técnica e especialidades' },
  { id: 'support', label: 'Suporte', icon: MessageSquare, description: 'Tickets e atendimento' },
  { id: 'documents', label: 'Documentos', icon: FileText, description: 'Links, contratos e arquivos' },
  { id: 'sitePages', label: 'Conteúdo público', icon: MonitorPlay, description: 'Estudos, produtos, equipe, loja, notícias e subpáginas públicas' },
  { id: 'billing', label: 'Faturamento', icon: CreditCard, description: 'Valores, vencimentos e status' },
  { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Avisos para clientes e equipe' },
  { id: 'ota', label: 'Códigos OTA', icon: UploadCloud, description: 'Versões e firmware dos equipamentos' },
  { id: 'settings', label: 'Meu Perfil', icon: Settings, description: 'Dados do administrador' },
];

const tabGroups = [
  { label: 'Operação', ids: ['overview', 'orders', 'clients', 'projects', 'technicians'] },
  { label: 'Atendimento e financeiro', ids: ['support', 'documents', 'billing', 'notifications'] },
  { label: 'Site e sistema', ids: ['store', 'sitePages', 'ota', 'settings'] },
];

const inputClass = 'dashboard-control mt-2 w-full rounded-md border p-3 text-sm outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-[#159AFD]/10';
const panelClass = 'dashboard-surface rounded-md border shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:shadow-none';
const defaultAreasSectionForm = {
  eyebrow: 'Espaços do site',
  title: 'Áreas da ELN Technology para acompanhar projetos, equipe, produtos e novidades.',
  description: 'Cada área tem sua própria página. Você acompanha projetos, documentos, produtos, vídeos, notícias e informações publicadas pela ELN.',
  buttonLabel: 'Ver notícias e inovações',
  buttonHref: '/noticias-inovacoes',
};

const sitePageOptions = ['projetos', 'melhorias', 'equipe', 'atividades', 'desenvolvimentos', 'estudos', 'produtos', 'lojas', 'videos', 'noticias'];
const siteContentTypeOptions = ['Projeto', 'Documento', 'Vídeo', 'Estudo', 'Produto', 'Loja', 'Melhoria', 'Equipe', 'Atividade', 'Notícia', 'Inovação', 'Link'];
const marketplaceChannelOptions = ['Loja oficial', 'WhatsApp', 'Shopee', 'Mercado Livre', 'AliExpress', 'Instagram', 'Site oficial', 'Catálogo externo', 'Outro canal'];
const channelLinkPlaceholders: Record<string, string> = {
  'Loja oficial': 'https://elntechnology.../produto',
  WhatsApp: 'https://wa.me/5581997092380?text=Quero%20saber%20sobre...',
  Shopee: 'https://shopee.com.br/...',
  'Mercado Livre': 'https://produto.mercadolivre.com.br/...',
  AliExpress: 'https://www.aliexpress.com/item/...',
  Instagram: 'https://www.instagram.com/eln_technology/',
  'Site oficial': 'https://elntechnology...',
  'Catálogo externo': 'https://...',
  'Outro canal': 'Cole aqui o link direto de compra ou atendimento',
};

function channelLinkPlaceholder(channel?: string) {
  return channelLinkPlaceholders[channel || 'Loja oficial'] || channelLinkPlaceholders['Outro canal'];
}

const defaultSiteContentForm = {
  page: 'projetos',
  type: 'Projeto',
  title: '',
  description: '',
  url: '',
  status: 'Publicado',
  price: '',
  currency: 'BRL' as 'BRL' | 'USD',
  marketplace: '',
  category: '',
  imageUrl: '',
  availability: 'Disponível',
  featured: false,
  sku: '',
  specifications: '',
  features: '',
  datasheetUrl: '',
  technicalContent: '',
  pinout: '',
  setupGuide: '',
  relatedProducts: '',
};

const defaultStoreProductForm = {
  ...defaultSiteContentForm,
  page: 'lojas',
  type: 'Produto',
  status: 'Publicado',
  currency: 'BRL' as 'BRL' | 'USD',
  marketplace: 'Loja oficial',
  category: 'IoT e automação',
  availability: 'Disponível',
};

const pageLinks: Record<string, string> = {
  projetos: '/projetos-desenvolvidos',
  melhorias: '/melhorias',
  equipe: '/equipe',
  atividades: '/atividades-analise',
  desenvolvimentos: '/desenvolvimentos',
  estudos: '/estudos',
  produtos: '/produtos',
  lojas: '/lojas',
  videos: '/videos-futuro',
  noticias: '/noticias-inovacoes',
};

const sitePageAdminDefinitions = [
  { page: 'projetos', label: 'Projetos desenvolvidos', type: 'Projeto', category: 'Projetos', icon: FolderOpen, description: 'Resultados, fotos, componentes, arquivos e entregas.' },
  { page: 'melhorias', label: 'Melhorias', type: 'Melhoria', category: 'Melhorias', icon: Settings, description: 'Correções, prioridades, segurança e próximas versões.' },
  { page: 'equipe', label: 'Equipe', type: 'Equipe', category: 'Equipe', icon: Users, description: 'Membros, cargos, fotos, contatos e responsabilidades.' },
  { page: 'atividades', label: 'Atividades e análise', type: 'Atividade', category: 'Análise', icon: Activity, description: 'Indicadores, eventos, resultados e relatórios.' },
  { page: 'desenvolvimentos', label: 'Desenvolvimentos', type: 'Projeto', category: 'Em desenvolvimento', icon: UploadCloud, description: 'Firmware, hardware, sistemas, versões e progresso.' },
  { page: 'estudos', label: 'Base técnica', type: 'Estudo', category: 'ESP32 e placas', icon: Cpu, description: 'Placas, módulos, datasheets, pinagem, setup e notas.' },
  { page: 'produtos', label: 'Produtos', type: 'Produto', category: 'IoT e automação', icon: PackagePlus, description: 'Produtos, serviços, códigos, imagens, preços e estoque.' },
  { page: 'videos', label: 'Vídeos e futuro', type: 'Vídeo', category: 'Vídeos', icon: MonitorPlay, description: 'Demonstrações, links, roadmap e próximos lançamentos.' },
  { page: 'noticias', label: 'Notícias e inovações', type: 'Notícia', category: 'Notícias', icon: Bell, description: 'Novidades, comunicados, mídia e lançamentos.' },
  { page: 'lojas', label: 'Loja e canais', type: 'Loja', category: 'Canal oficial', icon: Store, description: 'Loja oficial, marketplaces, contatos e parceiros.' },
] as const;

const firebaseConsoleRulesUrl = 'https://console.firebase.google.com/u/0/project/elntechnology/firestore/rules';

const firestoreRulesText = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function currentUser() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isOwnerEmail() {
      return signedIn()
        && request.auth.token.email in [
          "isaqueeln11@gmail.com",
          "elntechnologyinnovations@gmail.com"
        ];
    }

    function isAdmin() {
      return signedIn()
        && (
          isOwnerEmail()
          || currentUser().data.role == "admin"
        );
    }

    function hasRole(role) {
      return signedIn() && currentUser().data.role == role;
    }

    function ownsRecord(data) {
      return signedIn()
        && (
          data.get("ownerId", "") == request.auth.uid
          || data.get("clientEmail", "") == request.auth.token.email
        );
    }

    function createsOwnRecord() {
      return signedIn()
        && request.resource.data.get("ownerId", "") == request.auth.uid
        && request.resource.data.get("clientEmail", "") == request.auth.token.email;
    }

    function isPublicOrderRequest() {
      return request.resource.data.keys().hasOnly([
          "title",
          "type",
          "description",
          "goals",
          "requirements",
          "notes",
          "deadline",
          "budget",
          "client",
          "company",
          "clientEmail",
          "phone",
          "attachments",
          "source",
          "status",
          "createdAt",
          "updatedAt"
        ])
        && request.resource.data.title is string
        && request.resource.data.title.size() >= 2
        && request.resource.data.type is string
        && request.resource.data.notes is string
        && request.resource.data.clientEmail is string
        && request.resource.data.phone is string
        && request.resource.data.status == "Novo"
        && request.resource.data.source == "site-iniciar-projeto"
        && request.resource.data.attachments is list;
    }

    function canReceiveNotification(data) {
      return signedIn()
        && (
          ownsRecord(data)
          || data.get("target", "") == "Todos"
          || (hasRole("client") && data.get("target", "") == "Clientes")
          || (hasRole("technician") && data.get("target", "") == "Técnicos")
        );
    }

    match /users/{userId} {
      allow create: if signedIn()
        && request.auth.uid == userId
        && (
          request.resource.data.role == "client"
          || (isOwnerEmail() && request.resource.data.role == "admin")
        );

      allow read: if signedIn() && (request.auth.uid == userId || isAdmin());

      allow update: if signedIn()
        && request.auth.uid == userId
        && (
          request.resource.data.role == resource.data.role
          || (isOwnerEmail() && request.resource.data.role == "admin")
        );

      allow delete: if isAdmin();
    }

    match /siteContent/{contentId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /siteSettings/{settingId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /firmwareReleases/{releaseId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /systemEvents/{eventId} {
      allow read, update, delete: if isAdmin();
      allow create: if isAdmin()
        || (signedIn() && request.resource.data.userId == request.auth.uid);
    }

    match /clientes/{clientId} {
      allow read, create, update, delete: if isAdmin();
    }

    match /projetos/{projectId} {
      allow read: if isAdmin() || hasRole("technician") || ownsRecord(resource.data);
      allow create, update, delete: if isAdmin();
      allow update: if hasRole("technician")
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
          "status",
          "progress",
          "technician",
          "technicianEmail",
          "updatedAt"
        ]);
    }

    match /technicians/{technicianId} {
      allow read, create, update, delete: if isAdmin();
    }

    match /supportTickets/{ticketId} {
      allow read: if isAdmin() || hasRole("technician") || ownsRecord(resource.data);
      allow create: if isAdmin() || createsOwnRecord();
      allow update, delete: if isAdmin();
      allow update: if hasRole("technician")
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
          "status",
          "technician",
          "technicianEmail",
          "updatedAt"
        ]);
    }

    match /documents/{documentId} {
      allow read: if isAdmin() || hasRole("technician") || ownsRecord(resource.data);
      allow create, update, delete: if isAdmin();
    }

    match /invoices/{invoiceId} {
      allow read: if isAdmin() || ownsRecord(resource.data);
      allow create, update, delete: if isAdmin();
    }

    match /orders/{orderId} {
      allow read: if isAdmin() || ownsRecord(resource.data);
      allow create: if isAdmin() || createsOwnRecord() || isPublicOrderRequest();
      allow update, delete: if isAdmin();
    }

    match /notifications/{notificationId} {
      allow read: if isAdmin()
        || ownsRecord(resource.data)
        || (signedIn() && resource.data.target == "Todos")
        || (hasRole("client") && resource.data.target == "Clientes")
        || (hasRole("technician") && resource.data.target == "Técnicos");
      allow create: if isAdmin()
        || (
          signedIn()
          && request.resource.data.get("userId", "") == request.auth.uid
          && request.resource.data.get("target", "") == "Admin"
        );
      allow update: if isAdmin()
        || (
          canReceiveNotification(resource.data)
          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(["readBy", "updatedAt"])
          && request.resource.data.readBy.hasAll([request.auth.uid])
        );
      allow delete: if isAdmin();
    }
  }
}`;

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
  helper,
  type = 'text',
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} required={required} />
      {helper && <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{helper}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className={`${inputClass} resize-none`} />
    </label>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className={`${panelClass} p-8 text-center`}>
      <p className="text-lg font-semibold text-slate-950 dark:text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

function StatusPill({ value }: { value?: string }) {
  const color = value === 'Pago' || value === 'Concluído' || value === 'Resolvido' || value === 'Enviada'
    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200'
    : 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200';
  return <span className={`rounded-md border px-3 py-1 text-xs font-bold ${color}`}>{value || 'Aberto'}</span>;
}

function firestoreErrorMessage(error: unknown, action = 'salvar') {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (code === 'permission-denied') {
    return `Sem permissão para ${action}. Confira se sua conta está como admin e se as regras do Firestore liberam siteContent, siteSettings, systemEvents e orders.`;
  }

  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return `Não foi possível ${action} agora. Verifique sua internet e tente novamente.`;
  }

  return `Erro ao ${action}. Tente novamente e confira o Firebase.`;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));

    image.onload = () => {
      const maxSize = 520;
      const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Não foi possível preparar a imagem.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };

    image.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
    reader.readAsDataURL(file);
  });
}

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(requestedTab || user?.preferences?.dashboardStartPage || 'overview');
  const [status, setStatus] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianRecord[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserRecord[]>([]);
  const [systemEvents, setSystemEvents] = useState<SystemEventRecord[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContentRecord[]>([]);
  const [editingSiteContentId, setEditingSiteContentId] = useState<string | null>(null);
  const [sitePageFilter, setSitePageFilter] = useState('all');
  const [areasSectionForm, setAreasSectionForm] = useState(defaultAreasSectionForm);

  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [projectForm, setProjectForm] = useState({ name: '', client: '', clientEmail: '', status: 'Planejamento', budget: '', deadline: '', technician: '', progress: '0', description: '' });
  const [technicianForm, setTechnicianForm] = useState({ name: '', email: '', specialty: '', phone: '' });
  const [ticketForm, setTicketForm] = useState({ title: '', client: '', clientEmail: '', priority: 'Media', status: 'Aberto', message: '' });
  const [documentForm, setDocumentForm] = useState({ title: '', client: '', clientEmail: '', category: 'Contrato', url: '' });
  const [invoiceForm, setInvoiceForm] = useState({ title: '', client: '', clientEmail: '', amount: '', dueDate: '', status: 'Pendente' });
  const [orderForm, setOrderForm] = useState({ title: '', client: '', clientEmail: '', type: 'Novo projeto', budget: '', status: 'Novo', notes: '' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', target: 'Todos', status: 'Enviada', clientEmail: '' });
  const [siteContentForm, setSiteContentForm] = useState(defaultSiteContentForm);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    avatar: user?.avatar || '',
    theme: user?.preferences?.theme || user?.theme || 'dark' as ThemeMode,
    dashboardDensity: user?.preferences?.dashboardDensity || 'comfortable',
    dashboardStartPage: user?.preferences?.dashboardStartPage || 'overview',
    notifyNewUsers: user?.preferences?.notifyNewUsers !== false,
    notifyStatusChanges: user?.preferences?.notifyStatusChanges !== false,
  });

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      company: user?.company || '',
      avatar: user?.avatar || '',
      theme: user?.preferences?.theme || user?.theme || 'dark',
      dashboardDensity: user?.preferences?.dashboardDensity || 'comfortable',
      dashboardStartPage: user?.preferences?.dashboardStartPage || 'overview',
      notifyNewUsers: user?.preferences?.notifyNewUsers !== false,
      notifyStatusChanges: user?.preferences?.notifyStatusChanges !== false,
    });
  }, [user]);

  useEffect(() => {
    if (requestedTab && tabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
      return;
    }

    if (user?.preferences?.dashboardStartPage) {
      setActiveTab(user.preferences.dashboardStartPage);
    }
  }, [requestedTab, user?.preferences?.dashboardStartPage]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('overview');
      setSearchParams({ tab: 'overview' }, { replace: true });
      return;
    }

    if (requestedTab !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, requestedTab, setSearchParams]);

  function openTab(tabId: string) {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    const subscriptions = [
      onSnapshot(collection(db, 'clientes'), (snapshot) => setClients(asList<ClientRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar clientes'))),
      onSnapshot(collection(db, 'projetos'), (snapshot) => setProjects(asList<ProjectRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar projetos'))),
      onSnapshot(collection(db, 'technicians'), (snapshot) => setTechnicians(asList<TechnicianRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar técnicos'))),
      onSnapshot(collection(db, 'supportTickets'), (snapshot) => setTickets(asList<TicketRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar suporte'))),
      onSnapshot(collection(db, 'documents'), (snapshot) => setDocuments(asList<DocumentRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar documentos'))),
      onSnapshot(collection(db, 'invoices'), (snapshot) => setInvoices(asList<InvoiceRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar faturamento'))),
      onSnapshot(collection(db, 'orders'), (snapshot) => setOrders(asList<OrderRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar pedidos'))),
      onSnapshot(collection(db, 'notifications'), (snapshot) => setNotifications(asList<NotificationRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar notificações'))),
      onSnapshot(collection(db, 'users'), (snapshot) => setRegisteredUsers(asList<UserRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar usuários'))),
      onSnapshot(collection(db, 'systemEvents'), (snapshot) => setSystemEvents(asList<SystemEventRecord>(snapshot)), (error) => setStatus(firestoreErrorMessage(error, 'carregar atividades'))),
      onSnapshot(
        collection(db, 'siteContent'),
        (snapshot) => setSiteContent(asList<SiteContentRecord>(snapshot)),
        (error) => setStatus(firestoreErrorMessage(error, 'carregar conteúdos do site')),
      ),
      onSnapshot(doc(db, 'siteSettings', 'areasSection'), (snapshot) => {
        if (snapshot.exists()) {
          setAreasSectionForm({ ...defaultAreasSectionForm, ...snapshot.data() });
        }
      }, (error) => setStatus(firestoreErrorMessage(error, 'carregar textos públicos'))),
    ];

    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, []);

  const totals = useMemo(() => {
    const projectRevenue = projects.reduce((sum, project) => sum + moneyNumber(project.budget), 0);
    const invoiceRevenue = invoices.filter((invoice) => invoice.status === 'Pago').reduce((sum, invoice) => sum + moneyNumber(invoice.amount), 0);
    const openTickets = tickets.filter((ticket) => ticket.status !== 'Resolvido').length;
    const newUsers = notifications.filter((notification) => notification.type === 'new-user' && notification.status !== 'Lida').length;
    const pendingInvoices = invoices.filter((invoice) => invoice.status !== 'Pago').length;
    const openOrders = orders.filter((order) => order.status !== 'Concluído').length;
    return { projectRevenue, invoiceRevenue, openTickets, newUsers, pendingInvoices, openOrders };
  }, [invoices, notifications, orders, projects, tickets]);

  const storeContentItems = useMemo(
    () => siteContent
      .filter((item) => isStoreProductPage(item.page))
      .sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured))),
    [siteContent],
  );

  const filteredSiteContent = useMemo(
    () => sitePageFilter === 'all' ? siteContent : siteContent.filter((item) => normalizeContentValue(item.page) === sitePageFilter),
    [siteContent, sitePageFilter],
  );

  async function createRecord<T extends object>(collectionName: CollectionName, data: T, reset: () => void, message: string) {
    setStatus('Salvando registro...');

    try {
      await addDoc(collection(db, collectionName), { ...data, createdBy: user?.id || '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

      try {
        await addDoc(collection(db, 'systemEvents'), {
          title: message,
          message: `Registro salvo em ${collectionName}.`,
          type: collectionName,
          createdBy: user?.id || '',
          createdAt: serverTimestamp(),
        });
      } catch {
        // O registro principal já foi salvo. O evento é apenas histórico.
      }

      reset();
      setStatus(message);
    } catch (error) {
      setStatus(firestoreErrorMessage(error, 'salvar registro'));
    }
  }

  async function removeRecord(collectionName: CollectionName, id: string) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setStatus('Registro removido.');
    } catch (error) {
      setStatus(firestoreErrorMessage(error, 'remover registro'));
    }
  }

  async function changeStatus(collectionName: CollectionName, id: string, nextStatus: string) {
    try {
      await updateDoc(doc(db, collectionName, id), { status: nextStatus, updatedAt: serverTimestamp() });
      if (user?.preferences?.notifyStatusChanges !== false) {
        try {
          await addDoc(collection(db, 'notifications'), {
            title: 'Status atualizado',
            message: `Um registro em ${collectionName} mudou para ${nextStatus}.`,
            target: 'Admin',
            status: 'Nova',
            type: 'status-change',
            createdBy: user?.id || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch {
          // A notificação é auxiliar; o status principal já foi salvo.
        }
      }
      setStatus('Status atualizado.');
    } catch (error) {
      setStatus(firestoreErrorMessage(error, 'atualizar status'));
    }
  }

  function buildSiteContentPayload() {
    const normalizedPage = siteContentForm.page.trim().toLowerCase();
    const normalizedMarketplace = siteContentForm.marketplace.trim() || (['produtos', 'lojas'].includes(normalizedPage) ? 'Loja oficial' : '');

    return {
      page: normalizedPage,
      type: siteContentForm.type.trim(),
      title: siteContentForm.title.trim(),
      description: siteContentForm.description.trim(),
      url: siteContentForm.url.trim(),
      status: siteContentForm.status || 'Publicado',
      price: siteContentForm.price.trim(),
      currency: siteContentForm.currency,
      marketplace: normalizedMarketplace,
      category: siteContentForm.category.trim(),
      imageUrl: siteContentForm.imageUrl.trim(),
      availability: siteContentForm.availability,
      featured: siteContentForm.featured,
      sku: siteContentForm.sku.trim(),
      specifications: siteContentForm.specifications.trim(),
      features: siteContentForm.features.trim(),
      datasheetUrl: siteContentForm.datasheetUrl.trim(),
      technicalContent: siteContentForm.technicalContent.trim(),
      pinout: siteContentForm.pinout.trim(),
      setupGuide: siteContentForm.setupGuide.trim(),
      relatedProducts: siteContentForm.relatedProducts.trim(),
    };
  }

  async function saveSiteContent(resetForm: () => void, successMessage: string) {
    const nextContent = buildSiteContentPayload();

    if (!nextContent.title) {
      setStatus('Informe um título para salvar o conteúdo.');
      return;
    }

    if (editingSiteContentId) {
      setStatus('Atualizando conteúdo...');
      try {
        await updateDoc(doc(db, 'siteContent', editingSiteContentId), {
          ...nextContent,
          updatedAt: serverTimestamp(),
          updatedBy: user?.id || '',
        });
        resetForm();
        setEditingSiteContentId(null);
        setStatus('Conteúdo atualizado no site.');
      } catch (error) {
        setStatus(firestoreErrorMessage(error, 'atualizar conteúdo'));
      }
      return;
    }

    await createRecord('siteContent', nextContent, () => {
      resetForm();
      setEditingSiteContentId(null);
    }, successMessage);
  }

  function prepareStoreProduct(page: 'lojas' | 'produtos' = 'lojas') {
    setEditingSiteContentId(null);
    setSitePageFilter(page);
    setSiteContentForm({
      ...defaultStoreProductForm,
      page,
      type: page === 'lojas' ? 'Produto' : 'Produto',
    });
    setStatus(page === 'lojas' ? 'Preencha o produto para aparecer na loja.' : 'Preencha o produto para aparecer em produtos.');
  }

  function prepareSitePageContent(page: string) {
    const definition = sitePageAdminDefinitions.find((item) => item.page === page);
    if (!definition) return;

    setEditingSiteContentId(null);
    setSitePageFilter(page);
    setSiteContentForm({
      ...defaultSiteContentForm,
      page: definition.page,
      type: definition.type,
      category: definition.category,
      marketplace: ['produtos', 'lojas'].includes(definition.page) ? 'Loja oficial' : '',
    });
    setStatus(`Formulário preparado para cadastrar em ${definition.label}.`);
    window.setTimeout(() => document.getElementById('site-content-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function startEditingSiteContent(item: SiteContentRecord) {
    setEditingSiteContentId(item.id);
    setSiteContentForm({
      ...defaultSiteContentForm,
      page: item.page || defaultSiteContentForm.page,
      type: item.type || defaultSiteContentForm.type,
      title: item.title || '',
      description: item.description || '',
      url: item.url || '',
      status: item.status || defaultSiteContentForm.status,
      price: item.price || '',
      currency: item.currency || defaultSiteContentForm.currency,
      marketplace: item.marketplace || '',
      category: item.category || '',
      imageUrl: item.imageUrl || '',
      availability: item.availability || defaultSiteContentForm.availability,
      featured: Boolean(item.featured),
      sku: item.sku || '',
      specifications: item.specifications || '',
      features: item.features || '',
      datasheetUrl: item.datasheetUrl || '',
      technicalContent: item.technicalContent || '',
      pinout: item.pinout || '',
      setupGuide: item.setupGuide || '',
      relatedProducts: item.relatedProducts || '',
    });
    setSitePageFilter(item.page || 'all');
    setStatus(`Editando: ${item.title || 'conteúdo sem título'}.`);
    window.setTimeout(() => document.getElementById('site-content-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  async function copyFirestoreRules() {
    try {
      await navigator.clipboard.writeText(firestoreRulesText);
      setStatus('Regras copiadas. Cole em Firebase Console > Firestore Database > Regras > Publicar.');
    } catch {
      setStatus('Não consegui copiar automaticamente. Abra firestore.rules no projeto e cole no Firebase Console.');
    }
  }

  async function handleAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Escolha um arquivo de imagem.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus('Use uma foto com ate 4 MB para salvar no perfil.');
      return;
    }

    if (!user?.id) {
      setStatus('Usuário não autenticado.');
      return;
    }

    setIsUploadingAvatar(true);
    setStatus('Preparando foto para salvar no perfil...');

    try {
      const avatar = await compressImage(file);
      setProfileForm((current) => ({ ...current, avatar }));
      setStatus('Foto carregada. Clique em salvar perfil para gravar no usuário.');
    } catch {
      setStatus('Não foi possível carregar a foto. Tente outra imagem.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const stats = [
    { label: 'Clientes', value: String(clients.length), icon: Users, hint: 'base cadastrada' },
    { label: 'Usuários', value: String(registeredUsers.length), icon: UserPlus, hint: totals.newUsers ? `${totals.newUsers} novo(s)` : 'contas reais' },
    { label: 'Projetos ativos', value: String(projects.filter((project) => project.status !== 'Concluído').length), icon: FolderOpen, hint: 'em operação' },
    { label: 'Tickets Abertos', value: String(totals.openTickets), icon: MessageSquare, hint: 'precisam de resposta' },
    { label: 'Faturado Pago', value: toMoney(totals.invoiceRevenue), icon: CreditCard, hint: 'recebido' },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const CurrentTabIcon = currentTab.icon;
  const renderActiveTab = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'orders') return renderOrders();
    if (activeTab === 'store') return renderStoreProducts();
    if (activeTab === 'clients') return renderClients();
    if (activeTab === 'projects') return renderProjects();
    if (activeTab === 'technicians') return renderTechnicians();
    if (activeTab === 'support') return renderTickets();
    if (activeTab === 'documents') return renderDocuments();
    if (activeTab === 'sitePages') return renderSitePages();
    if (activeTab === 'billing') return renderBilling();
    if (activeTab === 'notifications') return renderNotifications();
    if (activeTab === 'ota') return <OtaAdminPanel />;
    if (activeTab === 'settings') return renderProfile();
    return renderOverview();
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {totals.newUsers > 0 && (
        <button
          type="button"
          onClick={() => openTab('notifications')}
          className="flex w-full items-start gap-3 rounded-lg border border-[#159AFD]/30 bg-[#159AFD]/10 p-4 text-left transition hover:bg-[#159AFD]/15"
        >
          <Bell className="mt-0.5 h-5 w-5 flex-none text-[#159AFD]" />
          <span>
            <span className="block font-black text-slate-950 dark:text-white">Novo cadastro no sistema</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">
              Existem {totals.newUsers} notificações de novo usuário aguardando leitura.
            </span>
          </span>
        </button>
      )}

      <div className={`${panelClass} p-4 sm:p-5`}>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Ações rápidas</p>
            <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Acesse as tarefas mais usadas sem procurar no menu.</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
            {[
              { label: 'Novo pedido', tab: 'orders', icon: PackagePlus },
              { label: 'Adicionar cliente', tab: 'clients', icon: UserPlus },
              { label: 'Criar projeto', tab: 'projects', icon: FolderOpen },
              { label: 'Publicar conteúdo', tab: 'sitePages', icon: MonitorPlay },
              { label: 'Cadastrar produto', tab: 'store', icon: Store },
            ].map(({ label, tab, icon: ActionIcon }) => (
              <button key={tab} type="button" onClick={() => openTab(tab)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 transition hover:border-[#159AFD] hover:bg-white hover:text-[#159AFD] dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-200 dark:hover:bg-white/[0.07]">
                <ActionIcon className="h-4 w-4 text-[#159AFD]" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className={`${panelClass} p-4 sm:p-5`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#159AFD]/15 text-[#159AFD]">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="truncate rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">{stat.hint}</span>
            </div>
            <p className="truncate text-2xl font-black text-slate-950 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className={`${panelClass} p-6`}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Operação em tempo real</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resumo puxado das colecoes do Firestore.</p>
            </div>
            <BarChart3 className="h-6 w-6 text-[#159AFD]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-4 dark:bg-white/[0.04]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pedidos</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{orders.length}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4 dark:bg-white/[0.04]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Receita projetos</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{toMoney(totals.projectRevenue)}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-4 dark:bg-white/[0.04]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Notificações</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className={`${panelClass} p-6`}>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">Proximas acoes</h3>
          <div className="mt-5 space-y-3">
            {[
              `${totals.openOrders} pedido(s) em aberto`,
              `${tickets.filter((ticket) => ticket.status !== 'Resolvido').length} ticket(s) aguardando`,
              `${totals.pendingInvoices} faturamento(s) pendente(s)`,
              `${registeredUsers.length} usuário(s) com acesso criado`,
            ].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${panelClass} p-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Atividades recentes</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Eventos gravados quando algo importante acontece.</p>
          </div>
          <Activity className="h-6 w-6 text-[#159AFD]" />
        </div>
        <div className="grid gap-3">
          {systemEvents.length === 0 && <EmptyState title="Sem atividades ainda" text="Quando usuários, clientes, projetos e pedidos forem criados, eles aparecem aqui." />}
          {systemEvents.slice(0, 6).map((event) => (
            <div key={event.id} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="font-bold text-slate-950 dark:text-white">{event.title || 'Atividade'}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.message || event.type || 'Evento do sistema'}</p>
            </div>
          ))}
        </div>
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
          () => setProjectForm({ name: '', client: '', clientEmail: '', status: 'Planejamento', budget: '', deadline: '', technician: '', progress: '0', description: '' }),
          'Projeto cadastrado.',
        );
      }}
      form={
        <>
          <Field label="Nome do projeto" value={projectForm.name} onChange={(name) => setProjectForm({ ...projectForm, name })} />
          <Field label="Cliente" value={projectForm.client} onChange={(client) => setProjectForm({ ...projectForm, client })} />
          <Field label="E-mail da conta do cliente" type="email" value={projectForm.clientEmail} onChange={(clientEmail) => setProjectForm({ ...projectForm, clientEmail: clientEmail.trim().toLowerCase() })} placeholder="cliente@email.com" />
          <SelectField label="Status" value={projectForm.status} onChange={(statusValue) => setProjectForm({ ...projectForm, status: statusValue })} options={['Planejamento', 'Em andamento', 'Aguardando cliente', 'Concluído']} />
          <Field label="Valor" placeholder="R$ 0,00" value={projectForm.budget} onChange={(budget) => setProjectForm({ ...projectForm, budget })} />
          <Field label="Prazo" type="date" value={projectForm.deadline} onChange={(deadline) => setProjectForm({ ...projectForm, deadline })} required={false} />
          <Field label="Técnico responsável" value={projectForm.technician} onChange={(technician) => setProjectForm({ ...projectForm, technician })} required={false} />
          <Field label="Progresso (%)" type="number" value={projectForm.progress} onChange={(progress) => setProjectForm({ ...projectForm, progress })} />
          <TextAreaField label="Descrição" value={projectForm.description} onChange={(description) => setProjectForm({ ...projectForm, description })} />
        </>
      }
      emptyText="Nenhum projeto cadastrado."
      items={projects.map((project) => ({
        id: project.id,
        title: project.name || 'Projeto sem nome',
        subtitle: `${project.client || 'Cliente não informado'} - ${project.status || 'Planejamento'}`,
        meta: `${project.budget || 'R$ 0'} / ${project.progress || '0'}%`,
        status: project.status,
        actions: [
          { label: 'Concluir', onClick: () => changeStatus('projetos', project.id, 'Concluído') },
          { label: 'Andamento', onClick: () => changeStatus('projetos', project.id, 'Em andamento') },
        ],
        remove: () => removeRecord('projetos', project.id),
      }))}
    />
  );

  const renderTechnicians = () => (
    <CrudPanel
      title="Adicionar técnico"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('technicians', technicianForm, () => setTechnicianForm({ name: '', email: '', specialty: '', phone: '' }), 'Técnico cadastrado.');
      }}
      form={
        <>
          <Field label="Nome" value={technicianForm.name} onChange={(name) => setTechnicianForm({ ...technicianForm, name })} />
          <Field label="Email" type="email" value={technicianForm.email} onChange={(email) => setTechnicianForm({ ...technicianForm, email })} />
          <Field label="Especialidade" value={technicianForm.specialty} onChange={(specialty) => setTechnicianForm({ ...technicianForm, specialty })} />
          <Field label="Telefone" value={technicianForm.phone} onChange={(phone) => setTechnicianForm({ ...technicianForm, phone })} />
        </>
      }
      emptyText="Nenhum técnico cadastrado."
      items={technicians.map((technician) => ({
        id: technician.id,
        title: technician.name || 'Técnico sem nome',
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
        createRecord('supportTickets', ticketForm, () => setTicketForm({ title: '', client: '', clientEmail: '', priority: 'Media', status: 'Aberto', message: '' }), 'Ticket cadastrado.');
      }}
      form={
        <>
          <Field label="Título" value={ticketForm.title} onChange={(title) => setTicketForm({ ...ticketForm, title })} />
          <Field label="Cliente" value={ticketForm.client} onChange={(client) => setTicketForm({ ...ticketForm, client })} />
          <Field label="E-mail da conta do cliente" type="email" value={ticketForm.clientEmail} onChange={(clientEmail) => setTicketForm({ ...ticketForm, clientEmail: clientEmail.trim().toLowerCase() })} placeholder="cliente@email.com" />
          <SelectField label="Prioridade" value={ticketForm.priority} onChange={(priority) => setTicketForm({ ...ticketForm, priority })} options={['Baixa', 'Media', 'Alta', 'Urgente']} />
          <SelectField label="Status" value={ticketForm.status} onChange={(statusValue) => setTicketForm({ ...ticketForm, status: statusValue })} options={['Aberto', 'Em atendimento', 'Aguardando cliente', 'Resolvido']} />
          <TextAreaField label="Mensagem" value={ticketForm.message} onChange={(message) => setTicketForm({ ...ticketForm, message })} />
        </>
      }
      emptyText="Nenhum ticket de suporte."
      items={tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title || 'Ticket sem título',
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
        createRecord('documents', documentForm, () => setDocumentForm({ title: '', client: '', clientEmail: '', category: 'Contrato', url: '' }), 'Documento cadastrado.');
      }}
      form={
        <>
          <Field label="Título" value={documentForm.title} onChange={(title) => setDocumentForm({ ...documentForm, title })} />
          <Field label="Cliente/Projeto" value={documentForm.client} onChange={(client) => setDocumentForm({ ...documentForm, client })} />
          <Field label="E-mail da conta do cliente" type="email" value={documentForm.clientEmail} onChange={(clientEmail) => setDocumentForm({ ...documentForm, clientEmail: clientEmail.trim().toLowerCase() })} placeholder="cliente@email.com" />
          <SelectField label="Categoria" value={documentForm.category} onChange={(category) => setDocumentForm({ ...documentForm, category })} options={['Contrato', 'Manual', 'Nota técnica', 'Arquivo do projeto', 'Outro']} />
          <Field label="Link do arquivo" value={documentForm.url} onChange={(url) => setDocumentForm({ ...documentForm, url })} placeholder="https://..." />
        </>
      }
      emptyText="Nenhum documento cadastrado."
      items={documents.map((documentItem) => ({
        id: documentItem.id,
        title: documentItem.title || 'Documento sem título',
        subtitle: `${documentItem.client || 'Geral'} - ${documentItem.category || 'Outro'}`,
        meta: documentItem.url || 'Sem link',
        link: documentItem.url,
        remove: () => removeRecord('documents', documentItem.id),
      }))}
    />
  );

  const renderStoreProducts = () => (
    <div className="space-y-6">
      <div className={`${panelClass} p-5 sm:p-6`}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Loja oficial</p>
            <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Cadastre somente produtos e serviços da vitrine.</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Esta área é só para loja: imagem do produto, link de compra, código/SKU, preço em R$ ou US$, categoria, disponibilidade e ficha técnica.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => prepareStoreProduct('lojas')} className="rounded-md bg-[#159AFD] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]">
              Novo produto
            </button>
            <a href="/lojas" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver loja
            </a>
            <a href="/produtos" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver produtos
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Itens na vitrine', value: String(storeContentItems.length) },
            { label: 'Publicados', value: String(storeContentItems.filter(isPublishedStoreProduct).length) },
            { label: 'Destaques', value: String(storeContentItems.filter((item) => item.featured).length) },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-2xl font-black text-slate-950 dark:text-white">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <CrudPanel
        title={editingSiteContentId ? 'Editar produto da loja' : 'Adicionar produto da loja'}
        onSubmit={async (event) => {
          event.preventDefault();
          await saveSiteContent(() => setSiteContentForm({ ...defaultStoreProductForm }), editingSiteContentId ? 'Produto atualizado na loja.' : 'Produto salvo na loja.');
        }}
        form={
          <>
            <SelectField label="Onde aparece" value={siteContentForm.page} onChange={(page) => setSiteContentForm({ ...siteContentForm, page })} options={['lojas', 'produtos']} />
            <SelectField label="Tipo" value={siteContentForm.type} onChange={(type) => setSiteContentForm({ ...siteContentForm, type })} options={['Produto', 'Serviço', 'Loja']} />
            <Field label="Nome do produto ou serviço" value={siteContentForm.title} onChange={(title) => setSiteContentForm({ ...siteContentForm, title })} placeholder="Ex.: ESP32-S3 Super Mini" />
            <div className="grid gap-4 sm:grid-cols-[0.45fr_1fr]">
              <SelectField label="Moeda" value={siteContentForm.currency} onChange={(currency) => setSiteContentForm({ ...siteContentForm, currency: currency as 'BRL' | 'USD' })} options={['BRL', 'USD']} />
              <Field label="Preço ou valor" value={siteContentForm.price} onChange={(price) => setSiteContentForm({ ...siteContentForm, price })} placeholder="Ex.: 25,90, R$ 25,90, US$ 5.00 ou Sob orçamento" required={false} />
            </div>
            <Field label="URL da imagem do produto" value={siteContentForm.imageUrl} onChange={(imageUrl) => setSiteContentForm({ ...siteContentForm, imageUrl })} placeholder="https://..." required={false} />
            <SelectField label="Marketplace ou canal" value={siteContentForm.marketplace || 'Loja oficial'} onChange={(marketplace) => setSiteContentForm({ ...siteContentForm, marketplace })} options={marketplaceChannelOptions} />
            {marketplaceNotice({ id: editingSiteContentId || 'preview', ...siteContentForm }) && (
              <p className="rounded-md border border-amber-300/50 bg-amber-400/10 p-3 text-xs font-bold leading-5 text-amber-700 dark:border-amber-300/25 dark:text-amber-100">
                Esse item sera marcado na loja como marketplace externo, com aviso para conferir vendedor, prazo, frete, garantia e politicas da plataforma.
              </p>
            )}
            <Field
              label="Link direto do canal escolhido"
              value={siteContentForm.url}
              onChange={(url) => setSiteContentForm({ ...siteContentForm, url })}
              placeholder={channelLinkPlaceholder(siteContentForm.marketplace)}
              helper="Cole aqui a URL real do produto, atendimento ou catálogo. O campo acima serve só para escolher o canal."
              required={false}
            />
            <Field label="Código/SKU do produto" value={siteContentForm.sku} onChange={(sku) => setSiteContentForm({ ...siteContentForm, sku })} placeholder="Ex.: ESP32-S3-001" required={false} />
            <Field label="Categoria" value={siteContentForm.category} onChange={(category) => setSiteContentForm({ ...siteContentForm, category })} placeholder="Ex.: IoT e automação" required={false} />
            <SelectField label="Disponibilidade" value={siteContentForm.availability} onChange={(availability) => setSiteContentForm({ ...siteContentForm, availability })} options={['Disponível', 'Sob encomenda', 'Sob consulta', 'Indisponível']} />
            <SelectField label="Status" value={siteContentForm.status} onChange={(statusValue) => setSiteContentForm({ ...siteContentForm, status: statusValue })} options={['Publicado', 'Rascunho']} />
            <Field label="Link do datasheet/manual" value={siteContentForm.datasheetUrl} onChange={(datasheetUrl) => setSiteContentForm({ ...siteContentForm, datasheetUrl })} placeholder="https://..." required={false} />
            <TextAreaField label="Descrição para a vitrine" value={siteContentForm.description} onChange={(description) => setSiteContentForm({ ...siteContentForm, description })} placeholder="Explique o produto, aplicação e uso." />
            <TextAreaField label="Especificações técnicas, uma por linha" value={siteContentForm.specifications} onChange={(specifications) => setSiteContentForm({ ...siteContentForm, specifications })} placeholder={'Processador: ESP32-S3\nMemória: 4 MB Flash\nConectividade: Wi-Fi + Bluetooth'} />
            <TextAreaField label="Recursos e aplicações, um por linha" value={siteContentForm.features} onChange={(features) => setSiteContentForm({ ...siteContentForm, features })} placeholder={'Atualização OTA\nPainel web\nAplicação em IoT'} />
            <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-[#070A1F]/70 dark:text-slate-300">
              Destacar na vitrine
              <input type="checkbox" checked={siteContentForm.featured} onChange={(event) => setSiteContentForm({ ...siteContentForm, featured: event.target.checked })} className="h-5 w-5 accent-[#159AFD]" />
            </label>
            {editingSiteContentId && (
              <button
                type="button"
                onClick={() => {
                  setEditingSiteContentId(null);
                  setSiteContentForm({ ...defaultStoreProductForm });
                  setStatus('Edição cancelada.');
                }}
                className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-300"
              >
                Cancelar edição
              </button>
            )}
          </>
        }
        emptyText="Nenhum produto cadastrado na loja."
        items={storeContentItems.map((item) => ({
          id: item.id,
          title: item.title || 'Produto sem título',
          subtitle: `${item.page || 'lojas'} - ${item.category || item.type || 'Produto'} - ${item.status || 'Publicado'}`,
          meta: [formatStorePrice(item), item.sku, item.marketplace, marketplaceNotice(item) ? 'Marketplace externo' : '', item.availability].filter(Boolean).join(' · '),
          status: item.status,
          link: item.url,
          actions: [
            { label: 'Editar', onClick: () => startEditingSiteContent(item) },
            { label: 'Ver loja', onClick: () => window.open(item.page === 'produtos' ? '/produtos' : '/lojas', '_blank', 'noopener,noreferrer') },
            { label: 'Ver ficha', onClick: () => window.open(`/produto/${item.id}`, '_blank', 'noopener,noreferrer') },
            { label: 'Publicar', onClick: () => changeStatus('siteContent', item.id, 'Publicado') },
            { label: 'Rascunho', onClick: () => changeStatus('siteContent', item.id, 'Rascunho') },
          ],
          remove: () => removeRecord('siteContent', item.id),
        }))}
      />
    </div>
  );

  const renderSitePages = () => (
    <div className="space-y-6">
      <div className={`${panelClass} p-5 sm:p-6`}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Conteúdo público do site</p>
            <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Cadastre estudos, produtos reais, equipe, lojas e publicações.</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Estudos aparecem em /estudos. Produtos aparecem em /produtos e /lojas. Tudo precisa estar com status Publicado.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver site normal
            </a>
            <a href="/produtos" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver produtos
            </a>
            <a href="/lojas" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver lojas
            </a>
            <a href="/estudos" target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Ver estudos
            </a>
          </div>
        </div>

        <div className="admin-rules-warning mt-5 rounded-md border p-4 text-sm leading-6">
          <p className="admin-rules-warning-title font-black">Se aparecer "sem permissão", a regra publicada no Firebase ainda é a antiga.</p>
          <p className="admin-rules-warning-text mt-1">
            A regra precisa ter `siteContent`, `siteSettings`, `systemEvents`, `orders` e `isAdmin()` reconhecendo seus emails donos. Use os botões abaixo para copiar e abrir o lugar certo.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copyFirestoreRules} className="rounded-md bg-[#159AFD] px-4 py-3 font-black text-white transition hover:bg-[#0D0F52]">
              Copiar regras corretas
            </button>
            <a href={firebaseConsoleRulesUrl} target="_blank" rel="noreferrer" className="admin-rules-warning-link rounded-md border px-4 py-3 font-black transition">
              Abrir regras no Firebase
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Gerenciar páginas públicas</p>
              <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">Escolha uma área para cadastrar, revisar ou publicar dados.</h4>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Cada cartão abre o formulário já configurado e filtra os registros daquela página.</p>
            </div>
            <button
              type="button"
              onClick={() => setSitePageFilter('all')}
              className={`rounded-md border px-4 py-3 text-sm font-black transition ${sitePageFilter === 'all' ? 'border-[#159AFD] bg-[#159AFD] text-white' : 'border-slate-200 text-slate-700 hover:border-[#159AFD] dark:border-white/10 dark:text-slate-200'}`}
            >
              Ver todos os registros ({siteContent.length})
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {sitePageAdminDefinitions.map(({ page, label, description, icon: PageIcon }) => {
              const pageItems = siteContent.filter((item) => item.page === page);
              const publishedCount = pageItems.filter((item) => item.status !== 'Rascunho').length;
              const draftCount = pageItems.filter((item) => item.status === 'Rascunho').length;

              return (
                <article key={page} className={`flex min-h-64 flex-col rounded-md border p-4 transition ${sitePageFilter === page ? 'border-[#159AFD] bg-[#159AFD]/8 ring-2 ring-[#159AFD]/15' : 'border-slate-200 bg-slate-50 hover:border-[#159AFD]/50 hover:bg-white dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-[#159AFD] text-white">
                      <PageIcon className="h-5 w-5" />
                    </span>
                    <a href={pageLinks[page]} target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-2 py-1 text-xs font-black text-slate-600 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-300">
                      Ver página
                    </a>
                  </div>
                  <h5 className="mt-4 font-black text-slate-950 dark:text-white">{label}</h5>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-2 text-center text-xs font-black text-emerald-600 dark:text-emerald-300">{publishedCount} publicado(s)</span>
                    <span className="rounded-md bg-amber-500/10 px-2 py-2 text-center text-xs font-black text-amber-700 dark:text-amber-300">{draftCount} rascunho(s)</span>
                  </div>
                  <button type="button" onClick={() => prepareSitePageContent(page)} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#159AFD] px-3 text-sm font-black text-white transition hover:bg-[#0D0F52]">
                    <Plus className="h-4 w-4" />
                    Adicionar conteúdo
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setStatus('Salvando seção pública...');

          try {
            await setDoc(doc(db, 'siteSettings', 'areasSection'), {
              ...areasSectionForm,
              updatedAt: serverTimestamp(),
              updatedBy: user?.id || '',
            });
            setStatus('Seção pública atualizada no site.');
          } catch (error) {
            setStatus(firestoreErrorMessage(error, 'salvar seção pública'));
          }
        }}
        className={`${panelClass} p-5 sm:p-6`}
      >
        <div className="mb-5 border-b border-slate-200 pb-4 dark:border-white/10">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">Editar seção pública de áreas</h3>
          <p className="mt-1 text-sm text-slate-500">Altere o título, texto e botão que aparecem na página inicial.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Texto pequeno" value={areasSectionForm.eyebrow} onChange={(eyebrow) => setAreasSectionForm({ ...areasSectionForm, eyebrow })} />
          <Field label="Texto do botão" value={areasSectionForm.buttonLabel} onChange={(buttonLabel) => setAreasSectionForm({ ...areasSectionForm, buttonLabel })} />
          <Field label="Link do botão" value={areasSectionForm.buttonHref} onChange={(buttonHref) => setAreasSectionForm({ ...areasSectionForm, buttonHref })} />
          <Field label="Título principal" value={areasSectionForm.title} onChange={(title) => setAreasSectionForm({ ...areasSectionForm, title })} />
          <div className="lg:col-span-2">
            <TextAreaField label="Descrição" value={areasSectionForm.description} onChange={(description) => setAreasSectionForm({ ...areasSectionForm, description })} />
          </div>
        </div>
        <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 font-bold text-white shadow-lg shadow-[#159AFD]/20 transition hover:bg-[#508AD0]">
          <Plus className="h-5 w-5" />
          Salvar texto da seção
        </button>
      </form>

      <div id="site-content-editor" className="scroll-mt-28 space-y-4">
      <div className={`${panelClass} flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center`}>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#159AFD]">Área selecionada</p>
          <p className="mt-1 font-black text-slate-950 dark:text-white">
            {sitePageFilter === 'all' ? 'Todos os conteúdos públicos' : sitePageAdminDefinitions.find((item) => item.page === sitePageFilter)?.label || sitePageFilter}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{filteredSiteContent.length} registro(s) sendo exibido(s).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sitePageFilter !== 'all' && (
            <a href={pageLinks[sitePageFilter]} target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
              Abrir página pública
            </a>
          )}
          <button type="button" onClick={() => setSitePageFilter('all')} className="rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-200">
            Mostrar todos
          </button>
        </div>
      </div>
      <CrudPanel
        title={editingSiteContentId ? 'Editar conteúdo público' : `Adicionar conteúdo público${sitePageFilter !== 'all' ? ` em ${sitePageAdminDefinitions.find((item) => item.page === sitePageFilter)?.label || sitePageFilter}` : ''}`}
        onSubmit={async (event) => {
          event.preventDefault();
          const nextContent = buildSiteContentPayload();

          if (!nextContent.title) {
            setStatus('Informe um título para salvar o conteúdo.');
            return;
          }

          if (editingSiteContentId) {
            setStatus('Atualizando conteúdo...');
            try {
              await updateDoc(doc(db, 'siteContent', editingSiteContentId), {
                ...nextContent,
                updatedAt: serverTimestamp(),
                updatedBy: user?.id || '',
              });
              setSiteContentForm({ ...defaultSiteContentForm });
              setEditingSiteContentId(null);
              setStatus('Conteúdo atualizado no site.');
            } catch (error) {
              setStatus(firestoreErrorMessage(error, 'atualizar conteúdo'));
            }
            return;
          }

          await createRecord('siteContent', nextContent, () => setSiteContentForm({ ...defaultSiteContentForm }), 'Conteúdo publicado na subpágina.');
        }}
        form={
          <>
            <SelectField
              label="Subpágina"
              value={siteContentForm.page}
              onChange={(page) => {
                setSitePageFilter(page);
                setSiteContentForm({ ...siteContentForm, page });
              }}
              options={sitePageOptions}
            />
            <SelectField
              label="Tipo de conteúdo"
              value={siteContentForm.type}
              onChange={(type) => setSiteContentForm({ ...siteContentForm, type })}
              options={siteContentTypeOptions}
            />
            <Field
              label={['produtos', 'lojas'].includes(siteContentForm.page) ? 'Nome do produto, serviço ou loja' : siteContentForm.page === 'equipe' ? 'Nome do membro da equipe' : siteContentForm.page === 'estudos' ? 'Nome da placa, módulo ou estudo' : 'Título'}
              value={siteContentForm.title}
              onChange={(title) => setSiteContentForm({ ...siteContentForm, title })}
            />
            {!['produtos', 'lojas'].includes(siteContentForm.page) && (
              <Field
                label={siteContentForm.page === 'equipe' ? 'Link de contato ou perfil' : siteContentForm.page === 'estudos' ? 'Link principal da referência' : 'Link, documento, imagem ou vídeo'}
                value={siteContentForm.url}
                onChange={(url) => setSiteContentForm({ ...siteContentForm, url })}
                placeholder={siteContentForm.page === 'estudos' ? 'Documentação, artigo, vídeo ou repositório' : 'https://...'}
                required={false}
              />
            )}
            {!['produtos', 'lojas', 'equipe', 'estudos'].includes(siteContentForm.page) && (
              <div className="grid gap-4 rounded-md border border-[#159AFD]/20 bg-[#159AFD]/5 p-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">Detalhes da publicação</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use estes campos para deixar a página completa, organizada e fácil de consultar.</p>
                </div>
                <Field label="Categoria ou etapa" value={siteContentForm.category} onChange={(category) => setSiteContentForm({ ...siteContentForm, category })} placeholder="Ex.: Concluído, Em teste, Próxima versão" required={false} />
                <Field label="URL da imagem ou capa" value={siteContentForm.imageUrl} onChange={(imageUrl) => setSiteContentForm({ ...siteContentForm, imageUrl })} placeholder="https://..." required={false} />
                <TextAreaField label="Destaques, resultados ou responsabilidades, um por linha" value={siteContentForm.features} onChange={(features) => setSiteContentForm({ ...siteContentForm, features })} placeholder={'Resultado principal\nTecnologia utilizada\nPróximo passo\nResponsável'} />
                <TextAreaField label="Informações técnicas ou dados, um por linha" value={siteContentForm.specifications} onChange={(specifications) => setSiteContentForm({ ...siteContentForm, specifications })} placeholder={'Versão: 1.0\nStatus: Em andamento\nPrazo: 30 dias\nProgresso: 60%'} />
                <TextAreaField label="Conteúdo detalhado" value={siteContentForm.technicalContent} onChange={(technicalContent) => setSiteContentForm({ ...siteContentForm, technicalContent })} placeholder={'Contexto da publicação\nO que foi realizado\nResultados obtidos\nPróximas ações'} />
              </div>
            )}
            {['produtos', 'lojas'].includes(siteContentForm.page) && (
              <div className="grid gap-4 rounded-md border border-[#159AFD]/20 bg-[#159AFD]/5 p-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">Informações comerciais</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Esses dados aparecem na vitrine da loja.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-[0.45fr_1fr]">
                  <SelectField label="Moeda padrão" value={siteContentForm.currency} onChange={(currency) => setSiteContentForm({ ...siteContentForm, currency: currency as 'BRL' | 'USD' })} options={['BRL', 'USD']} />
                  <Field label="Preço ou valor" value={siteContentForm.price} onChange={(price) => setSiteContentForm({ ...siteContentForm, price })} placeholder="Ex.: 25,90, R$ 25,90, US$ 5.00 ou Sob orçamento" required={false} />
                </div>
                <SelectField label="Marketplace ou canal" value={siteContentForm.marketplace || 'Loja oficial'} onChange={(marketplace) => setSiteContentForm({ ...siteContentForm, marketplace })} options={marketplaceChannelOptions} />
                {marketplaceNotice({ id: editingSiteContentId || 'preview', ...siteContentForm }) && (
                  <p className="rounded-md border border-amber-300/50 bg-amber-400/10 p-3 text-xs font-bold leading-5 text-amber-700 dark:border-amber-300/25 dark:text-amber-100">
                    Esse item sera exibido com aviso de marketplace externo. Use quando o link for Shopee, Mercado Livre ou AliExpress.
                  </p>
                )}
                <Field
                  label="Link direto do canal escolhido"
                  value={siteContentForm.url}
                  onChange={(url) => setSiteContentForm({ ...siteContentForm, url })}
                  placeholder={channelLinkPlaceholder(siteContentForm.marketplace)}
                  helper="Cole aqui a URL real do produto, atendimento ou catálogo. O campo acima serve só para escolher o canal."
                  required={false}
                />
                <Field label="Categoria" value={siteContentForm.category} onChange={(category) => setSiteContentForm({ ...siteContentForm, category })} placeholder="Ex.: IoT e automação" required={false} />
                <Field label="URL da imagem do produto" value={siteContentForm.imageUrl} onChange={(imageUrl) => setSiteContentForm({ ...siteContentForm, imageUrl })} placeholder="https://..." required={false} />
                <Field label="Código ou SKU" value={siteContentForm.sku} onChange={(sku) => setSiteContentForm({ ...siteContentForm, sku })} placeholder="Ex.: ELN-IOT-ESP32" required={false} />
                <Field label="Link do datasheet ou manual" value={siteContentForm.datasheetUrl} onChange={(datasheetUrl) => setSiteContentForm({ ...siteContentForm, datasheetUrl })} placeholder="https://..." required={false} />
                <SelectField label="Disponibilidade" value={siteContentForm.availability} onChange={(availability) => setSiteContentForm({ ...siteContentForm, availability })} options={['Disponível', 'Sob encomenda', 'Indisponível']} />
                <TextAreaField label="Especificações técnicas, uma por linha" value={siteContentForm.specifications} onChange={(specifications) => setSiteContentForm({ ...siteContentForm, specifications })} placeholder={'Processador: ESP32-S3\nMemória: 4 MB Flash\nConectividade: Wi-Fi + Bluetooth'} />
                <TextAreaField label="Recursos e aplicações, um por linha" value={siteContentForm.features} onChange={(features) => setSiteContentForm({ ...siteContentForm, features })} placeholder={'Controle de sensores\nAtualização OTA\nPainel web responsivo'} />
                <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-[#070A1F]/70 dark:text-slate-300">
                  Destacar este item na loja
                  <input
                    type="checkbox"
                    checked={siteContentForm.featured}
                    onChange={(event) => setSiteContentForm({ ...siteContentForm, featured: event.target.checked })}
                    className="h-5 w-5 accent-[#159AFD]"
                  />
                </label>
              </div>
            )}
            {siteContentForm.page === 'equipe' && (
              <div className="grid gap-4 rounded-md border border-[#159AFD]/20 bg-[#159AFD]/5 p-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">Dados da equipe</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Esses dados aparecem na página pública /equipe.</p>
                </div>
                <Field label="Cargo ou função" value={siteContentForm.category} onChange={(category) => setSiteContentForm({ ...siteContentForm, category })} placeholder="Ex.: Administrador, técnico, parceiro" required={false} />
                <Field label="URL da foto" value={siteContentForm.imageUrl} onChange={(imageUrl) => setSiteContentForm({ ...siteContentForm, imageUrl })} placeholder="https://..." required={false} />
                <TextAreaField label="Responsabilidades, uma por linha" value={siteContentForm.features} onChange={(features) => setSiteContentForm({ ...siteContentForm, features })} placeholder={'Atendimento ao cliente\nProjetos eletrônicos\nAtualizações OTA'} />
              </div>
            )}
            {siteContentForm.page === 'estudos' && (
              <div className="grid gap-4 rounded-md border border-[#159AFD]/20 bg-[#159AFD]/5 p-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">Ficha de estudo técnico</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Esses dados aparecem na lista /estudos e na ficha /estudos/id.</p>
                </div>
                <Field label="Categoria" value={siteContentForm.category} onChange={(category) => setSiteContentForm({ ...siteContentForm, category })} placeholder="Ex.: ESP32, Display, Sensor, Fonte" required={false} />
                <Field label="Modelo ou código" value={siteContentForm.sku} onChange={(sku) => setSiteContentForm({ ...siteContentForm, sku })} placeholder="Ex.: ESP32-S3 Super Mini" required={false} />
                <Field label="URL da imagem" value={siteContentForm.imageUrl} onChange={(imageUrl) => setSiteContentForm({ ...siteContentForm, imageUrl })} placeholder="https://..." required={false} />
                <Field label="Datasheet ou manual" value={siteContentForm.datasheetUrl} onChange={(datasheetUrl) => setSiteContentForm({ ...siteContentForm, datasheetUrl })} placeholder="https://..." required={false} />
                <TextAreaField label="Especificações, uma por linha" value={siteContentForm.specifications} onChange={(specifications) => setSiteContentForm({ ...siteContentForm, specifications })} placeholder={'Chip: ESP32-S3\nCPU: 240 MHz\nFlash: 4 MB\nUSB: USB-C\nDimensões: 18 x 23,5 mm'} />
                <TextAreaField label="Configuração, testes e notas, uma por linha" value={siteContentForm.features} onChange={(features) => setSiteContentForm({ ...siteContentForm, features })} placeholder={'IDE: Arduino IDE\nBiblioteca: ESP32 by Espressif\nTeste: blink no LED interno\nObservação: conferir tensão antes de alimentar'} />
                <TextAreaField label="Conteúdo detalhado do estudo" value={siteContentForm.technicalContent} onChange={(technicalContent) => setSiteContentForm({ ...siteContentForm, technicalContent })} placeholder={'Resumo do que foi estudado\nAplicações reais\nPontos fortes\nLimitações encontradas'} />
                <TextAreaField label="Pinagem e ligações, uma por linha" value={siteContentForm.pinout} onChange={(pinout) => setSiteContentForm({ ...siteContentForm, pinout })} placeholder={'GPIO 2: LED interno\n5V: alimentação USB\nGND: terra\nSDA/SCL: barramento I2C'} />
                <TextAreaField label="Guia de configuração, uma etapa por linha" value={siteContentForm.setupGuide} onChange={(setupGuide) => setSiteContentForm({ ...siteContentForm, setupGuide })} placeholder={'Instalar Arduino IDE\nAdicionar pacote ESP32 da Espressif\nSelecionar a placa correta\nEnviar sketch de teste'} />
                <TextAreaField label="Produtos, placas ou módulos relacionados" value={siteContentForm.relatedProducts} onChange={(relatedProducts) => setSiteContentForm({ ...siteContentForm, relatedProducts })} placeholder={'ESP32-S3 Super Mini\nDisplay OLED 0.96\nSensor de temperatura\nFonte 5V'} />
              </div>
            )}
            <SelectField label="Status" value={siteContentForm.status} onChange={(statusValue) => setSiteContentForm({ ...siteContentForm, status: statusValue })} options={['Publicado', 'Rascunho']} />
            <TextAreaField label="Descrição" value={siteContentForm.description} onChange={(description) => setSiteContentForm({ ...siteContentForm, description })} />
            {editingSiteContentId && (
              <button
                type="button"
                onClick={() => {
                  setEditingSiteContentId(null);
                  setSiteContentForm({ ...defaultSiteContentForm });
                  setStatus('Edição cancelada.');
                }}
                className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#159AFD] dark:border-white/10 dark:text-slate-300"
              >
                Cancelar edição
              </button>
            )}
          </>
        }
        emptyText="Nenhum conteúdo publicado nas subpáginas."
        items={filteredSiteContent.map((item) => ({
          id: item.id,
          title: item.title || 'Conteúdo sem título',
          subtitle: `${item.page || 'sem página'} - ${item.type || 'Conteúdo'} - ${item.status || 'Publicado'}`,
          meta: [item.price, item.currency, item.marketplace, item.sku, item.availability, item.category, item.description || item.url].filter(Boolean).join(' · '),
          status: item.status,
          link: item.url,
          actions: [
            ...(item.page && pageLinks[item.page] ? [{ label: 'Ver página', onClick: () => window.open(pageLinks[item.page], '_blank', 'noopener,noreferrer') }] : []),
            ...(['produtos', 'lojas'].includes(item.page || '') ? [{ label: 'Ver ficha técnica', onClick: () => window.open(`/produto/${item.id}`, '_blank', 'noopener,noreferrer') }] : []),
            ...(item.page === 'estudos' ? [{ label: 'Ver estudo', onClick: () => window.open(`/estudos/${item.id}`, '_blank', 'noopener,noreferrer') }] : []),
            { label: 'Editar', onClick: () => startEditingSiteContent(item) },
            { label: 'Publicar', onClick: () => changeStatus('siteContent', item.id, 'Publicado') },
            { label: 'Rascunho', onClick: () => changeStatus('siteContent', item.id, 'Rascunho') },
          ],
          remove: () => removeRecord('siteContent', item.id),
        }))}
      />
      </div>
    </div>
  );

  const renderBilling = () => (
    <CrudPanel
      title="Adicionar faturamento"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord('invoices', invoiceForm, () => setInvoiceForm({ title: '', client: '', clientEmail: '', amount: '', dueDate: '', status: 'Pendente' }), 'Faturamento cadastrado.');
      }}
      form={
        <>
          <Field label="Título" value={invoiceForm.title} onChange={(title) => setInvoiceForm({ ...invoiceForm, title })} />
          <Field label="Cliente" value={invoiceForm.client} onChange={(client) => setInvoiceForm({ ...invoiceForm, client })} />
          <Field label="E-mail da conta do cliente" type="email" value={invoiceForm.clientEmail} onChange={(clientEmail) => setInvoiceForm({ ...invoiceForm, clientEmail: clientEmail.trim().toLowerCase() })} placeholder="cliente@email.com" />
          <Field label="Valor" value={invoiceForm.amount} onChange={(amount) => setInvoiceForm({ ...invoiceForm, amount })} placeholder="R$ 0,00" />
          <Field label="Vencimento" type="date" value={invoiceForm.dueDate} onChange={(dueDate) => setInvoiceForm({ ...invoiceForm, dueDate })} required={false} />
          <SelectField label="Status" value={invoiceForm.status} onChange={(statusValue) => setInvoiceForm({ ...invoiceForm, status: statusValue })} options={['Pendente', 'Enviado', 'Pago', 'Atrasado', 'Cancelado']} />
        </>
      }
      emptyText="Nenhum faturamento cadastrado."
      items={invoices.map((invoice) => ({
        id: invoice.id,
        title: invoice.title || 'Fatura sem título',
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
        createRecord('orders', orderForm, () => setOrderForm({ title: '', client: '', clientEmail: '', type: 'Novo projeto', budget: '', status: 'Novo', notes: '' }), 'Pedido cadastrado.');
      }}
      form={
        <>
          <Field label="Título" value={orderForm.title} onChange={(title) => setOrderForm({ ...orderForm, title })} />
          <Field label="Cliente" value={orderForm.client} onChange={(client) => setOrderForm({ ...orderForm, client })} />
          <Field label="E-mail da conta do cliente" type="email" value={orderForm.clientEmail} onChange={(clientEmail) => setOrderForm({ ...orderForm, clientEmail: clientEmail.trim().toLowerCase() })} placeholder="cliente@email.com" />
          <SelectField label="Tipo" value={orderForm.type} onChange={(type) => setOrderForm({ ...orderForm, type })} options={['Novo projeto', 'Manutenção', 'Atualização OTA', 'Documento', 'Suporte']} />
          <Field label="Valor previsto" value={orderForm.budget} onChange={(budget) => setOrderForm({ ...orderForm, budget })} placeholder="R$ 0,00" />
          <SelectField label="Status" value={orderForm.status} onChange={(statusValue) => setOrderForm({ ...orderForm, status: statusValue })} options={['Novo', 'Em análise', 'Aprovado', 'Recusado', 'Concluído']} />
          <TextAreaField label="Observações" value={orderForm.notes} onChange={(notes) => setOrderForm({ ...orderForm, notes })} />
        </>
      }
      emptyText="Nenhum pedido cadastrado."
      items={orders.map((order) => ({
        id: order.id,
        title: order.title || 'Pedido sem título',
        subtitle: `${order.client || 'Sem cliente'} - ${order.type || 'Novo projeto'}`,
        meta: [order.clientEmail && `E-mail vinculado: ${order.clientEmail}`, order.budget || 'R$ 0,00', order.notes].filter(Boolean).join(' | '),
        status: order.status,
        actions: [
          { label: 'Aprovar', onClick: () => changeStatus('orders', order.id, 'Aprovado') },
          { label: 'Concluir', onClick: () => changeStatus('orders', order.id, 'Concluído') },
        ],
        remove: () => removeRecord('orders', order.id),
      }))}
    />
  );

  const renderNotifications = () => (
    <CrudPanel
      title="Criar notificação"
      onSubmit={(event) => {
        event.preventDefault();
        createRecord(
          'notifications',
          { ...notificationForm, clientEmail: notificationForm.clientEmail.trim().toLowerCase() },
          () => setNotificationForm({ title: '', message: '', target: 'Todos', status: 'Enviada', clientEmail: '' }),
          'Notificação enviada.',
        );
      }}
      form={
        <>
          <Field label="Título" value={notificationForm.title} onChange={(title) => setNotificationForm({ ...notificationForm, title })} />
          <SelectField label="Destino" value={notificationForm.target} onChange={(target) => setNotificationForm({ ...notificationForm, target })} options={['Todos', 'Clientes', 'Técnicos', 'Admin']} />
          <Field label="E-mail específico do cliente" type="email" value={notificationForm.clientEmail} onChange={(clientEmail) => setNotificationForm({ ...notificationForm, clientEmail })} placeholder="cliente@email.com" required={false} />
          <SelectField label="Status" value={notificationForm.status} onChange={(statusValue) => setNotificationForm({ ...notificationForm, status: statusValue })} options={['Rascunho', 'Nova', 'Enviada', 'Lida']} />
          <TextAreaField label="Mensagem" value={notificationForm.message} onChange={(message) => setNotificationForm({ ...notificationForm, message })} />
        </>
      }
      emptyText="Nenhuma notificação criada."
      items={notifications.map((notification) => ({
        id: notification.id,
        title: notification.title || 'Notificação sem título',
        subtitle: [notification.target || 'Todos', notification.status || 'Rascunho', notification.clientEmail].filter(Boolean).join(' - '),
        meta: notification.message || '',
        status: notification.status,
        actions: [
          { label: 'Enviar', onClick: () => changeStatus('notifications', notification.id, 'Enviada') },
          { label: 'Marcar lida', onClick: () => changeStatus('notifications', notification.id, 'Lida') },
        ],
        remove: () => removeRecord('notifications', notification.id),
      }))}
    />
  );

  const renderProfile = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await updateUserProfile({
            name: profileForm.name,
            company: profileForm.company,
            avatar: profileForm.avatar,
            theme: profileForm.theme as ThemeMode,
            preferences: {
              theme: profileForm.theme as ThemeMode,
              dashboardDensity: profileForm.dashboardDensity as UserPreferences['dashboardDensity'],
              dashboardStartPage: profileForm.dashboardStartPage,
              notifyNewUsers: profileForm.notifyNewUsers,
              notifyStatusChanges: profileForm.notifyStatusChanges,
            },
          });
          setStatus(result.message);
        }}
        className={`${panelClass} p-6`}
      >
        <h3 className="mb-5 text-xl font-bold text-slate-950 dark:text-white">Meu perfil de admin</h3>
        <div className="space-y-4">
          <Field label="Nome" value={profileForm.name} onChange={(name) => setProfileForm({ ...profileForm, name })} />
          <Field label="Empresa" value={profileForm.company} onChange={(company) => setProfileForm({ ...profileForm, company })} />
          <Field label="URL da foto" value={profileForm.avatar} onChange={(avatar) => setProfileForm({ ...profileForm, avatar })} required={false} />
          <SelectField label="Tema do meu acesso" value={profileForm.theme} onChange={(themeValue) => setProfileForm({ ...profileForm, theme: themeValue as ThemeMode })} options={['dark', 'light']} />
          <SelectField label="Tela inicial do painel" value={profileForm.dashboardStartPage} onChange={(dashboardStartPage) => setProfileForm({ ...profileForm, dashboardStartPage })} options={tabs.map((tab) => tab.id)} />
          <SelectField label="Densidade da interface" value={profileForm.dashboardDensity} onChange={(dashboardDensity) => setProfileForm({ ...profileForm, dashboardDensity: dashboardDensity as UserPreferences['dashboardDensity'] })} options={['comfortable', 'compact']} />
          <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
            Avisar novos usuários
            <input type="checkbox" checked={profileForm.notifyNewUsers} onChange={(event) => setProfileForm({ ...profileForm, notifyNewUsers: event.target.checked })} className="h-5 w-5 accent-[#159AFD]" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
            Avisar mudancas de status
            <input type="checkbox" checked={profileForm.notifyStatusChanges} onChange={(event) => setProfileForm({ ...profileForm, notifyStatusChanges: event.target.checked })} className="h-5 w-5 accent-[#159AFD]" />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Enviar foto do computador
            <input type="file" accept="image/*" onChange={handleAvatarFile} className="mt-2 w-full rounded-md border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#159AFD] file:px-4 file:py-2 file:font-semibold file:text-white dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-300" />
            {isUploadingAvatar && <span className="mt-2 block text-xs text-sky-300">Preparando imagem...</span>}
          </label>
          <button disabled={isUploadingAvatar} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 font-bold text-white transition hover:bg-[#508AD0] disabled:cursor-not-allowed disabled:bg-slate-600">Salvar perfil</button>
        </div>
      </form>
      <div className={`${panelClass} p-6`}>
        <h3 className="mb-5 text-xl font-bold text-slate-950 dark:text-white">Previa</h3>
        <div className="flex items-center gap-4">
          <img src={profileForm.avatar || user?.avatar} alt={profileForm.name} className="h-20 w-20 rounded-md border-2 border-[#159AFD] object-cover" />
          <div>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{profileForm.name || user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-slate-500 dark:text-gray-500">{profileForm.company || user?.company}</p>
            <p className="mt-2 text-sm font-semibold text-[#159AFD]">Tema salvo: {profileForm.theme === 'dark' ? 'noturno' : 'claro'}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tela inicial: {profileForm.dashboardStartPage}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Interface: {profileForm.dashboardDensity === 'compact' ? 'compacta' : 'confortavel'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const statusIsError = /erro|falha|sem permiss|não|nao|inválido|informe/i.test(status);
  const statusClass = statusIsError
    ? isDark ? 'border-rose-400/30 bg-rose-500/12 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'
    : isDark ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <DashboardLayout>
      <div className="admin-dashboard space-y-6">
        <div className="border-b border-slate-200 pb-5 dark:border-white/10">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-[#159AFD]/12 text-[#159AFD] ring-1 ring-[#159AFD]/15">
                <CurrentTabIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#159AFD]">Painel Administrativo</p>
                <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{currentTab.label}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{currentTab.description}</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-black text-emerald-700 dark:text-emerald-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Dados sincronizados
            </div>
          </div>
        </div>

        {status && (
          <div role="status" className={`sticky top-20 z-30 rounded-md border p-3 text-sm font-semibold shadow-lg backdrop-blur ${statusClass}`}>
            {status}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${panelClass} h-fit p-2 lg:sticky lg:top-24`}>
            <div className="mobile-scrollbar flex gap-2 overflow-x-auto lg:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => openTab(tab.id)}
                  className={`flex min-h-11 flex-none items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-[#159AFD] text-white shadow-md shadow-[#159AFD]/15'
                        : 'bg-[#0D0F52] text-white shadow-md shadow-slate-900/10'
                      : isDark
                        ? 'text-slate-300 hover:bg-white/7 hover:text-white'
                        : 'text-slate-600 hover:bg-[#F7FBFF] hover:text-[#0D0F52]'
                  }`}
                >
                  <tab.icon className="h-4 w-4 flex-none" />
                  <span className="min-w-0 truncate">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="hidden space-y-5 lg:block">
              {tabGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{group.label}</p>
                  <div className="grid gap-1">
                    {tabs.filter((tab) => group.ids.includes(tab.id)).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => openTab(tab.id)}
                        className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-bold transition-all ${
                          activeTab === tab.id
                            ? isDark
                              ? 'bg-[#159AFD] text-white shadow-md shadow-[#159AFD]/15'
                              : 'bg-[#0D0F52] text-white shadow-md shadow-slate-900/10'
                            : isDark
                              ? 'text-slate-300 hover:bg-white/7 hover:text-white'
                              : 'text-slate-600 hover:bg-[#F7FBFF] hover:text-[#0D0F52]'
                        }`}
                      >
                        <tab.icon className="h-4 w-4 flex-none" />
                        <span className="min-w-0 truncate">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            {renderActiveTab()}
          </section>
        </div>
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
    <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.55fr)]">
      <form onSubmit={onSubmit} className={`${panelClass} p-5 sm:p-6`}>
        <div className="mb-5 border-b border-slate-200 pb-4 dark:border-white/10">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Preencha os dados e salve no banco.</p>
        </div>
        <div className="space-y-4">
          {form}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 font-bold text-white shadow-lg shadow-[#159AFD]/20 transition hover:bg-[#508AD0]">
            <Plus className="h-5 w-5" />
            Salvar
          </button>
        </div>
      </form>

      <div className={`${panelClass} min-h-[360px] p-4 sm:p-5`}>
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Registros</h3>
            <p className="mt-1 text-sm text-slate-500">{items.length} item(ns) encontrado(s)</p>
          </div>
        </div>
        <div className="space-y-3">
        {items.length === 0 && <EmptyState title={emptyText} text="Cadastre o primeiro registro pelo formulario ao lado." />}
        {items.map((item) => (
          <article key={item.id} className="crud-record-card rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-[#159AFD]/35 hover:bg-white dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.055]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="max-w-2xl font-semibold leading-6 text-slate-950 dark:text-white">{item.title}</h4>
                {item.status && <StatusPill value={item.status} />}
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</p>
              {item.meta && <p className="mt-1 break-words text-sm leading-6 text-slate-500">{item.meta}</p>}
              {item.link && (
                <a href={item.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center rounded-md text-sm font-bold text-[#087CCB] transition hover:text-[#0D0F52] dark:text-sky-300 dark:hover:text-white">
                  Abrir link cadastrado
                </a>
              )}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Ações do registro</p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {item.actions?.map((action) => (
                  <button key={action.label} type="button" onClick={action.onClick} className="crud-action-button inline-flex min-h-10 w-full items-center justify-center rounded-md border border-[#159AFD]/35 bg-white px-3 py-2 text-sm font-bold text-[#0D0F52] transition hover:border-[#159AFD] hover:bg-sky-50 dark:bg-transparent dark:text-sky-200 dark:hover:bg-[#159AFD]/10">
                    {action.label}
                  </button>
                ))}
                <button type="button" onClick={item.remove} className="crud-remove-button inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-600 transition hover:border-red-400 hover:bg-red-50 dark:border-red-400/25 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
