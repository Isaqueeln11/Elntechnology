import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, LockKeyhole, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Nao foi possivel entrar.');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setStatus('');

    if (!email) {
      setError('Digite seu email para receber a recuperacao de senha.');
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      setStatus(result.message);
    } else {
      setError(result.message);
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
            Entre com uma conta criada no Firebase para acessar o painel correto. Nao existem mais contas prontas.
          </p>

          <div className="mt-8 grid gap-3">
            {['Firebase Authentication', 'Perfis no Firestore', 'Controle de firmware no banco'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-sky-100 bg-white p-4 shadow-sm">
                {item.includes('Firestore') || item.includes('banco') ? (
                  <Database className="h-5 w-5 flex-none text-[#159AFD]" />
                ) : (
                  <ShieldCheck className="h-5 w-5 flex-none text-[#159AFD]" />
                )}
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
            <div className="flex items-start gap-3">
              <Database className="mt-0.5 h-5 w-5 flex-none text-[#159AFD]" />
              <div>
                <p className="text-sm font-bold text-[#0D0F52]">Login conectado ao Firebase</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Use uma conta criada em "Criar conta". O acesso agora valida email e senha no Firebase Auth.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {status && (
            <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-sm font-semibold text-emerald-700">{status}</p>
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
              <span className="flex items-center justify-between gap-3">
                Senha
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs font-black text-[#159AFD] transition hover:text-[#0D0F52]"
                >
                  Esqueci minha senha
                </button>
              </span>
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
