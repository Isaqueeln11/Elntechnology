import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, LockKeyhole, Mail, ShieldCheck, User, UserPlus } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<'client' | 'admin' | 'technician'>('client');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({ name, email, password, role, company });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Nao foi possivel criar a conta.');
      return;
    }

    navigate('/dashboard');
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

      <main className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-black uppercase tracking-widest text-[#159AFD]">Novo acesso</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-[#0D0F52]">
            Crie uma conta local ate o banco ficar pronto.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            O cadastro fica salvo neste navegador por enquanto. Depois podemos ligar isso ao Firebase ou a uma API propria.
          </p>
          <div className="mt-8 rounded-md border border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#159AFD]" />
              <span className="font-black text-[#0D0F52]">Senhas ocultas na interface</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A tela nao mostra senha de usuarios. Para producao, o proximo passo e salvar senha com autenticacao real no backend.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl rounded-md border border-sky-100 bg-white p-5 shadow-xl shadow-sky-900/10 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#159AFD] text-white">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0D0F52]">Criar Conta</h2>
              <p className="text-sm text-slate-500">Cadastro temporario local</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Nome
                <span className="relative mt-2 block">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                    placeholder="Seu nome"
                    required
                  />
                </span>
              </label>

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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Empresa
                <span className="relative mt-2 block">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                    placeholder="ELN Technology"
                  />
                </span>
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Perfil
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'client' | 'admin' | 'technician')}
                  className="mt-2 w-full rounded-md border border-sky-100 px-4 py-3 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                >
                  <option value="client">Cliente</option>
                  <option value="technician">Tecnico</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Senha
                <span className="relative mt-2 block">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                    placeholder="Minimo 6 caracteres"
                    required
                  />
                </span>
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Confirmar senha
                <span className="relative mt-2 block">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-sky-100 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#159AFD] focus:ring-4 focus:ring-sky-100"
                    placeholder="Repita a senha"
                    required
                  />
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#159AFD] px-5 py-3 font-black text-white transition hover:bg-[#0D0F52] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <UserPlus className="h-5 w-5" />
              {isSubmitting ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ja tem uma conta?{' '}
            <Link to="/login" className="font-black text-[#159AFD] transition hover:text-[#0D0F52]">
              Fazer login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Register;
