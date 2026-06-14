import React, { useEffect, useState } from 'react';

const estadoInicial = {
  nome: '',
  email: '',
  especialidade: '',
  telefone: ''
};

export default function FormMedico({
  medicoSelecionado,
  cadastrarMedico,
  editarMedico,
  cancelarEdicao,
  carregando
}) {
  const [medico, setMedico] = useState(estadoInicial);

  useEffect(() => {
    if (medicoSelecionado) {
      setMedico({
        nome: medicoSelecionado.nome || '',
        email: medicoSelecionado.email || '',
        especialidade:
          medicoSelecionado.especialidade || '',
        telefone: medicoSelecionado.telefone || ''
      });
    } else {
      setMedico(estadoInicial);
    }
  }, [medicoSelecionado]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setMedico((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();

    let operacaoRealizada;

    if (medicoSelecionado) {
      operacaoRealizada = await editarMedico(
        medicoSelecionado.id,
        medico
      );
    } else {
      operacaoRealizada =
        await cadastrarMedico(medico);
    }

    if (operacaoRealizada) {
      setMedico(estadoInicial);
    }
  }

  function cancelar() {
    setMedico(estadoInicial);
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
        {medicoSelecionado
          ? 'Editar Médico'
          : 'Cadastrar Médico'}
      </h2>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="nome">Nome</label>

        <br />

        <input
          id="nome"
          name="nome"
          type="text"
          value={medico.nome}
          onChange={alterarCampo}
          placeholder="Digite o nome do médico"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="email">E-mail</label>

        <br />

        <input
          id="email"
          name="email"
          type="email"
          value={medico.email}
          onChange={alterarCampo}
          placeholder="Digite o e-mail"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="especialidade">
          Especialidade
        </label>

        <br />

        <input
          id="especialidade"
          name="especialidade"
          type="text"
          value={medico.especialidade}
          onChange={alterarCampo}
          placeholder="Digite a especialidade"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="telefone">Telefone</label>

        <br />

        <input
          id="telefone"
          name="telefone"
          type="text"
          value={medico.telefone}
          onChange={alterarCampo}
          placeholder="Digite o telefone"
          required
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={carregando}
      >
        {carregando
          ? 'Salvando...'
          : medicoSelecionado
            ? 'Salvar alterações'
            : 'Cadastrar'}
      </button>

      {medicoSelecionado && (
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