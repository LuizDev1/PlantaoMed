import React, { useEffect, useState } from 'react';

import api from '../services/api';
import FormCandidatura from '../components/FormCandidatura';
import { useAuth } from '../context/AuthContext';

export default function Candidaturas() {
  const { usuario } = useAuth();

  const [candidaturas, setCandidaturas] =
    useState([]);

  const [medicos, setMedicos] = useState([]);
  const [plantoes, setPlantoes] = useState([]);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] =
    useState(false);

  const usuarioAdministrador =
    usuario?.tipo === 'administrador';

  const usuarioMedico =
    usuario?.tipo === 'medico';

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
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

      setCandidaturas(
        respostaCandidaturas.data
      );

      setMedicos(respostaMedicos.data);
      setPlantoes(respostaPlantoes.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível carregar os dados'
      );
    }
  }

  function limparMensagens() {
    setMensagem('');
    setErro('');
  }

  async function cadastrarCandidatura(
    dadosCandidatura
  ) {
    limparMensagens();
    setCarregando(true);

    try {
      const resposta = await api.post(
        '/candidaturas',
        dadosCandidatura
      );

      setMensagem(resposta.data.mensagem);

      await carregarDados();

      return true;
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível cadastrar a candidatura'
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarStatus(id, status) {
    limparMensagens();

    try {
      const resposta = await api.put(
        `/candidaturas/${id}`,
        { status }
      );

      setMensagem(resposta.data.mensagem);

      await carregarDados();
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível atualizar a candidatura'
      );
    }
  }

  async function cancelarCandidatura(id) {
    const confirmou = window.confirm(
      'Deseja realmente cancelar esta candidatura?'
    );

    if (!confirmou) {
      return;
    }

    limparMensagens();

    try {
      const resposta = await api.delete(
        `/candidaturas/${id}`
      );

      setMensagem(
        resposta.data.mensagem ||
          'Candidatura cancelada com sucesso'
      );

      await carregarDados();
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível cancelar a candidatura'
      );
    }
  }

  function buscarNomeMedico(medicoId) {
    const medico = medicos.find(
      (item) => item.id === Number(medicoId)
    );

    return medico
      ? medico.nome
      : 'Médico não encontrado';
  }

  function buscarPlantao(plantaoId) {
    return plantoes.find(
      (item) => item.id === Number(plantaoId)
    );
  }

  function formatarData(data) {
    if (!data) {
      return '';
    }

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }

  const candidaturasExibidas =
    usuarioAdministrador
      ? candidaturas
      : candidaturas.filter(
          (candidatura) =>
            Number(candidatura.medicoId) ===
            Number(usuario?.medicoId)
        );

  return (
    <div>
      <h1>Gerenciamento de Candidaturas</h1>

      {usuarioMedico && (
        <FormCandidatura
          medicoId={usuario.medicoId}
          plantoes={plantoes}
          cadastrarCandidatura={
            cadastrarCandidatura
          }
          carregando={carregando}
        />
      )}

      {usuarioAdministrador && (
        <p>
          Visualize todas as candidaturas e
          aprove ou rejeite as solicitações.
        </p>
      )}

      {mensagem && (
        <p style={{ color: 'green' }}>
          {mensagem}
        </p>
      )}

      {erro && (
        <p style={{ color: 'red' }}>
          {erro}
        </p>
      )}

      <h2>
        {usuarioAdministrador
          ? 'Todas as candidaturas'
          : 'Minhas candidaturas'}
      </h2>

      {candidaturasExibidas.length === 0 ? (
        <p>Nenhuma candidatura encontrada.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}
          >
            <thead>
              <tr>
                <th style={estiloCelula}>ID</th>

                {usuarioAdministrador && (
                  <th style={estiloCelula}>
                    Médico
                  </th>
                )}

                <th style={estiloCelula}>
                  Plantão
                </th>

                <th style={estiloCelula}>
                  Data da candidatura
                </th>

                <th style={estiloCelula}>
                  Status
                </th>

                <th style={estiloCelula}>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {candidaturasExibidas.map(
                (candidatura) => {
                  const plantao = buscarPlantao(
                    candidatura.plantaoId
                  );

                  return (
                    <tr key={candidatura.id}>
                      <td style={estiloCelula}>
                        {candidatura.id}
                      </td>

                      {usuarioAdministrador && (
                        <td style={estiloCelula}>
                          {buscarNomeMedico(
                            candidatura.medicoId
                          )}
                        </td>
                      )}

                      <td style={estiloCelula}>
                        {plantao
                          ? `${formatarData(
                              plantao.data
                            )} às ${
                              plantao.horario
                            }`
                          : 'Plantão não encontrado'}
                      </td>

                      <td style={estiloCelula}>
                        {formatarData(
                          candidatura.dataCandidatura
                        )}
                      </td>

                      <td style={estiloCelula}>
                        {candidatura.status}
                      </td>

                      <td style={estiloCelula}>
                        {usuarioAdministrador &&
                          candidatura.status ===
                            'Pendente' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  atualizarStatus(
                                    candidatura.id,
                                    'Aprovada'
                                  )
                                }
                              >
                                Aprovar
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  atualizarStatus(
                                    candidatura.id,
                                    'Rejeitada'
                                  )
                                }
                                style={{
                                  marginLeft: '8px'
                                }}
                              >
                                Rejeitar
                              </button>
                            </>
                          )}

                        {usuarioMedico &&
                          candidatura.status ===
                            'Pendente' && (
                            <button
                              type="button"
                              onClick={() =>
                                cancelarCandidatura(
                                  candidatura.id
                                )
                              }
                            >
                              Cancelar
                            </button>
                          )}

                        {candidatura.status !==
                          'Pendente' && (
                          <span>
                            Nenhuma ação disponível
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const estiloCelula = {
  border: '1px solid #cccccc',
  padding: '10px',
  textAlign: 'left'
};