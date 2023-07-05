//////////////////////////////// variables de audio
let monitorear = false;
let mic;
let pitch;
let audioContext;
let gestorAmp;
let gestorPitch;
let haySonido;
let antesHabiaSonido;
let estado = "selectorDeComposicion";
let newCuadrado;
let cuadrados = [];
let cuadradoFondo;
let nroCuadrado = 1;
let MIN_AMP = 0.05;
let MAX_AMP = 0.3;
let MIN_FREC = 90;
let MAX_FREC = 700;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';


//////////////////////////////// variables de tiempo
let tiempoTranscurrido = 0;
let marcaEnElTiempo;
let tiempoLimiteAgrega = 3000;
let tiempoLimiteSelecPatron = 5000;
let tiempoLimiteColor = 3000;
let tiempoReinicio = 15000;

//////////////////////////////// variables de tamaño
let tamanioSegunAmplitud = 0;
let calibradorMapeoTamanio = 600;
let limiteDeTamanioC1 = 0;
let limiteDeTamanioC2 = 0;
let limiteDeTamanioC3 = 0;
let limiteDeTamanioC45 = 0;

//////////////////////////////// variables de color
let startColor;
let endColor;
let hue1 = 0;
let hue2 = 0;

//////////////////////////////// variables de posición
let posInicialX;
let posInicialY;

//////////////////////////////// variables selector de patrones
let compImg1;
let compImg2;
let compImg3;
let nroPatronComp = 1;
let posXRectSelector = 0;
let posYRectSelector = 0;

let latestCuadrado = null;
let myCanvas;
let printSacado;

function setup() {
  myCanvas = createCanvas(600, 600);
  myCanvas.parent("canvas-container");

  //////////////////////////////// inicialización de variables de audio
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  gestorAmp = new GestorSenial(MIN_AMP, MAX_AMP);
  gestorPitch = new GestorSenial(MIN_FREC, MAX_FREC);
  userStartAudio();
  antesHabiaSonido = false;

  //////////////////////////////// seteo de modos
  rectMode(CENTER);
  imageMode(CENTER);
  colorMode(HSB);
  strokeCap(SQUARE);

  //////////////////////////////// inicialización de variables de tamaño
  posInicialX = width / 2;
  posInicialY = height / 2;

  //////////////////////////////// cargo las imágenes
  compImg1 = loadImage('imgs/1.png');
  compImg2 = loadImage('imgs/2.png');
  compImg3 = loadImage('imgs/3.png');

}

function draw() {


  background(0);

  let vol = mic.getLevel();
  gestorAmp.actualizar(vol);

  console.log("volumen: " + vol);
  haySonido = gestorAmp.filtrada > 0.1;

  let inicioElSonido = haySonido && !antesHabiaSonido;

  let finDelSonido = !haySonido && antesHabiaSonido;

  console.log("estado: " + estado);

  if (estado == "selectorDeComposicion") {
    colorBg = color(0, 0, 0);
    document.getElementById("acaVaElEstado").innerHTML = "Emita un sonido para elegir la composición y espere 5 segundos.";
    switch (nroPatronComp) {
      case 1:
        posXRectSelector = 120;
        posYRectSelector = 300;
        limiteDeTamanioC1 = 567;
        limiteDeTamanioC2 = 305;
        limiteDeTamanioC3 = 182;
        limiteDeTamanioC45 = 82;
        break;

      case 2:
        posXRectSelector = 300;
        posYRectSelector = 300;
        limiteDeTamanioC1 = 567;
        limiteDeTamanioC2 = 355;
        limiteDeTamanioC3 = 182;
        limiteDeTamanioC45 = 102;
        break;

      case 3:
        posXRectSelector = 480;
        posYRectSelector = 300;
        limiteDeTamanioC1 = 567;
        limiteDeTamanioC2 = 475;
        limiteDeTamanioC3 = 102;
        limiteDeTamanioC45 = limiteDeTamanioC3;
        break;
    }

    if (inicioElSonido) {
      nroPatronComp++;

      if (nroPatronComp > 3) {
        nroPatronComp = 1;
      }
    }

    if (finDelSonido) {
      marcaEnElTiempo = millis();
    }

    if (!haySonido) {
      let ahora = millis();
      tiempoTranscurrido = floor((millis() - marcaEnElTiempo) / 1000);
      textSize(28);
      fill(255);
      text(tiempoTranscurrido, 28, 568);
      if (ahora > (marcaEnElTiempo + tiempoLimiteSelecPatron)) {
        estado = "agregar";
        marcaEnElTiempo = millis();
      }
    }

    push();
    noStroke();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(207, 7, 99);
    rect(posXRectSelector, posYRectSelector, 154, 154);
    pop();

    // dibujo las opciones
    image(compImg1, 120, 300, 150, 150);
    image(compImg2, 300, 300, 150, 150);
    image(compImg3, 480, 300, 150, 150);
  }

  if (nroCuadrado == 4) {
    if (nroPatronComp == 1) {
      posInicialX = 147;
      posXCuadrado1 = height / 2;
    } else if (nroPatronComp == 2) {
      posInicialX = 122, 5;
      posInicialY = 260;
    } else if (nroPatronComp == 3) {
      posInicialX = 142;
      posInicialY = 260;
    }
  }

  if (nroCuadrado == 5) {
    if (nroPatronComp == 1) {
      posInicialX = 452;
      posInicialY = height / 2;
    } else if (nroPatronComp == 2) {
      posInicialX = 477, 5;
      posInicialY = 340;
    } else if (nroPatronComp == 3) {
      posInicialX = 457, 5;
      posInicialY = 340;
    }
  }

  cuadradoFondo = new Cuadrado(width / 2, height / 2, 623, 1);
  if (estado != "selectorDeComposicion") {
    cuadradoFondo.setTamanio(623);
    cuadradoFondo.setColor(108, 100, 40);
    cuadradoFondo.dibujar();
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////// ESTADO AGREGAR
  if (estado == "agregar") {
    document.getElementById("acaVaElEstado").innerHTML = "Agregar cuadrado";
    if (nroCuadrado == 6) {
      document.getElementById("acaVaElEstado").innerHTML = "Registrar obra y reinicio";
      document.getElementById("acaVaLaInstruccion").innerHTML = "Emita un sonido para registrar su obra y luego otro más para reiniciar";
      if (inicioElSonido) {
        if (!printSacado) {
          estado = "print";
        } else {
          estado = "reinicio";
        }
      }
    }

    //////////////////////////////// cambio de color el lienzo
    if (inicioElSonido) {

      let newCuadrado = new Cuadrado(posInicialX, posInicialY, false);
      cuadrados.push(newCuadrado);
      latestCuadrado = newCuadrado;

      switch (nroCuadrado) {
        case 1:
          calibradorMapeoTamanio = 600;
          break;

        case 2:
          calibradorMapeoTamanio = 600;
          break;

        case 3:
          calibradorMapeoTamanio = 100;
          break;

        case 4:
          calibradorMapeoTamanio = 100;
          break;
      }
    }

    if (haySonido) {
      if (nroCuadrado < 6) {
        estado = "tamanio";
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////// ESTADO TAMANIO
  } else if (estado == "tamanio") {
    document.getElementById("acaVaElEstado").innerHTML = "Cambiar tamaño";
    ///////////////////////////////////////////////////////////////////////////////////// HAY SONIDO
    if (haySonido) {
      for (let i = 0; i < cuadrados.length; i++) {
        if (cuadrados[i] === latestCuadrado) {
          let tamanioSegunAmplitud = map(gestorAmp.filtrada, MIN_AMP, MAX_AMP, 0, calibradorMapeoTamanio) // mapeo la señal filtrada para usarla como tamaño
          tamanioSegunAmplitud = parseInt(tamanioSegunAmplitud);

          if (nroCuadrado == 1 && tamanioSegunAmplitud >= limiteDeTamanioC1) {
            tamanioSegunAmplitud = limiteDeTamanioC1;
            estado = "color";
          } else if (nroCuadrado == 2 && tamanioSegunAmplitud >= 305) {
            tamanioSegunAmplitud = limiteDeTamanioC2;
            estado = "color";
          } else if (nroCuadrado == 3 && tamanioSegunAmplitud >= limiteDeTamanioC3) {
            tamanioSegunAmplitud = limiteDeTamanioC3;
            estado = "color";
          } else if (nroCuadrado == 4 || nroCuadrado == 5 && tamanioSegunAmplitud >= limiteDeTamanioC45) {
            estado = "color";
            tamanioSegunAmplitud = limiteDeTamanioC45;
          }

          cuadrados[i].setTamanio(tamanioSegunAmplitud);
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////// ESTADO COLOR
  else if (estado == "color") {
    document.getElementById("acaVaElEstado").innerHTML = "Elija el color variando la frecuencia de la voz";
    ///////////////////////////////////////////////////////////////////////////////////// HAY SONIDO
    if (haySonido) {
      for (let i = 0; i < cuadrados.length; i++) {
        if (cuadrados[i] === latestCuadrado) {
          cuadrados[i].setColor(gestorPitch.filtrada, 75, 75);
        }
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////// FIN DEL SONIDO
    if (finDelSonido) {
      marcaEnElTiempo = millis();
    }

    ///////////////////////////////////////////////////////////////////////////////////// NO HAY SONIDO
    if (!haySonido) {
      let ahora = millis();
      if (ahora > (marcaEnElTiempo + tiempoLimiteColor)) {
        estado = "agregar";
        nroCuadrado++;
        marcaEnElTiempo = millis();
      }
    }
  }

  else if (estado == "reinicio") {
    clear();
    cuadrados.length = 0;
    nroCuadrado = 1;
    posInicialX = width / 2;
    posInicialY = height / 2;
    estado = "selectorDeComposicion";
    document.getElementById("acaVaLaInstruccion").innerHTML = "";
  }

  for (let i = 0; i < cuadrados.length; i++) {
    cuadrados[i].dibujar();
  }

  if (monitorear) {

    push();
    rectMode(CORNER);
    stroke(0, 0, 255);
    //gestorPitch.dibujar(100, 300);
    gestorAmp.dibujar(100, 100);
    pop();
  }

  push();
  stroke(0, 0, 255);
  noFill();
  strokeWeight(20);
  rect(width / 2, height / 2, 587, 587);
  pop();
  antesHabiaSonido = haySonido;

  if (estado == "print") {
    saveCanvas(myCanvas, 'ingrese su nombre', 'jpg');
    printSacado = true;
    estado = "agregar";
  }
}

//--------------------------------------------------------------------
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}
//--------------------------------------------------------------------
function modelLoaded() {
  //select('#status').html('Model Loaded');
  getPitch();
  //console.log( "entro aca !" );

}
//--------------------------------------------------------------------
function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      let midiNum = freqToMidi(frequency);

      gestorPitch.actualizar(frequency);
      for (let i = 0; i < cuadrados.length; i++) {
        cuadrados[i].dibujar();
      }
    }
    getPitch();
  })
}


