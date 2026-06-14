const express = require('express');

const relatorioController = require(
  '../controllers/relatorioController'
);

const router = express.Router();

router.get(
  '/candidaturas',
  relatorioController.gerarRelatorioCandidaturas
);

module.exports = router;