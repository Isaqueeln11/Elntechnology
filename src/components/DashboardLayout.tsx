import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  Settings, 
  User,
  Bell,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const count = snapshot.docs.filter((item) => {
        const data = item.data();
        return data.target === 'Admin' && data.status !== 'Lida';
      }).length;
      setNewNotifications(user?.preferences?.notifyNewUsers === false ? 0 : count);
    });

    return unsubscribe;
  }, [user?.preferences?.notifyNewUsers]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleThemeToggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    updateUserProfile({ theme: nextTheme });
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#070A1F]' : 'bg-[#F4F8FC]'}`}>
      {/* Top Navigation */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#080B24]/95' : 'border-slate-200 bg-white/95'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-3 py-3">
            {/* Logo */}
            <Link to="/" className="flex min-w-0 items-center space-x-2">
              <img
                src="/Eln technology.png"
                alt="ELN Technology Logo"
                className="h-10 w-10 flex-none object-contain"
              />
              <span className={`notranslate hidden truncate text-lg font-bold sm:block lg:text-xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`} translate="no">ELN Technology</span>
            </Link>

            {/* Search Bar */}
            <div className="mx-4 hidden max-w-lg flex-1 md:block lg:mx-8">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar projetos, clientes, tickets..."
                  className={`w-full rounded-md border py-2 pl-10 pr-4 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-[#159AFD]/10 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder-gray-500' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex flex-none items-center space-x-2 sm:space-x-4">
              <button className={`relative rounded-md p-2 transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                <Bell className="w-6 h-6" />
                {newNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                    {newNotifications > 9 ? '9+' : newNotifications}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleThemeToggle}
                className={`rounded-md p-2 transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                title={isDark ? 'Modo claro' : 'Modo noturno'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="h-9 w-9 rounded-full border border-[#159AFD]/50 object-cover"
                />
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                  <p className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className={`rounded-md p-2 transition-colors hover:bg-red-500/10 hover:text-red-400 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${user?.preferences?.dashboardDensity === 'compact' ? 'py-4 sm:py-5' : 'py-6 sm:py-8'}`}>
        {children}
      </main>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6">
        <div className="relative group">
          <button className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] shadow-lg shadow-[#159AFD]/20 transition-all duration-300 hover:bg-[#508AD0] sm:h-14 sm:w-14">
            <Settings className="w-6 h-6 text-white" />
          </button>
          
          {/* Quick Actions Menu */}
          <div className="pointer-events-none absolute bottom-16 right-0 rounded-lg border border-white/10 bg-[#080B24]/95 p-2 opacity-0 shadow-xl shadow-black/25 backdrop-blur-sm transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
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
