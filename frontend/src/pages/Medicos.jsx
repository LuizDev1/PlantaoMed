import React, { useEffect, useState } from 'react';

import api from '../services/api';
import FormMedico from '../components/FormMedico';

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] =
    useState(null);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] =
    useState(false);

  useEffect(() => {
    listarMedicos();
  }, []);

  function limparMensagens() {
    setMensagem('');
    setErro('');
  }

  async function listarMedicos() {
    limparMensagens();

    try {
      const resposta = await api.get('/medicos');

      setMedicos(resposta.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível listar os médicos'
      );
    }
  }

  async function cadastrarMedico(dadosMedico) {
    limparMensagens();
    setCarregando(true);

    try {
      const resposta = await api.post(
        '/medicos',
        dadosMedico
      );

      setMensagem(resposta.data.mensagem);

      await listarMedicos();

      return true;
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível cadastrar o médico'
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function editarMedico(id, dadosMedico) {
    limparMensagens();
    setCarregando(true);

    try {
      const resposta = await api.put(
        `/medicos/${id}`,
        dadosMedico
      );

      setMensagem(resposta.data.mensagem);
      setMedicoSelecionado(null);

      await listarMedicos();

      return true;
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível editar o médico'
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function excluirMedico(id) {
    const confirmouExclusao = window.confirm(
      'Deseja realmente excluir este médico?'
    );

    if (!confirmouExclusao) {
      return;
    }

    limparMensagens();

    try {
      const resposta = await api.delete(
        `/medicos/${id}`
      );

      setMensagem(resposta.data.mensagem);

      if (medicoSelecionado?.id === id) {
        setMedicoSelecionado(null);
      }

      await listarMedicos();
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível excluir o médico'
      );
    }
  }

  function selecionarMedicoParaEdicao(medico) {
    limparMensagens();
    setMedicoSelecionado(medico);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function cancelarEdicao() {
    setMedicoSelecionado(null);
    limparMensagens();
  }

  return (
    <div>
      <h1>Gerenciamento de Médicos</h1>

      <FormMedico
        medicoSelecionado={medicoSelecionado}
        cadastrarMedico={cadastrarMedico}
        editarMedico={editarMedico}
        cancelarEdicao={cancelarEdicao}
        carregando={carregando}
      />

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

      <h2>Médicos cadastrados</h2>

      {medicos.length === 0 ? (
        <p>Nenhum médico cadastrado.</p>
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
                <th style={estiloCelula}>Nome</th>
                <th style={estiloCelula}>E-mail</th>
                <th style={estiloCelula}>
                  Especialidade
                </th>
                <th style={estiloCelula}>
                  Telefone
                </th>
                <th style={estiloCelula}>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  <td style={estiloCelula}>
                    {medico.id}
                  </td>

                  <td style={estiloCelula}>
                    {medico.nome}
                  </td>

                  <td style={estiloCelula}>
                    {medico.email}
                  </td>

                  <td style={estiloCelula}>
                    {medico.especialidade}
                  </td>

                  <td style={estiloCelula}>
                    {medico.telefone}
                  </td>

                  <td style={estiloCelula}>
                    <button
                      type="button"
                      onClick={() =>
                        selecionarMedicoParaEdicao(
                          medico
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        excluirMedico(medico.id)
                      }
                      style={{ marginLeft: '8px' }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
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