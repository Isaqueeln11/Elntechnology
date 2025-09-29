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
    <section className="py-20 bg-[#159AFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Números que Falam por Si
          </h2>
          <p className="text-white/90">
            Resultados comprovados em projetos de IoT e robótica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <stat.icon className="w-12 h-12 text-white mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <p className="text-white/80 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;