import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const demoAccounts = [
  { label: 'Cliente', email: 'cliente@empresa.com' },
  { label: 'Admin', email: 'admin@elntechnology.com' },
  { label: 'Tecnico', email: 'tecnico@elntechnology.com' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou senha incorretos.');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-slate-950">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-md border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-[#0D0F52] shadow-sm transition hover:border-[#159AFD] hover:text-[#159AFD]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <span className="text-sm font-black uppercase tracking-widest text-[#159AFD]">ELN Technology</span>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Area segura</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-[#0D0F52]">
            Gerencie projetos, clientes e atualizacoes OTA.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Entre com sua conta para acessar o painel correto. As senhas ficam ocultas e nao aparecem na tela de acesso.
          </p>

          <div className="mt-8 grid gap-3">
            {['Painel administrativo', 'Controle de firmware', 'Historico local de usuarios'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-sky-100 bg-white p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 flex-none text-[#159AFD]" />
                <span className="font-bold text-[#0D0F52]">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-md border border-sky-100 bg-white p-5 shadow-xl shadow-sky-900/10 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] text-white">
              <LogIn className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0D0F52]">Entrar</h2>
              <p className="text-sm text-slate-500">Acesso ao painel ELN</p>
            </div>
          </div>

          <div className="mb-6 rounded-md border border-sky-100 bg-[#F7FBFF] p-4">
            <p className="text-sm font-bold text-[#0D0F52]">Contas de demonstracao</p>
            <div className="mt-3 space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => setEmail(account.email)}
                  className="flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-left text-sm transition hover:text-[#159AFD]"
                >
                  <span className="font-bold text-slate-700">{account.label}</span>
                  <span className="truncate text-slate-500">{account.email}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">Senhas nao sao exibidas por seguranca.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm font-bold text-slate-700">
              Email
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                  placeholder="seu@email.com"
                  required
                />
              </span>
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Senha
              <span className="relative mt-2 block">
                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                  placeholder="Digite sua senha"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <LogIn className="h-5 w-5" />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Nao tem uma conta?{' '}
            <Link to="/register" className="font-black text-[#159AFD] transition hover:text-[#0D0F52]">
              Criar conta
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
