import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FolderOpen, MessageSquare, DollarSign, BarChart3, Settings, UserPlus, TrendingUp, Calendar, Bell, Search, Filter, Download, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total de Clientes', value: '24', change: '+12%', icon: Users, color: 'text-blue-400' },
    { label: 'Projetos Ativos', value: '18', change: '+8%', icon: FolderOpen, color: 'text-green-400' },
    { label: 'Receita Mensal', value: 'R$ 145k', change: '+23%', icon: DollarSign, color: 'text-yellow-400' },
    { label: 'Tickets Abertos', value: '7', change: '-15%', icon: MessageSquare, color: 'text-red-400' }
  ];

  const clients = [
    {
      id: 1,
      name: 'TechCorp Ltda',
      contact: 'João Silva',
      email: 'joao@techcorp.com',
      projects: 3,
      value: 'R$ 85.000',
      status: 'Ativo',
      lastActivity: '2024-01-15'
    },
    {
      id: 2,
      name: 'InnovaTech',
      contact: 'Maria Santos',
      email: 'maria@innovatech.com',
      projects: 2,
      value: 'R$ 45.000',
      status: 'Ativo',
      lastActivity: '2024-01-14'
    },
    {
      id: 3,
      name: 'AutoSystems',
      contact: 'Carlos Oliveira',
      email: 'carlos@autosystems.com',
      projects: 1,
      value: 'R$ 25.000',
      status: 'Pendente',
      lastActivity: '2024-01-10'
    }
  ];

  const projects = [
    {
      id: 1,
      name: 'Sistema IoT Industrial',
      client: 'TechCorp Ltda',
      technician: 'Carlos Técnico',
      status: 'Em Desenvolvimento',
      progress: 65,
      budget: 'R$ 45.000',
      deadline: '2024-03-15'
    },
    {
      id: 2,
      name: 'Robô Colaborativo',
      client: 'InnovaTech',
      technician: 'Ana Santos',
      status: 'Aguardando Aprovação',
      progress: 25,
      budget: 'R$ 78.000',
      deadline: '2024-04-20'
    },
    {
      id: 3,
      name: 'PCB Customizado',
      client: 'AutoSystems',
      technician: 'João Oliveira',
      status: 'Concluído',
      progress: 100,
      budget: 'R$ 12.500',
      deadline: '2024-02-10'
    }
  ];

  const technicians = [
    {
      id: 1,
      name: 'Carlos Técnico',
      email: 'carlos@elntechnology.com',
      speciality: 'IoT & Sistemas Embarcados',
      activeProjects: 3,
      completedProjects: 12,
      rating: 4.8,
      status: 'Disponível'
    },
    {
      id: 2,
      name: 'Ana Santos',
      email: 'ana@elntechnology.com',
      speciality: 'Robótica & Automação',
      activeProjects: 2,
      completedProjects: 8,
      rating: 4.9,
      status: 'Ocupado'
    },
    {
      id: 3,
      name: 'João Oliveira',
      email: 'joao@elntechnology.com',
      speciality: 'PCB Design & Hardware',
      activeProjects: 1,
      completedProjects: 15,
      rating: 4.7,
      status: 'Disponível'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-400 bg-green-400/20';
      case 'Pendente': return 'text-yellow-400 bg-yellow-400/20';
      case 'Inativo': return 'text-red-400 bg-red-400/20';
      case 'Em Desenvolvimento': return 'text-blue-400 bg-blue-400/20';
      case 'Aguardando Aprovação': return 'text-yellow-400 bg-yellow-400/20';
      case 'Concluído': return 'text-green-400 bg-green-400/20';
      case 'Disponível': return 'text-green-400 bg-green-400/20';
      case 'Ocupado': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Receita Mensal</h3>
          <div className="h-64 flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-[#159AFD]" />
            <p className="text-gray-400 ml-4">Gráfico de receita em desenvolvimento</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Projetos por Status</h3>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-[#159AFD]" />
            <p className="text-gray-400 ml-4">Gráfico de projetos em desenvolvimento</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {[
            { action: 'Novo projeto criado', client: 'TechCorp Ltda', time: '2 horas atrás' },
            { action: 'Ticket resolvido', client: 'InnovaTech', time: '4 horas atrás' },
            { action: 'Pagamento recebido', client: 'AutoSystems', time: '1 dia atrás' },
            { action: 'Projeto concluído', client: 'SmartFactory', time: '2 dias atrás' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-[#159AFD]/20 last:border-b-0">
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-gray-400 text-sm">{activity.client}</p>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Gerenciar Clientes</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="pl-10 pr-4 py-2 bg-[#0D0F52]/30 border border-[#159AFD]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#159AFD]"
            />
          </div>
          <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0D0F52]/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Cliente</th>
                <th className="text-left p-4 text-gray-300 font-medium">Contato</th>
                <th className="text-left p-4 text-gray-300 font-medium">Projetos</th>
                <th className="text-left p-4 text-gray-300 font-medium">Valor Total</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-t border-[#159AFD]/20">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{client.name}</p>
                      <p className="text-gray-400 text-sm">Última atividade: {client.lastActivity}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{client.contact}</p>
                      <p className="text-gray-400 text-sm">{client.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-white">{client.projects}</td>
                  <td className="p-4 text-white font-medium">{client.value}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-[#159AFD] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-[#159AFD] transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Gerenciar Projetos</h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-[#0D0F52]/30 border border-[#159AFD]/30 rounded-lg text-gray-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
          <button className="flex items-center px-4 py-2 bg-[#0D0F52]/30 border border-[#159AFD]/30 rounded-lg text-gray-300 hover:text-white transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{project.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Cliente:</span>
                <span className="text-white">{project.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Técnico:</span>
                <span className="text-white">{project.technician}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orçamento:</span>
                <span className="text-white">{project.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prazo:</span>
                <span className="text-white">{project.deadline}</span>
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
              <button className="flex-1 bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] py-2 rounded-lg transition-colors text-sm">
                Ver Detalhes
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTechnicians = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Gerenciar Técnicos</h3>
        <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Técnico
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#159AFD]/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-[#159AFD]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{tech.name}</h4>
                  <p className="text-gray-400 text-sm">{tech.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tech.status)}`}>
                {tech.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Especialidade</p>
                <p className="text-white">{tech.speciality}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Projetos Ativos</p>
                  <p className="text-white font-semibold">{tech.activeProjects}</p>
                </div>
                <div>
                  <p className="text-gray-400">Concluídos</p>
                  <p className="text-white font-semibold">{tech.completedProjects}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Avaliação</p>
                <div className="flex items-center">
                  <span className="text-yellow-400 font-semibold">{tech.rating}</span>
                  <span className="text-gray-400 ml-1">/5.0</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] py-2 rounded-lg transition-colors text-sm">
                Ver Perfil
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm">
                Atribuir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'technicians', label: 'Técnicos', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="text-gray-400 mt-1">Bem-vindo, {user?.name}</p>
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
        <div className="flex space-x-1 bg-[#0D0F52]/30 p-1 rounded-xl border border-[#159AFD]/30 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
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
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'technicians' && renderTechnicians()}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Seção de relatórios em desenvolvimento</p>
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

export default AdminDashboard;