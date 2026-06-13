const { lerDados } = require('../utils/fileManager');

function buscarPorEmail(email) {
  const dados = lerDados();

  return dados.usuarios.find(
    (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
  );
}

function buscarPorId(id) {
  const dados = lerDados();

  return dados.usuarios.find(
    (usuario) => usuario.id === Number(id)
  );
}

module.exports = {
  buscarPorEmail,
  buscarPorId
};