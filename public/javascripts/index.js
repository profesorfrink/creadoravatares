'use strict';

Handlebars.registerHelper('getNombre', function( objetoImagen ) {
  return objetoImagen.toObject().name;
});

Handlebars.registerHelper('isActive', function( index ) {
  var valor = '';
  if ( index === 0 ) {
    valor = 'active';
  } 
  return valor;
});

$(document).ready( function () {

  var ui = {
    $btnAleatorio: $('.js-aleatorio'),
    $btnDialog: $('.js-cuadro-prop'),
    $btnGuardar: $('.js-guardar'),
    $itemImagen: $('.js-item-imagen'),
    $contenedorTablaObjetos: $('#contenedorTablaObjetos'),
    $colorCara: $('#colorCara'),
    $colorPelo: $('#colorPelo')
  };

  var canvas = document.getElementById('avatar_canvas'),
      context = canvas.getContext('2d'),

      canvasAux = document.createElement('canvas'),
      contextAux = canvasAux.getContext('2d');

  var canvasFabric = new fabric.Canvas('canvas_fabric');

  var templates = {
    listaObjetos: Handlebars.compile( $('#tplListaObjetos').html() ),
    tabsObjetos: Handlebars.compile( $('#tplTabsObjetos').html() )
  };
  
  var OPCIONES = {
      cara: 0,
      colorCara : 0,
      ojos: 0,
      nariz: 0,
      boca: 0,
      pelo: 0,
      colorPelo: 0,
      cuerpo: 0
  };

  ui.$btnDialog.on('click', function (e) {
    e.preventDefault();
    ui.$contenedorTablaObjetos.dialog({
        position: {
           my: "center",
           at: "center",
           of: window
        }
    });
    // ui.$contenedorTablaObjetos.dialog();
  });

  ui.$btnGuardar.on('click', function (e) {
    e.preventDefault();
    DownloadImage();

  });
  ui.$btnAleatorio.on('click', function (e) {
    e.preventDefault();
    avatarAleatorio();
  });

  ui.$itemImagen.on('click', function (e) {
    e.preventDefault();
    var $item = $(e.currentTarget);
    // var $tabContenedor = $item.parentsUntil('.tab-content');
    OPCIONES[$item.attr('data-nombre')] = parseInt($item.attr('data-num'));

    var imagenTemp = new Image();
    var item = _.find( imagenes, { nombre: $item.attr('data-nombre') });

    if (! item ) return false;

   
    var imagenTemp = new Image();
    imagenTemp.src = getItemImageSrc( item );

    imagenTemp.addEventListener('load', function() {
      var objsCanvas = canvasFabric.getObjects();

    _.each( objsCanvas, function ( objeto ) {
      if ( objeto.toObject().name === item.nombre ) {
        objeto.setElement( imagenTemp );
        canvasFabric.renderAll();
        dibujarListaObjetos();
        return;
      }
    });
    })
    

    //dibujar();
  });


  ui.$contenedorTablaObjetos
    .on('click', '.js-seleccionar-objeto', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      canvasFabric.setActiveObject( objetoSeleccionado );
      
      canvasFabric.renderAll();
    })
    .on('click', '.js-flip-x', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      var valorActual = objetoSeleccionado.get('flipX');
      objetoSeleccionado.set('flipX', !valorActual);
      canvasFabric.renderAll();

    })
    .on('click', '.js-flip-y', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      var valorActual = objetoSeleccionado.get('flipY');
      objetoSeleccionado.set('flipY', !valorActual);
      canvasFabric.renderAll();
    })
    .on('click', '.js-mover-arriba', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      var valorActual = objetoSeleccionado.get('flipY');
      objetoSeleccionado.set('top', parseInt(objetoSeleccionado.get('top')) - 1);
      canvasFabric.renderAll();
    })
    .on('click', '.js-mover-abajo', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      
      objetoSeleccionado.set('top', parseInt(objetoSeleccionado.get('top')) + 1);
      canvasFabric.renderAll();
    })
    .on('click', '.js-mover-izquierda', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      
      objetoSeleccionado.set('left', parseInt(objetoSeleccionado.get('left')) - 1);
      canvasFabric.renderAll();
    })
    .on('click', '.js-mover-derecha', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      
      objetoSeleccionado.set('left', parseInt(objetoSeleccionado.get('left')) + 1);
      canvasFabric.renderAll();
    })
    .on('click', '.js-traer-frente', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      canvasFabric.bringToFront(objetoSeleccionado);
      canvasFabric.renderAll();
    })
    .on('click', '.js-traer-adelante', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      canvasFabric.bringForward(objetoSeleccionado);
      canvasFabric.renderAll();
    })
    .on('click', '.js-enviar-fondo', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      objetoSeleccionado.sendToBack();
      canvasFabric.sendToBack(objetoSeleccionado);
      canvasFabric.renderAll();
    })
    .on('click', '.js-enviar-atras', function (e) {
      e.preventDefault();
      var index = parseInt( $(e.currentTarget).attr('data-index') );
      var objetoSeleccionado = canvasFabric.getObjects()[index];
      objetoSeleccionado.sendBackwards();
      canvasFabric.sendBackwards(objetoSeleccionado);
      canvasFabric.renderAll();
    });

  ui.$colorCara.on('change', function(e) {
    OPCIONES.colorPelo = ui.$colorPelo.val();
    dibujar();
  });

  ui.$colorPelo.on('change', function(e) {
    OPCIONES.colorPelo = ui.$colorPelo.val();
    dibujar();
  });

  canvasAux.width = canvas.width;
  canvasAux.height = canvas.height;

  var contadorImagenes = 0;
  $.each( imagenes, function (idx, val ) {
    
    var img = new Image();
    img.src = val.src;

    val.objImagen = img;

    if ( val.relleno ) {
      var imgRelleno = new Image();
      imgRelleno.src = val.imagenColor;
      val.objImagenColor = imgRelleno;
    }    

    img.addEventListener('load', function () {
      contadorImagenes++;
      if ( contadorImagenes === imagenes.length ) {
        console.log('Imagenes cargadas');
        avatarAleatorio();
      }  
    
    });

  });


  
  function avatarAleatorio(){
    OPCIONES.boca = Math.floor( Math.random() * 12 );
    OPCIONES.cabeza = Math.floor( Math.random() * 6 );
    OPCIONES.idPiel = ['#ffd7c7','#f3bc85','#c4874e','#9f6946','#724422','#41261e'] [Math.floor( Math.random() * 8 )];
    OPCIONES.nariz = Math.floor( Math.random() * 12 );
    OPCIONES.ojos = Math.floor( Math.random() * 12 );
    OPCIONES.cuerpo = Math.floor( Math.random() * 24 );
    // OPCIONES.idColorPelo = Math.floor( Math.random() * 8 );
    OPCIONES.pelo = Math.floor( Math.random() * 21 );

    dibujar();
  }

  function dibujarRelleno (color_image, line_image, sx, sy, sw, sh, dx, dy, dw, dh, color) {
    contextAux.clearRect( 0, 0,canvasAux.width, canvasAux.height);
    contextAux.drawImage(color_image, sx, sy, sw, sh, dx, dy, dw, dh);
    contextAux.globalCompositeOperation = "source-atop"; // draw the color in the shape of the hair
    contextAux.fillStyle = color;
    contextAux.fillRect(dx,dy,dw,dh);
    contextAux.globalCompositeOperation = "source-over"; // back to normal
        
    context.drawImage(canvasAux,0,0); // draw the color
    context.drawImage(line_image, sx, sy, sw, sh, dx, dy, dw, dh); // draw the line on top
  }
  
  function dibujarItem( nombreItem, filas, columnas, color ) {

    /*
      img Specifies the image, canvas, or video element to use   
      sx  Optional. The x coordinate where to start clipping  Play it »
      sy  Optional. The y coordinate where to start clipping  Play it »
      swidth  Optional. The width of the clipped image  Play it »
      sheight Optional. The height of the clipped image Play it »
      x The x coordinate where to place the image on the canvas Play it »
      y The y coordinate where to place the image on the canvas Play it »
      width Optional. The width of the image to use (stretch or reduce the image) Play it »
      height  Optional. The height of the image to use (stretch or reduce the image)
    */

    var item = _.find( imagenes, { nombre: nombreItem });

    if ( !item ) return false;

   
    var imagenParte = new Image();
    imagenParte.src = getItemImageSrc( item );

    imagenParte.addEventListener( 'load', function () {
      var imgInstance = new fabric.Image(imagenParte, {
        left: item.coordX,
        top: item.coordY
      });

      imgInstance.toObject = function() {
        return { name: nombreItem };
      };

      imgInstance.set({
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        selectable: false
      });
      canvasFabric.add(imgInstance);
      dibujarListaObjetos();
    });
    
    
  }


  function getItemImageSrc ( item ) {

    var imagen = new Image();
    imagen.src = item.src;

    var datosDibujo = {
      
      width: item.width,
      height: item.height,
      row: Math.floor( OPCIONES[ item.nombre ] / item.columnas),
      col: OPCIONES[ item.nombre ] % item.columnas,
      coordX: item.coordX,
      coordY: item.coordY
    }

    datosDibujo.desdeX = parseInt(datosDibujo.width * datosDibujo.col );
    datosDibujo.desdeY = parseInt( datosDibujo.height * datosDibujo.row );
    
    var imagenParte = new Image ();
    
    if ( item.relleno ) {
      
      var imgColor = new Image();
      imgColor.src = item.imagenColor;

      if ( item.nombre === 'cabeza') {
        datosDibujo.color = ui.$colorCara.val();
      } else {
        datosDibujo.color = ui.$colorPelo.val();
      }

      //dibujarRelleno ( item.objImagenColor, item.objImagen, datosDibujo.desdeX, datosDibujo.desdeY, datosDibujo.width, datosDibujo.height, datosDibujo.coordX, datosDibujo.coordY, datosDibujo.width, datosDibujo.height, datosDibujo.color )
      imagenParte.src = dibujarParteColor( 
        item.objImagenColor, 
        item.objImagen, 
        datosDibujo.desdeX, 
        datosDibujo.desdeY, 
        datosDibujo.width, 
        datosDibujo.height, 
        datosDibujo.coordX, 
        datosDibujo.coordY, 
        datosDibujo.width, 
        datosDibujo.height, 
        datosDibujo.color 
      );
    } else {
      //context.drawImage( item.objImagen, datosDibujo.desdeX , datosDibujo.desdeY , datosDibujo.width, datosDibujo.height, datosDibujo.coordX, datosDibujo.coordY, datosDibujo.width, datosDibujo.height);
      
      imagenParte.src = dibujarParte ( 
        item.objImagen, 
        datosDibujo.desdeX , 
        datosDibujo.desdeY , 
        datosDibujo.width, 
        datosDibujo.height, 
        datosDibujo.coordX, 
        datosDibujo.coordY 
      );
      
    }
    return imagenParte.src;
  }

  function dibujarListaObjetos () {
    var html = templates.tabsObjetos( { objetos : canvasFabric.getObjects() });
    ui.$contenedorTablaObjetos.html( html );

    if ( !ui.$contenedorTablaObjetos.dialog( 'instance' ) ) {
      ui.$contenedorTablaObjetos.dialog({
        position: {
           my: "center",
           at: "center",
           of: window
        }
      });
    }
    
  }

  function dibujarParte ( objImagen, desdeX, desdeY, width, height, CoordX, CoordY ) {
    var canvasParte = document.createElement('canvas');
    canvasParte.width = width;
    canvasParte.height = height;
    var contextParte = canvasParte.getContext('2d');
    contextParte.clearRect(0, 0, canvasParte.width, canvasParte.height);
    contextParte.drawImage( objImagen, desdeX , desdeY , width, height, 0, 0, width, height);
    return canvasParte.toDataURL();
  }

  function dibujarParteColor (color_image, line_image, sx, sy, sw, sh, dx, dy, dw, dh, color) {
    dx = 0;
    dy = 0;
    var canvasColor = document.createElement('canvas');
    canvasColor.width = sw;
    canvasColor.height = sh;
    var contextColor = canvasColor.getContext('2d');


    var canvasParte = document.createElement('canvas');
    canvasParte.width = sw;
    canvasParte.height = sh;
    var contextParte = canvasParte.getContext('2d');

    contextColor.clearRect( 0, 0, sw,  sh );
    contextColor.drawImage(color_image, sx, sy, sw, sh, 0, 0, sw, sh);
    contextColor.globalCompositeOperation = "source-atop"; // draw the color in the shape of the hair
    contextColor.fillStyle = color;
    contextColor.fillRect(dx,dy,dw,dh);
    contextColor.globalCompositeOperation = "source-over"; // back to normal
        
    contextParte.drawImage( canvasColor, 0, 0); // draw the color
    contextParte.drawImage( line_image, sx, sy, sw, sh, dx, dy, sw, sh); // draw the line on top

    return canvasParte.toDataURL();
  }

  function dibujar() {
    canvasFabric.clear();
    context.clearRect(0,0,canvas.width, canvas.height);
    dibujarItem('cuerpo', 4, 6, '#FFFFFF');
    dibujarItem('cabeza', 1, 6, '#FFFFFF');
    dibujarItem('ojos', 2, 6, '#FFFFFF');
    dibujarItem('nariz', 2, 6, '#FFFFFF');
    dibujarItem('boca', 2, 6, '#FFFFFF');
    dibujarItem('pelo', 3, 7, '#FFFFFF');
    canvasFabric.renderAll();
    
  }  
  function DownloadImage() {
       
    try {
        //canvasFabric.setActiveObject( canvasFabric.getObjects()[0]);
        var rawImageData = canvasFabric.toDataURL('image/jpeg', 0.76);
        rawImageData = rawImageData.replace('image/png', 'image/octet-stream');
        var link = document.createElement('a');
        link.download = 'avatar.png';
        link.href = rawImageData;
        link.click();
        
    }
    catch (err) {
        
        alert("Su navegador no permite descargar, haga click derecho en la imagen y use guardar imagen como...");
    }

    return true;
  }

});