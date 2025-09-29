import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Quais tipos de projetos IoT vocês desenvolvem?',
      answer: 'Desenvolvemos uma ampla gama de projetos IoT, incluindo sistemas de monitoramento industrial, automação residencial, agricultura inteligente, sensores ambientais, e soluções de conectividade para diversos setores. Cada projeto é personalizado conforme as necessidades específicas do cliente.'
    },
    {
      question: 'Quanto tempo leva para desenvolver um projeto de robótica?',
      answer: 'O tempo de desenvolvimento varia conforme a complexidade do projeto. Projetos simples podem levar de 2-4 semanas, enquanto sistemas mais complexos podem levar de 2-6 meses. Fornecemos um cronograma detalhado após a análise inicial dos requisitos.'
    },
    {
      question: 'Vocês oferecem suporte técnico após a entrega?',
      answer: 'Sim, oferecemos suporte técnico completo por 12 meses após a entrega, incluindo correções de bugs, atualizações de firmware e suporte para dúvidas técnicas. Também oferecemos contratos de manutenção estendida para projetos críticos.'
    },
    {
      question: 'É possível desenvolver protótipos antes do projeto final?',
      answer: 'Absolutamente! Recomendamos sempre começar com protótipos para validar conceitos e funcionalidades. Oferecemos prototipagem rápida em 24-48h para PCBs simples e protótipos funcionais em 1-2 semanas para sistemas completos.'
    },
    {
      question: 'Quais são os custos típicos dos projetos?',
      answer: 'Os custos variam amplamente baseados na complexidade, componentes utilizados e prazo de entrega. Projetos simples começam em R$ 5.000, enquanto sistemas industriais complexos podem variar de R$ 50.000 a R$ 500.000. Fornecemos orçamentos detalhados sem compromisso.'
    },
    {
      question: 'Vocês trabalham com empresas de outros estados?',
      answer: 'Sim, atendemos clientes em todo o Brasil. Utilizamos ferramentas de comunicação remota para acompanhamento de projetos e podemos realizar visitas técnicas quando necessário. A maioria dos nossos projetos pode ser desenvolvida remotamente.'
    },
    {
      question: 'Que tipo de treinamento vocês oferecem?',
      answer: 'Oferecemos treinamentos personalizados em IoT, robótica, programação de microcontroladores e desenvolvimento de PCBs. Os treinamentos podem ser presenciais ou online, adaptados ao nível técnico da equipe e às necessidades específicas da empresa.'
    },
    {
      question: 'Como garantem a qualidade dos projetos?',
      answer: 'Seguimos rigorosos processos de controle de qualidade, incluindo testes automatizados, validação em ambiente real, documentação completa e revisões técnicas em cada etapa. Todos os projetos passam por testes extensivos antes da entrega final.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-[#159AFD] mr-3" />
            <h2 className="text-3xl font-bold text-white">Perguntas Frequentes</h2>
          </div>
          <p className="text-gray-400">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#0D0F52]/30 backdrop-blur-sm rounded-xl border border-[#159AFD]/20 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#0D0F52]/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#159AFD] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#159AFD] flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-[#159AFD]/20 pt-4">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Não encontrou a resposta que procurava?
          </p>
          <a
            href="mailto:elntechnologyy@gmail.com"
            className="inline-block bg-[#159AFD] hover:bg-[#508AD0] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Entre em Contato
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;