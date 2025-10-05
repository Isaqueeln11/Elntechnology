import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Login';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ExplorarSolucoes from './pages/ExplorarSolucoes';
import IniciarProjeto from './pages/IniciarProjeto';
import Inovacoes from './pages/Inovacoes';
import PCBs from './pages/PCBs';
import NavigationLinks from './components/NavigationLinks';
import MobileMenu from './components/MobileMenu';
import Newsletter from './components/Newsletter';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Stats from './components/Stats';
import BlogPreview from './components/BlogPreview';
import TechStack from './components/TechStack';
import { Cpu, Zap, Shield, Smartphone, ArrowRight, CheckCircle, Star, Users, Award, Clock, Headphones as HeadphonesIcon, Menu, X, ChevronRight, Play, ExternalLink } from 'lucide-react';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cpu className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                ELN Technology
              </span>
            </div>
            
            <div className="hidden md:block">
              <NavigationLinks />
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </a>
              <a href="/register" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
                Começar
              </a>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {isMenuOpen && <MobileMenu />}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-8">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                IoT Solutions
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                Robótica
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                PCB Design
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Inovação em
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Tecnologia
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Desenvolvemos soluções IoT, sistemas robóticos e PCBs personalizados 
              para transformar suas ideias em realidade tecnológica.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/iniciar-projeto" className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <span className="flex items-center justify-center">
                  Iniciar Projeto
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/explorar-solucoes" className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  Explorar Soluções
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Nossos Serviços
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Soluções completas em tecnologia para impulsionar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Cpu,
                title: "IoT Solutions",
                description: "Sistemas inteligentes conectados para automação industrial e residencial",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Robótica",
                description: "Desenvolvimento de robôs e sistemas automatizados personalizados",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "PCB Design",
                description: "Projeto e fabricação de placas de circuito impresso profissionais",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Smartphone,
                title: "Sistemas Embarcados",
                description: "Desenvolvimento de firmware e software para microcontroladores",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((service, index) => (
              <div key={index} className="group relative">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                  <div className={`h-1 bg-gradient-to-r ${service.gradient} rounded-full mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Tech Stack */}
      <TechStack />

      {/* Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Projetos em Destaque
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Conheça alguns dos nossos projetos mais inovadores
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sistema IoT Industrial",
                category: "IoT",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
                description: "Monitoramento em tempo real de equipamentos industriais"
              },
              {
                title: "Robô Colaborativo",
                category: "Robótica",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
                description: "Automação de processos de manufatura"
              },
              {
                title: "PCB Multi-layer",
                category: "Hardware",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
                description: "Placa de alta densidade para aplicações críticas"
              }
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500/80 text-white rounded-full text-sm backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-white/30 flex items-center">
                      Ver Projeto <ExternalLink className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Blog Preview */}
      <BlogPreview />

      {/* FAQ */}
      <FAQ />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Cpu className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  ELN Technology
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transformando ideias em soluções tecnológicas inovadoras através de IoT, robótica e sistemas embarcados.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">IoT Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Robótica</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PCB Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sistemas Embarcados</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>contato@elntechnology.com</li>
                <li>+55 (11) 9999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ELN Technology. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explorar-solucoes" element={<ExplorarSolucoes />} />
          <Route path="/iniciar-projeto" element={<IniciarProjeto />} />
          <Route path="/inovacoes" element={<Inovacoes />} />
          <Route path="/pcbs" element={<PCBs />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;