// Biel Serrano Sánchez
// DAW2 Escola Jesuïtes El Clot
// Curs 2019-20

window.addEventListener(
  'load',
  () => {
    // comprova si el navegador és compatible amb canvas
    try {
      document.createElement('canvas').getContext('2d');
    } catch (e) {
      document.getElementById('area-dibuix').innerHTML =
        'HTML5 Canvas no suportat.';
    }

    /**************** INICIALITZACIÓ CANVAS ****************/
    // recull el canvas i el context del HTML
    let canvas = document.getElementById('area-dibuix');
    let ctx = canvas.getContext('2d');

    // recull el div contenidor dels canvas per calcular la mida
    // dels canvas
    // getComputedStyle recull les característiques del div (alçada, amplada)
    let painting = document.getElementById('paint');
    let paintStyle = getComputedStyle(painting);

    // s'assignen els valors d'alçada i amplada
    canvas.width = parseInt(paintStyle.getPropertyValue('width'));
    canvas.height = parseInt(paintStyle.getPropertyValue('height'));

    // creació canvas temporal
    let tmpCanvas = document.createElement('canvas');
    let tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    canvas.parentNode.insertBefore(tmpCanvas, canvas);

    // variable per guardar una còpia del canvas
    // amb l'aspecte anterior a una acció nova
    // per l'acció de DESFER
    let copiaCanvas = document.createElement('canvas');
    let copiaCanvasCtx = copiaCanvas.getContext('2d');
    copiaCanvas.width = canvas.width;
    copiaCanvas.height = canvas.height;

    // valors per defecte pel tipus de traç (mida, color, etc)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    tmpCtx.strokeStyle = '#000';
    tmpCtx.lineWidth = 3;
    tmpCtx.lineJoin = 'round';
    tmpCtx.lineCap = 'round';

    /**************** INICIALITZACIÓ CANVAS ****************/

    /**************** VARIABLES GLOBALS ****************/

    // variables que recullen les coordinades del ratolí
    let mouse = { x: 0, y: 0 };
    let startMouse = { x: 0, y: 0 };
    let puntsCursor = [];

    // variable global pel ratio per l'efecte de blur
    let ratioBlur = 2;

    // l'eina per defecte és el pincell
    let eina = (einaAnterior = 'pincell');
    document.getElementById(`btn-${eina}`).style.backgroundColor = '#aef1c1';

    // opció fill per les formes geomètriques
    let fill = false;

    // variable que guarda els graus d'inclinació a l'hora de dibuixar
    let graus = 0;

    // variables per l'escala de les formes
    let escalaX = (escalaY = 1);

    // variables per la informació del text (tipus de font, mida)
    let midaText = 12;
    let fontFamily = 'Montserrat';

    // imatge pel stamp de l'estrella
    let imatgeEstrella = new Image();
    imatgeEstrella.src = 'img/pattern-estrella.png';

    // imatges pels patterns
    let imatgePatternHex = new Image();
    let patternHex;
    imatgePatternHex.src = 'img/pattern-hex.jpg';
    imatgePatternHex.onload = () => {
      patternHex = ctx.createPattern(imatgePatternHex, 'repeat');
    };
    let imatgePatternStriped = new Image();
    let patternStriped;
    imatgePatternStriped.src = 'img/pattern-striped.jpg';
    imatgePatternStriped.onload = () => {
      patternStriped = ctx.createPattern(imatgePatternStriped, 'repeat');
    };

    /**************** VARIABLES GLOBALS ****************/

    /************ FUNCIONS GENERALS ************/

    let obtenirPosicioCursor = () => {
      let rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    let obtenirPosicioCursorAmbStartMouse = () => {
      let rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      startMouse.x = mouse.x;
      startMouse.y = mouse.y;
    };

    let canviaColor = () => {
      ctx.strokeStyle = document.getElementById('btn-color-pick').value;
      ctx.fillStyle = document.getElementById('btn-color-pick').value;
    };

    let canviaMidaPincell = () => {
      ctx.lineWidth = document.getElementById('mida-pincell').value;
      document.getElementById('valor-mida-pincell').innerHTML = ctx.lineWidth;
    };

    let canviaFonsEinaSeleccionada = () => {
      console.log(
        `canvia fons eina seleccionada, einaAnterior: ${einaAnterior} eina: ${eina}`
      );

      // primer treu el fons de l'eina seleccionada anteriorment
      document.getElementById(`btn-${einaAnterior}`).style.backgroundColor =
        'transparent';

      // després posa el fons a l'eina actual
      document.getElementById(`btn-${eina}`).style.backgroundColor = '#aef1c1';

      einaAnterior = eina;
    };

    let onPaint = () => {
      console.log('onPaint');
      if (eina == 'pincell') {
        canvas.addEventListener('mousemove', onPaintPincell, false);
        onPaintPincell();
      } else if (eina == 'linia') {
        canvas.addEventListener('mousemove', onPaintLinia, false);
        onPaintLinia();
      } else if (eina == 'cercle') {
        canvas.addEventListener('mousemove', onPaintCercle, false);
        onPaintCercle();
      } else if (eina == 'rectangle') {
        canvas.addEventListener('mousemove', onPaintRect, false);
        onPaintRect();
      } else if (eina == 'ellipse') {
        canvas.addEventListener('mousemove', onPaintEllipse, false);
        onPaintEllipse();
      } else if (eina == 'estrella') {
        // aplica l'escala que s'ha indicat
        tmpCtx.scale(escalaX, escalaY);

        // comprova si s'ha indicat un num de graus de rotació
        if (graus != 0) {
          // si és el cas, es canvia el punt d'origen del canvas
          // al punt del
          tmpCtx.save();
          tmpCtx.translate(
            mouse.x - imatgeEstrella.width / 2,
            mouse.y - imatgeEstrella.height / 2
          );
          tmpCtx.rotate((graus * Math.PI) / 180);
          tmpCtx.drawImage(imatgeEstrella, 0, 0);
          tmpCtx.restore();
        } else {
          tmpCtx.drawImage(
            imatgeEstrella,
            mouse.x - imatgeEstrella.width / 2,
            mouse.y - imatgeEstrella.height / 2
          );
        }

        // retorna l'escala a la normalitat
        tmpCtx.setTransform(1, 0, 0, 1, 0, 0);
      } else if (eina == 'text') {
        console.log(`${document.getElementById('text').value}`);
        ctx.font = `${midaText}px ${fontFamily}`;

        // comprova si s'ha d'aplicar alguna rotació al text
        console.log(graus);
        if (graus != 0) {
          console.log('Texto con rotate');

          ctx.save();
          ctx.translate(mouse.x, mouse.y);
          ctx.rotate((graus * Math.PI) / 180);
          if (fill) {
            ctx.fillText(
              document.getElementById('text').value,
              -mouse.x,
              -mouse.y
            );
          } else {
            ctx.lineWidth = 1;
            ctx.strokeText(
              document.getElementById('text').value,
              mouse.x,
              mouse.y
            );
            canviaMidaPincell();
          }
          ctx.restore();
        } else {
          if (fill) {
            ctx.fillText(
              document.getElementById('text').value,
              mouse.x,
              mouse.y
            );
          } else {
            ctx.lineWidth = 1;
            ctx.strokeText(
              document.getElementById('text').value,
              mouse.x,
              mouse.y
            );
            canviaMidaPincell();
          }
        }
      } else if (eina == 'goma') {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        onErase();
      }
    };

    /************ FUNCIONS GENERALS ************/

    /************ EVENT LISTENERS ************/

    // event listener per recollir les coordinades del cursor
    canvas.addEventListener('mousemove', obtenirPosicioCursor, false);

    // event listener per començar a dibuixar
    canvas.addEventListener(
      'mousedown',
      e => {
        obtenirPosicioCursorAmbStartMouse();
        //canviaColor(); // per assegurar-nos de que sempre té el color escollit al color-picker
        console.log(`FillStyle: ${ctx.fillStyle}`);
        onPaint();
      },
      false
    );

    // event listener per deixar de dibuixar
    canvas.addEventListener(
      'mouseup',
      e => {
        if (eina == 'pincell') {
          canvas.removeEventListener('mousemove', onPaintPincell, false);
        } else if (eina == 'linia') {
          canvas.removeEventListener('mousemove', onPaintLinia, false);
        } else if (eina == 'cercle') {
          canvas.removeEventListener('mousemove', onPaintCercle, false);
        } else if (eina == 'rectangle') {
          canvas.removeEventListener('mousemove', onPaintRect, false);
        } else if (eina == 'ellipse') {
          canvas.removeEventListener('mousemove', onPaintEllipse, false);
        }

        // copia el canvas actual per si es vol desfer l'acció
        copiaCanvasCtx.drawImage(canvas, 0, 0);

        // es dibuixa en el canvas final i es neteja el temporal
        ctx.drawImage(tmpCanvas, 0, 0);
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

        // es retorna a 0 l'array de punts del cursor
        puntsCursor = [];
      },
      false
    );

    /************ EVENT LISTENERS ************/

    /************ FUNCIONS EINES ************/

    // PINCELL
    let onPaintPincell = () => {
      puntsCursor.push({
        x: mouse.x,
        y: mouse.y,
      });

      if (puntsCursor.length < 3) {
        let b = puntsCursor[0];
        tmpCtx.lineWidth = ctx.lineWidth;
        /*tmpCtx.lineJoin = 'round';
                tmpCtx.lineCap = 'round';*/
        tmpCtx.strokeStyle = ctx.strokeStyle;
        tmpCtx.fillStyle = ctx.strokeStyle;
        tmpCtx.beginPath();
        tmpCtx.arc(b.x, b.y, tmpCtx.lineWidth / 2, 0, Math.PI * 2, !0);
        tmpCtx.fill();
        tmpCtx.closePath();

        return;
      }

      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

      tmpCtx.beginPath();
      tmpCtx.moveTo(puntsCursor[0].x, puntsCursor[0].y);

      for (var i = 1; i < puntsCursor.length - 2; i++) {
        let c = (puntsCursor[i].x + puntsCursor[i + 1].x) / 2;
        let d = (puntsCursor[i].y + puntsCursor[i + 1].y) / 2;

        tmpCtx.quadraticCurveTo(puntsCursor[i].x, puntsCursor[i].y, c, d);
      }

      tmpCtx.quadraticCurveTo(
        puntsCursor[i].x,
        puntsCursor[i].y,
        puntsCursor[i + 1].x,
        puntsCursor[i + 1].y
      );
      tmpCtx.stroke();
    };

    // LINIA
    let onPaintLinia = () => {
      // agafa la coordinada inicial
      // i després la coordinada fins on es fa el drag
      // finalment pinta la linia

      // sempre es neteja el canvas temporal abans de dibuixar
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

      tmpCtx.lineWidth = ctx.lineWidth;
      tmpCtx.strokeStyle = ctx.strokeStyle;

      tmpCtx.beginPath();
      tmpCtx.moveTo(startMouse.x, startMouse.y);
      tmpCtx.lineTo(mouse.x, mouse.y);
      tmpCtx.stroke();
      tmpCtx.closePath();
    };

    // CERCLE
    let onPaintCercle = () => {
      // sempre es neteja el canvas temporal abans de dibuixar
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

      tmpCtx.lineWidth = ctx.lineWidth;

      let x = (mouse.x + startMouse.x) / 2;
      let y = (mouse.y + startMouse.y) / 2;

      let radi =
        Math.max(
          Math.abs(mouse.x - startMouse.x),
          Math.abs(mouse.y - startMouse.y)
        ) / 2;

      tmpCtx.beginPath();
      tmpCtx.arc(x, y, radi, 0, Math.PI * 2, false);
      if (fill) {
        tmpCtx.fillStyle = ctx.strokeStyle;
        tmpCtx.fill();
      } else {
        tmpCtx.strokeStyle = ctx.strokeStyle;
        tmpCtx.stroke();
      }
      tmpCtx.closePath();
    };

    // RECTANGLE
    let onPaintRect = () => {
      // sempre es neteja el canvas temporal abans de dibuixar
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

      tmpCtx.lineWidth = ctx.lineWidth;

      let x = Math.min(mouse.x, startMouse.x);
      let y = Math.min(mouse.y, startMouse.y);
      let width = Math.abs(mouse.x - startMouse.x);
      let height = Math.abs(mouse.y - startMouse.y);

      // aplica l'escala que s'ha indicat
      tmpCtx.scale(escalaX, escalaY);

      // comprova si s'ha indicat un num de graus de rotació
      if (graus != 0) {
        // si és el cas, es canvia el punt d'origen del canvas
        // al punt del
        tmpCtx.save();
        tmpCtx.translate((x + width) / 2, (y + height) / 2);
        tmpCtx.rotate((graus * Math.PI) / 180);

        if (fill) {
          tmpCtx.fillStyle = ctx.strokeStyle;
          tmpCtx.fillRect(0, 0, width, height);
        } else {
          tmpCtx.strokeStyle = ctx.strokeStyle;
          tmpCtx.strokeRect(0, 0, width, height);
        }

        tmpCtx.restore();
      } else {
        if (fill) {
          tmpCtx.fillStyle = ctx.strokeStyle;
          tmpCtx.fillRect(x, y, width, height);
        } else {
          tmpCtx.strokeStyle = ctx.strokeStyle;
          tmpCtx.strokeRect(x, y, width, height);
        }
      }

      // retorna l'escala a la normalitat
      tmpCtx.setTransform(1, 0, 0, 1, 0, 0);
    };

    // EL·LIPSE
    let onPaintEllipse = () => {
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

      tmpCtx.lineWidth = ctx.lineWidth;

      let x = (mouse.x + startMouse.x) / 2;
      let y = (mouse.y + startMouse.y) / 2;

      let radiX = Math.abs(mouse.x - startMouse.x) / 2;
      let radiY = Math.abs(mouse.y - startMouse.y) / 2;

      tmpCtx.beginPath();
      tmpCtx.ellipse(x, y, radiX, radiY, 0, 0, Math.PI * 2);
      if (fill) {
        tmpCtx.fillStyle = ctx.strokeStyle;
        tmpCtx.fill();
      } else {
        tmpCtx.strokeStyle = ctx.strokeStyle;
        tmpCtx.stroke();
      }
      tmpCtx.closePath();
    };

    // GOMA D'ESBORRAR
    let onErase = () => {
      console.log('onErase');
      console.log(`coords: ${mouse.x} , ${mouse.y}`);

      let esborra = () => {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      };

      canvas.addEventListener('mousemove', esborra, false);
      canvas.addEventListener(
        'mouseup',
        () => {
          canvas.removeEventListener('mousemove', esborra, false);
          ctx.closePath();
          ctx.globalCompositeOperation = 'source-over';
        },
        false
      );
    };

    // DESFER L'ÚLTIMA ACCIÓ
    let desferAccio = () => {
      console.log('Entra a desfer');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(copiaCanvas, 0, 0);
    };

    // NETEJA EL CANVAS COMPLET
    let netejaCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    };

    // GUARDAR CANVAS COM A IMATGE
    // ****** es podria preguntar el nom de l'arxiu amb un prompt
    let guardarComImatge = () => {
      document.getElementById('a-descarrega').download = 'imatge.png';
      document.getElementById('a-descarrega').href = document
        .getElementById('area-dibuix')
        .toDataURL('image/png')
        .replace('/^data:image/[^;]/', 'data:application/octet-stream');
    };

    // PUJAR IMATGE D'ARXIU
    let pujarImatge = e => {
      let lectorArxiu = new FileReader();
      lectorArxiu.onload = e => {
        let img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          // si l'amplada de la imatge és més gran que el canvas, escala
          if (w > canvas.width) {
            w = canvas.width;
          }
          // si l'alçada de la imatge és més gran que el canvas, escala
          if (h > canvas.height) {
            h = canvas.height;
          }
          ctx.drawImage(img, 0, 0, w, h);
        };
        img.src = e.target.result;
      };
      lectorArxiu.readAsDataURL(e.target.files[0]);
    };

    // INVERTIR ELS COLORS DE LA IMATGE
    let invertirColors = () => {
      // primer es recullen les 'dades' de la imatge
      // (és a dir, els valors dels colors RGB i la opacitat
      //  de cada pixel de la imatge del canvas)
      let dadesDibuix = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let dades = dadesDibuix.data;

      // després, s'iteren de 4 en quatre (per agafar els valors de RGB
      // d'un sol pixel), i s'inverteix el color restant a 255 (que és
      // el valor màxim que pot prendre un color) el valor actual
      for (let i = 0; i < dades.length; i += 4) {
        dades[i] = 255 - dades[i];
        dades[i + 1] = 255 - dades[i + 1];
        dades[i + 2] = 255 - dades[i + 2];
      }

      // se sobreescriu el canvas original
      ctx.putImageData(dadesDibuix, 0, 0);
    };

    let escalaGrisos = () => {
      let dadesDibuix = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let dades = dadesDibuix.data;

      for (let i = 0; i < dades.length; i += 4) {
        let escalaG =
          dades[i] * 0.34 + dades[i + 1] * 0.5 + dades[i + 2] * 0.16;

        dades[i] = escalaG;
        dades[i + 1] = escalaG;
        dades[i + 2] = escalaG;
      }

      // se sobreescriu el canvas original
      ctx.putImageData(dadesDibuix, 0, 0);
    };

    // EFECTE DE BLUR (DESENFOC)
    let efecteBlur = () => {
      let dadesDibuix = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let dades = dadesDibuix.data;

      // segons la quantitat de blur que es vulgui, es repetirà
      // el procés ratioBlur cops (variable global que pot modificar
      // l'usuari)
      for (let br = 0; br < ratioBlur; br++) {
        for (let i = 0; i < dades.length; i += 4) {
          let tempW = 4 * canvas.width;
          let sumaOpacitat = 0;
          let sumaVermell = 0;
          let sumaVerd = 0;
          let sumaBlau = 0;
          let contador = 0;

          let dadesPixelsPropers = [
            i - tempW - 4,
            i - tempW,
            i - tempW + 4, // pixels de dalt
            i - 4,
            i + 4, // pixels de la meitat
            i + tempW - 4,
            i + tempW,
            i + tempW + 4, // pixels d'abaix
          ];

          // calcula la suma dels valors de tots els pixels propers
          for (let j = 0; j < dadesPixelsPropers.length; j++) {
            if (
              dadesPixelsPropers[j] >= 0 &&
              dadesPixelsPropers[j] <= dades.length - 3
            ) {
              sumaOpacitat += dades[dadesPixelsPropers[j]];
              sumaVermell += dades[dadesPixelsPropers[j] + 1];
              sumaVerd += dades[dadesPixelsPropers[j] + 2];
              sumaBlau += dades[dadesPixelsPropers[j] + 3];
              contador++;
            }
          }

          // s'apliquen els valors mitjans
          dades[i] = (sumaOpacitat / contador) * 0.99;
          dades[i + 1] = (sumaVermell / contador) * 0.99;
          dades[i + 2] = (sumaVerd / contador) * 0.99;
          dades[i + 3] = sumaBlau / contador;
        }
      }

      ctx.putImageData(dadesDibuix, 0, 0);
    };

    let rotarClockWise = () => {
      console.log('rota clockwise');
      ctx.rotate((10 * Math.PI) / 180);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    let rotarCounterClockWise = () => {
      console.log('rota counterclockwise');
      ctx.rotate((-10 * Math.PI) / 180);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    /************ FUNCIONS EINES ************/

    /************ EVENT LISTENERS DELS BOTONS ************/

    // eines
    document.getElementById('btn-pincell').addEventListener(
      'click',
      () => {
        eina = 'pincell';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-linia').addEventListener(
      'click',
      () => {
        eina = 'linia';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-cercle').addEventListener(
      'click',
      () => {
        eina = 'cercle';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-rectangle').addEventListener(
      'click',
      () => {
        eina = 'rectangle';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-ellipse').addEventListener(
      'click',
      () => {
        eina = 'ellipse';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-estrella').addEventListener(
      'click',
      () => {
        eina = 'estrella';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-text').addEventListener(
      'click',
      () => {
        eina = 'text';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document.getElementById('btn-goma').addEventListener(
      'click',
      () => {
        eina = 'goma';
        canviaFonsEinaSeleccionada();
      },
      false
    );

    document
      .getElementById('btn-color-pick')
      .addEventListener('change', canviaColor, false);

    document.getElementById('btn-pattern-hex').addEventListener(
      'click',
      () => {
        ctx.fillStyle = patternHex;
        tmpCtx.fillStyle = patternHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      false
    );

    document.getElementById('btn-pattern-striped').addEventListener(
      'click',
      () => {
        ctx.fillStyle = patternStriped;
        tmpCtx.fillStyle = patternStriped;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      false
    );

    // atributs eines

    document
      .getElementById('mida-pincell')
      .addEventListener('change', canviaMidaPincell, false);

    document.getElementById('opcio-fill').addEventListener(
      'click',
      () => {
        if (!fill) {
          fill = true;
          document
            .getElementById('opcio-fill')
            .setAttribute('src', 'img/icon-radiobtn-marcat.png');
        } else {
          fill = false;
          document
            .getElementById('opcio-fill')
            .setAttribute('src', 'img/icon-radiobtn.png');
        }
      },
      true
    );

    document
      .getElementById('graus-inclinacio')
      .addEventListener(
        'change',
        e =>
          (graus = parseInt(document.getElementById('graus-inclinacio').value)),
        false
      );

    document.getElementById('escala-x').addEventListener(
      'change',
      e => {
        escalaX = parseInt(document.getElementById('escala-x').value);
        console.log(`canvi escala x: ${escalaX}`);
      },
      false
    );

    document.getElementById('escala-y').addEventListener(
      'change',
      e => {
        escalaX = parseInt(document.getElementById('escala-y').value);
        console.log(`canvi escala y ${escalaY}`);
      },
      false
    );

    document
      .getElementById('mida-font')
      .addEventListener(
        'change',
        e => (midaText = parseInt(document.getElementById('mida-font').value)),
        false
      );

    document
      .getElementById('tipo-font')
      .addEventListener(
        'change',
        e => (fontFamily = document.getElementById('tipo-font').value),
        false
      );

    // accions
    document
      .getElementById('btn-desfer')
      .addEventListener('click', desferAccio, false);

    document
      .getElementById('a-descarrega')
      .addEventListener('click', guardarComImatge, false);

    document
      .getElementById('btn-neteja')
      .addEventListener('click', netejaCanvas, false);

    /*document
      .getElementById('btn-pujar-imatge')
      .addEventListener('change', pujarImatge, false);*/

    document
      .getElementById('btn-invertir')
      .addEventListener('click', invertirColors, false);

    document
      .getElementById('btn-grisos')
      .addEventListener('click', escalaGrisos, false);

    document
      .getElementById('btn-blur')
      .addEventListener('click', efecteBlur, false);

    /************ EVENT LISTENERS DELS BOTONS ************/
  },
  true
);
