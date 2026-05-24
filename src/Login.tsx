import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

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
            <LogIn className="h-12 w-12 text-[#159AFD]" />
          </div>
          <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Bem-vindo de volta</h2>

          <div className="mb-6 rounded-lg border border-[#159AFD]/30 bg-[#159AFD]/10 p-4">
            <h3 className="mb-2 font-semibold text-white">Credenciais de demonstracao:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Cliente:</strong> cliente@empresa.com</p>
              <p><strong>Admin:</strong> admin@elntechnology.com</p>
              <p><strong>Tecnico:</strong> tecnico@elntechnology.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#159AFD] p-3 font-semibold text-white transition-colors hover:bg-[#508AD0] disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Nao tem uma conta?{' '}
            <Link to="/register" className="text-[#159AFD] transition-colors hover:text-[#508AD0]">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
