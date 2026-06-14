const medicoModel = require('../models/medicoModel');

function normalizarTelefone(telefone) {
  return String(telefone || '').replace(/\D/g, '');
}

function listarMedicos(req, res) {
  try {
    const medicos = medicoModel.buscarTodos();

    return res.status(200).json(medicos);
  } catch (erro) {
    console.error('Erro ao listar médicos:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function cadastrarMedico(req, res) {
  try {
    const medico = {
      nome: String(req.body.nome || '').trim(),

      email: String(req.body.email || '')
        .trim()
        .toLowerCase(),

      especialidade: String(
        req.body.especialidade || ''
      ).trim(),

      telefone: normalizarTelefone(
        req.body.telefone
      )
    };

    if (!medicoModel.validarDados(medico)) {
      return res.status(400).json({
        erro: 'Preencha todos os campos corretamente'
      });
    }

    if (
      medico.telefone.length !== 10 &&
      medico.telefone.length !== 11
    ) {
      return res.status(400).json({
        erro: 'O telefone deve conter 10 ou 11 números'
      });
    }

    const medicos = medicoModel.buscarTodos();

    const emailJaCadastrado = medicos.some(
      (medicoCadastrado) =>
        medicoCadastrado.email.toLowerCase() ===
        medico.email
    );

    if (emailJaCadastrado) {
      return res.status(409).json({
        erro: 'Já existe um médico com este e-mail'
      });
    }

    const telefoneJaCadastrado = medicos.some(
      (medicoCadastrado) =>
        normalizarTelefone(
          medicoCadastrado.telefone
        ) === medico.telefone
    );

    if (telefoneJaCadastrado) {
      return res.status(409).json({
        erro: 'Já existe um médico com este telefone'
      });
    }

    const novoMedico =
      medicoModel.criarMedico(medico);

    return res.status(201).json({
      mensagem: 'Médico cadastrado com sucesso',
      medico: novoMedico
    });
  } catch (erro) {
    console.error('Erro ao cadastrar médico:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function editarMedico(req, res) {
  try {
    const id = Number(req.params.id);

    const medicoExistente =
      medicoModel.buscarPorId(id);

    if (!medicoExistente) {
      return res.status(404).json({
        erro: 'Médico não encontrado'
      });
    }

    const medicoAtualizado = {
      id: medicoExistente.id,

      nome:
        req.body.nome !== undefined
          ? String(req.body.nome).trim()
          : medicoExistente.nome,

      email:
        req.body.email !== undefined
          ? String(req.body.email)
              .trim()
              .toLowerCase()
          : medicoExistente.email,

      especialidade:
        req.body.especialidade !== undefined
          ? String(req.body.especialidade).trim()
          : medicoExistente.especialidade,

      telefone:
        req.body.telefone !== undefined
          ? normalizarTelefone(req.body.telefone)
          : normalizarTelefone(
              medicoExistente.telefone
            )
    };

    if (!medicoModel.validarDados(medicoAtualizado)) {
      return res.status(400).json({
        erro: 'Preencha todos os campos corretamente'
      });
    }

    if (
      medicoAtualizado.telefone.length !== 10 &&
      medicoAtualizado.telefone.length !== 11
    ) {
      return res.status(400).json({
        erro: 'O telefone deve conter 10 ou 11 números'
      });
    }

    const medicos = medicoModel.buscarTodos();

    const emailJaCadastrado = medicos.some(
      (medico) =>
        medico.id !== medicoExistente.id &&
        medico.email.toLowerCase() ===
          medicoAtualizado.email
    );

    if (emailJaCadastrado) {
      return res.status(409).json({
        erro: 'Já existe outro médico com este e-mail'
      });
    }

    const telefoneJaCadastrado = medicos.some(
      (medico) =>
        medico.id !== medicoExistente.id &&
        normalizarTelefone(medico.telefone) ===
          medicoAtualizado.telefone
    );

    if (telefoneJaCadastrado) {
      return res.status(409).json({
        erro: 'Já existe outro médico com este telefone'
      });
    }

    const resultado =
      medicoModel.atualizarMedico(
        medicoAtualizado
      );

    return res.status(200).json({
      mensagem: 'Médico atualizado com sucesso',
      medico: resultado
    });
  } catch (erro) {
    console.error('Erro ao editar médico:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function excluirMedico(req, res) {
  try {
    const medicoExcluido =
      medicoModel.excluirMedico(req.params.id);

    if (!medicoExcluido) {
      return res.status(404).json({
        erro: 'Médico não encontrado'
      });
    }

    return res.status(200).json({
      mensagem: 'Médico excluído com sucesso',
      medico: medicoExcluido
    });
  } catch (erro) {
    console.error('Erro ao excluir médico:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  cadastrarMedico,
  listarMedicos,
  editarMedico,
  excluirMedico
};