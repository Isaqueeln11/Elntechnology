import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wrench, 
  FolderOpen, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Bell,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Camera,
  Upload,
  Send
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const myProjects = [
    {
      id: 1,
      name: 'Sistema IoT Industrial',
      client: 'TechCorp Ltda',
      status: 'Em Desenvolvimento',
      progress: 65,
      priority: 'Alta',
      deadline: '2024-03-15',
      timeSpent: '45h',
      description: 'Desenvolvimento de sistema de monitoramento industrial com sensores IoT'
    },
    {
      id: 2,
      name: 'PCB Sensor de Temperatura',
      client: 'AutoSystems',
      status: 'Teste',
      progress: 85,
      priority: 'Média',
      deadline: '2024-02-28',
      timeSpent: '32h',
      description: 'Design e fabricação de PCB para sensor de temperatura industrial'
    }
  ];

  const repairTickets = [
    {
      id: 1,
      title: 'Problema na conectividade WiFi - Sistema IoT',
      client: 'TechCorp Ltda',
      project: 'Sistema IoT Industrial',
      status: 'Aberto',
      priority: 'Alta',
      created: '2024-01-15',
      description: 'Sistema perdendo conexão WiFi intermitentemente após 2 horas de operação',
      steps: [
        { id: 1, description: 'Verificar configurações de rede', completed: true, time: '30min' },
        { id: 2, description: 'Testar estabilidade do sinal', completed: true, time: '45min' },
        { id: 3, description: 'Analisar logs do sistema', completed: false, time: '60min' },
        { id: 4, description: 'Implementar correção no firmware', completed: false, time: '120min' }
      ]
    },
    {
      id: 2,
      title: 'Calibração de sensores - PCB Temperatura',
      client: 'AutoSystems',
      project: 'PCB Sensor de Temperatura',
      status: 'Em Andamento',
      priority: 'Média',
      created: '2024-01-12',
      description: 'Sensores apresentando leituras inconsistentes após instalação',
      steps: [
        { id: 1, description: 'Verificar soldas dos componentes', completed: true, time: '45min' },
        { id: 2, description: 'Testar com multímetro', completed: true, time: '30min' },
        { id: 3, description: 'Recalibrar sensores', completed: false, time: '90min' },
        { id: 4, description: 'Validar em ambiente real', completed: false, time: '60min' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Desenvolvimento': return 'text-blue-400 bg-blue-400/20';
      case 'Teste': return 'text-yellow-400 bg-yellow-400/20';
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
            <Wrench className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Horas Trabalhadas</p>
              <p className="text-2xl font-bold text-white">77h</p>
            </div>
            <Clock className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taxa de Resolução</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-[#159AFD]/20 hover:bg-[#159AFD]/30 rounded-lg transition-colors">
            <Play className="w-5 h-5 text-[#159AFD] mr-2" />
            <span className="text-white">Iniciar Timer</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-white">Marcar Concluído</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-white">Novo Ticket</span>
          </button>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Tarefas de Hoje</h3>
        <div className="space-y-3">
          {[
            { task: 'Analisar logs do sistema IoT', project: 'Sistema IoT Industrial', time: '09:00', status: 'pending' },
            { task: 'Recalibrar sensores de temperatura', project: 'PCB Sensor', time: '14:00', status: 'pending' },
            { task: 'Reunião com cliente TechCorp', project: 'Sistema IoT Industrial', time: '16:00', status: 'scheduled' },
            { task: 'Documentar correções implementadas', project: 'Geral', time: '17:30', status: 'pending' }
          ].map((task, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  task.status === 'completed' ? 'bg-green-400' : 
                  task.status === 'scheduled' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <div>
                  <p className="text-white">{task.task}</p>
                  <p className="text-gray-400 text-sm">{task.project}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{task.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold text-white">Meus Projetos</h3>
        <div className="flex items-center space-x-2">
          <button className="bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] px-4 py-2 rounded-lg transition-colors">
            Filtrar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myProjects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-xl font-semibold text-white">{project.name}</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{project.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex flex-col gap-1 text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Cliente
                </span>
                <span>{project.client}</span>
              </div>
              <div className="flex flex-col gap-1 text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prazo
                </span>
                <span>{project.deadline}</span>
              </div>
              <div className="flex flex-col gap-1 text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Tempo Gasto
                </span>
                <span>{project.timeSpent}</span>
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
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button className="flex-1 bg-[#159AFD] hover:bg-[#508AD0] text-white py-2 rounded-lg transition-colors flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Continuar
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRepairTickets = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold text-white">Roteiro de Reparos</h3>
        <button className="w-full rounded-lg bg-[#159AFD] px-4 py-2 text-white transition-colors hover:bg-[#508AD0] sm:w-auto">
          Novo Ticket
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {repairTickets.map((ticket) => (
          <div key={ticket.id} className="bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-xl border border-[#159AFD]/30 p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-lg font-semibold text-white">{ticket.title}</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-gray-400">Cliente:</span>
                <span className="text-white">{ticket.client}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-gray-400">Projeto:</span>
                <span className="text-white">{ticket.project}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-gray-400">Criado:</span>
                <span className="text-white">{ticket.created}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">{ticket.description}</p>
            
            <div className="space-y-2 mb-4">
              <h5 className="text-white font-medium text-sm">Etapas do Reparo:</h5>
              {ticket.steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-2 rounded bg-black/20 p-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      step.completed ? 'bg-green-400' : 'bg-gray-400'
                    }`}>
                      {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${step.completed ? 'text-gray-400 line-through' : 'text-white'} break-words`}>
                      {step.description}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">{step.time}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button 
                onClick={() => setSelectedTicket(ticket.id)}
                className="flex-1 bg-[#159AFD] hover:bg-[#508AD0] text-white py-2 rounded-lg transition-colors text-sm"
              >
                Trabalhar
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm">
                Histórico
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Repair Work Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#159AFD]/20 bg-[#0D0F52] p-4 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Roteiro de Reparo - Ticket #{selectedTicket}
              </h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Steps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Etapas do Reparo</h3>
                <div className="space-y-3">
                  {repairTickets.find(t => t.id === selectedTicket)?.steps.map((step) => (
                    <div key={step.id} className="bg-black/20 p-4 rounded-lg">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center">
                          <button className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                            step.completed ? 'bg-green-400' : 'bg-gray-600 hover:bg-[#159AFD]'
                          } transition-colors`}>
                            {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                          </button>
                          <span className={`${step.completed ? 'text-gray-400 line-through' : 'text-white'} break-words`}>
                            {step.description}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{step.time}</span>
                      </div>
                      {!step.completed && (
                        <div className="ml-9 flex space-x-2">
                          <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-3 py-1 rounded text-sm transition-colors">
                            Iniciar
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors">
                            Pular
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column - Documentation */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Documentação</h3>
                <div className="space-y-4">
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Notas do Técnico</h4>
                    <textarea
                      className="w-full h-32 bg-gray-800 border border-gray-600 rounded p-3 text-white placeholder-gray-400 resize-none"
                      placeholder="Adicione suas observações sobre o reparo..."
                    />
                  </div>
                  
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Anexar Evidências</h4>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Clique para adicionar fotos ou documentos</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Tempo Gasto</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Horas"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-white"
                      />
                      <span className="text-gray-400">:</span>
                      <input
                        type="number"
                        placeholder="Min"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Salvar e Fechar
              </button>
              <div className="grid grid-cols-1 gap-2 sm:flex sm:space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center">
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Clock },
    { id: 'projects', label: 'Meus Projetos', icon: FolderOpen },
    { id: 'repairs', label: 'Roteiro de Reparos', icon: Wrench },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'reports', label: 'Relatórios', icon: FileText }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Painel Técnico
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
        <div className="mobile-scrollbar flex space-x-1 overflow-x-auto rounded-xl border border-[#159AFD]/30 bg-[#0D0F52]/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-none items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
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
          {activeTab === 'repairs' && renderRepairTickets()}
          {activeTab === 'messages' && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Sistema de mensagens em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Relatórios técnicos em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
