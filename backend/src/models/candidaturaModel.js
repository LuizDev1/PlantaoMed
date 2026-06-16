const pool = require('../config/db');

function validarDados(candidatura) {
  const medicoIdValido = Number.isInteger(Number(candidatura.medicoId)) && Number(candidatura.medicoId) > 0;
  const plantaoIdValido = Number.isInteger(Number(candidatura.plantaoId)) && Number(candidatura.plantaoId) > 0;
  const dataValida = typeof candidatura.dataCandidatura === 'string' && candidatura.dataCandidatura.trim() !== '';
  const statusValido = typeof candidatura.status === 'string' && candidatura.status.trim() !== '';

  return medicoIdValido && plantaoIdValido && dataValida && statusValido;
}

async function criarCandidatura(candidatura) {
  const medicoId = Number(candidatura.medicoId);
  const plantaoId = Number(candidatura.plantaoId);
  const dataCandidatura = candidatura.dataCandidatura.trim();
  const status = candidatura.status.trim();

  const [result] = await pool.query(
    'INSERT INTO candidaturas (medicoId, plantaoId, dataCandidatura, status) VALUES (?, ?, ?, ?)',
    [medicoId, plantaoId, dataCandidatura, status]
  );

  return { id: result.insertId, medicoId, plantaoId, dataCandidatura, status };
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM candidaturas WHERE id = ?', [Number(id)]);
  if (rows.length === 0) return null;
  const row = rows[0];
  if (row.dataCandidatura instanceof Date) {
      row.dataCandidatura = row.dataCandidatura.toISOString().split('T')[0];
  }
  return row;
}

async function buscarTodos() {
  const [rows] = await pool.query('SELECT * FROM candidaturas');
  return rows.map(row => {
    if (row.dataCandidatura instanceof Date) {
        row.dataCandidatura = row.dataCandidatura.toISOString().split('T')[0];
    }
    return row;
  });
}

async function atualizarCandidatura(candidaturaAtualizado) {
  const id = Number(candidaturaAtualizado.id);
  const medicoId = Number(candidaturaAtualizado.medicoId);
  const plantaoId = Number(candidaturaAtualizado.plantaoId);
  const dataCandidatura = candidaturaAtualizado.dataCandidatura.trim();
  const status = candidaturaAtualizado.status.trim();

  const [result] = await pool.query(
    'UPDATE candidaturas SET medicoId = ?, plantaoId = ?, dataCandidatura = ?, status = ? WHERE id = ?',
    [medicoId, plantaoId, dataCandidatura, status, id]
  );

  if (result.affectedRows === 0) return null;

  return { id, medicoId, plantaoId, dataCandidatura, status };
}

async function atualizarMultiplasCandidaturas(plantaoId, statusAtual, novoStatus) {
  // Atualiza em massa o status das candidaturas de um mesmo plantão.
  await pool.query(
    'UPDATE candidaturas SET status = ? WHERE plantaoId = ? AND status = ?',
    [novoStatus, plantaoId, statusAtual]
  );
}

async function excluirCandidatura(id) {
  const candidatura = await buscarPorId(id);
  if (!candidatura) return null;

  await pool.query('DELETE FROM candidaturas WHERE id = ?', [Number(id)]);
  return candidatura;
}

async function excluirCandidaturasPorMedicoId(medicoId) {
  await pool.query('DELETE FROM candidaturas WHERE medicoId = ?', [Number(medicoId)]);
}

async function excluirCandidaturasPorPlantaoId(plantaoId) {
  await pool.query('DELETE FROM candidaturas WHERE plantaoId = ?', [Number(plantaoId)]);
}

module.exports = {
  criarCandidatura,
  buscarPorId,
  buscarTodos,
  atualizarCandidatura,
  excluirCandidatura,
  excluirCandidaturasPorMedicoId,
  excluirCandidaturasPorPlantaoId,
  atualizarMultiplasCandidaturas,
  validarDados
};