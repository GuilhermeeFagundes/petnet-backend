const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuarios.routes');

router.use('/usuarios', usuariosRoutes);


module.exports = router;