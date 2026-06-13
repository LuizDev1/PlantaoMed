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
    <div>
      <h1>PlantãoMed</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
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
          />
        </div>

        <div>
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
          />
        </div>

        {erro && <p>{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}