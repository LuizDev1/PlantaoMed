import React, { useEffect, useState } from 'react';

const estadoInicial = {
  data: '',
  horario: '',
  valor: '',
  status: 'Disponível'
};

export default function FormPlantao({
  plantaoSelecionado,
  cadastrarPlantao,
  editarPlantao,
  cancelarEdicao,
  carregando
}) {
  const [plantao, setPlantao] = useState(estadoInicial);

  useEffect(() => {
    if (plantaoSelecionado) {
      setPlantao({
        data: plantaoSelecionado.data || '',
        horario: plantaoSelecionado.horario || '',
        valor: plantaoSelecionado.valor ?? '',
        status: plantaoSelecionado.status || 'Disponível'
      });
    } else {
      setPlantao(estadoInicial);
    }
  }, [plantaoSelecionado]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setPlantao((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();

    let operacaoRealizada;

    if (plantaoSelecionado) {
      operacaoRealizada = await editarPlantao(
        plantaoSelecionado.id,
        plantao
      );
    } else {
      operacaoRealizada = await cadastrarPlantao(plantao);
    }

    if (operacaoRealizada) {
      setPlantao(estadoInicial);
    }
  }

  function cancelar() {
    setPlantao(estadoInicial);
    cancelarEdicao();
  }

  return (
    <form
      onSubmit={enviarFormulario}
      style={{
        border: '1px solid #cccccc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}
    >
      <h2>
        {plantaoSelecionado
          ? 'Editar Plantão'
          : 'Cadastrar Plantão'}
      </h2>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="data">Data</label>

        <br />

        <input
          id="data"
          name="data"
          type="date"
          value={plantao.data}
          onChange={alterarCampo}
          required
          style={estiloCampo}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="horario">Horário</label>

        <br />

        <input
          id="horario"
          name="horario"
          type="time"
          value={plantao.horario}
          onChange={alterarCampo}
          required
          style={estiloCampo}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="valor">Valor</label>

        <br />

        <input
          id="valor"
          name="valor"
          type="number"
          min="0"
          step="0.01"
          value={plantao.valor}
          onChange={alterarCampo}
          placeholder="Digite o valor do plantão"
          required
          style={estiloCampo}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="status">Status</label>

        <br />

        <select
          id="status"
          name="status"
          value={plantao.status}
          onChange={alterarCampo}
          required
          style={estiloCampo}
        >
          <option value="Disponível">Disponível</option>
          <option value="Preenchido">Preenchido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={carregando}
      >
        {carregando
          ? 'Salvando...'
          : plantaoSelecionado
            ? 'Salvar alterações'
            : 'Cadastrar'}
      </button>

      {plantaoSelecionado && (
        <button
          type="button"
          onClick={cancelar}
          disabled={carregando}
          style={{ marginLeft: '10px' }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

const estiloCampo = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box'
};