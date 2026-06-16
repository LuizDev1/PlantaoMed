const {
  lerDados,
  salvarDados: salvarArquivo
} = require('../utils/fileManager');

function carregarDados() {
  const dados = lerDados();

  if (!Array.isArray(dados.plantoes)) {
    return [];
  }

  return dados.plantoes;
}

function salvarDados(plantoes) {
  const dados = lerDados();

  dados.plantoes = plantoes;

  salvarArquivo(dados);
}

function validarDados(plantao) {
  const dataValida =
    typeof plantao.data === 'string' &&
    plantao.data.trim() !== '';

  const horarioValido =
    typeof plantao.horario === 'string' &&
    plantao.horario.trim() !== '';

  const valorValido =
    plantao.valor !== '' &&
    Number.isFinite(Number(plantao.valor)) &&
    Number(plantao.valor) >= 0;

  const statusValido =
    typeof plantao.status === 'string' &&
    plantao.status.trim() !== '';

  return (
    dataValida &&
    horarioValido &&
    valorValido &&
    statusValido
  );
}

function criarPlantao(plantao) {
  const plantoes = carregarDados();

  const novoId =
    plantoes.length > 0
      ? Math.max(
          ...plantoes.map(
            (plantaoCadastrado) =>
              Number(plantaoCadastrado.id) || 0
          )
        ) + 1
      : 1;

  const novoPlantao = {
    id: novoId,
    data: plantao.data.trim(),
    horario: plantao.horario.trim(),
    valor: Number(plantao.valor),
    status: plantao.status.trim()
  };

  plantoes.push(novoPlantao);
  salvarDados(plantoes);

  return novoPlantao;
}

function buscarPorId(id) {
  const plantoes = carregarDados();

  return plantoes.find(
    (plantao) => plantao.id === Number(id)
  );
}

function buscarTodos() {
  return carregarDados();
}

function atualizarPlantao(plantaoAtualizado) {
  const plantoes = carregarDados();

  const indice = plantoes.findIndex(
    (plantao) =>
      plantao.id === Number(plantaoAtualizado.id)
  );

  if (indice === -1) {
    return null;
  }

  plantoes[indice] = {
    id: plantoes[indice].id,
    data: plantaoAtualizado.data.trim(),
    horario: plantaoAtualizado.horario.trim(),
    valor: Number(plantaoAtualizado.valor),
    status: plantaoAtualizado.status.trim()
  };

  salvarDados(plantoes);

  return plantoes[indice];
}

function excluirPlantao(id) {
  const plantoes = carregarDados();

  const indice = plantoes.findIndex(
    (plantao) => plantao.id === Number(id)
  );

  if (indice === -1) {
    return null;
  }

  const plantaoExcluido = plantoes[indice];

  plantoes.splice(indice, 1);
  salvarDados(plantoes);

  return plantaoExcluido;
}

module.exports = {
  criarPlantao,
  buscarPorId,
  buscarTodos,
  atualizarPlantao,
  excluirPlantao,
  salvarDados,
  carregarDados,
  validarDados
};