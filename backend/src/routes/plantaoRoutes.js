const express = require('express');

const plantaoController = require(
  '../controllers/plantaoController'
);

const router = express.Router();

router.get(
  '/',
  plantaoController.listarPlantoes
);

router.post(
  '/',
  plantaoController.cadastrarPlantao
);

router.put(
  '/:id',
  plantaoController.editarPlantao
);

router.delete(
  '/:id',
  plantaoController.excluirPlantao
);

module.exports = router;