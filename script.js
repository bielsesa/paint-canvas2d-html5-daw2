// Biel Serrano Sánchez
// DAW2 Escola Jesuïtes El Clot
// Curs 2019-20

// TODO:
/*
    - Mirar perquè no funcionen les altres eines (cercle rectangle línia!!!)
*/

window.addEventListener(
  "load",
  () => {
    // comprova si el navegador és compatible amb canvas
    try {
      document.createElement("canvas").getContext("2d");
    } catch (e) {
      document.getElementById("area-dibuix").innerHTML =
        "HTML5 Canvas no suportat.";
    }

    // recull el canvas i el context del HTML
    let canvas = document.getElementById("area-dibuix");
    let ctx = canvas.getContext("2d");

    // recull el div contenidor dels canvas per calcular la mida
    // dels canvas
    // getComputedStyle recull les característiques del div (alçada, amplada)
    let painting = document.getElementById("paint");
    let paintStyle = getComputedStyle(painting);

    // valors per defecte pel tipus de traç
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // s'assignen els valors d'alçada i amplada
    canvas.width = parseInt(paintStyle.getPropertyValue("width"));
    canvas.height = parseInt(paintStyle.getPropertyValue("height"));

    // creació canvas temporal
    let tmpCanvas = document.createElement("canvas");
    let tmpCtx = tmpCanvas.getContext("2d");
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    canvas.parentNode.insertBefore(tmpCanvas, canvas);

    // variables que recullen les coordinades del ratolí
    let mouse = { x: 0, y: 0 };
    let startMouse = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };
    let puntsCursor = [];

    // l'eina per defecte és el pincell
    let tool = "pincell";

    canvas.addEventListener(
      "mousedown",
      e => {
        canvas.addEventListener("mousemove", obtenirPosicioCursor, false);

        obtenirPosicioCursor();
        if (tool == "pincell" || tool == "goma") {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
        }
        else if (tool == 'cercle') {
            canvas.addEventListener('mousedown', onPaintCercle, false);
        }

        canviaColor(); // per assegurar-nos de que sempre té el color escollit al color-picker
        onPaint();
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      e => {
        if (tool == "linia") {
          onPaint();
        }else if (tool == 'cercle') {
            canvas.removeEventListener('mousedown', onPaintCercle, false);
        }
        canvas.removeEventListener("mousemove", obtenirPosicioCursor, false);

        // dibuixar en el canvas final i netejar el temporal
        ctx.drawImage(tmpCanvas, 0, 0);
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        // retornar a 0 l'array de punts del cursor
        puntsCursor = [];
      },
      false
    );

    /************ FUNCIONS GENERALS ************/

    let obtenirPosicioCursor = () => {
      let rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      puntsCursor.push({ x: mouse.x, y: mouse.y });
      console.log("obtenirPosicioCursor");
    };

    let obtenirPosicioCursorAmbStartMouse = () => {
      let rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      startMouse.x = mouse.x;
      startMouse.y = mouse.y;
    };

    let canviaColor = () => {
      ctx.strokeStyle = document.getElementById("btn-color-pick").value;
    };

    let canviaMidaPincell = () => {
      ctx.lineWidth = document.getElementById("mida-pincell").value;
    };

    let onPaint = () => {
      console.log("onPaint");
      if (tool == "pincell") {
        onPaintPincell();
      } else if (tool == "cercle") {
        onPaintCercle();
      } else if (tool == "linia") {
        onPaintLinia();
      } else if (tool == "rectangle") {
        onPaintRect();
      } else if (tool == "ellipse") {
        drawEllipse(tmp_ctx);
      } else if (tool == "goma") {
        onErase();
      }
    };
    /************ FUNCIONS GENERALS ************/

    /************ FUNCIONS EINES ************/

    // PINCELL
    let onPaintPincell = () => {
      console.log("onPaintPincell");
      console.log(`coords: ${mouse.x} , ${mouse.y}`);
      let pinta = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      };

      canvas.addEventListener("mousemove", pinta, false);
      canvas.addEventListener(
        "mouseup",
        () => {
          canvas.removeEventListener("mousemove", pinta, false);
        },
        false
      );

      ctx.closePath();
    };

    // LINIA
    let onPaintLinia = () => {
        // agafa la coordinada inicial
        // i després la coordinada fins on es fa el drag
        // finalment pinta la linia

        // pq es vegi el recorregut:
        // EN EVENT MOUSEMOVE
        // comprovar diferència entre mouse.x/mouse.y i lastMouse.x/lastMouse.y
        // si es diferent, esborrar últim traç 
        // dibuixar un nou traç
        // guardar les noves coords a lastMouse

        // S'HAURIA DE FER AMB UN CANVAS TEMPORAL!! ^^^^^
        // pq aixi cada cop que canvien les lastmouse i mouse coords
        // es neteja tot el canvas temp i es redibuixa
        // sense que afecti el canvas principal

        // com onPaint esta assignat a mousemove d'abans
        // torna a entrar tota la estona a onPaintLinia



        // Si faig un onPaint en el event de mouseUp (el general)
        // fa bé la línia pero no el pincell

        let pintaLinia = () => { 
            // recull la posició inicial del cursor
            obtenirPosicioCursorAmbStartMouse();
            
            ctx.beginPath();
            ctx.moveTo(startMouse.x, startMouse.y);
        };

        canvas.addEventListener('mousedown', pintaLinia, false);
        //canvas.addEventListener('mousemove', arrossegaLinia, false);
        canvas.addEventListener('mouseup', (e) => {
            canvas.removeEventListener('mousedown', pintaLinia, false);
            obtenirPosicioCursor();
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }, false);
    };

    // CERCLE
    let onPaintCercle = () => {
      console.log("onPaintCercle");

        let x = (mouse.x + startMouse.x) / 2;
        let y = (mouse.y + startMouse.y) / 2;

        let radi = Math.max(
            Math.abs(mouse.x - startMouse.x),
            Math.abs(mouse.y - startMouse.y)) / 2;

        tmpCtx.beginPath();
        tmpCtx.arc(x, y, radi, 0, Math.PI * 2, false);
        tmpCtx.stroke();
        tmpCtx.closePath();

      /*let pintaCercle = () => {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
        ctx.stroke();
      };

      canvas.addEventListener("mousedown", pintaCercle, false);

      canvas.addEventListener(
        "mouseup",
        () => {
          canvas.removeEventListener("mousedown", pintaCercle, false);
        },
        false
      );
      */
    };

    // RECTANGLE
    let onPaintRect = () => {
      console.log("onPaintRect");
      console.log(`coords: ${mouse.x} , ${mouse.y}`);

      let pintaRectangle = () => {
        ctx.rect(mouse.x, mouse.y, 150, 100);
        ctx.stroke();
      };

      canvas.addEventListener("mousedown", pintaRectangle, false);

      canvas.addEventListener(
        "mouseup",
        () => {
          canvas.removeEventListener("mousedown", pintaRectangle, false);
        },
        false
      );
    };

    // NETEJA EL CANVAS COMPLET
    let netejaCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    };

    // GOMA D'ESBORRAR
    let onErase = () => {
      console.log("onErase");
      console.log(`coords: ${mouse.x} , ${mouse.y}`);

      let esborra = () => {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      };

      canvas.addEventListener("mousemove", esborra, false);
      canvas.addEventListener(
        "mouseup",
        () => {
          canvas.removeEventListener("mousemove", esborra, false);
          ctx.closePath();
          ctx.globalCompositeOperation = "source-over";
        },
        false
      );
    };

    // GUARDAR CANVAS COM A IMATGE
    let guardarComImatge = () => {
      document.getElementById("a-descarrega").download = "imatge.png";
      document.getElementById("a-descarrega").href = document
        .getElementById("area-dibuix")
        .toDataURL("image/png")
        .replace('/^data:image\/[^;]/', "data:application/octet-stream");
    };

    /************ FUNCIONS EINES ************/

    // assignació de event listeners per les eines
    document
      .getElementById("btn-pincell")
      .addEventListener("click", () => (tool = "pincell"));
    document
      .getElementById("btn-linia")
      .addEventListener("click", () => (tool = "linia"));
    document
      .getElementById("btn-cercle")
      .addEventListener("click", () => (tool = "cercle"));
    document
      .getElementById("btn-rectangle")
      .addEventListener("click", () => (tool = "rectangle"));
    document
      .getElementById("a-descarrega")
      .addEventListener("click", guardarComImatge);
    document
      .getElementById("btn-color-pick")
      .addEventListener("change", canviaColor);
    document
      .getElementById("mida-pincell")
      .addEventListener("change", canviaMidaPincell);
    document
      .getElementById("btn-neteja")
      .addEventListener("click", netejaCanvas);
    document
      .getElementById("btn-goma")
      .addEventListener("click", () => (tool = "goma"));
  },
  true
);
