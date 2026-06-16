const usuarioModel = require('../models/usuarioModel');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'E-mail e senha são obrigatórios'
      });
    }

    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos'
      });
    }

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        medicoId: usuario.medicoId || null
      }
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

function logout(req, res) {
  return res.status(200).json({
    mensagem: 'Logout realizado com sucesso'
  });
}

module.exports = {
  login,
  logout
};