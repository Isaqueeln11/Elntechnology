import React from 'react';
import { Bell, Home, LogOut, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import logoUrl from '../../ELN TECHNOLOGY.svg';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const { isDark, setTheme } = useTheme();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications(user?.role, user?.id, user?.email);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleThemeToggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    void updateUserProfile({ theme: nextTheme });
  };

  return (
    <div className={`dashboard-shell min-h-screen transition-colors ${isDark ? 'dashboard-dark' : 'dashboard-light'}`}>
      <nav className="dashboard-topbar dashboard-topbar-surface sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="dashboard-brand flex min-w-0 items-center gap-3" title="Ir para o site normal">
            <img src={logoUrl} alt="ELN Technology" className="h-10 w-16 flex-none object-contain" />
            <span className="min-w-0">
              <span className={`notranslate hidden truncate text-lg font-black sm:block lg:text-xl ${isDark ? 'text-white' : 'text-[#0D0F52]'}`} translate="no">ELN Technology</span>
              <span className={`hidden text-xs font-bold uppercase tracking-[0.18em] sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Painel</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`hidden items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition sm:inline-flex ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#159AFD]/40 hover:bg-sky-50'}`}
            >
              <Home className="h-4 w-4" />
              Site
            </Link>
            <button
              type="button"
              onClick={() => navigate('/dashboard?tab=notifications')}
              className={`dashboard-icon-button relative rounded-md p-2 transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            <button
              type="button"
              onClick={handleThemeToggle}
              className={`dashboard-icon-button rounded-md p-2 transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              title={isDark ? 'Modo claro' : 'Modo noturno'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button type="button" onClick={() => navigate('/dashboard?tab=settings')} className={`hidden items-center gap-3 rounded-md border p-1.5 pr-3 transition md:flex ${isDark ? 'border-white/10 bg-white/[0.03] hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:border-[#159AFD]/35 hover:bg-white'}`}>
              <img src={user?.avatar || logoUrl} alt={user?.name || 'Usuário'} className="h-9 w-9 rounded-md border border-[#159AFD]/50 object-cover" />
              <span className="max-w-44 text-left"><span className={`block truncate text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</span><span className={`block truncate text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user?.email}</span></span>
            </button>
            <button type="button" onClick={handleLogout} className={`dashboard-icon-button rounded-md p-2 transition-colors hover:bg-red-500/10 hover:text-red-400 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} title="Sair" aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className={`mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 ${user?.preferences?.dashboardDensity === 'compact' ? 'py-4 sm:py-5' : 'py-6 sm:py-8'}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
