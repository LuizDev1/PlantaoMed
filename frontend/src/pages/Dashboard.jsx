import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();

  const usuarioAdministrador =
    usuario?.tipo === 'administrador';

  const estiloCard = {
    border: '1px solid #cccccc',
    borderRadius: '8px',
    padding: '20px',
    textDecoration: 'none',
    color: '#222222',
    backgroundColor: '#ffffff'
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Bem-vindo, <strong>{usuario?.nome}</strong>.
      </p>

      <p>
        Perfil:{' '}
        <strong>
          {usuarioAdministrador
            ? 'Administrador'
            : 'Médico'}
        </strong>
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}
      >
        {usuarioAdministrador && (
          <>
            <Link
              to="/medicos"
              style={estiloCard}
            >
              <h2>Médicos</h2>

              <p>
                Cadastrar, listar, editar e excluir
                médicos.
              </p>
            </Link>

            <Link
              to="/plantoes"
              style={estiloCard}
            >
              <h2>Plantões</h2>

              <p>
                Cadastrar, listar, editar e excluir
                plantões.
              </p>
            </Link>
          </>
        )}

        <Link
          to="/candidaturas"
          style={estiloCard}
        >
          <h2>Candidaturas</h2>

          <p>
            {usuarioAdministrador
              ? 'Visualizar, aprovar e rejeitar candidaturas.'
              : 'Cadastrar e acompanhar suas candidaturas.'}
          </p>
        </Link>

        <Link
          to="/relatorio"
          style={estiloCard}
        >
          <h2>Relatório</h2>

          <p>
            Visualizar o relatório de candidaturas,
            médicos e plantões.
          </p>
        </Link>
      </div>
    </div>
  );
}