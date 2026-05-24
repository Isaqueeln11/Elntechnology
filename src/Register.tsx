import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0D0F52] to-black">
      <button
        onClick={() => navigate('/')}
        className="flex items-center p-4 text-gray-300 hover:text-white sm:p-8"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Voltar
      </button>

      <div className="flex flex-1 items-center justify-center px-4 pb-8 sm:p-8">
        <div className="w-full max-w-md rounded-xl border border-[#159AFD]/20 bg-[#0D0F52]/30 p-5 shadow-xl backdrop-blur-sm sm:rounded-2xl sm:p-8">
          <div className="mb-8 flex items-center justify-center">
            <UserPlus className="h-12 w-12 text-[#159AFD]" />
          </div>
          <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Criar Conta</h2>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
                placeholder="ELN Technology"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Perfil</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'client' | 'admin' | 'technician')}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
              >
                <option value="client">Cliente</option>
                <option value="technician">Tecnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
                placeholder="******"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[#159AFD]/20 bg-black/30 p-3 text-white transition-colors focus:border-[#159AFD] focus:outline-none"
                placeholder="******"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#159AFD] p-3 font-semibold text-white transition-colors hover:bg-[#508AD0] disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {isSubmitting ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Ja tem uma conta?{' '}
            <Link to="/login" className="text-[#159AFD] transition-colors hover:text-[#508AD0]">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
