import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"></div>
      <div className="flex items-center mb-4">
        <div className="bg-white/20 p-2 rounded-lg mr-3">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Newsletter Tecnológica</h3>
      </div>
      
      {isSubscribed ? (
        <div className="flex items-center text-green-300 bg-green-500/20 p-4 rounded-xl border border-green-500/30">
          <CheckCircle className="w-6 h-6 mr-3 animate-pulse" />
          <span className="font-semibold">Obrigado! Você foi inscrito com sucesso.</span>
        </div>
      ) : (
        <>
          <p className="text-white/90 mb-6 leading-relaxed">
            Receba as últimas novidades sobre IoT, robótica e inovações tecnológicas.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/25 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-[#159AFD] px-6 py-4 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Inscrever-se
            </button>
          </form>
        </>
      )}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/50 to-transparent"></div>
    </div>
  );
};

export default Newsletter;