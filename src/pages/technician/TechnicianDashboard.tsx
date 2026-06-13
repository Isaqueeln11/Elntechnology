import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notificationIsUnread, useNotifications } from '../../hooks/useNotifications';
import { 
  Wrench, 
  FolderOpen, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  User,
  Calendar,
  Bell,
  Play,
  Pause,
  FileText,
  Camera
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const technicianPanelClass = 'dashboard-surface rounded-md border p-5 sm:p-6';
const technicianSoftClass = 'dashboard-soft-surface rounded-md border';
const technicianTitleClass = 'text-slate-950 dark:text-white';
const technicianMutedClass = 'text-slate-500 dark:text-slate-400';
const technicianBodyClass = 'text-slate-600 dark:text-slate-300';
const technicianSecondaryButton = 'rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 transition hover:border-[#159AFD] hover:text-[#0D0F52] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08] dark:hover:text-white';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [notificationStatus, setNotificationStatus] = useState('');
  const { notifications, unreadCount, error: notificationError, markRead } = useNotifications(user?.role, user?.id, user?.email);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab && requestedTab !== activeTab) setActiveTab(requestedTab);
  }, [activeTab, searchParams]);

  function openTab(tab: string) {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function markNotificationRead(id: string) {
    try {
      await markRead(id);
      setNotificationStatus('Notificação marcada como lida.');
    } catch {
      setNotificationStatus('Não foi possível marcar como lida. Publique as regras atualizadas do Firestore.');
    }
  }

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
      case 'Em Desenvolvimento': return 'bg-blue-50 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300';
      case 'Teste': return 'bg-amber-50 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300';
      case 'Concluído': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300';
      case 'Aberto': return 'bg-red-50 text-red-700 dark:bg-red-400/20 dark:text-red-300';
      case 'Em Andamento': return 'bg-blue-50 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-400/20 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-600 dark:text-red-300';
      case 'Média': return 'text-amber-600 dark:text-amber-300';
      case 'Baixa': return 'text-emerald-600 dark:text-emerald-300';
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={technicianPanelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${technicianMutedClass}`}>Projetos Ativos</p>
              <p className={`text-2xl font-bold ${technicianTitleClass}`}>2</p>
            </div>
            <FolderOpen className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className={technicianPanelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${technicianMutedClass}`}>Tickets Abertos</p>
              <p className={`text-2xl font-bold ${technicianTitleClass}`}>2</p>
            </div>
            <Wrench className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className={technicianPanelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${technicianMutedClass}`}>Horas Trabalhadas</p>
              <p className={`text-2xl font-bold ${technicianTitleClass}`}>77h</p>
            </div>
            <Clock className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
        <div className={technicianPanelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${technicianMutedClass}`}>Taxa de Resolução</p>
              <p className={`text-2xl font-bold ${technicianTitleClass}`}>94%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#159AFD]" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={technicianPanelClass}>
        <h3 className={`mb-4 text-xl font-semibold ${technicianTitleClass}`}>Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-[#159AFD]/20 hover:bg-[#159AFD]/30 rounded-lg transition-colors">
            <Play className="w-5 h-5 text-[#159AFD] mr-2" />
            <span className={technicianTitleClass}>Iniciar Timer</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className={technicianTitleClass}>Marcar Concluído</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-yellow-400 mr-2" />
            <span className={technicianTitleClass}>Novo Ticket</span>
          </button>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className={technicianPanelClass}>
        <h3 className={`mb-4 text-xl font-semibold ${technicianTitleClass}`}>Tarefas de Hoje</h3>
        <div className="space-y-3">
          {[
            { task: 'Analisar logs do sistema IoT', project: 'Sistema IoT Industrial', time: '09:00', status: 'pending' },
            { task: 'Recalibrar sensores de temperatura', project: 'PCB Sensor', time: '14:00', status: 'pending' },
            { task: 'Reunião com cliente TechCorp', project: 'Sistema IoT Industrial', time: '16:00', status: 'scheduled' },
            { task: 'Documentar correções implementadas', project: 'Geral', time: '17:30', status: 'pending' }
          ].map((task, index) => (
            <div key={index} className={`${technicianSoftClass} flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between`}>
              <div className="flex min-w-0 items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  task.status === 'completed' ? 'bg-green-400' : 
                  task.status === 'scheduled' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <div>
                  <p className={technicianTitleClass}>{task.task}</p>
                  <p className={`text-sm ${technicianMutedClass}`}>{task.project}</p>
                </div>
              </div>
              <span className={`text-sm ${technicianMutedClass}`}>{task.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className={`text-2xl font-bold ${technicianTitleClass}`}>Meus Projetos</h3>
        <div className="flex items-center space-x-2">
          <button className="bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] px-4 py-2 rounded-lg transition-colors">
            Filtrar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myProjects.map((project) => (
          <div key={project.id} className={technicianPanelClass}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className={`text-xl font-semibold ${technicianTitleClass}`}>{project.name}</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <p className={`mb-4 ${technicianBodyClass}`}>{project.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${technicianBodyClass}`}>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Cliente
                </span>
                <span>{project.client}</span>
              </div>
              <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${technicianBodyClass}`}>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prazo
                </span>
                <span>{project.deadline}</span>
              </div>
              <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${technicianBodyClass}`}>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Tempo Gasto
                </span>
                <span>{project.timeSpent}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className={`mb-1 flex justify-between text-sm ${technicianMutedClass}`}>
                <span>Progresso</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
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
              <button className={technicianSecondaryButton}>
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
        <h3 className={`text-2xl font-bold ${technicianTitleClass}`}>Roteiro de Reparos</h3>
        <button className="w-full rounded-lg bg-[#159AFD] px-4 py-2 text-white transition-colors hover:bg-[#508AD0] sm:w-auto">
          Novo Ticket
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {repairTickets.map((ticket) => (
          <div key={ticket.id} className={technicianPanelClass}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className={`text-lg font-semibold ${technicianTitleClass}`}>{ticket.title}</h4>
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
                <span className={technicianMutedClass}>Cliente:</span>
                <span className={technicianTitleClass}>{ticket.client}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className={technicianMutedClass}>Projeto:</span>
                <span className={technicianTitleClass}>{ticket.project}</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className={technicianMutedClass}>Criado:</span>
                <span className={technicianTitleClass}>{ticket.created}</span>
              </div>
            </div>
            
            <p className={`mb-4 text-sm ${technicianBodyClass}`}>{ticket.description}</p>
            
            <div className="space-y-2 mb-4">
              <h5 className={`text-sm font-medium ${technicianTitleClass}`}>Etapas do Reparo:</h5>
              {ticket.steps.map((step) => (
                <div key={step.id} className={`${technicianSoftClass} flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:justify-between`}>
                  <div className="flex min-w-0 items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      step.completed ? 'bg-green-400' : 'bg-gray-400'
                    }`}>
                      {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`break-words text-sm ${step.completed ? 'text-slate-400 line-through dark:text-slate-500' : technicianTitleClass}`}>
                      {step.description}
                    </span>
                  </div>
                  <span className={`text-xs ${technicianMutedClass}`}>{step.time}</span>
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
              <button className={`${technicianSecondaryButton} flex-1 text-sm`}>
                Histórico
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Repair Work Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="dashboard-surface max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-md border p-4 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
              <h2 className={`text-xl font-bold sm:text-2xl ${technicianTitleClass}`}>
                Roteiro de Reparo - Ticket #{selectedTicket}
              </h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className={`${technicianMutedClass} hover:text-[#159AFD]`}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Steps */}
              <div>
                <h3 className={`mb-4 text-lg font-semibold ${technicianTitleClass}`}>Etapas do Reparo</h3>
                <div className="space-y-3">
                  {repairTickets.find(t => t.id === selectedTicket)?.steps.map((step) => (
                    <div key={step.id} className={`${technicianSoftClass} p-4`}>
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center">
                          <button className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                            step.completed ? 'bg-green-400' : 'bg-gray-600 hover:bg-[#159AFD]'
                          } transition-colors`}>
                            {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                          </button>
                          <span className={`${step.completed ? 'text-slate-400 line-through dark:text-slate-500' : technicianTitleClass} break-words`}>
                            {step.description}
                          </span>
                        </div>
                        <span className={`text-sm ${technicianMutedClass}`}>{step.time}</span>
                      </div>
                      {!step.completed && (
                        <div className="ml-9 flex space-x-2">
                          <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-3 py-1 rounded text-sm transition-colors">
                            Iniciar
                          </button>
                          <button className={`${technicianSecondaryButton} px-3 py-1 text-sm`}>
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
                <h3 className={`mb-4 text-lg font-semibold ${technicianTitleClass}`}>Documentação</h3>
                <div className="space-y-4">
                  <div className={`${technicianSoftClass} p-4`}>
                    <h4 className={`mb-2 font-medium ${technicianTitleClass}`}>Notas do Técnico</h4>
                    <textarea
                      className="dashboard-control h-32 w-full resize-none rounded-md border p-3"
                      placeholder="Adicione suas observações sobre o reparo..."
                    />
                  </div>
                  
                  <div className={`${technicianSoftClass} p-4`}>
                    <h4 className={`mb-2 font-medium ${technicianTitleClass}`}>Anexar Evidências</h4>
                    <div className="rounded-md border-2 border-dashed border-slate-300 p-6 text-center dark:border-white/15">
                      <Camera className={`mx-auto mb-2 h-8 w-8 ${technicianMutedClass}`} />
                      <p className={`text-sm ${technicianMutedClass}`}>Clique para adicionar fotos ou documentos</p>
                    </div>
                  </div>
                  
                  <div className={`${technicianSoftClass} p-4`}>
                    <h4 className={`mb-2 font-medium ${technicianTitleClass}`}>Tempo Gasto</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Horas"
                        className="dashboard-control flex-1 rounded-md border p-2"
                      />
                      <span className={technicianMutedClass}>:</span>
                      <input
                        type="number"
                        placeholder="Min"
                        className="dashboard-control flex-1 rounded-md border p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => setSelectedTicket(null)}
                className={technicianSecondaryButton}
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
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="technician-dashboard space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold sm:text-3xl ${technicianTitleClass}`}>
              Painel Técnico
            </h1>
            <p className={`mt-1 ${technicianMutedClass}`}>Bem-vindo, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => openTab('notifications')} className={`relative rounded-md p-2 transition-colors hover:bg-[#159AFD]/10 hover:text-[#159AFD] ${technicianMutedClass}`} title="Notificações">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full border-2 border-[#159AFD]"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-surface mobile-scrollbar flex space-x-1 overflow-x-auto rounded-md border p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => openTab(tab.id)}
              className={`flex flex-none items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#159AFD] text-white'
                  : 'text-slate-600 hover:bg-[#159AFD]/10 hover:text-[#0D0F52] dark:text-slate-300 dark:hover:bg-[#159AFD]/20 dark:hover:text-white'
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
              <MessageSquare className={`mx-auto mb-4 h-16 w-16 ${technicianMutedClass}`} />
              <p className={technicianMutedClass}>Sistema de mensagens em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <FileText className={`mx-auto mb-4 h-16 w-16 ${technicianMutedClass}`} />
              <p className={technicianMutedClass}>Relatórios técnicos em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {(notificationStatus || notificationError) && <div className="rounded-md border border-[#159AFD]/30 bg-[#159AFD]/10 p-4 text-sm font-semibold text-sky-700 dark:text-sky-200">{notificationError || notificationStatus}</div>}
              {notifications.length === 0 ? (
                <div className="dashboard-surface rounded-md border py-12 text-center">
                  <Bell className={`mx-auto h-12 w-12 ${technicianMutedClass}`} />
                  <p className={`mt-4 font-bold ${technicianTitleClass}`}>Nenhuma notificação disponível.</p>
                </div>
              ) : notifications.map((item) => (
                <article key={item.id} className="dashboard-surface flex flex-col gap-4 rounded-md border p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold ${technicianTitleClass}`}>{item.title || 'Notificação'}</h3>
                      <span className={`rounded-md px-2 py-1 text-xs font-black ${notificationIsUnread(item, user?.id) ? 'bg-[#159AFD]/20 text-[#159AFD]' : 'bg-emerald-500/15 text-emerald-400'}`}>
                        {notificationIsUnread(item, user?.id) ? 'Nova' : 'Lida'}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm leading-6 ${technicianBodyClass}`}>{item.message || 'Sem mensagem.'}</p>
                  </div>
                  {notificationIsUnread(item, user?.id) && <button type="button" onClick={() => markNotificationRead(item.id)} className="rounded-lg border border-[#159AFD]/30 px-4 py-2 text-sm font-bold text-[#159AFD] transition hover:bg-[#159AFD]/10">Marcar lida</button>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
