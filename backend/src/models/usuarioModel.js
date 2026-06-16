const pool = require('../config/db');

async function buscarPorEmail(email) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE LOWER(email) = ?', [emailNormalizado]);
  return rows.length > 0 ? rows[0] : null;
}

async function buscarPorMedicoId(medicoId) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE medicoId = ?', [Number(medicoId)]);
  return rows.length > 0 ? rows[0] : null;
}

async function criarUsuarioMedico({ nome, email, senha, medicoId }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, tipo, medicoId) VALUES (?, ?, ?, ?, ?)',
    [String(nome).trim(), String(email).trim().toLowerCase(), String(senha), 'medico', Number(medicoId)]
  );
  return { id: result.insertId, nome, email, tipo: 'medico', medicoId };
}

async function atualizarUsuarioPorMedicoId(medicoId, novosDados) {
  const usuario = await buscarPorMedicoId(medicoId);
  if (!usuario) return null;

  const nome = novosDados.nome !== undefined ? String(novosDados.nome).trim() : usuario.nome;
  const email = novosDados.email !== undefined ? String(novosDados.email).trim().toLowerCase() : usuario.email;
  const senha = novosDados.senha ? String(novosDados.senha) : usuario.senha;

  await pool.query(
    'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE medicoId = ?',
    [nome, email, senha, Number(medicoId)]
  );

  return { ...usuario, nome, email, senha };
}

async function excluirUsuarioPorMedicoId(medicoId) {
  const usuario = await buscarPorMedicoId(medicoId);
  if (!usuario) return null;

  await pool.query('DELETE FROM usuarios WHERE medicoId = ?', [Number(medicoId)]);
  return usuario;
}

module.exports = {
  buscarPorEmail,
  buscarPorMedicoId,
  criarUsuarioMedico,
  atualizarUsuarioPorMedicoId,
  excluirUsuarioPorMedicoId
};