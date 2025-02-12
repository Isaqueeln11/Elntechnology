import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Notebook as Robot,
  BrainCircuit as Circuit,
  Lightbulb,
  Wifi,
  BookOpen,
  Ship as ChipIcon,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import IniciarProjeto from './pages/IniciarProjeto';
import ExplorarSolucoes from './pages/ExplorarSolucoes';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img
                src="/Eln technology.png"
                alt="ELN Technology Logo"
                className="w-16 h-16 object-contain"
              />
              <span className="text-2xl font-bold text-white">
                ELN Technology
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#servicos"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Serviços
              </a>
              <a
                href="#projetos"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Projetos
              </a>
              <a
                href="#sobre"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contato
              </a>
              <Link
                to="/explorar-solucoes"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Explorar Soluções
              </Link>
              <Link
                to="/iniciar-projeto"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Iniciar Projeto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Inovação em
            <span className="text-blue-500"> IoT e Robótica</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Desenvolvemos soluções avançadas em Internet das Coisas (IoT),
            robótica e sistemas inteligentes. Transformando ideias em realidade
            através da tecnologia.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleNavigate('/iniciar-projeto')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Iniciar Projeto
            </button>
            <button
              onClick={() => handleNavigate('/explorar-solucoes')}
              className="border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explorar Soluções
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
      </header>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Nossas Especialidades
            </h2>
            <p className="text-gray-400">
              Soluções inovadoras em IoT, robótica e tecnologia educacional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Robot,
                title: 'Robótica Avançada',
                desc: 'Desenvolvimento de sistemas robóticos e automação industrial',
              },
              {
                icon: Wifi,
                title: 'Soluções IoT',
                desc: 'Sistemas conectados e monitoramento remoto',
              },
              {
                icon: ChipIcon,
                title: 'Sistemas Embarcados',
                desc: 'Desenvolvimento de hardware e firmware customizado',
              },
              {
                icon: BookOpen,
                title: 'Educação Tecnológica',
                desc: 'Cursos e treinamentos em robótica e IoT',
              },
              {
                icon: Cpu,
                title: 'Prototipagem',
                desc: 'Criação rápida de protótipos e MVPs',
              },
              {
                icon: Lightbulb,
                title: 'Consultoria',
                desc: 'Assessoria em projetos tecnológicos inovadores',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-600/50 transition-all transform hover:-translate-y-1"
              >
                <service.icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-gray-400">
              Conheça alguns dos nossos projetos inovadores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Sistema de Monitoramento IoT',
                desc: 'Solução de monitoramento industrial com sensores wireless',
                image:
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
              },
              {
                title: 'Robô Educacional',
                desc: 'Plataforma robótica para ensino de programação',
                image:
                  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80',
              },
              {
                title: 'Automação Residencial',
                desc: 'Sistema inteligente de controle residencial',
                image:
                  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80',
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-300">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Experiência e Inovação
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Especialistas em desenvolvimento de soluções tecnológicas
                  inovadoras, combinando conhecimento avançado em IoT, robótica
                  e sistemas embarcados para criar soluções que impulsionam o
                  futuro.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Expertise em IoT e sistemas embarcados
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Desenvolvimento de robótica avançada
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Pesquisa e desenvolvimento tecnológico
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Soluções educacionais personalizadas
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                  alt="Laboratório de Robótica"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vamos Criar Algo Incrível?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato para discutirmos seu projeto de IoT ou robótica.
          </p>
          <a
            href="mailto:elntechnologyy.com"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Entrar em Contato
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/Eln technology.png"
                  alt="ELN Technology Logo"
                  className="w-14 h-14 object-contain ml-2"
                />
                <span className="text-xl font-bold text-white">
                  ELN Technology
                </span>
              </div>
              <p className="text-gray-400">
                Soluções inovadoras em IoT, robótica e tecnologia educacional
                para transformar ideias em realidade.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Links Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="#servicos"
                  className="hover:text-white transition-colors"
                >
                  Serviços
                </a>
                <a
                  href="#projetos"
                  className="hover:text-white transition-colors"
                >
                  Projetos
                </a>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre
                </a>
                <a
                  href="#contato"
                  className="hover:text-white transition-colors"
                >
                  Contato
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <a
                    href="mailto:elntechnologyy@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    elntechnologyy@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>Recife, PE - Brasil</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <a
                    href="https://wa.me/5581997092380"
                    className="hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (81) 99709-2380
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p>© 2024 ELN Technology. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/iniciar-projeto" element={<IniciarProjeto />} />
        <Route path="/explorar-solucoes" element={<ExplorarSolucoes />} />
      </Routes>
    </Router>
  );
}

export default App;