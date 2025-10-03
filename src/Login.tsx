import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ArrowLeft, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0F52] to-black flex flex-col">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-300 hover:text-white p-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-[#0D0F52]/30 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-[#159AFD]/20 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <LogIn className="w-12 h-12 text-[#159AFD]" />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Bem-vindo de volta</h2>
          
          {/* Demo Credentials */}
          <div className="bg-[#159AFD]/10 border border-[#159AFD]/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-2">Credenciais de Demonstração:</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Cliente:</strong> cliente@empresa.com</p>
              <p><strong>Admin:</strong> admin@elntechnology.com</p>
              <p><strong>Técnico:</strong> tecnico@elntechnology.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-[#159AFD]/20 text-white focus:outline-none focus:border-[#159AFD] transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-[#159AFD]/20 text-white focus:outline-none focus:border-[#159AFD] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-[#159AFD] hover:bg-[#508AD0]'
              } text-white p-3 rounded-lg font-semibold transition-colors`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-[#159AFD] hover:text-[#508AD0] transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;