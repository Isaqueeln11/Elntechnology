import React from 'react';
import { Code, Cpu, Wifi, Zap, Wrench, Layers, Activity, Thermometer, Radio, Bluetooth, MessageSquare, Cable, BarChart, Box, Settings } from 'lucide-react';

const TechStack = () => {
  const techCategories = [
    {
      category: 'Hardware',
      technologies: [
        { name: 'Arduino', icon: Cpu },
        { name: 'Raspberry Pi', icon: Cpu },
        { name: 'ESP32/ESP8266', icon: Wifi },
        { name: 'STM32', icon: Cpu },
        { name: 'Sensores IoT', icon: Zap },
        { name: 'Módulos RF', icon: Radio }
      ]
    },
    {
      category: 'Software',
      technologies: [
        { name: 'C/C++', icon: Code },
        { name: 'Python', icon: Code },
        { name: 'JavaScript', icon: Code },
        { name: 'MicroPython', icon: Code },
        { name: 'Arduino IDE', icon: Wrench },
        { name: 'PlatformIO', icon: Wrench }
      ]
    },
    {
      category: 'PCB Design',
      technologies: [
        { name: 'Altium Designer', icon: Layers },
        { name: 'KiCad', icon: Layers },
        { name: 'Eagle CAD', icon: Layers },
        { name: 'Proteus', icon: Layers },
        { name: 'SPICE Simulation', icon: Activity },
        { name: 'Thermal Analysis', icon: Thermometer }
      ]
    },
    {
      category: 'Comunicação',
      technologies: [
        { name: 'LoRa/LoRaWAN', icon: Radio },
        { name: 'WiFi', icon: Wifi },
        { name: 'Bluetooth', icon: Bluetooth },
        { name: 'Zigbee', icon: Radio },
        { name: 'MQTT', icon: MessageSquare },
        { name: 'Modbus', icon: Cable }
      ]
    },
    {
      category: 'Ferramentas',
      technologies: [
        { name: 'Oscilloscópio', icon: Activity },
        { name: 'Multímetro', icon: Zap },
        { name: 'Analisador Lógico', icon: BarChart },
        { name: 'Soldagem SMD', icon: Wrench },
        { name: 'Impressora 3D', icon: Box },
        { name: 'Bancada de Testes', icon: Settings }
      ]
    }
  ];

  return (
    <section id="tech-stack" className="py-20 bg-gradient-to-b from-black/50 to-[#0D0F52]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#159AFD]/10 backdrop-blur-sm px-6 py-2 rounded-full border border-[#159AFD]/30 mb-6">
            <span className="text-[#159AFD] font-semibold text-sm uppercase tracking-wider">Tecnologia</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Tecnologias e Ferramentas
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tecnologias e ferramentas que utilizamos para desenvolver soluções completas em IoT, robótica e sistemas embarcados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="group bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#159AFD]/30 hover:border-[#159AFD]/60 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#159AFD]/20 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold text-white mb-6 text-center group-hover:text-[#159AFD] transition-colors">
                {category.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#159AFD]/10 transition-all duration-300 border border-transparent hover:border-[#159AFD]/30">
                    <tech.icon className="w-5 h-5 text-[#159AFD] group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{tech.name}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#159AFD] to-[#508AD0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2523159AFD\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>
    </section>
  );
};

export default TechStack;