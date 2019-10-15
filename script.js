let canvas;
let ctx;
let mouse;

window.addEventListener('load', () => {
    // comprova si el navegador és compatible amb canvas
    try {
        document.createElement('canvas').getContext('2d');
    } catch (e) {
        document.getElementById('area-dibuix').innerHTML = 'HTML5 Canvas no suportat.';
    }

    // recull el canvas i el context del HTML
    canvas = document.getElementById('area-dibuix'); 
    ctx = canvas.getContext('2d');

    let painting = document.getElementById('paint');
    let paint_style = getComputedStyle(painting);
    canvas.width = parseInt(paint_style.getPropertyValue('width'));
    canvas.height = parseInt(paint_style.getPropertyValue('height'));

    mouse = { x: 0, y: 0 };

    // event mousemove per pintar amb el pincell només mentre es mou el cursor
    canvas.addEventListener('mousemove', (e) => getCursorPosition(), false);

    // assignació de les propietats al pincell
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    canvas.addEventListener('mousedown', (e) => {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);

        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    let onPaint = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };

    let getCursorPosition = () => {
        let rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    };  
}, true);

let einaPincell = () => {
    
};

document.getElementById('btn-pincell').addEventListener('click', einaPincell);