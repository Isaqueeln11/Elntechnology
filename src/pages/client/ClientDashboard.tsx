import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Settings,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Bell
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
    {
      id: 1,
      name: 'Sistema IoT Industrial',
      status: 'Em Desenvolvimento',
      progress: 65,
      deadline: '2024-03-15',
      budget: 'R$ 45.000',
      technician: 'Carlos Técnico'
    },
    {
      id: 2,
      name: 'Robô Colaborativo',
      status: 'Aguardando Aprovação',
      progress: 25,
      deadline: '2024-04-20',
      budget: 'R$ 78.000',
      technician: 'Ana Santos'
    },
    {
      id: 3,
      name: 'PCB Customizado',
      status: 'Concluído',
      progress: 100,
      deadline: '2024-02-10',
      budget: 'R$ 12.500',
      technician: 'João Oliveira'
    }
  ];

  const tickets = [
    {
      id: 1,
      title: 'Problema na conectividade WiFi',
      status: 'Aberto',
      priority: 'Alta',
      created: '2024-01-15',
      project: 'Sistema IoT Industrial'
    },
    {
      id: 2,
      title: 'Solicitação de modificação no firmware',
      status: 'Em Andamento',
      priority: 'Média',
      created: '2024-01-12',
      project: 'Robô Colaborativo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Desenvolvimento': return 'text-blue-400 bg-blue-400/20';
      case 'Aguardando Aprovação': return 'text-yellow-400 bg-yellow-400/20';
      case 'Concluído': return 'text-green-400 bg-green-400/20';
      case 'Aberto': return 'text-red-400 bg-red-400/20';
      case 'Em Andamento': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-400';
      case 'Média': return 'text-yellow-400';
      case 'Baixa': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Projetos Ativos</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <FolderOpen className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tickets Abertos</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <MessageSquare className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Investimento Total</p>
              <p className="text-2xl font-bold text-white">R$ 123k</p>
            </div>
            <CreditCard className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Projetos Concluídos</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Projetos Recentes</h3>
          <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </button>
        </div>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="bg-black/20 p-4 rounded-lg border border-[#159AFD]/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{project.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>Técnico: {project.technician}</span>
                <span>Prazo: {project.deadline}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#159AFD] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{project.progress}% concluído</span>
                <span>{project.budget}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Meus Projetos</h3>
        <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-6 py-3 rounded-lg transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Projeto
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{project.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Técnico
                </span>
                <span>{project.technician}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prazo
                </span>
                <span>{project.deadline}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Orçamento
                </span>
                <span>{project.budget}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#159AFD] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] py-2 rounded-lg transition-colors">
                Ver Detalhes
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
                Mensagens
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Tickets de Suporte</h3>
        <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-6 py-3 rounded-lg transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Ticket
        </button>
      </div>
      
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{ticket.title}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-gray-300 mb-4">
              <span className="text-sm">Projeto: {ticket.project}</span>
              <span className="text-sm">Criado em: {ticket.created}</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors">
                Ver Conversa
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                Atualizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'tickets', label: 'Suporte', icon: MessageSquare },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'billing', label: 'Faturamento', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Bem-vindo, {user?.name}!
            </h1>
            <p className="text-gray-400 mt-1">{user?.company}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full border-2 border-[#159AFD]"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-[#0D0F52]/30 p-1 rounded-xl border border-[#159AFD]/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-[#159AFD] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#159AFD]/20'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'tickets' && renderTickets()}
          {activeTab === 'documents' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Seção de documentos em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'billing' && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Seção de faturamento em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Configurações em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;