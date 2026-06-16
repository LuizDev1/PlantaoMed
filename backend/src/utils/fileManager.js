const fs = require('fs');
const path = require('path');

const caminhoDados = path.join(__dirname, '../data/dados.json');

function lerDados() {
  try {
    const conteudo = fs.readFileSync(caminhoDados, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error('Erro ao ler o arquivo de dados:', erro.message);
    throw erro;
  }
}

function salvarDados(dados) {
  try {
    fs.writeFileSync(
      caminhoDados,
      JSON.stringify(dados, null, 2),
      'utf-8'
    );
  } catch (erro) {
    console.error('Erro ao salvar o arquivo de dados:', erro.message);
    throw erro;
  }
}

module.exports = {
  lerDados,
  salvarDados
};