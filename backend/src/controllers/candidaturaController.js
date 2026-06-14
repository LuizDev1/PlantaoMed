const candidaturaModel = require(
  '../models/candidaturaModel'
);

const medicoModel = require(
  '../models/medicoModel'
);

const plantaoModel = require(
  '../models/plantaoModel'
);

const STATUS_VALIDOS = [
  'Pendente',
  'Aprovada',
  'Rejeitada'
];

function listarCandidaturas(req, res) {
  try {
    const candidaturas =
      candidaturaModel.buscarTodos();

    return res.status(200).json(candidaturas);
  } catch (erro) {
    console.error(
      'Erro ao listar candidaturas:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function cadastrarCandidatura(req, res) {
  try {
    const medicoId = Number(req.body.medicoId);
    const plantaoId = Number(req.body.plantaoId);

    const candidatura = {
      medicoId,
      plantaoId,
      dataCandidatura: new Date()
        .toISOString()
        .split('T')[0],
      status: 'Pendente'
    };

    if (
      !candidaturaModel.validarDados(
        candidatura
      )
    ) {
      return res.status(400).json({
        erro: 'Dados da candidatura inválidos'
      });
    }

    const medico =
      medicoModel.buscarPorId(medicoId);

    if (!medico) {
      return res.status(404).json({
        erro: 'Médico não encontrado'
      });
    }

    const plantao =
      plantaoModel.buscarPorId(plantaoId);

    if (!plantao) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    if (plantao.status !== 'Disponível') {
      return res.status(400).json({
        erro:
          'Não é possível se candidatar a um plantão indisponível'
      });
    }

    const candidaturaDuplicada =
      candidaturaModel.buscarTodos().some(
        (item) =>
          Number(item.medicoId) === medicoId &&
          Number(item.plantaoId) === plantaoId
      );

    if (candidaturaDuplicada) {
      return res.status(409).json({
        erro:
          'Este médico já possui uma candidatura para este plantão'
      });
    }

    const novaCandidatura =
      candidaturaModel.criarCandidatura(
        candidatura
      );

    return res.status(201).json({
      mensagem:
        'Candidatura cadastrada com sucesso',
      candidatura: novaCandidatura
    });
  } catch (erro) {
    console.error(
      'Erro ao cadastrar candidatura:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function editarCandidatura(req, res) {
  try {
    const id = Number(req.params.id);

    const candidaturaExistente =
      candidaturaModel.buscarPorId(id);

    if (!candidaturaExistente) {
      return res.status(404).json({
        erro: 'Candidatura não encontrada'
      });
    }

    const medicoId =
      req.body.medicoId !== undefined
        ? Number(req.body.medicoId)
        : candidaturaExistente.medicoId;

    const plantaoId =
      req.body.plantaoId !== undefined
        ? Number(req.body.plantaoId)
        : candidaturaExistente.plantaoId;

    const status =
      req.body.status !== undefined
        ? String(req.body.status).trim()
        : candidaturaExistente.status;

    const candidaturaAtualizada = {
      id: candidaturaExistente.id,
      medicoId,
      plantaoId,
      dataCandidatura:
        candidaturaExistente.dataCandidatura,
      status
    };

    if (
      !candidaturaModel.validarDados(
        candidaturaAtualizada
      )
    ) {
      return res.status(400).json({
        erro: 'Dados da candidatura inválidos'
      });
    }

    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({
        erro:
          'O status deve ser Pendente, Aprovada ou Rejeitada'
      });
    }

    const medico =
      medicoModel.buscarPorId(medicoId);

    if (!medico) {
      return res.status(404).json({
        erro: 'Médico não encontrado'
      });
    }

    const plantao =
      plantaoModel.buscarPorId(plantaoId);

    if (!plantao) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    const candidaturaDuplicada =
      candidaturaModel.buscarTodos().some(
        (item) =>
          item.id !== candidaturaExistente.id &&
          Number(item.medicoId) === medicoId &&
          Number(item.plantaoId) === plantaoId
      );

    if (candidaturaDuplicada) {
      return res.status(409).json({
        erro:
          'Este médico já possui outra candidatura para este plantão'
      });
    }

    const resultado =
      candidaturaModel.atualizarCandidatura(
        candidaturaAtualizada
      );

    return res.status(200).json({
      mensagem:
        'Candidatura atualizada com sucesso',
      candidatura: resultado
    });
  } catch (erro) {
    console.error(
      'Erro ao editar candidatura:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function excluirCandidatura(req, res) {
  try {
    const candidaturaExcluida =
      candidaturaModel.excluirCandidatura(
        req.params.id
      );

    if (!candidaturaExcluida) {
      return res.status(404).json({
        erro: 'Candidatura não encontrada'
      });
    }

    return res.status(200).json({
      mensagem:
        'Candidatura excluída com sucesso',
      candidatura: candidaturaExcluida
    });
  } catch (erro) {
    console.error(
      'Erro ao excluir candidatura:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  cadastrarCandidatura,
  listarCandidaturas,
  editarCandidatura,
  excluirCandidatura
};