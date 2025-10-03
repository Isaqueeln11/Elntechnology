import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0F52] to-black flex items-center justify-center p-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <AlertTriangle className="w-24 h-24 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Acesso Negado</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Você não tem permissão para acessar esta área do sistema.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Ir para página inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;