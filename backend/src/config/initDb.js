const pool = require('./db');

async function initDb() {
  try {
    const conexao = await pool.getConnection();

    await conexao.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        tipo ENUM('administrador', 'medico') NOT NULL,
        medicoId INT NULL
      )
    `);

    await conexao.query(`
      CREATE TABLE IF NOT EXISTS medicos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        especialidade VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL
      )
    `);

    await conexao.query(`
      CREATE TABLE IF NOT EXISTS plantoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data DATE NOT NULL,
        horario VARCHAR(10) NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);

    await conexao.query(`
      CREATE TABLE IF NOT EXISTS candidaturas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        medicoId INT NOT NULL,
        plantaoId INT NOT NULL,
        dataCandidatura DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        FOREIGN KEY (medicoId) REFERENCES medicos(id) ON DELETE CASCADE,
        FOREIGN KEY (plantaoId) REFERENCES plantoes(id) ON DELETE CASCADE
      )
    `);

    console.log('Tabelas inicializadas com sucesso.');
    conexao.release();
  } catch (erro) {
    console.error('Erro ao inicializar tabelas no banco de dados:', erro);
  }
}

module.exports = initDb;
