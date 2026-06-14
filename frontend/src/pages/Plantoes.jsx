import React, { useEffect, useState } from 'react';

import api from '../services/api';
import FormPlantao from '../components/FormPlantao';

export default function Plantoes() {
  const [plantoes, setPlantoes] = useState([]);

  const [
    plantaoSelecionado,
    setPlantaoSelecionado
  ] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    listarPlantoes();
  }, []);

  function limparMensagens() {
    setMensagem('');
    setErro('');
  }

  async function listarPlantoes() {
    try {
      const resposta = await api.get('/plantoes');

      setPlantoes(resposta.data);
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível listar os plantões'
      );
    }
  }

  async function cadastrarPlantao(dadosPlantao) {
    limparMensagens();
    setCarregando(true);

    try {
      const resposta = await api.post(
        '/plantoes',
        dadosPlantao
      );

      await listarPlantoes();

      setMensagem(resposta.data.mensagem);

      return true;
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível cadastrar o plantão'
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function editarPlantao(id, dadosPlantao) {
    limparMensagens();
    setCarregando(true);

    try {
      const resposta = await api.put(
        `/plantoes/${id}`,
        dadosPlantao
      );

      await listarPlantoes();

      setPlantaoSelecionado(null);
      setMensagem(resposta.data.mensagem);

      return true;
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível editar o plantão'
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function excluirPlantao(id) {
    const confirmouExclusao = window.confirm(
      'Deseja realmente excluir este plantão?'
    );

    if (!confirmouExclusao) {
      return;
    }

    limparMensagens();

    try {
      const resposta = await api.delete(
        `/plantoes/${id}`
      );

      await listarPlantoes();

      if (plantaoSelecionado?.id === id) {
        setPlantaoSelecionado(null);
      }

      setMensagem(resposta.data.mensagem);
    } catch (erro) {
      setErro(
        erro.response?.data?.erro ||
          'Não foi possível excluir o plantão'
      );
    }
  }

  function selecionarPlantaoParaEdicao(plantao) {
    limparMensagens();
    setPlantaoSelecionado(plantao);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function cancelarEdicao() {
    setPlantaoSelecionado(null);
    limparMensagens();
  }

  function formatarData(data) {
    if (!data) {
      return '';
    }

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }

  function formatarValor(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  return (
    <div>
      <h1>Gerenciamento de Plantões</h1>

      <FormPlantao
        plantaoSelecionado={plantaoSelecionado}
        cadastrarPlantao={cadastrarPlantao}
        editarPlantao={editarPlantao}
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

      <h2>Plantões cadastrados</h2>

      {plantoes.length === 0 ? (
        <p>Nenhum plantão cadastrado.</p>
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
                <th style={estiloCelula}>Data</th>
                <th style={estiloCelula}>Horário</th>
                <th style={estiloCelula}>Valor</th>
                <th style={estiloCelula}>Status</th>
                <th style={estiloCelula}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {plantoes.map((plantao) => (
                <tr key={plantao.id}>
                  <td style={estiloCelula}>
                    {plantao.id}
                  </td>

                  <td style={estiloCelula}>
                    {formatarData(plantao.data)}
                  </td>

                  <td style={estiloCelula}>
                    {plantao.horario}
                  </td>

                  <td style={estiloCelula}>
                    {formatarValor(plantao.valor)}
                  </td>

                  <td style={estiloCelula}>
                    {plantao.status}
                  </td>

                  <td style={estiloCelula}>
                    <button
                      type="button"
                      onClick={() =>
                        selecionarPlantaoParaEdicao(
                          plantao
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        excluirPlantao(plantao.id)
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