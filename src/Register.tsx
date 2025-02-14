import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    // Adicione a lógica de registro aqui
    console.log('Register:', { name, email, password });
    navigate('/');
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
            <UserPlus className="w-12 h-12 text-[#159AFD]" />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Criar Conta</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-[#159AFD]/20 text-white focus:outline-none focus:border-[#159AFD] transition-colors"
                placeholder="Seu nome"
                required
              />
            </div>
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
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-[#159AFD]/20 text-white focus:outline-none focus:border-[#159AFD] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#159AFD] hover:bg-[#508AD0] text-white p-3 rounded-lg font-semibold transition-colors"
            >
              Criar Conta
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#159AFD] hover:text-[#508AD0] transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;