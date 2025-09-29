import React from 'react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

const BlogPreview = () => {
  const blogPosts = [
    {
      title: 'O Futuro da IoT na Indústria 4.0',
      excerpt: 'Como a Internet das Coisas está revolucionando os processos industriais e criando fábricas inteligentes.',
      date: '15 de Janeiro, 2024',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=250',
      category: 'IoT Industrial'
    },
    {
      title: 'Robótica Colaborativa: Humanos e Máquinas Trabalhando Juntos',
      excerpt: 'Explorando como os robôs colaborativos estão transformando ambientes de trabalho e aumentando a produtividade.',
      date: '10 de Janeiro, 2024',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400&h=250',
      category: 'Robótica'
    },
    {
      title: 'Desenvolvimento de PCBs: Melhores Práticas para 2024',
      excerpt: 'Dicas essenciais para criar placas de circuito impresso eficientes e confiáveis em projetos modernos.',
      date: '5 de Janeiro, 2024',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=250',
      category: 'PCB Design'
    }
  ];

  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[#159AFD] mr-3" />
            <h2 className="text-3xl font-bold text-white">Blog & Insights</h2>
          </div>
          <p className="text-gray-400">
            Artigos técnicos e insights sobre as últimas tendências em IoT e robótica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="bg-[#0D0F52]/30 backdrop-blur-sm rounded-xl overflow-hidden border border-[#159AFD]/20 hover:border-[#159AFD]/40 transition-all group"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#159AFD] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} de leitura</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#159AFD] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <button className="flex items-center text-[#159AFD] hover:text-[#508AD0] font-semibold transition-colors">
                  Ler mais
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
            Ver Todos os Artigos
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;