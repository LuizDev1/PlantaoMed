import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(evento) {
    evento.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      const resposta = await api.post('/auth/login', {
        email,
        senha
      });

      login(resposta.data.usuario);

      navigate('/dashboard');
    } catch (erro) {
      const mensagem =
        erro.response?.data?.erro ||
        'Não foi possível realizar o login';

      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={estiloContainer}>
      <div style={estiloCard}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>PlantãoMed</h1>
        <h2 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={estiloGrupo}>
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(evento) =>
                setEmail(evento.target.value)
              }
              required
              style={estiloCampo}
            />
          </div>

          <div style={estiloGrupo}>
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(evento) =>
                setSenha(evento.target.value)
              }
              required
              style={estiloCampo}
            />
          </div>

          {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            style={carregando ? estiloBotaoDesabilitado : estiloBotao}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const estiloContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9',
  padding: '24px'
};

const estiloCard = {
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #cccccc',
  borderRadius: '8px',
  padding: '32px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
};

const estiloGrupo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '16px'
};

const estiloCampo = {
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  border: '1px solid #cccccc',
  borderRadius: '4px',
  fontSize: '16px'
};

const estiloBotao = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '16px',
  transition: 'background-color 0.2s'
};

const estiloBotaoDesabilitado = {
  ...estiloBotao,
  backgroundColor: '#999999',
  cursor: 'not-allowed'
};