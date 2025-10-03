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
    <section className="py-20 bg-gradient-to-b from-gray-800/50 to-[#0D0F52]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="inline-block bg-[#159AFD]/10 backdrop-blur-sm px-6 py-2 rounded-full border border-[#159AFD]/30 mb-6">
              <span className="text-[#159AFD] font-semibold text-sm uppercase tracking-wider">Conteúdo</span>
            </div>
          </div>
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-[#159AFD] mr-3" />
            <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Blog & Insights</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Artigos técnicos e insights sobre as últimas tendências em IoT e robótica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="group bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#159AFD]/30 hover:border-[#159AFD]/60 transition-all duration-500 transform hover:-translate-y-2 relative"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#159AFD]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-[#159AFD]/30">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F52]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} de leitura</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#159AFD] transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <button className="flex items-center text-[#159AFD] hover:text-[#508AD0] font-semibold transition-all duration-300 group-hover:translate-x-2">
                  Ler mais
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#159AFD] to-[#508AD0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#159AFD] to-[#508AD0] hover:from-[#508AD0] hover:to-[#159AFD] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Ver Todos os Artigos
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23159AFD" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E')] opacity-30"></div>
      </div>
    </section>
  );
};

export default BlogPreview;