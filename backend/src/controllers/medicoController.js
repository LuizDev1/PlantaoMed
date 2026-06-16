const medicoModel = require('../models/medicoModel');
const usuarioModel = require('../models/usuarioModel');
const candidaturaModel = require(
  '../models/candidaturaModel'
);

function normalizarTelefone(telefone) {
  return String(telefone || '').replace(/\D/g, '');
}

async function listarMedicos(req, res) {
  try {
    const medicos = await medicoModel.buscarTodos();

    return res.status(200).json(medicos);
  } catch (erro) {
    console.error('Erro ao listar médicos:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function cadastrarMedico(req, res) {
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

    const senha = String(
      req.body.senha || ''
    );

    const confirmarSenha = String(
      req.body.confirmarSenha || ''
    );

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

    if (senha.length < 6) {
      return res.status(400).json({
        erro: 'A senha deve possuir pelo menos 6 caracteres'
      });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({
        erro: 'A confirmação da senha está diferente'
      });
    }

    const medicos = await medicoModel.buscarTodos();

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

    const usuarioComMesmoEmail =
      await usuarioModel.buscarPorEmail(medico.email);

    if (usuarioComMesmoEmail) {
      return res.status(409).json({
        erro: 'Este e-mail já está sendo usado por um usuário'
      });
    }

    const novoMedico =
      await medicoModel.criarMedico(medico);

    try {
      const novoUsuario =
        await usuarioModel.criarUsuarioMedico({
          nome: novoMedico.nome,
          email: novoMedico.email,
          senha,
          medicoId: novoMedico.id
        });

      return res.status(201).json({
        mensagem:
          'Médico e usuário cadastrados com sucesso',

        medico: novoMedico,

        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          tipo: novoUsuario.tipo,
          medicoId: novoUsuario.medicoId
        }
      });
    } catch (erroUsuario) {
      // Desfaz o cadastro do médico caso a criação
      // do usuário apresente algum erro.
      await medicoModel.excluirMedico(novoMedico.id);

      throw erroUsuario;
    }
  } catch (erro) {
    console.error('Erro ao cadastrar médico:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function editarMedico(req, res) {
  try {
    const id = Number(req.params.id);

    const medicoExistente =
      await medicoModel.buscarPorId(id);

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

    const medicos = await medicoModel.buscarTodos();

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

    const usuarioVinculado =
      await usuarioModel.buscarPorMedicoId(id);

    const usuarioComMesmoEmail =
      await usuarioModel.buscarPorEmail(
        medicoAtualizado.email
      );

    if (
      usuarioComMesmoEmail &&
      Number(usuarioComMesmoEmail.medicoId) !== id
    ) {
      return res.status(409).json({
        erro: 'Este e-mail já está sendo usado por outro usuário'
      });
    }

    const senha = String(
      req.body.senha || ''
    );

    const confirmarSenha = String(
      req.body.confirmarSenha || ''
    );

    const desejaAlterarSenha =
      senha !== '' || confirmarSenha !== '';

    if (desejaAlterarSenha) {
      if (senha.length < 6) {
        return res.status(400).json({
          erro:
            'A nova senha deve possuir pelo menos 6 caracteres'
        });
      }

      if (senha !== confirmarSenha) {
        return res.status(400).json({
          erro:
            'A confirmação da nova senha está diferente'
        });
      }
    }

    if (!usuarioVinculado && !desejaAlterarSenha) {
      return res.status(400).json({
        erro:
          'Este médico ainda não possui acesso. Informe uma senha para criar o usuário'
      });
    }

    const resultado =
      await medicoModel.atualizarMedico(
        medicoAtualizado
      );

    let usuarioAtualizado;

    if (usuarioVinculado) {
      usuarioAtualizado =
        await usuarioModel.atualizarUsuarioPorMedicoId(
          id,
          {
            nome: medicoAtualizado.nome,
            email: medicoAtualizado.email,
            senha: desejaAlterarSenha
              ? senha
              : undefined
          }
        );
    } else {
      usuarioAtualizado =
        await usuarioModel.criarUsuarioMedico({
          nome: medicoAtualizado.nome,
          email: medicoAtualizado.email,
          senha,
          medicoId: id
        });
    }

    return res.status(200).json({
      mensagem:
        'Médico e usuário atualizados com sucesso',

      medico: resultado,

      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo,
        medicoId: usuarioAtualizado.medicoId
      }
    });
  } catch (erro) {
    console.error('Erro ao editar médico:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

async function excluirMedico(req, res) {
  try {
    const id = Number(req.params.id);

    const medicoExistente =
      await medicoModel.buscarPorId(id);

    if (!medicoExistente) {
      return res.status(404).json({
        erro: 'Médico não encontrado'
      });
    }

    // Remove todas as candidaturas vinculadas ao médico antes de excluí-lo
    await candidaturaModel.excluirCandidaturasPorMedicoId(id);

    const medicoExcluido = await medicoModel.excluirMedico(id);
    await usuarioModel.excluirUsuarioPorMedicoId(id);

    return res.status(200).json({
      mensagem:
        'Médico e usuário excluídos com sucesso',
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