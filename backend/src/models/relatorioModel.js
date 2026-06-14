const candidaturaModel = require(
  './candidaturaModel'
);

const medicoModel = require(
  './medicoModel'
);

const plantaoModel = require(
  './plantaoModel'
);

function gerarDadosRelatorio() {
  const candidaturas =
    candidaturaModel.buscarTodos();

  const medicos =
    medicoModel.buscarTodos();

  const plantoes =
    plantaoModel.buscarTodos();

  return {
    candidaturas,
    medicos,
    plantoes
  };
}

module.exports = {
  gerarDadosRelatorio
};