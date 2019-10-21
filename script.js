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

        // creació canvas temporal
        let tmpCanvas = document.createElement('canvas');
        let tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        canvas.parentNode.insertBefore(tmpCanvas, canvas);

        // variables que recullen les coordinades del ratolí
        let mouse = { x: 0, y: 0 };
        let startMouse = { x: 0, y: 0 };
        let lastMouse = { x: 0, y: 0 };
        let puntsCursor = [];

        // l'eina per defecte és el pincell
        let tool = 'pincell';

        /************ FUNCIONS GENERALS ************/

        let obtenirPosicioCursor = () => {
            let rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;

            puntsCursor.push({ x: mouse.x, y: mouse.y });
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
            if (tool == 'pincell') {
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                onPaintPincell();
            } else if (tool == 'cercle') {
                canvas.addEventListener('mousemove', onPaintCercle, false);
                onPaintCercle();
            } else if (tool == 'linia') {
                canvas.addEventListener('mousemove', onPaintLinia, false);
                onPaintLinia();
            } else if (tool == 'rectangle') {
                canvas.addEventListener('mousemove', onPaintRect, false);
                onPaintRect();
            } else if (tool == 'text') {
                canvas.addEventListener('mousemove', dibuixaText, false);
                dibuixaText();
            } else if (tool == 'ellipse') {
                drawEllipse(tmp_ctx);
            } else if (tool == 'goma') {
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
                canviaColor(); // per assegurar-nos de que sempre té el color escollit al color-picker
                onPaint();
            },
            false
        );

        // event listener per deixar de dibuixar
        canvas.addEventListener(
            'mouseup',
            e => {
                if (tool == 'linia') {
                    onPaint();
                    canvas.removeEventListener('mousemove', onPaintLinia, false);
                } else if (tool == 'cercle') {
                    canvas.removeEventListener('mousemove', onPaintCercle, false);
                } else if (tool == 'rectangle') {
                    canvas.removeEventListener('mousemove', onPaintRect, false);
                } else if (tool == 'text') {
                    canvas.removeEventListener('mousemove', dibuixaText, false);
                }

                // dibuixar en el canvas final i netejar el temporal
                ctx.drawImage(tmpCanvas, 0, 0);
                tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

                // retornar a 0 l'array de punts del cursor
                puntsCursor = [];
            },
            false
        );

        /************ EVENT LISTENERS ************/

        /************ FUNCIONS EINES ************/

        // PINCELL
        let onPaintPincell = () => {
            console.log('onPaintPincell');
            console.log(`coords: ${mouse.x} , ${mouse.y}`);
            let pinta = () => {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            };

            canvas.addEventListener('mousemove', pinta, false);
            canvas.addEventListener(
                'mouseup',
                () => {
                    canvas.removeEventListener('mousemove', pinta, false);
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

            // sempre es neteja el canvas temporal abans de dibuixar
            // (per assegurar-nos que està net sempre)
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            tmpCtx.beginPath();
            tmpCtx.moveTo(startMouse.x, startMouse.y);
            tmpCtx.lineTo(mouse.x, mouse.y);
            tmpCtx.stroke();
            tmpCtx.closePath();
        };

        // CERCLE
        let onPaintCercle = () => {
            // sempre es neteja el canvas temporal abans de dibuixar
            // (per assegurar-nos que està net sempre)
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            let x = (mouse.x + startMouse.x) / 2;
            let y = (mouse.y + startMouse.y) / 2;

            let radi = Math.max(
                Math.abs(mouse.x - startMouse.x),
                Math.abs(mouse.y - startMouse.y)) / 2;

            tmpCtx.beginPath();
            tmpCtx.arc(x, y, radi, 0, Math.PI * 2, false);
            tmpCtx.stroke();
            tmpCtx.closePath();
        };

        // RECTANGLE
        let onPaintRect = () => {
            // sempre es neteja el canvas temporal abans de dibuixar
            // (per assegurar-nos que està net sempre)
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            let x = Math.min(mouse.x, startMouse.x);
            let y = Math.min(mouse.y, startMouse.y);
            let width = Math.abs(mouse.x - startMouse.x);
            let height = Math.abs(mouse.y - startMouse.y);
            tmpCtx.strokeRect(x, y, width, height);
        };

        let dibuixaText = () => {
            console.log('dibuixaText');
            let afegeixText = () => {
                ctx.font = '40px sans-serif';
                ctx.fillText('Hello World', mouse.x, mouse.y);
                console.log('afegeixText');
            };

            canvas.addEventListener('mousedown', afegeixText, false);
            canvas.addEventListener('mouseup', () => {
                canvas.addEventListener('mousedown', afegeixText, false);
                console.log('mouseup remove mdw');
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

        // GUARDAR CANVAS COM A IMATGE
        let guardarComImatge = () => {
            document.getElementById('a-descarrega').download = 'imatge.png';
            document.getElementById('a-descarrega').href = document
                .getElementById('area-dibuix')
                .toDataURL('image/png')
                .replace('/^data:image\/[^;]/', 'data:application/octet-stream');
        };

        /************ FUNCIONS EINES ************/

        // assignació de event listeners per les eines
        document
            .getElementById('btn-pincell')
            .addEventListener('click', () => (tool = 'pincell'), false);
        document
            .getElementById('btn-linia')
            .addEventListener('click', () => (tool = 'linia'), false);
        document
            .getElementById('btn-cercle')
            .addEventListener('click', () => (tool = 'cercle'), false);
        document
            .getElementById('btn-rectangle')
            .addEventListener('click', () => (tool = 'rectangle'), false);
        document
            .getElementById('btn-text')
            .addEventListener('click', () => (tool = 'text'), false);
        document
            .getElementById('a-descarrega')
            .addEventListener('click', guardarComImatge, false);
        document
            .getElementById('btn-color-pick')
            .addEventListener('change', canviaColor, false);
        document
            .getElementById('mida-pincell')
            .addEventListener('change', canviaMidaPincell, false);
        document
            .getElementById('btn-neteja')
            .addEventListener('click', netejaCanvas, false);
        document
            .getElementById('btn-goma')
            .addEventListener('click', () => (tool = 'goma'), false);
    },
    true
);