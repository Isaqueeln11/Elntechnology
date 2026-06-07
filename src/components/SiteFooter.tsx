import { ArrowUpRight, Instagram, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import logoUrl from '../../ELN TECHNOLOGY.svg';

const navigationLinks = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projetos-desenvolvidos' },
  { label: 'Equipe', href: '/equipe' },
  { label: 'Estudos', href: '/estudos' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Loja', href: '/lojas' },
];

const solutionLinks = [
  { label: 'Soluções', href: '/explorar-solucoes' },
  { label: 'Placas PCB', href: '/pcbs' },
  { label: 'Desenvolvimentos', href: '/desenvolvimentos' },
  { label: 'Base técnica', href: '/estudos' },
  { label: 'Notícias e inovação', href: '/noticias-inovacoes' },
];

export default function SiteFooter() {
  const { isDark } = useTheme();
  const linkClass = `inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#159AFD] ${
    isDark ? 'text-slate-300' : 'text-slate-600'
  }`;

  return (
    <footer className={`border-t ${isDark ? 'border-white/10 bg-[#070A1F]' : 'border-sky-100 bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.2fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Página inicial da ELN Technology">
              <img src={logoUrl} alt="" className="h-11 w-20 object-contain" />
              <span className={`notranslate text-lg font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`} translate="no">
                ELN Technology
              </span>
            </Link>
            <p className={`mt-4 text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Eletrônica, IoT, automação, impressão 3D, firmware OTA e sistemas digitais com atendimento direto.
            </p>
            <a
              href="https://wa.me/5581997092380?text=Olá,%20quero%20falar%20sobre%20um%20projeto."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]"
            >
              Falar sobre um projeto
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Navegação</p>
            <nav className="mt-5 flex flex-col items-start gap-3" aria-label="Navegação do rodapé">
              {navigationLinks.map((link) => (
                <Link key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Tecnologia</p>
            <nav className="mt-5 flex flex-col items-start gap-3" aria-label="Áreas de tecnologia">
              {solutionLinks.map((link) => (
                <Link key={link.href} to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#0D0F52]'}`}>Contato direto</p>
            <div className="mt-5 flex flex-col items-start gap-4">
              <a href="https://wa.me/5581997092380" target="_blank" rel="noreferrer" className={linkClass}>
                <MessageCircle className="h-4 w-4 text-[#159AFD]" />
                +55 (81) 99709-2380
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=elntechnologyinnovations@gmail.com" target="_blank" rel="noreferrer" className={`${linkClass} break-all`}>
                <Mail className="h-4 w-4 flex-none text-[#159AFD]" />
                elntechnologyinnovations@gmail.com
              </a>
              <a href="https://instagram.com/eln_technology" target="_blank" rel="noreferrer" className={linkClass}>
                <Instagram className="h-4 w-4 text-[#159AFD]" />
                @eln_technology
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-10 flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between ${
          isDark ? 'border-white/10 text-slate-500' : 'border-sky-100 text-slate-500'
        }`}>
          <p>© {new Date().getFullYear()} ELN Technology. Todos os direitos reservados.</p>
          <Link to="/login" className="inline-flex items-center gap-2 font-bold transition hover:text-[#159AFD]">
            <ShieldCheck className="h-4 w-4" />
            Acesso ao painel
          </Link>
        </div>
      </div>
    </footer>
  );
}
