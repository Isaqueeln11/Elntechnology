import React from 'react';
import { Bot, Cpu, Database, Radio, Settings, Wifi } from 'lucide-react';

const categories = [
  {
    category: 'Hardware',
    technologies: [
      { name: 'ESP32', icon: Cpu },
      { name: 'Arduino', icon: Settings },
      { name: 'Raspberry Pi', icon: Cpu },
      { name: 'Sensores', icon: Radio },
    ],
  },
  {
    category: 'Conectividade',
    technologies: [
      { name: 'Wi-Fi', icon: Wifi },
      { name: 'Bluetooth', icon: Radio },
      { name: 'MQTT', icon: Database },
      { name: 'APIs', icon: Database },
    ],
  },
  {
    category: 'Automacao',
    technologies: [
      { name: 'Robotica', icon: Bot },
      { name: 'Firmware', icon: Cpu },
      { name: 'Dashboards', icon: Database },
      { name: 'OTA', icon: Wifi },
    ],
  },
];

const TechStack = () => {
  return (
    <section className="relative bg-black/50 py-20">
      <div className="absolute inset-0 bg-sky-500/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#159AFD]">Tecnologia</span>
          <h2 className="mt-3 text-4xl font-bold text-white">Tecnologias e ferramentas</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-400">
            Base tecnica para desenvolver solucoes completas em IoT, robotica e sistemas embarcados.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.category}
              className="rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-6 text-center text-xl font-bold text-white">{category.category}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.technologies.map(({ icon: Icon, name }) => (
                  <div key={name} className="flex items-center gap-3 rounded-md border border-transparent p-3 transition hover:border-[#159AFD]/30 hover:bg-[#159AFD]/10">
                    <Icon className="h-5 w-5 text-[#159AFD]" />
                    <span className="text-sm text-gray-300">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
