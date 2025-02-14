import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks = ({ className = '' }) => {
  return (
    <div className={`hidden md:flex justify-center space-x-4 ${className}`}>
      <Link
        to="/explorar-solucoes"
        className="text-gray-300 hover:text-white transition-colors bg-[#0D0F52]/50 px-6 py-3 rounded-lg hover:bg-[#0D0F52]/70"
      >
        Explorar Soluções
      </Link>
      <Link
        to="/iniciar-projeto"
        className="bg-[#159AFD] hover:bg-[#508AD0] text-white px-6 py-3 rounded-lg transition-colors"
      >
        Iniciar Projeto
      </Link>
    </div>
  );
};

export default NavigationLinks;