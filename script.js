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

    // funcions

    let getCursorPosition = () => {
        let rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    };

    let canviaColor = () => {
        ctx.strokeStyle = document.getElementById('btn-color-pick').value;
    };

    let pintaPunt = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };

    /************ FUNCIONS EINES ************/

    let einaPincell = () => {
        // event mousemove per pintar amb el pincell només mentre es mou el cursor
        canvas.addEventListener('mousemove', (e) => getCursorPosition(), false);

        canvas.addEventListener('mousedown', (e) => {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);

            canvas.addEventListener('mousemove', pintaPunt, false);
        }, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', pintaPunt, false);
        }, false);
    };

    let einaLinia = () => {
        let startMouse = { x: 0, y: 0 };
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
            getCursorPosition();
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
        }, false);
    };

    let einaRectangle = () => {
        canvas.addEventListener('mousedown', (e) => {
            getCursorPosition();
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
    document.getElementById('btn-pincell').addEventListener('click', einaPincell);
    document.getElementById('btn-linia').addEventListener('click', einaLinia);
    document.getElementById('btn-cercle').addEventListener('click', einaCercle);
    document.getElementById('btn-rectangle').addEventListener('click', einaRectangle);
    document.getElementById('btn-color-pick').addEventListener('change', canviaColor);
    document.getElementById('btn-neteja').addEventListener('click', netejaCanvas);

    // per últim simula un click al botó del pincell perquè és l'eina per defecte
    document.getElementById('btn-pincell').click();
}, true);

