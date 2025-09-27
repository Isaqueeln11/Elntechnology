import React, { useState } from 'react';
import { ArrowLeft, Cpu, Zap, Shield, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PCBs() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const pcbServices = [
    {
      title: 'Design de PCB Personalizado',
      icon: Layers,
      description: 'Desenvolvimento completo de placas de circuito impresso sob medida',
      features: [
        'Esquemático profissional',
        'Layout otimizado',
        'Análise de integridade de sinal',
        'Compatibilidade EMC/EMI'
      ],
      details: {
        processo: 'Utilizamos ferramentas profissionais como Altium Designer e KiCad para criar PCBs de alta qualidade, desde o conceito até a produção.',
        aplicacoes: ['Dispositivos IoT', 'Sistemas embarcados', 'Automação industrial', 'Eletrônicos de consumo'],
        especificacoes: ['2-16 camadas', 'Via-in-pad', 'HDI (High Density Interconnect)', 'Flex e Rigid-Flex'],
        prazo: '2-4 semanas',
        preco: 'A partir de R$ 2.500'
      }
    },
    {
      title: 'Prototipagem Rápida',
      icon: Zap,
      description: 'Fabricação rápida de protótipos para validação de conceitos',
      features: [
        'Fabricação em 24-48h',
        'Montagem SMD/THT',
        'Testes funcionais',
        'Documentação completa'
      ],
      details: {
        processo: 'Serviço de prototipagem express para acelerar o desenvolvimento de produtos, com fabricação local e internacional.',
        aplicacoes: ['Validação de conceitos', 'Testes de funcionalidade', 'Demonstrações', 'Desenvolvimento iterativo'],
        especificacoes: ['PCB simples e dupla face', 'Componentes SMD 0402+', 'BGA e QFN', 'Soldagem por refusão'],
        prazo: '1-3 dias',
        preco: 'A partir de R$ 150'
      }
    },
    {
      title: 'Análise e Otimização',
      icon: Shield,
      description: 'Análise técnica e otimização de designs existentes',
      features: [
        'Análise DRC/ERC',
        'Simulação térmica',
        'Otimização de custo',
        'Melhoria de performance'
      ],
      details: {
        processo: 'Revisão completa de designs existentes com foco em otimização de performance, redução de custos e melhoria da confiabilidade.',
        aplicacoes: ['Redesign de produtos', 'Redução de custos', 'Melhoria de performance', 'Correção de problemas'],
        especificacoes: ['Análise de integridade de sinal', 'Simulação SPICE', 'Análise térmica', 'Otimização de roteamento'],
        prazo: '1-2 semanas',
        preco: 'A partir de R$ 1.200'
      }
    }
  ];

  const technologies = [
    { name: 'Altium Designer', category: 'Design' },
    { name: 'KiCad', category: 'Design' },
    { name: 'SPICE Simulation', category: 'Simulação' },
    { name: 'Thermal Analysis', category: 'Análise' },
    { name: 'EMC/EMI Testing', category: 'Testes' },
    { name: 'Pick & Place', category: 'Montagem' }
  ];

  const projects = [
    {
      title: 'Controlador IoT Industrial',
      description: 'PCB de 4 camadas para monitoramento industrial com conectividade WiFi e sensores múltiplos',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=250',
      specs: ['4 camadas', '85x60mm', '32 componentes SMD', 'WiFi integrado']
    },
    {
      title: 'Módulo de Potência',
      description: 'Design de PCB para controle de motores com dissipação térmica otimizada',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=250',
      specs: ['6 camadas', '100x80mm', 'Corrente: 20A', 'Dissipação térmica']
    },
    {
      title: 'Sensor Wireless',
      description: 'PCB compacto para sensor IoT com baixo consumo de energia e comunicação LoRa',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400&h=250',
      specs: ['2 camadas', '25x35mm', 'Ultra baixo consumo', 'LoRa 915MHz']
    }
  ];

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
              <Cpu className="w-16 h-16 text-[#159AFD] mr-4" />
              <h1 className="text-5xl font-bold text-white">Desenvolvimento de PCBs</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Especialistas em design e fabricação de placas de circuito impresso (PCB) para projetos de IoT, 
              robótica e sistemas embarcados. Da concepção à produção, oferecemos soluções completas.
            </p>
          </div>

          {/* Services Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Nossos Serviços de PCB</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pcbServices.map((service, index) => (
                <div key={index} className="bg-[#0D0F52]/30 backdrop-blur-sm rounded-xl p-6 border border-[#159AFD]/20 hover:border-[#159AFD]/40 transition-all">
                  <service.icon className="w-12 h-12 text-[#159AFD] mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setSelectedService(index)}
                    className="w-full bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-[#159AFD] font-semibold py-2 rounded-lg transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Technologies Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Tecnologias Utilizadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-[#0D0F52]/30 backdrop-blur-sm p-4 rounded-lg text-center border border-[#159AFD]/20">
                  <h4 className="text-white font-semibold text-sm">{tech.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{tech.category}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Showcase */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Projetos Realizados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-[#0D0F52]/30 backdrop-blur-sm rounded-xl overflow-hidden border border-[#159AFD]/20 hover:border-[#159AFD]/40 transition-all group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {project.specs.map((spec, idx) => (
                        <div key={idx} className="bg-black/20 px-2 py-1 rounded text-gray-400 text-sm text-center">
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-[#159AFD]/10 rounded-xl p-12 border border-[#159AFD]/20">
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para Desenvolver seu PCB?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para transformar sua ideia em uma placa de circuito impresso profissional. 
              Entre em contato para discutir seu projeto.
            </p>
            <button 
              onClick={() => navigate('/iniciar-projeto')}
              className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Iniciar Projeto de PCB
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </section>
        </div>

        {/* Service Details Modal */}
        {selectedService !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#0D0F52] rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#159AFD]/20">
              <h2 className="text-3xl font-bold text-white mb-6">
                {pcbServices[selectedService].title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Processo</h3>
                  <p className="text-gray-300 mb-6">{pcbServices[selectedService].details.processo}</p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Aplicações</h3>
                  <ul className="space-y-2 mb-6">
                    {pcbServices[selectedService].details.aplicacoes.map((app, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-2" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Especificações</h3>
                  <ul className="space-y-2 mb-6">
                    {pcbServices[selectedService].details.especificacoes.map((spec, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Prazo:</span>
                      <span className="text-white font-semibold">{pcbServices[selectedService].details.prazo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Preço:</span>
                      <span className="text-[#159AFD] font-semibold">{pcbServices[selectedService].details.preco}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    navigate('/iniciar-projeto');
                  }}
                  className="bg-[#159AFD] text-white px-6 py-2 rounded-lg hover:bg-[#508AD0] transition-colors flex items-center"
                >
                  Solicitar Orçamento
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