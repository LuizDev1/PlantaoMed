import React, { useEffect, useMemo, useState } from 'react';

import api from '../services/api';
import Tabela from '../components/Tabela';
import { useAuth } from '../context/AuthContext';

export default function Relatorio() {
  const { usuario } = useAuth();

  const [candidaturas, setCandidaturas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [plantoes, setPlantoes] = useState([]);

  const [filtroStatus, setFiltroStatus] =
    useState('Todos');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] =
    useState(true);

  const usuarioAdministrador =
    usuario?.tipo === 'administrador';

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');

    try {
      const [
        respostaCandidaturas,
        respostaMedicos,
        respostaPlantoes
      ] = await Promise.all([
        api.get('/candidaturas'),
        api.get('/medicos'),
        api.get('/plantoes')
      ]);

      setCandidaturas(respostaCandidaturas.data);
      setMedicos(respostaMedicos.data);
      setPlantoes(respostaPlantoes.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível gerar o relatório'
      );
    } finally {
      setCarregando(false);
    }
  }
  const relatorio = useMemo(() => {
    return candidaturas
      .filter((candidatura) => {
        if (usuarioAdministrador) {
          return true;
        }

        return (
          Number(candidatura.medicoId) ===
          Number(usuario?.medicoId)
        );
      })
      .map((candidatura) => {
        const medico = medicos.find(
          (item) =>
            Number(item.id) ===
            Number(candidatura.medicoId)
        );

        const plantao = plantoes.find(
          (item) =>
            Number(item.id) ===
            Number(candidatura.plantaoId)
        );

        return {
          id: candidatura.id,
          medico:
            medico?.nome ||
            'Médico não encontrado',

          especialidade:
            medico?.especialidade || '—',

          dataPlantao:
            plantao?.data || null,

          horarioPlantao:
            plantao?.horario || '—',

          valorPlantao:
            plantao?.valor ?? null,

          dataCandidatura:
            candidatura.dataCandidatura,

          status: candidatura.status
        };
      });
  }, [
    candidaturas,
    medicos,
    plantoes,
    usuario,
    usuarioAdministrador
  ]);

  const relatorioFiltrado = relatorio.filter(
    (item) =>
      filtroStatus === 'Todos' ||
      item.status === filtroStatus
  );

  function formatarData(data) {
    if (!data) {
      return 'Não encontrado';
    }

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }

  function formatarValor(valor) {
    if (valor === null || valor === undefined) {
      return 'Não encontrado';
    }

    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  const colunas = [
    {
      chave: 'id',
      titulo: 'ID'
    },
    {
      chave: 'medico',
      titulo: 'Médico'
    },
    {
      chave: 'especialidade',
      titulo: 'Especialidade'
    },
    {
      chave: 'dataPlantao',
      titulo: 'Data do plantão',
      renderizar: (item) =>
        formatarData(item.dataPlantao)
    },
    {
      chave: 'horarioPlantao',
      titulo: 'Horário'
    },
    {
      chave: 'valorPlantao',
      titulo: 'Valor',
      renderizar: (item) =>
        formatarValor(item.valorPlantao)
    },
    {
      chave: 'dataCandidatura',
      titulo: 'Data da candidatura',
      renderizar: (item) =>
        formatarData(item.dataCandidatura)
    },
    {
      chave: 'status',
      titulo: 'Status'
    }
  ];

  if (carregando) {
    return <p>Gerando relatório...</p>;
  }

  return (
    <div>
      <h1>Relatório de Candidaturas</h1>

      {!usuarioAdministrador && (
        <p>
          Este relatório mostra apenas suas candidaturas.
        </p>
      )}

      <div style={{ margin: '20px 0' }}>
        <label htmlFor="filtroStatus">
          Filtrar por status:
        </label>

        <select
          id="filtroStatus"
          value={filtroStatus}
          onChange={(evento) =>
            setFiltroStatus(evento.target.value)
          }
          style={{
            marginLeft: '10px',
            padding: '8px'
          }}
        >
          <option value="Todos">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Aprovada">Aprovada</option>
          <option value="Rejeitada">Rejeitada</option>
        </select>
      </div>

      {erro && (
        <p style={{ color: 'red' }}>
          {erro}
        </p>
      )}

      <Tabela
        colunas={colunas}
        dados={relatorioFiltrado}
        mensagemVazia="Nenhuma candidatura encontrada para o filtro selecionado."
      />
    </div>
  );
}