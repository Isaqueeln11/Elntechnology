import React, { useState } from 'react';
import { BarChart3, Bell, DollarSign, FolderOpen, MessageSquare, Settings, UploadCloud, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import OtaAdminPanel from '../../components/OtaAdminPanel';

const emptyStats = [
  { label: 'Total de Clientes', value: '0', icon: Users, color: 'text-blue-400' },
  { label: 'Projetos Ativos', value: '0', icon: FolderOpen, color: 'text-green-400' },
  { label: 'Receita Mensal', value: 'R$ 0', icon: DollarSign, color: 'text-yellow-400' },
  { label: 'Tickets Abertos', value: '0', icon: MessageSquare, color: 'text-red-400' },
];

const tabs = [
  { id: 'overview', label: 'Visao Geral', icon: BarChart3 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'projects', label: 'Projetos', icon: FolderOpen },
  { id: 'technicians', label: 'Tecnicos', icon: Users },
  { id: 'ota', label: 'OTA', icon: UploadCloud },
  { id: 'reports', label: 'Relatorios', icon: BarChart3 },
  { id: 'settings', label: 'Configuracoes', icon: Settings },
];

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-8 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">{text}</p>
    </div>
  );
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {emptyStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-sm font-medium text-gray-500">0%</span>
            </div>
            <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Receita Mensal</h3>
          <div className="flex h-64 items-center justify-center text-center text-gray-400">
            Sem dados financeiros cadastrados.
          </div>
        </div>

        <div className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Projetos por Status</h3>
          <div className="flex h-64 items-center justify-center text-center text-gray-400">
            Sem projetos cadastrados.
          </div>
        </div>
      </div>

      <EmptyState
        title="Atividade recente vazia"
        text="Quando voce cadastrar clientes, projetos, tickets ou firmwares OTA, os dados do sistema passam a aparecer aqui."
      />
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
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-10 w-10 rounded-full border-2 border-[#159AFD]"
            />
          </div>
        </div>

        <div className="mobile-scrollbar flex space-x-1 overflow-x-auto rounded-xl border border-[#159AFD]/30 bg-[#0D0F52]/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-none items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#159AFD] text-white'
                  : 'text-gray-400 hover:bg-[#159AFD]/20 hover:text-white'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'clients' && (
          <EmptyState
            title="Nenhum cliente cadastrado"
            text="Comece adicionando clientes reais ao banco de dados. Os exemplos ficticios foram removidos."
          />
        )}
        {activeTab === 'projects' && (
          <EmptyState
            title="Nenhum projeto cadastrado"
            text="Projetos reais enviados pelo formulario ou cadastrados no sistema aparecem aqui."
          />
        )}
        {activeTab === 'technicians' && (
          <EmptyState
            title="Nenhum tecnico cadastrado"
            text="Crie usuarios reais e altere o campo role para technician no Firestore quando quiser liberar acesso tecnico."
          />
        )}
        {activeTab === 'ota' && <OtaAdminPanel />}
        {activeTab === 'reports' && (
          <EmptyState title="Relatorios zerados" text="Os relatorios serao gerados quando houver dados reais no banco." />
        )}
        {activeTab === 'settings' && (
          <EmptyState title="Configuracoes iniciais" text="Nenhuma configuracao personalizada foi cadastrada ainda." />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
