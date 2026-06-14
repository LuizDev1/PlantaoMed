const express = require('express');
const medicoController = require(
  '../controllers/medicoController'
);

const router = express.Router();

router.get(
  '/',
  medicoController.listarMedicos
);

router.post(
  '/',
  medicoController.cadastrarMedico
);

router.put(
  '/:id',
  medicoController.editarMedico
);

router.delete(
  '/:id',
  medicoController.excluirMedico
);

module.exports = router;