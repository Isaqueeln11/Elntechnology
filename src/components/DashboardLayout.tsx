import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  Settings, 
  User,
  Bell,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0F52] to-black">
      {/* Top Navigation */}
      <nav className="bg-[#0D0F52]/90 backdrop-blur-sm border-b border-[#159AFD]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-3 py-3">
            {/* Logo */}
            <Link to="/" className="flex min-w-0 items-center space-x-2">
              <img
                src="/Eln technology.png"
                alt="ELN Technology Logo"
                className="h-10 w-10 flex-none object-contain"
              />
              <span className="hidden truncate text-lg font-bold text-white sm:block lg:text-xl">ELN Technology</span>
            </Link>

            {/* Search Bar */}
            <div className="mx-4 hidden max-w-lg flex-1 md:block lg:mx-8">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar projetos, clientes, tickets..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0D0F52]/50 border border-[#159AFD]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#159AFD] transition-colors"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex flex-none items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-[#159AFD]"
                />
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6">
        <div className="relative group">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#159AFD] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#508AD0] sm:h-14 sm:w-14">
            <Settings className="w-6 h-6 text-white" />
          </button>
          
          {/* Quick Actions Menu */}
          <div className="absolute bottom-16 right-0 bg-[#0D0F52]/90 backdrop-blur-sm rounded-lg border border-[#159AFD]/30 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="space-y-1 w-48">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-[#159AFD]/20 rounded transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Link>
              <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-[#159AFD]/20 rounded transition-colors">
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </button>
              <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-[#159AFD]/20 rounded transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
