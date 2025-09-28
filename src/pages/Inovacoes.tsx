import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Rocket, Brain, Eye, Zap, Calendar, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Inovacoes() {
  const navigate = useNavigate();
  const [selectedInnovation, setSelectedInnovation] = useState<number | null>(null);

  const innovations = [
    {
      title: 'IA Embarcada em Microcontroladores',
      category: 'Inteligência Artificial',
      icon: Brain,
      status: 'Em Desenvolvimento',
      description: 'Implementação de algoritmos de machine learning diretamente em microcontroladores de baixo consumo',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600&h=300',
      details: {
        problema: 'Necessidade de processamento inteligente em dispositivos IoT sem dependência de conectividade',
        solucao: 'Desenvolvimento de modelos de IA otimizados para rodar em ESP32, Arduino e similares',
        tecnologias: ['TensorFlow Lite', 'Edge Impulse', 'ESP32-S3', 'Quantização de modelos'],
        aplicacoes: ['Reconhecimento de padrões', 'Detecção de anomalias', 'Classificação de dados', 'Predição local'],
        impacto: 'Redução de 90% na latência e 80% no consumo de dados',
        timeline: 'Q2 2024 - Protótipo funcional'
      }
    },
    {
      title: 'Sistema de Visão Computacional Distribuída',
      category: 'Computer Vision',
      icon: Eye,
      status: 'Protótipo',
      description: 'Rede de câmeras inteligentes que processam imagens localmente e compartilham insights',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=600&h=300',
      details: {
        problema: 'Limitações de largura de banda e privacidade em sistemas de vigilância tradicionais',
        solucao: 'Processamento distribuído com IA local e comunicação apenas de metadados',
        tecnologias: ['OpenCV', 'YOLO', 'Raspberry Pi 4', 'Edge Computing', 'MQTT'],
        aplicacoes: ['Segurança industrial', 'Monitoramento de tráfego', 'Controle de qualidade', 'Análise comportamental'],
        impacto: 'Redução de 95% no tráfego de rede e conformidade total com LGPD',
        timeline: 'Q3 2024 - Testes piloto'
      }
    },
    {
      title: 'Mesh Network Auto-Organizável',
      category: 'Conectividade',
      icon: Zap,
      status: 'Pesquisa',
      description: 'Protocolo de comunicação que cria redes mesh automaticamente entre dispositivos IoT',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600&h=300',
      details: {
        problema: 'Dificuldade de configuração e manutenção de redes IoT em ambientes complexos',
        solucao: 'Protocolo proprietário que permite auto-descoberta e auto-configuração de dispositivos',
        tecnologias: ['LoRa', 'ESP-NOW', 'Algoritmos genéticos', 'Protocolos mesh', 'Criptografia AES'],
        aplicacoes: ['Agricultura inteligente', 'Cidades inteligentes', 'Monitoramento ambiental', 'Emergências'],
        impacto: 'Redução de 70% no tempo de implantação e 50% nos custos de manutenção',
        timeline: 'Q4 2024 - Prova de conceito'
      }
    },
    {
      title: 'Robô Colaborativo Modular',
      category: 'Robótica',
      icon: Rocket,
      status: 'Conceito',
      description: 'Sistema robótico modular que se adapta automaticamente a diferentes tarefas industriais',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600&h=300',
      details: {
        problema: 'Rigidez dos sistemas robóticos atuais e alto custo de reconfiguração',
        solucao: 'Módulos intercambiáveis com IA para reconhecimento automático de configuração',
        tecnologias: ['ROS 2', 'Visão computacional', 'Aprendizado por reforço', 'Conectores magnéticos'],
        aplicacoes: ['Linha de montagem', 'Logística', 'Agricultura', 'Laboratórios'],
        impacto: 'Redução de 60% no tempo de reconfiguração e aumento de 40% na flexibilidade',
        timeline: 'Q1 2025 - Desenvolvimento inicial'
      }
    }
  ];

  const researchAreas = [
    {
      area: 'Quantum Computing',
      description: 'Pesquisa em computação quântica aplicada a IoT',
      progress: 15
    },
    {
      area: 'Neuromorphic Chips',
      description: 'Chips inspirados no cérebro humano para IA eficiente',
      progress: 30
    },
    {
      area: 'Energy Harvesting',
      description: 'Coleta de energia do ambiente para dispositivos autônomos',
      progress: 65
    },
    {
      area: 'Bio-Sensors',
      description: 'Sensores biológicos para monitoramento de saúde',
      progress: 45
    }
  ];

  const timeline = [
    {
      quarter: 'Q1 2024',
      achievements: [
        'Lançamento do primeiro protótipo de IA embarcada',
        'Parceria com universidade para pesquisa em quantum computing'
      ]
    },
    {
      quarter: 'Q2 2024',
      achievements: [
        'Sistema de visão computacional em testes',
        'Publicação de artigo sobre energy harvesting'
      ]
    },
    {
      quarter: 'Q3 2024',
      achievements: [
        'Mesh network em fase de validação',
        'Início dos testes de bio-sensores'
      ]
    },
    {
      quarter: 'Q4 2024',
      achievements: [
        'Robô colaborativo - primeira demonstração',
        'Expansão do laboratório de P&D'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Desenvolvimento': return 'bg-blue-500';
      case 'Protótipo': return 'bg-green-500';
      case 'Pesquisa': return 'bg-yellow-500';
      case 'Conceito': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0F52] to-black">
      <div className="p-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-300 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
        
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="w-16 h-16 text-[#159AFD] mr-4" />
              <h1 className="text-5xl font-bold text-white">Inovações & P&D</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explorando as fronteiras da tecnologia com pesquisa e desenvolvimento em IA, IoT, robótica e 
              computação de borda. Criando o futuro da tecnologia hoje.
            </p>
          </div>

          {/* Innovation Projects */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Projetos de Inovação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {innovations.map((innovation, index) => (
                <div key={index} className="bg-[#0D0F52]/30 backdrop-blur-sm rounded-xl overflow-hidden border border-[#159AFD]/20 hover:border-[#159AFD]/40 transition-all group">
                  <div className="relative">
                    <img 
                      src={innovation.image} 
                      alt={innovation.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="bg-[#159AFD] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {innovation.category}
                      </span>
                      <span className={`${getStatusColor(innovation.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {innovation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <innovation.icon className="w-6 h-6 text-[#159AFD] mr-2" />
                      <h3 className="text-xl font-semibold text-white">{innovation.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{innovation.description}</p>
                    <button 
                      onClick={() => setSelectedInnovation(index)}
                      className="w-full bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Áreas de Pesquisa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchAreas.map((area, index) => (
                <div key={index} className="bg-[#0D0F52]/30 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/20">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-white">{area.area}</h3>
                    <span className="text-[#159AFD] font-bold">{area.progress}%</span>
                  </div>
                  <p className="text-gray-300 mb-4">{area.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#159AFD] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${area.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Roadmap de Inovação</h2>
            <div className="space-y-8">
              {timeline.map((period, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-4 h-4 bg-[#159AFD] rounded-full" />
                    {index < timeline.length - 1 && <div className="w-0.5 h-16 bg-[#159AFD]/30 mt-2" />}
                  </div>
                  <div className="bg-[#0D0F52]/30 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/20 flex-1">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-[#159AFD] mr-2" />
                      <h3 className="text-xl font-semibold text-white">{period.quarter}</h3>
                    </div>
                    <ul className="space-y-2">
                      {period.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lab & Partnership */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0D0F52]/30 backdrop-blur-sm p-8 rounded-xl border border-[#159AFD]/20">
                <h3 className="text-2xl font-bold text-white mb-4">Laboratório de P&D</h3>
                <p className="text-gray-300 mb-6">
                  Nosso laboratório está equipado com as mais modernas ferramentas para prototipagem, 
                  testes e desenvolvimento de tecnologias emergentes.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    Impressoras 3D profissionais
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    Estação de soldagem SMD
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    Analisadores de espectro
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    Cluster de computação GPU
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0D0F52]/30 backdrop-blur-sm p-8 rounded-xl border border-[#159AFD]/20">
                <h3 className="text-2xl font-bold text-white mb-4">Parcerias Acadêmicas</h3>
                <p className="text-gray-300 mb-6">
                  Colaboramos com universidades e centros de pesquisa para acelerar a inovação 
                  e formar a próxima geração de tecnólogos.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    UFPE - Universidade Federal de Pernambuco
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    CESAR - Centro de Estudos Avançados
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    Porto Digital - Ecossistema de Inovação
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3" />
                    FACEPE - Fundação de Amparo à Ciência
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-[#159AFD]/20 to-[#508AD0]/20 rounded-xl p-12 border border-[#159AFD]/20">
            <h2 className="text-3xl font-bold text-white mb-4">Interessado em Colaborar?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Estamos sempre abertos a parcerias, colaborações acadêmicas e projetos de pesquisa conjunta. 
              Vamos inovar juntos!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/iniciar-projeto')}
                className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Propor Colaboração
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-transparent border border-[#159AFD] text-[#159AFD] hover:bg-[#159AFD] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo Lab
              </button>
            </div>
          </section>
        </div>

        {/* Innovation Details Modal */}
        {selectedInnovation !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#0D0F52] rounded-xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#159AFD]/20">
              <div className="flex items-center mb-6">
                {(() => {
                  const InnovationIcon = innovations[selectedInnovation].icon;
                  return <InnovationIcon className="w-8 h-8 text-[#159AFD] mr-3" />;
                })()}
                <h2 className="text-3xl font-bold text-white">
                  {innovations[selectedInnovation].title}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Problema</h3>
                  <p className="text-gray-300 mb-6">{innovations[selectedInnovation].details.problema}</p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Nossa Solução</h3>
                  <p className="text-gray-300 mb-6">{innovations[selectedInnovation].details.solucao}</p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Impacto Esperado</h3>
                  <p className="text-green-400 font-semibold">{innovations[selectedInnovation].details.impacto}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Tecnologias</h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {innovations[selectedInnovation].details.tecnologias.map((tech, idx) => (
                      <div key={idx} className="bg-black/20 px-3 py-2 rounded text-gray-300 text-sm text-center">
                        {tech}
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Aplicações</h3>
                  <ul className="space-y-2 mb-6">
                    {innovations[selectedInnovation].details.aplicacoes.map((app, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-2" />
                        {app}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-[#159AFD] mr-2" />
                      <span className="text-white font-semibold">{innovations[selectedInnovation].details.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setSelectedInnovation(null)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setSelectedInnovation(null);
                    navigate('/iniciar-projeto');
                  }}
                  className="bg-[#159AFD] text-white px-6 py-2 rounded-lg hover:bg-[#508AD0] transition-colors flex items-center"
                >
                  Colaborar neste Projeto
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}