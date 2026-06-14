const candidaturaModel = require(
  '../models/candidaturaModel'
);

const medicoModel = require(
  '../models/medicoModel'
);

const plantaoModel = require(
  '../models/plantaoModel'
);

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
      !candidaturaModel.validarDados(candidatura)
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

    if (
      candidaturaExistente.status !== 'Pendente'
    ) {
      return res.status(409).json({
        erro:
          'Esta candidatura já foi analisada e não pode ser alterada'
      });
    }

    const status = String(
      req.body.status || ''
    ).trim();

    if (
      status !== 'Aprovada' &&
      status !== 'Rejeitada'
    ) {
      return res.status(400).json({
        erro:
          'O status deve ser Aprovada ou Rejeitada'
      });
    }

    const plantao = plantaoModel.buscarPorId(
      candidaturaExistente.plantaoId
    );

    if (!plantao) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    if (status === 'Rejeitada') {
      const candidaturaAtualizada = {
        ...candidaturaExistente,
        status: 'Rejeitada'
      };

      const resultado =
        candidaturaModel.atualizarCandidatura(
          candidaturaAtualizada
        );

      return res.status(200).json({
        mensagem:
          'Candidatura rejeitada com sucesso',
        candidatura: resultado
      });
    }

    const candidaturas =
      candidaturaModel.buscarTodos();

    const outraCandidaturaAprovada =
      candidaturas.some(
        (candidatura) =>
          candidatura.id !==
            candidaturaExistente.id &&
          Number(candidatura.plantaoId) ===
            Number(
              candidaturaExistente.plantaoId
            ) &&
          candidatura.status === 'Aprovada'
      );

    if (outraCandidaturaAprovada) {
      return res.status(409).json({
        erro:
          'Este plantão já possui um médico aprovado'
      });
    }

    const candidaturasAtualizadas =
      candidaturas.map((candidatura) => {
        const mesmoPlantao =
          Number(candidatura.plantaoId) ===
          Number(
            candidaturaExistente.plantaoId
          );

        if (!mesmoPlantao) {
          return candidatura;
        }

        if (
          candidatura.id ===
          candidaturaExistente.id
        ) {
          return {
            ...candidatura,
            status: 'Aprovada'
          };
        }

        if (candidatura.status === 'Pendente') {
          return {
            ...candidatura,
            status: 'Rejeitada'
          };
        }

        return candidatura;
      });

    candidaturaModel.salvarDados(
      candidaturasAtualizadas
    );

    plantaoModel.atualizarPlantao({
      ...plantao,
      status: 'Preenchido'
    });

    const candidaturaAprovada =
      candidaturaModel.buscarPorId(id);

    return res.status(200).json({
      mensagem:
        'Candidatura aprovada e plantão preenchido com sucesso',
      candidatura: candidaturaAprovada
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
    const id = Number(req.params.id);

    const candidaturaExistente =
      candidaturaModel.buscarPorId(id);

    if (!candidaturaExistente) {
      return res.status(404).json({
        erro: 'Candidatura não encontrada'
      });
    }

    if (
      candidaturaExistente.status !== 'Pendente'
    ) {
      return res.status(409).json({
        erro:
          'Somente candidaturas pendentes podem ser canceladas'
      });
    }

    const candidaturaExcluida =
      candidaturaModel.excluirCandidatura(id);

    return res.status(200).json({
      mensagem:
        'Candidatura cancelada com sucesso',
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