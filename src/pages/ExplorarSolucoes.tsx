import React, { useState } from 'react';
import { ArrowLeft, Notebook as Robot, Cpu, Wifi, ChevronRight, Users, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExplorarSolucoes() {
  const navigate = useNavigate();
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  const solucoes = [
    {
      title: 'Automação Industrial',
      icon: Robot,
      description: 'Soluções completas para automação de processos industriais',
      items: [
        'Controle de produção',
        'Monitoramento em tempo real',
        'Integração com sistemas existentes',
        'Manutenção preditiva'
      ],
      detalhes: {
        descricao: 'Nossa solução de automação industrial oferece controle total sobre seus processos produtivos, com monitoramento em tempo real, integração com sistemas existentes e manutenção preditiva para maximizar a eficiência operacional.',
        beneficios: [
          'Redução de custos operacionais',
          'Aumento da produtividade',
          'Minimização de erros humanos',
          'Maior controle de qualidade'
        ],
        prazoMedio: '3-6 meses',
        investimentoMedio: 'R$ 100.000 - R$ 500.000',
        clientesAlvo: 'Indústrias de manufatura, processos contínuos, montadoras'
      }
    },
    {
      title: 'IoT Empresarial',
      icon: Wifi,
      description: 'Sistemas IoT para otimização de negócios',
      items: [
        'Sensoriamento remoto',
        'Análise de dados em tempo real',
        'Dashboards personalizados',
        'Alertas inteligentes'
      ],
      detalhes: {
        descricao: 'Transforme sua empresa com nossa solução IoT empresarial. Monitore, analise e otimize suas operações com dados em tempo real, dashboards personalizados e alertas inteligentes.',
        beneficios: [
          'Tomada de decisão baseada em dados',
          'Monitoramento remoto 24/7',
          'Otimização de recursos',
          'Redução de desperdícios'
        ],
        prazoMedio: '2-4 meses',
        investimentoMedio: 'R$ 50.000 - R$ 200.000',
        clientesAlvo: 'Empresas de médio e grande porte, indústrias, varejo'
      }
    },
    {
      title: 'Sistemas Embarcados',
      icon: Cpu,
      description: 'Desenvolvimento de hardware e software especializado',
      items: [
        'Prototipagem rápida',
        'Firmware customizado',
        'Certificação de produtos',
        'Suporte técnico especializado'
      ],
      detalhes: {
        descricao: 'Desenvolvemos sistemas embarcados completos, desde a prototipagem até a certificação final do produto, com suporte técnico especializado em todas as etapas do projeto.',
        beneficios: [
          'Soluções personalizadas',
          'Alta performance',
          'Baixo consumo de energia',
          'Suporte completo ao ciclo de vida'
        ],
        prazoMedio: '4-8 meses',
        investimentoMedio: 'R$ 80.000 - R$ 300.000',
        clientesAlvo: 'Fabricantes de equipamentos, startups de hardware, empresas de tecnologia'
      }
    }
  ];

  const handleSaibaMais = (index: number) => {
    setSelectedSolution(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-300 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Nossas Soluções</h1>
        <p className="text-gray-400 mb-8">Explore nossas soluções tecnológicas e encontre a ideal para seu negócio</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solucoes.map((solucao, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-all transform hover:-translate-y-1">
              <solucao.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">{solucao.title}</h2>
              <p className="text-gray-300 mb-6">{solucao.description}</p>
              <ul className="space-y-2 mb-6">
                {solucao.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSaibaMais(index)}
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                Saiba mais
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal de detalhes */}
        {selectedSolution !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                {solucoes[selectedSolution].title}
              </h2>
              
              <p className="text-gray-300 mb-8">
                {solucoes[selectedSolution].detalhes.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Benefícios
                  </h3>
                  <ul className="space-y-2">
                    {solucoes[selectedSolution].detalhes.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-2" />
                      Prazo Médio
                    </h3>
                    <p className="text-gray-300">{solucoes[selectedSolution].detalhes.prazoMedio}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                      Investimento Médio
                    </h3>
                    <p className="text-gray-300">{solucoes[selectedSolution].detalhes.investimentoMedio}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      Clientes-Alvo
                    </h3>
                    <p className="text-gray-300">{solucoes[selectedSolution].detalhes.clientesAlvo}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setSelectedSolution(null);
                    navigate('/iniciar-projeto');
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  Iniciar Projeto
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}