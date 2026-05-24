import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { BarChart3, Bell, DollarSign, FolderOpen, MessageSquare, Plus, Settings, Trash2, UploadCloud, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import DashboardLayout from '../../components/DashboardLayout';
import OtaAdminPanel from '../../components/OtaAdminPanel';

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface ProjectRecord {
  id: string;
  name: string;
  client: string;
  status: string;
  budget: string;
  deadline: string;
}

interface TechnicianRecord {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
}

const tabs = [
  { id: 'overview', label: 'Visao Geral', icon: BarChart3 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'technicians', label: 'Tecnicos', icon: Users },
  { id: 'ota', label: 'OTA', icon: UploadCloud },
  { id: 'reports', label: 'Relatorios', icon: BarChart3 },
  { id: 'settings', label: 'Meu Perfil', icon: Settings },
];

const inputClass = 'mt-2 w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white outline-none transition focus:border-[#159AFD]';

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
        required
      />
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

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianRecord[]>([]);
  const [status, setStatus] = useState('');

  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [projectForm, setProjectForm] = useState({ name: '', client: '', status: 'Planejamento', budget: '', deadline: '' });
  const [technicianForm, setTechnicianForm] = useState({ name: '', email: '', specialty: '', phone: '' });
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', company: user?.company || '', avatar: user?.avatar || '' });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', company: user?.company || '', avatar: user?.avatar || '' });
  }, [user]);

  useEffect(() => {
    const unsubClients = onSnapshot(collection(db, 'clientes'), (snapshot) => {
      setClients(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ClientRecord));
    });
    const unsubProjects = onSnapshot(collection(db, 'projetos'), (snapshot) => {
      setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ProjectRecord));
    });
    const unsubTechnicians = onSnapshot(collection(db, 'technicians'), (snapshot) => {
      setTechnicians(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as TechnicianRecord));
    });

    return () => {
      unsubClients();
      unsubProjects();
      unsubTechnicians();
    };
  }, []);

  const monthlyRevenue = useMemo(() => {
    const total = projects.reduce((sum, project) => {
      const value = Number((project.budget || '').replace(/\D/g, '')) / 100;
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, [projects]);

  const activeProjects = projects.filter((project) => (project.status || 'Planejamento') !== 'Concluido').length;

  async function addClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addDoc(collection(db, 'clientes'), { ...clientForm, createdAt: serverTimestamp() });
    setClientForm({ name: '', email: '', phone: '', company: '' });
    setStatus('Cliente cadastrado.');
  }

  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addDoc(collection(db, 'projetos'), { ...projectForm, createdAt: serverTimestamp() });
    setProjectForm({ name: '', client: '', status: 'Planejamento', budget: '', deadline: '' });
    setStatus('Projeto cadastrado.');
  }

  async function addTechnician(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addDoc(collection(db, 'technicians'), { ...technicianForm, createdAt: serverTimestamp() });
    setTechnicianForm({ name: '', email: '', specialty: '', phone: '' });
    setStatus('Tecnico cadastrado.');
  }

  async function removeItem(collectionName: string, id: string) {
    await deleteDoc(doc(db, collectionName, id));
    setStatus('Registro removido.');
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await updateUserProfile(profileForm);
    setStatus(result.message);
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
    { label: 'Total de Clientes', value: String(clients.length), icon: Users, color: 'text-blue-400' },
    { label: 'Projetos Ativos', value: String(activeProjects), icon: FolderOpen, color: 'text-green-400' },
    { label: 'Receita Cadastrada', value: monthlyRevenue, icon: DollarSign, color: 'text-yellow-400' },
    { label: 'Tickets Abertos', value: '0', icon: MessageSquare, color: 'text-red-400' },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmptyState title="Resumo financeiro" text="A receita aparece conforme voce cadastra projetos com valores." />
        <EmptyState title="Status dos projetos" text="Cadastre projetos e altere o status para acompanhar o andamento." />
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={addClient} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">Adicionar cliente</h3>
        <div className="space-y-4">
          <FormField label="Nome" value={clientForm.name} onChange={(name) => setClientForm({ ...clientForm, name })} />
          <FormField label="Email" type="email" value={clientForm.email} onChange={(email) => setClientForm({ ...clientForm, email })} />
          <FormField label="Telefone" value={clientForm.phone} onChange={(phone) => setClientForm({ ...clientForm, phone })} />
          <FormField label="Empresa" value={clientForm.company} onChange={(company) => setClientForm({ ...clientForm, company })} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">
            <Plus className="h-5 w-5" />
            Salvar cliente
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {clients.length === 0 && <EmptyState title="Nenhum cliente cadastrado" text="Use o formulario para adicionar o primeiro cliente real." />}
        {clients.map((client) => (
          <article key={client.id} className="rounded-xl border border-[#159AFD]/30 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-white">{client.name}</h4>
                <p className="text-sm text-gray-400">{client.company || 'Sem empresa'} - {client.email}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
              </div>
              <button onClick={() => removeItem('clientes', client.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={addProject} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">Adicionar projeto</h3>
        <div className="space-y-4">
          <FormField label="Nome do projeto" value={projectForm.name} onChange={(name) => setProjectForm({ ...projectForm, name })} />
          <FormField label="Cliente" value={projectForm.client} onChange={(client) => setProjectForm({ ...projectForm, client })} />
          <label className="block text-sm font-medium text-gray-300">
            Status
            <select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })} className={inputClass}>
              <option>Planejamento</option>
              <option>Em andamento</option>
              <option>Aguardando cliente</option>
              <option>Concluido</option>
            </select>
          </label>
          <FormField label="Valor" placeholder="R$ 0,00" value={projectForm.budget} onChange={(budget) => setProjectForm({ ...projectForm, budget })} />
          <FormField label="Prazo" value={projectForm.deadline} onChange={(deadline) => setProjectForm({ ...projectForm, deadline })} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">
            <Plus className="h-5 w-5" />
            Salvar projeto
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {projects.length === 0 && <EmptyState title="Nenhum projeto cadastrado" text="Adicione projetos reais para alimentar o painel e os relatorios." />}
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-[#159AFD]/30 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-white">{project.name || 'Projeto sem nome'}</h4>
                <p className="text-sm text-gray-400">{project.client || 'Cliente nao informado'} - {project.status || 'Planejamento'}</p>
                <p className="text-sm text-gray-500">{project.budget || 'R$ 0'} / {project.deadline || 'Sem prazo'}</p>
              </div>
              <button onClick={() => removeItem('projetos', project.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderTechnicians = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={addTechnician} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">Adicionar tecnico</h3>
        <div className="space-y-4">
          <FormField label="Nome" value={technicianForm.name} onChange={(name) => setTechnicianForm({ ...technicianForm, name })} />
          <FormField label="Email" type="email" value={technicianForm.email} onChange={(email) => setTechnicianForm({ ...technicianForm, email })} />
          <FormField label="Especialidade" value={technicianForm.specialty} onChange={(specialty) => setTechnicianForm({ ...technicianForm, specialty })} />
          <FormField label="Telefone" value={technicianForm.phone} onChange={(phone) => setTechnicianForm({ ...technicianForm, phone })} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">
            <Plus className="h-5 w-5" />
            Salvar tecnico
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {technicians.length === 0 && <EmptyState title="Nenhum tecnico cadastrado" text="Cadastre tecnicos para organizar equipe e atribuicoes." />}
        {technicians.map((technician) => (
          <article key={technician.id} className="rounded-xl border border-[#159AFD]/30 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-white">{technician.name}</h4>
                <p className="text-sm text-gray-400">{technician.specialty || 'Sem especialidade'} - {technician.email}</p>
                <p className="text-sm text-gray-500">{technician.phone}</p>
              </div>
              <button onClick={() => removeItem('technicians', technician.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={saveProfile} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">Meu perfil de admin</h3>
        <div className="space-y-4">
          <FormField label="Nome" value={profileForm.name} onChange={(name) => setProfileForm({ ...profileForm, name })} />
          <FormField label="Empresa" value={profileForm.company} onChange={(company) => setProfileForm({ ...profileForm, company })} />
          <FormField label="URL da foto" value={profileForm.avatar} onChange={(avatar) => setProfileForm({ ...profileForm, avatar })} />
          <label className="block text-sm font-medium text-gray-300">
            Enviar foto do computador
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFile}
              className="mt-2 w-full rounded-lg border border-dashed border-[#159AFD]/30 bg-black/30 p-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#159AFD] file:px-4 file:py-2 file:font-semibold file:text-white"
            />
          </label>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#159AFD] px-4 py-3 font-semibold text-white hover:bg-[#508AD0]">
            Salvar perfil
          </button>
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
            <p className="mt-1 text-gray-400">Bem-vindo, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 transition-colors hover:text-white">
              <Bell className="h-6 w-6" />
            </button>
            <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full border-2 border-[#159AFD] object-cover" />
          </div>
        </div>

        {status && <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-200">{status}</div>}

        <div className="mobile-scrollbar flex space-x-1 overflow-x-auto rounded-xl border border-[#159AFD]/30 bg-[#0D0F52]/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-none items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
                activeTab === tab.id ? 'bg-[#159AFD] text-white' : 'text-gray-400 hover:bg-[#159AFD]/20 hover:text-white'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'technicians' && renderTechnicians()}
        {activeTab === 'ota' && <OtaAdminPanel />}
        {activeTab === 'reports' && <EmptyState title="Relatorios" text="Os relatorios serao alimentados pelos dados cadastrados." />}
        {activeTab === 'settings' && renderProfile()}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
