const plantaoModel = require('../models/plantaoModel');
const candidaturaModel = require('../models/candidaturaModel');

async function listarPlantoes(req, res) {
  try {
    const plantoes = await plantaoModel.buscarTodos();

    return res.status(200).json(plantoes);
  } catch (erro) {
    console.error('Erro ao listar plantões:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function cadastrarPlantao(req, res) {
  try {
    const plantao = {
      data: String(req.body.data || '').trim(),
      horario: String(req.body.horario || '').trim(),
      valor: req.body.valor,
      status: String(req.body.status || '').trim()
    };

    if (!plantaoModel.validarDados(plantao)) {
      return res.status(400).json({
        erro: 'Preencha todos os campos corretamente'
      });
    }

    const plantoes = await plantaoModel.buscarTodos();
    const plantaoDuplicado =
      plantoes.some(
        (plantaoCadastrado) =>
          plantaoCadastrado.data === plantao.data &&
          plantaoCadastrado.horario === plantao.horario
      );

    if (plantaoDuplicado) {
      return res.status(409).json({
        erro: 'Já existe um plantão nesta data e horário'
      });
    }

    const novoPlantao =
      await plantaoModel.criarPlantao(plantao);

    return res.status(201).json({
      mensagem: 'Plantão cadastrado com sucesso',
      plantao: novoPlantao
    });
  } catch (erro) {
    console.error('Erro ao cadastrar plantão:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function editarPlantao(req, res) {
  try {
    const id = Number(req.params.id);

    const plantaoExistente =
      await plantaoModel.buscarPorId(id);

    if (!plantaoExistente) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    const plantaoAtualizado = {
      id: plantaoExistente.id,

      data:
        req.body.data !== undefined
          ? String(req.body.data).trim()
          : plantaoExistente.data,

      horario:
        req.body.horario !== undefined
          ? String(req.body.horario).trim()
          : plantaoExistente.horario,

      valor:
        req.body.valor !== undefined
          ? req.body.valor
          : plantaoExistente.valor,

      status:
        req.body.status !== undefined
          ? String(req.body.status).trim()
          : plantaoExistente.status
    };

    if (!plantaoModel.validarDados(plantaoAtualizado)) {
      return res.status(400).json({
        erro: 'Preencha todos os campos corretamente'
      });
    }

    const plantoes = await plantaoModel.buscarTodos();
    const plantaoDuplicado =
      plantoes.some(
        (plantao) =>
          plantao.id !== plantaoExistente.id &&
          plantao.data === plantaoAtualizado.data &&
          plantao.horario === plantaoAtualizado.horario
      );

    if (plantaoDuplicado) {
      return res.status(409).json({
        erro: 'Já existe outro plantão nesta data e horário'
      });
    }

    const resultado =
      await plantaoModel.atualizarPlantao(
        plantaoAtualizado
      );

    return res.status(200).json({
      mensagem: 'Plantão atualizado com sucesso',
      plantao: resultado
    });
  } catch (erro) {
    console.error('Erro ao editar plantão:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function excluirPlantao(req, res) {
  try {
    const id = Number(req.params.id);

    const plantaoExistente =
      await plantaoModel.buscarPorId(id);

    if (!plantaoExistente) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    // Cancela todas as candidaturas vinculadas ao plantão
    await candidaturaModel.cancelarCandidaturasPorPlantaoId(id);

    // Cancela o plantão em vez de excluí-lo fisicamente
    const plantaoCancelado =
      await plantaoModel.cancelarPlantao(id);

    return res.status(200).json({
      mensagem:
        'Plantão e candidaturas cancelados com sucesso',
      plantao: plantaoCancelado
    });
  } catch (erro) {
    console.error(
      'Erro ao excluir plantão:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  cadastrarPlantao,
  listarPlantoes,
  editarPlantao,
  excluirPlantao
};