window.onload = () => {
    // comprova si el navegador és compatible amb canvas
    try {
        document.createElement('canvas').getContext('2d');
    } catch (e) {
        document.getElementById('area-dibuix').innerHTML = 'HTML5 Canvas no suportat.';
    }

    // recull el canvas i el context del HTML
    let canvas = document.getElementById('area-dibuix');
    let ctx = canvas.getContext('2d');

    // crea un canvas temporal per traçar el dibuix durant l'event
    let tmpCanvas = document.createElement('canvas');
    let tmpCtx = tmpCanvas.getContext('2d');

    // recull el div contenidor dels canvas per calcular la mida
    // dels canvas
    let sketch = document.getElementById('paint');

    // getComputedStyle recull les característiques del div (alçada, amplada)
    let sketchStyle = getComputedStyle(sketch);

    // s'assignen els valors d'alçada i amplada
    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;

    // s'insereix el canvas temporal al document, just abans del canvas normal
    canvas.parentNode.insertBefore(tmpCanvas, canvas);
    
    // objectes per guardar les coordinades del cursor
    // (array per dibuixar la línia)
    let mouse = { x: 0, y: 0 };
    let puntsCursor = [];

    // drawing (brush)
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    // drawing (brush) TEMP
    tmpCtx.lineWidth = 5;
    tmpCtx.lineJoin = 'round';
    tmpCtx.lineCap = 'round';
    tmpCtx.strokeStyle = 'black';

    /************ FUNCIONS EINES ************/

    // PINCELL
    let einaPincell = () => {

        let onPaint = () => {
            // recull diversos punts a mesura que el ratolí es mou
            // i va dibuixant curves de bezier
            // d'aquesta forma la línia del pincell és més suau

            tmpCtx.beginPath();
            tmpCtx.moveTo(puntsCursor[0].x, puntsCursor[0].y);

            for (var i = 1; i < puntsCursor.length - 3; i++) {
                let c = (puntsCursor[i].x + puntsCursor[i + 1].x) / 2;
                let d = (puntsCursor[i].y + puntsCursor[i + 1].y) / 2;

                tmpCtx.quadraticCurveTo(puntsCursor[i].x, puntsCursor[i].y, c, d);
            }

            tmpCtx.quadraticCurveTo(
                puntsCursor[i].x,
                puntsCursor[i].y,
                puntsCursor[i + 1].x,
                puntsCursor[i + 1].y,
            );

            tmpCtx.stroke();
        };

        canvas.addEventListener('mousedown', e => {
            canvas.addEventListener('mousemove', recullCoordinadesCursorArray, false);
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', e => {
            canvas.removeEventListener('mousemove', recullCoordinadesCursorArray, false);
            canvas.removeEventListener('mousemove', onPaint, false);
            ctx.drawImage(tmpCanvas, 0, 0); // copy temp to original
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height); // clear temp
            puntsCursor.splice(0, puntsCursor.length); // clear points array
        }, false);        
    }

    // CERCLE
    let einaCercle = () => {
        canvas.addEventListener('mousedown', recullCoordinadesCursor, false);
        canvas.addEventListener('mousedown', () => {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        }, false);
    };

    // RECTANGLE
    let einaRectangle = () => {
        canvas.addEventListener('mousedown', recullCoordinadesCursor, false);
        canvas.addEventListener('mousedown', () => {
            ctx.beginPath();
            ctx.rect(mouse.x, mouse.y, 150, 100);
            ctx.stroke();
        }, false);
    };

    /************ FUNCIONS EINES ************/

    /************ FUNCIONS GENERALS ************/

    // recull les coordenades del ratolí i les insereix 
    // a l'objecte mouse
    let recullCoordinadesCursor = (e) => {
        let rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    // recull les coordenades del ratolí i les insereix 
    // a l'array de punts del ratolí
    let recullCoordinadesCursorArray = (e) => {
        let rect = canvas.getBoundingClientRect();
        puntsCursor.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        console.log(`Last point added: (${puntsCursor[puntsCursor.length - 1].x}, ${puntsCursor[puntsCursor.length - 1].y})`);
    };

    // canvia el color del stroke style
    let canviaColor = () => {
        ctx.strokeStyle = document.getElementById('btn-color-pick').value;
        tmpCtx.strokeStyle = document.getElementById('btn-color-pick').value;
    };

    let netejaCanvas = () => {        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    /************ FUNCIONS GENERALS ************/

    // assignació d'event listeners per les eines
    document.getElementById('btn-pincell').addEventListener('click', einaPincell);
    document.getElementById('btn-cercle').addEventListener('click', einaCercle);
    document.getElementById('btn-rectangle').addEventListener('click', einaRectangle);
    document.getElementById('btn-color-pick').addEventListener('change', canviaColor);
    document.getElementById('btn-neteja').addEventListener('click', netejaCanvas);

    // simula un click al botó del pincell perquè és l'eina per defecte
    document.getElementById('btn-pincell').click();
};