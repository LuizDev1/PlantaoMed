import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();

  const estiloCard = {
    border: '1px solid #cccccc',
    borderRadius: '8px',
    padding: '20px',
    textDecoration: 'none',
    color: '#222222'
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Bem-vindo, <strong>{usuario?.nome}</strong>.
      </p>

      <p>
        Perfil: {usuario?.tipo}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}
      >
        <Link to="/medicos" style={estiloCard}>
          <h2>Médicos</h2>
          <p>Gerenciar médicos cadastrados.</p>
        </Link>

        <Link to="/plantoes" style={estiloCard}>
          <h2>Plantões</h2>
          <p>Gerenciar plantões disponíveis.</p>
        </Link>

        <Link to="/candidaturas" style={estiloCard}>
          <h2>Candidaturas</h2>
          <p>Acompanhar candidaturas aos plantões.</p>
        </Link>

        <Link to="/relatorio" style={estiloCard}>
          <h2>Relatório</h2>
          <p>Visualizar o relatório de candidaturas.</p>
        </Link>
      </div>
    </div>
  );
}