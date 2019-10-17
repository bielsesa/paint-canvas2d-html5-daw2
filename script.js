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

    // variable que recull les coordinades del ratolí
    let mouse = { x: 0, y: 0 };
    let startMouse = { x: 0, y: 0 };
    let puntsCursor = [];

    // l'eina per defecte és el pincell
    let tool = 'brush';

    canvas.addEventListener('mousedown', (e) => {
        console.log('mousedown');
        canvas.addEventListener('mousemove', obtenirPosicioCursor, false);
        canvas.addEventListener('mousemove', onPaint, false);

        obtenirPosicioCursor();
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
    }, false);

    canvas.addEventListener('mouseup', (e) => {
        console.log('mouseup');
        canvas.removeEventListener('mousemove', obtenirPosicioCursor, false);
        //ctx.closePath();
        puntsCursor.splice(0, puntsCursor.length - 1);
    }, false);

    // funcions    

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

        if (tool == 'line') {
            startMouse.x = mouse.x;
            startMouse.y = mouse.y;
        }   
    };

    let canviaColor = () => {
        ctx.strokeStyle = document.getElementById('btn-color-pick').value;
    };

    let pintaPunt = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };

    let onPaint = () => {
        console.log('onPaint');
        if (tool == 'brush') { onPaintBrush(); }
        else if (tool == 'circle') { onPaintCircle(); }
        else if (tool == 'line') { onPaintLine(); }
        else if (tool == 'rectangle') { onPaintRect(); }
        else if (tool == 'ellipse') { drawEllipse(tmp_ctx); }
        else if (tool == 'eraser') { onErase(); }
        else if (tool == 'spray') { generateSprayParticles(); }
    };

    /************ FUNCIONS EINES ************/

    let onPaintBrush = () => {
        console.log('onPaintBrush');
        console.log(`coords: ${mouse.x} , ${mouse.y}`);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };

    let onPaintCircle = () => {
        console.log('onPaintCircle');
        console.log(`coords: ${mouse.x} , ${mouse.y}`);

        let pintaCercle = () => {
            ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        };

        canvas.addEventListener('mousedown', pintaCercle, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousedown', pintaCercle, false);
        }, false);

        /*
        ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        
        let x = (mouse.x + startMouse.x) / 2;
        let y = (mouse.y + startMouse.y) / 2;

        let radius = Math.max(
            Math.abs(mouse.x - startMouse.x),
            Math.abs(mouse.y - startMouse.y)
        ) / 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
        */
    };

    let onPaintLine = () => {
        // agafa la coordinada inicial
        // i després la coordinada fins on es fa el drag
        // finalment pinta la linia

        let pintaLinia = () => {
            obtenirPosicioCursorAmbStartMouse();
            ctx.beginPath();
            ctx.moveTo(startMouse.x, startMouse.y);
        };

        canvas.addEventListener('mousedown', pintaLinia, false);
        canvas.addEventListener('mouseup', (e) => {
            canvas.removeEventListener('mousedown', pintaLinia, false);
            obtenirPosicioCursor();
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }, false);
    };

    let einaLinia = () => {
        canvas.addEventListener('mousedown', (e) => {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

            startMouse.x = mouse.x;
            startMouse.y = mouse.y;

            ctx.beginPath();
            ctx.moveTo(startMouse.x, startMouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
        }, false);
    };

    let einaCercle = () => {
        canvas.addEventListener('mousedown', (e) => {
            obtenirPosicioCursor();
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        }, false);
    };

    let einaRectangle = () => {
        canvas.addEventListener('mousedown', (e) => {
            obtenirPosicioCursor();
            ctx.beginPath();
            ctx.rect(mouse.x, mouse.y, 150, 100);
            ctx.stroke();
        }, false);
    };

    let netejaCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    /************ FUNCIONS EINES ************/

    // assignació de event listeners per les eines
    document.getElementById('btn-pincell').addEventListener('click', () => tool = 'brush');
    document.getElementById('btn-linia').addEventListener('click', () => tool = 'line');
    document.getElementById('btn-cercle').addEventListener('click', () => tool = 'circle');
    document.getElementById('btn-rectangle').addEventListener('click', einaRectangle);
    document.getElementById('btn-color-pick').addEventListener('change', canviaColor);
    document.getElementById('btn-neteja').addEventListener('click', netejaCanvas);
}, true);

