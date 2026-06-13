import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div>
      <h1>Dashboard do PlantãoMed</h1>

      <p>
        Bem-vindo, {usuario?.nome}
      </p>

      <p>
        Tipo de usuário: {usuario?.tipo}
      </p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}