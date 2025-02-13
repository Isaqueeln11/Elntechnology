import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks = ({ className = '' }) => {
  return (
    <div className={`flex justify-center space-x-4 ${className}`}>
      <Link
        to="/explorar-solucoes"
        className="text-gray-300 hover:text-white transition-colors bg-gray-800/50 px-6 py-3 rounded-lg"
      >
        Explorar Soluções
      </Link>
      <Link
        to="/iniciar-projeto"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Iniciar Projeto
      </Link>
    </div>
  );
};

export default NavigationLinks;