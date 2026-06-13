import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import ClientDashboard from './client/ClientDashboard';
import TechnicianDashboard from './technician/TechnicianDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'client') return <ClientDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'technician') return <TechnicianDashboard />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FBFF] px-4 text-slate-950">
      <section className="max-w-lg rounded-md border border-sky-100 bg-white p-6 text-center shadow-xl shadow-sky-900/10">
        <h1 className="text-2xl font-black text-[#0D0F52]">Perfil sem permissão definida</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A conta está autenticada, mas o perfil ainda não corresponde a cliente, administrador ou técnico.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-[#159AFD] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]">
          Voltar ao site
        </Link>
      </section>
    </main>
  );
}
