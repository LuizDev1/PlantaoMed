import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({
  children,
  tiposPermitidos
}) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (
    tiposPermitidos &&
    !tiposPermitidos.includes(usuario.tipo)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}