import React from 'react';
import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicos from './pages/Medicos';
import Plantoes from './pages/Plantoes';
import Candidaturas from './pages/Candidaturas';
import Relatorio from './pages/Relatorio';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/candidaturas"
          element={<Candidaturas />}
        />

        <Route
          path="/relatorio"
          element={<Relatorio />}
        />

        <Route
          path="/medicos"
          element={
            <ProtectedRoute
              tiposPermitidos={['administrador']}
            >
              <Medicos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plantoes"
          element={
            <ProtectedRoute
              tiposPermitidos={['administrador']}
            >
              <Plantoes />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}