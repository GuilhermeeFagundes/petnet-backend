const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios.controller');


router.get('/teste', usuarioController.testarRota);


module.exports = router;