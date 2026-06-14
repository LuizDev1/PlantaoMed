const {
  lerDados,
  salvarDados
} = require('../utils/fileManager');

function carregarDados() {
  const dados = lerDados();

  if (!Array.isArray(dados.usuarios)) {
    dados.usuarios = [];
  }

  return dados;
}

function buscarPorEmail(email) {
  const dados = carregarDados();

  const emailNormalizado = String(email || '')
    .trim()
    .toLowerCase();

  return dados.usuarios.find(
    (usuario) =>
      String(usuario.email).toLowerCase() ===
      emailNormalizado
  );
}

function buscarPorMedicoId(medicoId) {
  const dados = carregarDados();

  return dados.usuarios.find(
    (usuario) =>
      Number(usuario.medicoId) ===
      Number(medicoId)
  );
}

function criarUsuarioMedico({
  nome,
  email,
  senha,
  medicoId
}) {
  const dados = carregarDados();

  const novoId =
    dados.usuarios.length > 0
      ? Math.max(
          ...dados.usuarios.map(
            (usuario) =>
              Number(usuario.id) || 0
          )
        ) + 1
      : 1;

  const novoUsuario = {
    id: novoId,
    nome: String(nome).trim(),
    email: String(email)
      .trim()
      .toLowerCase(),
    senha: String(senha),
    tipo: 'medico',
    medicoId: Number(medicoId)
  };

  dados.usuarios.push(novoUsuario);
  salvarDados(dados);

  return novoUsuario;
}

function atualizarUsuarioPorMedicoId(
  medicoId,
  novosDados
) {
  const dados = carregarDados();

  const indice = dados.usuarios.findIndex(
    (usuario) =>
      Number(usuario.medicoId) ===
      Number(medicoId)
  );

  if (indice === -1) {
    return null;
  }

  const usuarioAtual = dados.usuarios[indice];

  dados.usuarios[indice] = {
    ...usuarioAtual,

    nome:
      novosDados.nome !== undefined
        ? String(novosDados.nome).trim()
        : usuarioAtual.nome,

    email:
      novosDados.email !== undefined
        ? String(novosDados.email)
            .trim()
            .toLowerCase()
        : usuarioAtual.email,

    senha:
      novosDados.senha
        ? String(novosDados.senha)
        : usuarioAtual.senha
  };

  salvarDados(dados);

  return dados.usuarios[indice];
}

function excluirUsuarioPorMedicoId(medicoId) {
  const dados = carregarDados();

  const indice = dados.usuarios.findIndex(
    (usuario) =>
      Number(usuario.medicoId) ===
      Number(medicoId)
  );

  if (indice === -1) {
    return null;
  }

  const [usuarioExcluido] =
    dados.usuarios.splice(indice, 1);

  salvarDados(dados);

  return usuarioExcluido;
}

module.exports = {
  buscarPorEmail,
  buscarPorMedicoId,
  criarUsuarioMedico,
  atualizarUsuarioPorMedicoId,
  excluirUsuarioPorMedicoId
};