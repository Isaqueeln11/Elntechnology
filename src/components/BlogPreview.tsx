import React from 'react';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';

const blogPosts = [
  {
    title: 'O futuro da IoT na industria 4.0',
    excerpt: 'Como a Internet das Coisas esta transformando processos industriais e criando fabricas inteligentes.',
    date: '15 de janeiro, 2024',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=250',
    category: 'IoT Industrial',
  },
  {
    title: 'Robotica colaborativa',
    excerpt: 'Como robos colaborativos ajudam equipes a trabalhar com mais precisao, seguranca e produtividade.',
    date: '10 de janeiro, 2024',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400&h=250',
    category: 'Robotica',
  },
  {
    title: 'Boas praticas para PCBs',
    excerpt: 'Dicas essenciais para criar placas de circuito impresso eficientes e confiaveis em projetos modernos.',
    date: '5 de janeiro, 2024',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=250',
    category: 'PCB Design',
  },
];

const BlogPreview = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-800/50 to-[#0D0F52]/30 py-20">
      <div className="absolute inset-0 bg-sky-500/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center">
            <BookOpen className="mr-3 h-8 w-8 text-[#159AFD]" />
            <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent">
              Blog & Insights
            </h2>
          </div>
          <p className="text-lg text-gray-400">
            Artigos tecnicos e ideias sobre IoT, robotica e sistemas embarcados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="group relative overflow-hidden rounded-xl border border-[#159AFD]/30 bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#159AFD]/60"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-[#159AFD]/30 bg-[#159AFD]/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center text-sm text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{post.date}</span>
                  <span className="mx-2">-</span>
                  <span>{post.readTime} de leitura</span>
                </div>

                <h3 className="mb-4 text-xl font-semibold leading-tight text-white transition-colors group-hover:text-[#159AFD]">
                  {post.title}
                </h3>
                <p className="mb-6 leading-relaxed text-gray-300">{post.excerpt}</p>

                <button className="flex items-center font-semibold text-[#159AFD] transition-all duration-300 hover:text-[#508AD0] group-hover:translate-x-2">
                  Ler mais
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
