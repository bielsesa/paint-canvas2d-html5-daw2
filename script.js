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

    // valors per defecte pel tipus de traç
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    let painting = document.getElementById('paint');
    let paint_style = getComputedStyle(painting);
    canvas.width = parseInt(paint_style.getPropertyValue('width'));
    canvas.height = parseInt(paint_style.getPropertyValue('height'));

    // variable que recull les coordinades del ratolí
    let mouse = { x: 0, y: 0 };

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

    // assignació de event listeners per les eines
    document.getElementById('btn-pincell').addEventListener('click', einaPincell);
    document.getElementById('btn-cercle').addEventListener('click', einaCercle);
    document.getElementById('btn-rectangle').addEventListener('click', einaRectangle);
    document.getElementById('btn-color-pick').addEventListener('change', canviaColor);
    document.getElementById('btn-neteja').addEventListener('click', netejaCanvas);

    // simula un click al botó del pincell perquè és l'eina per defecte
    document.getElementById('btn-pincell').click();
}, true);

