import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuario');

    return usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null;
  });

  function login(dadosUsuario) {
    localStorage.setItem(
      'usuario',
      JSON.stringify(dadosUsuario)
    );

    setUsuario(dadosUsuario);
  }

  function logout() {
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}