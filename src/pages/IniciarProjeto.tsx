import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IniciarProjeto() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-300 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Iniciar Projeto</h1>
        
        <form className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Nome do Projeto</label>
            <input 
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Digite o nome do seu projeto"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Tipo de Projeto</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
              <option value="iot">IoT</option>
              <option value="robotica">Robótica</option>
              <option value="automacao">Automação</option>
              <option value="educacional">Educacional</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Descrição</label>
            <textarea 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32"
              placeholder="Descreva seu projeto"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Orçamento Estimado</label>
            <input 
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="R$ 0,00"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Enviar Proposta
          </button>
        </form>
      </div>
    </div>
  );
}