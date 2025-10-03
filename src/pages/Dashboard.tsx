import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from './client/ClientDashboard';
import AdminDashboard from './admin/AdminDashboard';
import TechnicianDashboard from './technician/TechnicianDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'client':
      return <ClientDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'technician':
      return <TechnicianDashboard />;
    default:
      return <div>Tipo de usuário não reconhecido</div>;
  }
};

export default Dashboard;