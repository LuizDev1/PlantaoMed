import React, { useEffect, useState } from 'react';

const estadoInicial = {
  nome: '',
  email: '',
  especialidade: '',
  telefone: '',
  senha: '',
  confirmarSenha: ''
};

export default function FormMedico({
  medicoSelecionado,
  cadastrarMedico,
  editarMedico,
  cancelarEdicao,
  carregando
}) {
  const [medico, setMedico] = useState(estadoInicial);
  const [erroSenha, setErroSenha] = useState('');

  useEffect(() => {
    setErroSenha('');

    if (medicoSelecionado) {
      setMedico({
        nome: medicoSelecionado.nome || '',
        email: medicoSelecionado.email || '',
        especialidade:
          medicoSelecionado.especialidade || '',
        telefone: medicoSelecionado.telefone || '',

        // A senha existente nunca deve aparecer no formulário.
        senha: '',
        confirmarSenha: ''
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

    if (
      name === 'senha' ||
      name === 'confirmarSenha'
    ) {
      setErroSenha('');
    }
  }

  function validarSenha() {
    const estaEditando = Boolean(medicoSelecionado);

    const desejaAlterarSenha =
      medico.senha !== '' ||
      medico.confirmarSenha !== '';

    if (!estaEditando || desejaAlterarSenha) {
      if (medico.senha.length < 6) {
        setErroSenha(
          'A senha deve possuir pelo menos 6 caracteres'
        );

        return false;
      }

      if (medico.senha !== medico.confirmarSenha) {
        setErroSenha(
          'A senha e a confirmação estão diferentes'
        );

        return false;
      }
    }

    return true;
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErroSenha('');

    if (!validarSenha()) {
      return;
    }

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
      setErroSenha('');
    }
  }

  function cancelar() {
    setMedico(estadoInicial);
    setErroSenha('');
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

      <div style={estiloGrupo}>
        <label htmlFor="nome">Nome</label>

        <input
          id="nome"
          name="nome"
          type="text"
          value={medico.nome}
          onChange={alterarCampo}
          placeholder="Digite o nome do médico"
          required
          style={estiloCampo}
        />
      </div>

      <div style={estiloGrupo}>
        <label htmlFor="email">E-mail</label>

        <input
          id="email"
          name="email"
          type="email"
          value={medico.email}
          onChange={alterarCampo}
          placeholder="Digite o e-mail"
          required
          style={estiloCampo}
        />
      </div>

      <div style={estiloGrupo}>
        <label htmlFor="especialidade">
          Especialidade
        </label>

        <input
          id="especialidade"
          name="especialidade"
          type="text"
          value={medico.especialidade}
          onChange={alterarCampo}
          placeholder="Digite a especialidade"
          required
          style={estiloCampo}
        />
      </div>

      <div style={estiloGrupo}>
        <label htmlFor="telefone">Telefone</label>

        <input
          id="telefone"
          name="telefone"
          type="text"
          value={medico.telefone}
          onChange={alterarCampo}
          placeholder="Digite o telefone"
          required
          style={estiloCampo}
        />
      </div>

      <div style={estiloGrupo}>
        <label htmlFor="senha">
          {medicoSelecionado
            ? 'Nova senha'
            : 'Senha inicial'}
        </label>

        <input
          id="senha"
          name="senha"
          type="password"
          value={medico.senha}
          onChange={alterarCampo}
          placeholder={
            medicoSelecionado
              ? 'Deixe vazio para manter a senha'
              : 'Digite a senha inicial'
          }
          minLength={6}
          required={!medicoSelecionado}
          autoComplete="new-password"
          style={estiloCampo}
        />
      </div>

      <div style={estiloGrupo}>
        <label htmlFor="confirmarSenha">
          Confirmar senha
        </label>

        <input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          value={medico.confirmarSenha}
          onChange={alterarCampo}
          placeholder="Digite a senha novamente"
          minLength={6}
          required={!medicoSelecionado}
          autoComplete="new-password"
          style={estiloCampo}
        />
      </div>

      {medicoSelecionado && (
        <p
          style={{
            color: '#555555',
            fontSize: '14px'
          }}
        >
          Deixe os campos de senha vazios para manter a
          senha atual.
        </p>
      )}

      {erroSenha && (
        <p style={{ color: 'red' }}>
          {erroSenha}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
      >
        {carregando
          ? 'Salvando...'
          : medicoSelecionado
            ? 'Salvar alterações'
            : 'Cadastrar médico e usuário'}
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

const estiloGrupo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px'
};

const estiloCampo = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box'
};