import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Carlos Silva',
      company: 'Indústria MetalTech',
      role: 'Gerente de Produção',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      text: 'A ELN Technology transformou nossa linha de produção com soluções IoT inovadoras. Aumentamos a eficiência em 40% e reduzimos custos significativamente.'
    },
    {
      name: 'Ana Costa',
      company: 'TechStart Solutions',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      text: 'Excelente trabalho no desenvolvimento do nosso sistema embarcado. Entrega no prazo, qualidade excepcional e suporte técnico impecável.'
    },
    {
      name: 'Roberto Oliveira',
      company: 'AgroTech Fazendas',
      role: 'Diretor de Tecnologia',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      text: 'O sistema de monitoramento IoT para nossa fazenda superou todas as expectativas. Agora temos controle total sobre irrigação e clima.'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-[#0D0F52]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-gray-400">
            Depoimentos reais de empresas que transformaram seus negócios conosco
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#0D0F52]/30 backdrop-blur-sm p-6 rounded-xl border border-[#159AFD]/20 hover:border-[#159AFD]/40 transition-all"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-[#159AFD] mr-3" />
                <div className="flex">{renderStars(testimonial.rating)}</div>
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-[#159AFD] text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;