import React from 'react';
import { ArrowLeft, Notebook as Robot, Cpu, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExplorarSolucoes() {
  const navigate = useNavigate();

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
      ]
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
      ]
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
      ]
    }
  ];

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
        <h1 className="text-4xl font-bold text-white mb-8">Nossas Soluções</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solucoes.map((solucao, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
              <solucao.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">{solucao.title}</h2>
              <p className="text-gray-300 mb-6">{solucao.description}</p>
              <ul className="space-y-2">
                {solucao.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold py-2 rounded-lg transition-colors">
                Saiba mais
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}