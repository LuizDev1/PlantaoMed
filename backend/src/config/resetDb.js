const pool = require('./db');
const initDb = require('./initDb');

async function resetDb() {
  try {
    const conexao = await pool.getConnection();

    await conexao.query('SET FOREIGN_KEY_CHECKS = 0');
    await conexao.query('DROP TABLE IF EXISTS candidaturas');
    await conexao.query('DROP TABLE IF EXISTS plantoes');
    await conexao.query('DROP TABLE IF EXISTS usuarios');
    await conexao.query('DROP TABLE IF EXISTS medicos');
    await conexao.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Tabelas antigas removidas com sucesso.');
    conexao.release();
    
    // Recriar tabelas e admin
    await initDb();
    console.log('Banco de dados resetado com sucesso.');
    process.exit(0);
  } catch (erro) {
    console.error('Erro ao resetar o banco de dados:', erro);
    process.exit(1);
  }
}

resetDb();
