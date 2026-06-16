const candidaturaModel = require('./candidaturaModel');
const medicoModel = require('./medicoModel');
const plantaoModel = require('./plantaoModel');

async function gerarDadosRelatorio() {
  const candidaturas = await candidaturaModel.buscarTodos();
  const medicos = await medicoModel.buscarTodos();
  const plantoes = await plantaoModel.buscarTodos();

  return {
    candidaturas,
    medicos,
    plantoes
  };
}

module.exports = {
  gerarDadosRelatorio
};