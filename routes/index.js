var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var notificaciones = [];
  notificaciones.push({
    titulo: 'Titulo',
    descripcion: 'Descripción generalmente mas larga',
    fecha: new Date(),
    imagen: 'http://lorempixel.com/60/60'
  });
  notificaciones.push({
    titulo: 'Titulo 2',
    descripcion: 'Descripción generalmente mas larga 2',
    fecha: new Date(),
    imagen: 'http://lorempixel.com/60/60'
  });
  notificaciones.push({
    titulo: 'Titulo 3',
    descripcion: 'Descripción generalmente mas larga 3',
    fecha: new Date(),
    imagen: 'http://lorempixel.com/60/60'
  });
  notificaciones.push({
    titulo: 'Titulo 3',
    descripcion: 'Descripción generalmente mas larga 3',
    fecha: new Date(),
    imagen: 'http://lorempixel.com/60/60'
  });

  res.render('index', { 
    title: 'Express',
    notificaciones: notificaciones
  });
});

module.exports = router;
