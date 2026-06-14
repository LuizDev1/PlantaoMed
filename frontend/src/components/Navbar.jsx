import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function estiloLink({ isActive }) {
    return {
      color: 'white',
      textDecoration: 'none',
      fontWeight: isActive ? 'bold' : 'normal',
      borderBottom: isActive
        ? '2px solid white'
        : '2px solid transparent'
    };
  }

  return (
    <nav
      style={{
        backgroundColor: '#146c94',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}
    >
      <div>
        <strong>PlantãoMed</strong>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '18px',
          alignItems: 'center'
        }}
      >
        <NavLink to="/dashboard" style={estiloLink}>
          Dashboard
        </NavLink>

        <NavLink to="/medicos" style={estiloLink}>
          Médicos
        </NavLink>

        <NavLink to="/plantoes" style={estiloLink}>
          Plantões
        </NavLink>

        <NavLink to="/candidaturas" style={estiloLink}>
          Candidaturas
        </NavLink>

        <NavLink to="/relatorio" style={estiloLink}>
          Relatório
        </NavLink>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span>{usuario?.nome}</span>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}