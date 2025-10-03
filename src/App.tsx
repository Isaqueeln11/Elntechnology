import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  User,
} from 'lucide-react';
import IniciarProjeto from './pages/IniciarProjeto';
import ExplorarSolucoes from './pages/ExplorarSolucoes';
import NavigationLinks from './components/NavigationLinks';
import MobileMenu from './components/MobileMenu';
import Newsletter from './components/Newsletter';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Stats from './components/Stats';
import BlogPreview from './components/BlogPreview';
import TechStack from './components/TechStack';
import Login from './Login';
import Register from './Register';
import PCBs from './pages/PCBs';
import Inovacoes from './pages/Inovacoes';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0F52] to-black">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0D0F52]/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img
                src="/Eln technology.png"
                alt="ELN Technology Logo"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold text-white">
                ELN Technology
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#servicos"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                Serviços
              </a>
              <a
                href="#projetos"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                Projetos
              </a>
              <a
                href="#sobre"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                Contato
              </a>
              <Link
                to="/pcbs"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                PCBs
              </Link>
              <Link
                to="/inovacoes"
                className="text-gray-300 hover:text-[#159AFD] transition-colors"
              >
                Inovações
              </Link>
              <NavigationLinks className="space-x-8" />
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#159AFD] transition-colors flex items-center"
                >
                  <User className="w-5 h-5 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Inovação em
            <span className="text-[#159AFD]"> IoT e Robótica</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Desenvolvemos soluções avançadas em Internet das Coisas (IoT),
            robótica e sistemas inteligentes. Transformando ideias em realidade
            através da tecnologia.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-[#159AFD]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#159AFD]/30">
              <span className="text-[#159AFD] font-semibold">IoT Solutions</span>
            </div>
            <div className="bg-[#159AFD]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#159AFD]/30">
              <span className="text-[#159AFD] font-semibold">Robotics</span>
            </div>
            <div className="bg-[#159AFD]/20 backdrop-blur-sm px-6 py-3 rounded-full border border-[#159AFD]/30">
              <span className="text-[#159AFD] font-semibold">PCB Design</span>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#159AFD] rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-[#508AD0] rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-[#159AFD] rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#508AD0] rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-10 w-2 h-2 bg-[#159AFD] rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#159AFD]/5 to-transparent" />
      </header>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-gradient-to-b from-black/50 to-[#0D0F52]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#159AFD]/10 backdrop-blur-sm px-6 py-2 rounded-full border border-[#159AFD]/30 mb-6">
              <span className="text-[#159AFD] font-semibold text-sm uppercase tracking-wider">Especialidades</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Nossas Especialidades
            </h2>
            <p className="text-gray-400 text-lg">
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
                className="group bg-gradient-to-br from-[#0D0F52]/40 to-[#0D0F52]/20 backdrop-blur-sm p-8 rounded-2xl hover:from-[#0D0F52]/60 hover:to-[#0D0F52]/40 transition-all duration-500 transform hover:-translate-y-2 border border-[#159AFD]/30 hover:border-[#159AFD]/60 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#159AFD]/20 to-transparent rounded-bl-full"></div>
                <service.icon className="w-14 h-14 text-[#159AFD] mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#159AFD] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{service.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#159AFD] to-[#508AD0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23159AFD" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 bg-[#0D0F52]/20">
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
                className="group relative overflow-hidden rounded-xl border border-[#159AFD]/20"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F52]/90 to-transparent flex flex-col justify-end p-6">
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
      <section id="sobre" className="py-20 bg-gradient-to-br from-gray-900/80 to-[#0D0F52]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#159AFD]/10 backdrop-blur-sm px-6 py-2 rounded-full border border-[#159AFD]/30 mb-6">
                <span className="text-[#159AFD] font-semibold text-sm uppercase tracking-wider">Sobre Nós</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Experiência e Inovação
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Especialistas em desenvolvimento de soluções tecnológicas
                  inovadoras, combinando conhecimento avançado em IoT, robótica
                  e sistemas embarcados para criar soluções que impulsionam o
                  futuro.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3 animate-pulse"></div>
                    Expertise em IoT e sistemas embarcados
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3 animate-pulse"></div>
                    Desenvolvimento de robótica avançada
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3 animate-pulse"></div>
                    Pesquisa e desenvolvimento tecnológico
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#159AFD] rounded-full mr-3 animate-pulse"></div>
                    Soluções educacionais personalizadas
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-video rounded-2xl overflow-hidden border border-[#159AFD]/30 group-hover:border-[#159AFD]/60 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                  alt="Laboratório de Robótica"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#159AFD]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#159AFD]/30 to-transparent rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-[#508AD0]/20 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23159AFD" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E')] opacity-30"></div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Tech Stack Section */}
      <TechStack />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gradient-to-br from-[#159AFD] via-[#159AFD] to-[#508AD0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 mb-6">
                <span className="text-white font-semibold text-sm uppercase tracking-wider">Contato</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Vamos Criar Algo Incrível?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Entre em contato para discutirmos seu projeto de IoT ou robótica.
                Nossa equipe está pronta para transformar suas ideias em realidade.
              </p>
              <a
                href="mailto:elntechnologyy@gmail.com"
                className="inline-flex items-center bg-white text-[#159AFD] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Entrar em Contato
              </a>
            </div>
            <div>
              <Newsletter />
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0F52] text-gray-400 py-12">
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
                  className="hover:text-[#159AFD] transition-colors"
                >
                  Serviços
                </a>
                <a
                  href="#projetos"
                  className="hover:text-[#159AFD] transition-colors"
                >
                  Projetos
                </a>
                <a href="#sobre" className="hover:text-[#159AFD] transition-colors">
                  Sobre
                </a>
                <a
                  href="#contato"
                  className="hover:text-[#159AFD] transition-colors"
                >
                  Contato
                </a>
                <Link
                  to="/pcbs"
                  className="hover:text-[#159AFD] transition-colors"
                >
                  PCBs
                </Link>
                <Link
                  to="/inovacoes"
                  className="hover:text-[#159AFD] transition-colors"
                >
                  Inovações
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#159AFD]" />
                  <a
                    href="mailto:elntechnologyy@gmail.com"
                    className="hover:text-[#159AFD] transition-colors"
                  >
                    elntechnologyy@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#159AFD]" />
                  <span>Recife, PE - Brasil</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#159AFD]" />
                  <a
                    href="https://wa.me/5581997092380"
                    className="hover:text-[#159AFD] transition-colors"
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pcbs" element={<PCBs />} />
        <Route path="/inovacoes" element={<Inovacoes />} />
      </Routes>
    </Router>
  );
}

export default App;