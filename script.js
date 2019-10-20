// Biel Serrano Sánchez 
// DAW2 Escola Jesuïtes El Clot
// Curs 2019-20

// TODO:
/*
    - Assegurar-se de que el color escollit a l'hora d'entrar en l'eina sigui
      el color del color-picker (sobretot en el pas de la goma a una altra eina
      com el pincell!!)

    - Mirar perquè no funcionen les altres eines (cercle rectangle línia!!!)

*/

window.addEventListener('load', () => {
    // comprova si el navegador és compatible amb canvas
    try {
        document.createElement('canvas').getContext('2d');
    } catch (e) {
        document.getElementById('area-dibuix').innerHTML = 'HTML5 Canvas no suportat.';
    }

    // recull el canvas i el context del HTML
    let canvas = document.getElementById('area-dibuix');
    let ctx = canvas.getContext('2d');

    let tmpCanvas = document.createElement('canvas');
    let tmpCtx = tmpCanvas.getContext('2d');

    // recull el div contenidor dels canvas per calcular la mida
    // dels canvas
    // getComputedStyle recull les característiques del div (alçada, amplada)
    let painting = document.getElementById('paint');
    let paintStyle = getComputedStyle(painting);

    // valors per defecte pel tipus de traç
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // s'assignen els valors d'alçada i amplada
    canvas.width = parseInt(paintStyle.getPropertyValue('width'));
    canvas.height = parseInt(paintStyle.getPropertyValue('height'));

    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;

    canvas.parentNode.insertBefore(tmpCanvas, canvas);

    // variable que recull les coordinades del ratolí
    let mouse = { x: 0, y: 0 };
    let startMouse = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };
    let puntsCursor = [];

    // l'eina per defecte és el pincell
    let tool = 'brush';

    canvas.addEventListener('mousedown', (e) => {
        console.log('mousedown');
        canvas.addEventListener('mousemove', obtenirPosicioCursor, false);

        obtenirPosicioCursor();
        if (tool == 'brush' || tool == 'eraser') {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            
            console.log(`Global composite operation: ${ctx.globalCompositeOperation}`);
            console.log(`Line color: ${ctx.strokeStyle}`);
        }

        canviaColor(); // per assegurar-nos de que sempre té el color escollit al color-picker
        onPaint();
    }, false);

    canvas.addEventListener('mouseup', (e) => {
        console.log('mouseup');

        if (tool == 'line') {
            onPaint();
        }
        canvas.removeEventListener('mousemove', obtenirPosicioCursor, false);
        
        puntsCursor.splice(0, puntsCursor.length - 1);
    }, false);

    /************ FUNCIONS GENERALS ************/

    let obtenirPosicioCursor = () => {
        let rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;

        puntsCursor.push({ x: mouse.x, y: mouse.y });
        console.log('obtenirPosicioCursor');
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
    };

    let canviaMidaPincell = () => {
        ctx.lineWidth = document.getElementById('mida-pincell').value;
    };

    let onPaint = () => {
        console.log('onPaint');
        if (tool == 'brush') { onPaintBrush(); }
        else if (tool == 'circle') { onPaintCircle(); }
        else if (tool == 'line') { onPaintLine(); }
        else if (tool == 'rectangle') { onPaintRect(); }
        else if (tool == 'ellipse') { drawEllipse(tmp_ctx); }
        else if (tool == 'eraser') { onErase(); }
    };
    /************ FUNCIONS GENERALS ************/

    /************ FUNCIONS EINES ************/

    // PINCELL
    let onPaintBrush = () => {
        console.log('onPaintBrush');
        console.log(`coords: ${mouse.x} , ${mouse.y}`);
        let pinta = () => {
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        };

        canvas.addEventListener('mousemove', pinta, false);
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', pinta, false);
        }, false);

        ctx.closePath();
    };

    // LINIA
    let onPaintLine = () => {
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
        // torna a entrar tota la estona a onPaintLine



        // Si faig un onPaint en el event de mouseUp (el general)
        // fa bé la línia pero no el brush

        let pintaLinia = () => { 
            // recull la posició inicial del cursor
            obtenirPosicioCursorAmbStartMouse();           
            /*
            tmpCtx.beginPath();
            tmpCtx.moveTo(startMouse.x, startMouse.y);
            lastMouse.x = startMouse.x;
            lastMouse.y = startMouse.y;
            */
            ctx.beginPath();
            ctx.moveTo(startMouse.x, startMouse.y);
        };

        let arrossegaLinia = () => {
            obtenirPosicioCursor();
            // pintar al canvas temporal
            if (mouse.x !== lastMouse.x && mouse.y !== lastMouse.y) {
                console.log('COORDINADES DIFERENTS');
                tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
                tmpCtx.moveTo(startMouse.x, startMouse.y);
                tmpCtx.lineTo(mouse.x, mouse.y);
                tmpCtx.stroke();

                lastMouse.x = mouse.x;
                lastMouse.y = mouse.y;
            }
        };

        canvas.addEventListener('mousedown', pintaLinia, false);
        //canvas.addEventListener('mousemove', arrossegaLinia, false);
        canvas.addEventListener('mouseup', (e) => {
            canvas.removeEventListener('mousedown', pintaLinia, false);
            /*canvas.removeEventListener('mousemove', arrossegaLinia, false);
            ctx.drawImage(tmpCanvas, 0, 0);
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);*/
            obtenirPosicioCursor();
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            //ctx.closePath();
        }, false);
    };

    // CERCLE
    let onPaintCircle = () => {
        console.log('onPaintCircle');
        console.log(`coords: ${mouse.x} , ${mouse.y}`);

        let pintaCercle = () => {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        };

        canvas.addEventListener('mousedown', pintaCercle, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousedown', pintaCercle, false);
        }, false);
    };

    // RECTANGLE
    let onPaintRect = () => {
        console.log('onPaintRect');
        console.log(`coords: ${mouse.x} , ${mouse.y}`);

        let pintaRectangle = () => {
            ctx.rect(mouse.x, mouse.y, 150, 100);
            ctx.stroke();
        };

        canvas.addEventListener('mousedown', pintaRectangle, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousedown', pintaRectangle, false);
        }, false);
    };

    // NETEJA EL CANVAS COMPLET
    let netejaCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
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
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', esborra, false);
            ctx.globalCompositeOperation = 'source-over';
        }, false);
    };

    /************ FUNCIONS EINES ************/

    // assignació de event listeners per les eines
    document.getElementById('btn-pincell').addEventListener('click', () => tool = 'brush');
    document.getElementById('btn-linia').addEventListener('click', () => tool = 'line');
    document.getElementById('btn-cercle').addEventListener('click', () => tool = 'circle');
    document.getElementById('btn-rectangle').addEventListener('click', () => tool = 'rectangle');
    document.getElementById('btn-color-pick').addEventListener('change', canviaColor);
    document.getElementById('mida-pincell').addEventListener('change', canviaMidaPincell);
    document.getElementById('btn-neteja').addEventListener('click', netejaCanvas);
    document.getElementById('btn-goma').addEventListener('click', () => tool = 'eraser');
}, true);