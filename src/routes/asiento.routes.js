const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosAsientos,obtenerTodosAsientosPlan,obtenerAsiento,crearAsiento,actualizarAsiento,anularAsiento,eliminarAsiento} = require('../controllers/asiento.controllers')


router.get('/asiento/:fecha_ini/:fecha_proceso', obtenerTodosAsientos);//aumentado fecha_ini new 
router.get('/asiento/:fecha_ini/:fecha_proceso', obtenerTodosAsientosPlan);

router.get('/asiento/:cod/:serie/:num/:elem', obtenerAsiento);
router.post('/asiento', crearAsiento);
router.put('/asiento/:cod/:serie/:num/:elem', actualizarAsiento);
router.put('/asiento/:cod/:serie/:num/:elem/anular', anularAsiento);
router.delete('/asiento/:cod/:serie/:num/:elem', eliminarAsiento);

module.exports = router;