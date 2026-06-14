const pool = require('../config/db');

function validarDados(medico) {
  const nomeValido = typeof medico.nome === 'string' && medico.nome.trim() !== '';
  const emailValido = typeof medico.email === 'string' && medico.email.trim() !== '' && medico.email.includes('@');
  const especialidadeValida = typeof medico.especialidade === 'string' && medico.especialidade.trim() !== '';
  const telefoneValido = typeof medico.telefone === 'string' && medico.telefone.trim() !== '';

  return nomeValido && emailValido && especialidadeValida && telefoneValido;
}

async function criarMedico(medico) {
  const nome = medico.nome.trim();
  const email = medico.email.trim().toLowerCase();
  const especialidade = medico.especialidade.trim();
  const telefone = medico.telefone.trim();

  const [result] = await pool.query(
    'INSERT INTO medicos (nome, email, especialidade, telefone) VALUES (?, ?, ?, ?)',
    [nome, email, especialidade, telefone]
  );
  
  return { id: result.insertId, nome, email, especialidade, telefone };
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM medicos WHERE id = ?', [Number(id)]);
  return rows.length > 0 ? rows[0] : null;
}

async function buscarTodos() {
  const [rows] = await pool.query('SELECT * FROM medicos');
  return rows;
}

async function atualizarMedico(medicoAtualizado) {
  const id = Number(medicoAtualizado.id);
  const nome = medicoAtualizado.nome.trim();
  const email = medicoAtualizado.email.trim().toLowerCase();
  const especialidade = medicoAtualizado.especialidade.trim();
  const telefone = medicoAtualizado.telefone.trim();

  const [result] = await pool.query(
    'UPDATE medicos SET nome = ?, email = ?, especialidade = ?, telefone = ? WHERE id = ?',
    [nome, email, especialidade, telefone, id]
  );

  if (result.affectedRows === 0) return null;

  return { id, nome, email, especialidade, telefone };
}

async function excluirMedico(id) {
  const medico = await buscarPorId(id);
  if (!medico) return null;

  await pool.query('DELETE FROM medicos WHERE id = ?', [Number(id)]);
  return medico;
}

module.exports = {
  criarMedico,
  buscarPorId,
  buscarTodos,
  atualizarMedico,
  excluirMedico,
  validarDados
};