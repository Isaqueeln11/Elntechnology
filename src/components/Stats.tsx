import React from 'react';
import { Users, Award, Clock, Zap } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      number: '50+',
      label: 'Projetos Entregues',
      description: 'Soluções IoT e robótica implementadas'
    },
    {
      icon: Award,
      number: '98%',
      label: 'Satisfação do Cliente',
      description: 'Taxa de aprovação dos projetos'
    },
    {
      icon: Clock,
      number: '5+',
      label: 'Anos de Experiência',
      description: 'Especialização em tecnologia'
    },
    {
      icon: Zap,
      number: '24/7',
      label: 'Suporte Técnico',
      description: 'Disponibilidade para emergências'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#159AFD] via-[#159AFD] to-[#508AD0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 mb-6">
            <span className="text-white font-semibold text-sm uppercase tracking-wider">Resultados</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Números que Falam por Si
          </h2>
          <p className="text-white/90 text-lg">
            Resultados comprovados em projetos de IoT e robótica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"></div>
              <stat.icon className="w-14 h-14 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-5xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-white mb-3">
                {stat.label}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {stat.description}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Background animated elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      </div>
    </section>
  );
};

export default Stats;