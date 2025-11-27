import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0D0F52] border-t border-[#159AFD]/20 p-4 space-y-4">
          <a
            href="#servicos"
            className="block text-gray-300 hover:text-[#159AFD] transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Serviços
          </a>
          <a
            href="#projetos"
            className="block text-gray-300 hover:text-[#159AFD] transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Projetos
          </a>
          <a
            href="#sobre"
            className="block text-gray-300 hover:text-[#159AFD] transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </a>
          <a
            href="#contato"
            className="block text-gray-300 hover:text-[#159AFD] transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Contato
          </a>
          <Link
            to="/explorar-solucoes"
            className="block text-gray-300 hover:text-[#159AFD] transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Explorar Soluções
          </Link>
          <Link
            to="/iniciar-projeto"
            className="block bg-[#159AFD] hover:bg-[#508AD0] text-white px-4 py-2 rounded-lg transition-colors text-center"
            onClick={() => setIsOpen(false)}
          >
            Iniciar Projeto
          </Link>
          <div className="pt-4 border-t border-[#159AFD]/20">
            <Link
              to="/login"
              className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5 mr-2" />
              Login
            </Link>
            <Link
              to="/register"
              className="block bg-[#159AFD]/20 hover:bg-[#159AFD]/30 text-white px-4 py-2 rounded-lg transition-colors text-center mt-2"
              onClick={() => setIsOpen(false)}
            >
              Criar Conta
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;