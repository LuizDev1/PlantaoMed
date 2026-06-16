const relatorioModel = require(
  '../models/relatorioModel'
);

async function gerarRelatorioCandidaturas(req, res) {
  try {
    const dadosRelatorio =
      await relatorioModel.gerarDadosRelatorio();

    return res.status(200).json(
      dadosRelatorio
    );
  } catch (erro) {
    console.error(
      'Erro ao gerar relatório:',
      erro
    );

    return res.status(500).json({
      erro:
        'Não foi possível gerar o relatório de candidaturas'
    });
  }
}

module.exports = {
  gerarRelatorioCandidaturas
};