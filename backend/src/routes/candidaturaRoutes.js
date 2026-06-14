const express = require('express');

const candidaturaController = require(
  '../controllers/candidaturaController'
);

const router = express.Router();

router.get(
  '/',
  candidaturaController.listarCandidaturas
);

router.post(
  '/',
  candidaturaController.cadastrarCandidatura
);

router.put(
  '/:id',
  candidaturaController.editarCandidatura
);

router.delete(
  '/:id',
  candidaturaController.excluirCandidatura
);

module.exports = router;