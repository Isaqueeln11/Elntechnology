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
    <section id="tech-stack" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Stack Tecnológico
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologias e ferramentas que utilizo para desenvolver soluções completas em IoT e sistemas embarcados
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {category.category}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <tech.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">{tech.name}</span>
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