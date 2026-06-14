const plantaoModel = require('../models/plantaoModel');

function listarPlantoes(req, res) {
  try {
    const plantoes = plantaoModel.buscarTodos();

    return res.status(200).json(plantoes);
  } catch (erro) {
    console.error('Erro ao listar plantões:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function cadastrarPlantao(req, res) {
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

    const plantaoDuplicado =
      plantaoModel.buscarTodos().some(
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
      plantaoModel.criarPlantao(plantao);

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

function editarPlantao(req, res) {
  try {
    const id = Number(req.params.id);

    const plantaoExistente =
      plantaoModel.buscarPorId(id);

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

    const plantaoDuplicado =
      plantaoModel.buscarTodos().some(
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
      plantaoModel.atualizarPlantao(
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

function excluirPlantao(req, res) {
  try {
    const plantaoExcluido =
      plantaoModel.excluirPlantao(req.params.id);

    if (!plantaoExcluido) {
      return res.status(404).json({
        erro: 'Plantão não encontrado'
      });
    }

    return res.status(200).json({
      mensagem: 'Plantão excluído com sucesso',
      plantao: plantaoExcluido
    });
  } catch (erro) {
    console.error('Erro ao excluir plantão:', erro);

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