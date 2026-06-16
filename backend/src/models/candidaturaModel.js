const {
  lerDados,
  salvarDados: salvarArquivo
} = require('../utils/fileManager');

function carregarDados() {
  const dados = lerDados();

  if (!Array.isArray(dados.candidaturas)) {
    return [];
  }

  return dados.candidaturas;
}

function salvarDados(candidaturas) {
  const dados = lerDados();

  dados.candidaturas = candidaturas;

  salvarArquivo(dados);
}

function validarDados(candidatura) {
  const medicoIdValido =
    Number.isInteger(Number(candidatura.medicoId)) &&
    Number(candidatura.medicoId) > 0;

  const plantaoIdValido =
    Number.isInteger(Number(candidatura.plantaoId)) &&
    Number(candidatura.plantaoId) > 0;

  const dataValida =
    typeof candidatura.dataCandidatura === 'string' &&
    candidatura.dataCandidatura.trim() !== '';

  const statusValido =
    typeof candidatura.status === 'string' &&
    candidatura.status.trim() !== '';

  return (
    medicoIdValido &&
    plantaoIdValido &&
    dataValida &&
    statusValido
  );
}

function criarCandidatura(candidatura) {
  const candidaturas = carregarDados();

  const novoId =
    candidaturas.length > 0
      ? Math.max(
          ...candidaturas.map(
            (candidaturaCadastrada) =>
              Number(candidaturaCadastrada.id) || 0
          )
        ) + 1
      : 1;

  const novaCandidatura = {
    id: novoId,
    medicoId: Number(candidatura.medicoId),
    plantaoId: Number(candidatura.plantaoId),
    dataCandidatura:
      candidatura.dataCandidatura.trim(),
    status: candidatura.status.trim()
  };

  candidaturas.push(novaCandidatura);
  salvarDados(candidaturas);

  return novaCandidatura;
}

function buscarPorId(id) {
  const candidaturas = carregarDados();

  return candidaturas.find(
    (candidatura) =>
      candidatura.id === Number(id)
  );
}

function buscarTodos() {
  return carregarDados();
}

function atualizarCandidatura(
  candidaturaAtualizada
) {
  const candidaturas = carregarDados();

  const indice = candidaturas.findIndex(
    (candidatura) =>
      candidatura.id ===
      Number(candidaturaAtualizada.id)
  );

  if (indice === -1) {
    return null;
  }

  candidaturas[indice] = {
    id: candidaturas[indice].id,
    medicoId: Number(
      candidaturaAtualizada.medicoId
    ),
    plantaoId: Number(
      candidaturaAtualizada.plantaoId
    ),
    dataCandidatura:
      candidaturaAtualizada.dataCandidatura.trim(),
    status:
      candidaturaAtualizada.status.trim()
  };

  salvarDados(candidaturas);

  return candidaturas[indice];
}

function excluirCandidatura(id) {
  const candidaturas = carregarDados();

  const indice = candidaturas.findIndex(
    (candidatura) =>
      candidatura.id === Number(id)
  );

  if (indice === -1) {
    return null;
  }

  const candidaturaExcluida =
    candidaturas[indice];

  candidaturas.splice(indice, 1);
  salvarDados(candidaturas);

  return candidaturaExcluida;
}

module.exports = {
  criarCandidatura,
  buscarPorId,
  buscarTodos,
  atualizarCandidatura,
  excluirCandidatura,
  salvarDados,
  carregarDados,
  validarDados
};