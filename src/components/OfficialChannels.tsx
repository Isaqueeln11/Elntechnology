import { Github, Instagram, Mail, MessageCircle } from 'lucide-react';

const channels = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5581997092380?text=Ol%C3%A1%2C%20quero%20falar%20com%20a%20ELN%20Technology.',
    icon: MessageCircle,
  },
  {
    label: 'Gmail',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=elntechnologyinnovations@gmail.com',
    icon: Mail,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/eln_technology/',
    icon: Instagram,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Isaqueeln11',
    icon: Github,
  },
];

type OfficialChannelsProps = {
  isDark: boolean;
  title?: string;
  compact?: boolean;
};

export default function OfficialChannels({ isDark, title = 'Canais oficiais', compact = false }: OfficialChannelsProps) {
  return (
    <div className={`rounded-md border ${compact ? 'p-4' : 'p-5'} ${
      isDark ? 'border-sky-400/20 bg-sky-400/10' : 'border-sky-100 bg-white'
    }`}>
      <p className="text-xs font-black uppercase tracking-widest text-[#159AFD]">{title}</p>
      <div className={`mt-3 grid gap-2 ${compact ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
        {channels.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${label} da ELN Technology`}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
              isDark
                ? 'border-white/10 bg-[#070A1F] text-slate-200 hover:border-[#159AFD] hover:text-white'
                : 'border-sky-100 bg-[#F7FBFF] text-[#0D0F52] hover:border-[#159AFD] hover:bg-white'
            }`}
          >
            <Icon className="h-4 w-4 flex-none text-[#159AFD]" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
