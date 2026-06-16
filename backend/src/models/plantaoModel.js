const pool = require('../config/db');

function validarDados(plantao) {
  const dataValida = typeof plantao.data === 'string' && plantao.data.trim() !== '';
  const horarioValido = typeof plantao.horario === 'string' && plantao.horario.trim() !== '';
  const valorValido = plantao.valor !== '' && Number.isFinite(Number(plantao.valor)) && Number(plantao.valor) >= 0;
  const statusValido = typeof plantao.status === 'string' && plantao.status.trim() !== '';

  return dataValida && horarioValido && valorValido && statusValido;
}

async function criarPlantao(plantao) {
  const data = plantao.data.trim();
  const horario = plantao.horario.trim();
  const valor = Number(plantao.valor);
  const status = plantao.status.trim();

  const [result] = await pool.query(
    'INSERT INTO plantoes (data, horario, valor, status) VALUES (?, ?, ?, ?)',
    [data, horario, valor, status]
  );
  
  return { id: result.insertId, data, horario, valor, status };
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM plantoes WHERE id = ?', [Number(id)]);
  if (rows.length === 0) return null;
  // Format date to YYYY-MM-DD
  const row = rows[0];
  if (row.data instanceof Date) {
      row.data = row.data.toISOString().split('T')[0];
  }
  return row;
}

async function buscarTodos() {
  const [rows] = await pool.query('SELECT * FROM plantoes');
  return rows.map(row => {
    if (row.data instanceof Date) {
        row.data = row.data.toISOString().split('T')[0];
    }
    return row;
  });
}

async function atualizarPlantao(plantaoAtualizado) {
  const id = Number(plantaoAtualizado.id);
  const data = plantaoAtualizado.data.trim();
  const horario = plantaoAtualizado.horario.trim();
  const valor = Number(plantaoAtualizado.valor);
  const status = plantaoAtualizado.status.trim();

  const [result] = await pool.query(
    'UPDATE plantoes SET data = ?, horario = ?, valor = ?, status = ? WHERE id = ?',
    [data, horario, valor, status, id]
  );

  if (result.affectedRows === 0) return null;

  return { id, data, horario, valor, status };
}

async function excluirPlantao(id) {
  const plantao = await buscarPorId(id);
  if (!plantao) return null;

  await pool.query('DELETE FROM plantoes WHERE id = ?', [Number(id)]);
  return plantao;
}

async function cancelarPlantao(id) {
  const plantao = await buscarPorId(id);
  if (!plantao) return null;

  await pool.query('UPDATE plantoes SET status = "Cancelado" WHERE id = ?', [Number(id)]);
  plantao.status = 'Cancelado';
  return plantao;
}

module.exports = {
  criarPlantao,
  buscarPorId,
  buscarTodos,
  atualizarPlantao,
  excluirPlantao,
  cancelarPlantao,
  validarDados
};