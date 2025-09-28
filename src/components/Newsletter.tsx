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
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Mail className="w-6 h-6 text-white mr-2" />
        <h3 className="text-xl font-semibold text-white">Newsletter</h3>
      </div>
      
      {isSubscribed ? (
        <div className="flex items-center text-green-400">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Obrigado! Você foi inscrito com sucesso.</span>
        </div>
      ) : (
        <>
          <p className="text-white/90 mb-4">
            Receba as últimas novidades sobre IoT, robótica e inovações tecnológicas.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-[#159AFD] px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Inscrever-se
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Newsletter;