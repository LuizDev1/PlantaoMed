const {
  lerDados,
  salvarDados: salvarArquivo
} = require('../utils/fileManager');

function carregarDados() {
  const dados = lerDados();

  if (!Array.isArray(dados.medicos)) {
    return [];
  }

  return dados.medicos;
}

function salvarDados(medicos) {
  const dados = lerDados();

  dados.medicos = medicos;

  salvarArquivo(dados);
}

function validarDados(medico) {
  const nomeValido =
    typeof medico.nome === 'string' &&
    medico.nome.trim() !== '';

  const emailValido =
    typeof medico.email === 'string' &&
    medico.email.trim() !== '' &&
    medico.email.includes('@');

  const especialidadeValida =
    typeof medico.especialidade === 'string' &&
    medico.especialidade.trim() !== '';

  const telefoneValido =
    typeof medico.telefone === 'string' &&
    medico.telefone.trim() !== '';

  return (
    nomeValido &&
    emailValido &&
    especialidadeValida &&
    telefoneValido
  );
}

function criarMedico(medico) {
  const medicos = carregarDados();

  const novoId =
    medicos.length > 0
      ? Math.max(
          ...medicos.map(
            (medicoCadastrado) =>
              Number(medicoCadastrado.id) || 0
          )
        ) + 1
      : 1;

  const novoMedico = {
    id: novoId,
    nome: medico.nome.trim(),
    email: medico.email.trim().toLowerCase(),
    especialidade: medico.especialidade.trim(),
    telefone: medico.telefone.trim()
  };

  medicos.push(novoMedico);
  salvarDados(medicos);

  return novoMedico;
}

function buscarPorId(id) {
  const medicos = carregarDados();

  return medicos.find(
    (medico) => medico.id === Number(id)
  );
}

function buscarTodos() {
  return carregarDados();
}

function atualizarMedico(medicoAtualizado) {
  const medicos = carregarDados();

  const indice = medicos.findIndex(
    (medico) =>
      medico.id === Number(medicoAtualizado.id)
  );

  if (indice === -1) {
    return null;
  }

  medicos[indice] = {
    id: medicos[indice].id,
    nome: medicoAtualizado.nome.trim(),
    email: medicoAtualizado.email
      .trim()
      .toLowerCase(),
    especialidade:
      medicoAtualizado.especialidade.trim(),
    telefone: medicoAtualizado.telefone.trim()
  };

  salvarDados(medicos);

  return medicos[indice];
}

function excluirMedico(id) {
  const medicos = carregarDados();

  const indice = medicos.findIndex(
    (medico) => medico.id === Number(id)
  );

  if (indice === -1) {
    return null;
  }

  const medicoExcluido = medicos[indice];

  medicos.splice(indice, 1);
  salvarDados(medicos);

  return medicoExcluido;
}

module.exports = {
  criarMedico,
  buscarPorId,
  buscarTodos,
  atualizarMedico,
  excluirMedico,
  salvarDados,
  carregarDados,
  validarDados
};