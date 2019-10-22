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

        // s'assignen els valors d'alçada i amplada
        canvas.width = parseInt(paintStyle.getPropertyValue('width'));
        canvas.height = parseInt(paintStyle.getPropertyValue('height'));

        // creació canvas temporal
        let tmpCanvas = document.createElement('canvas');
        let tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        canvas.parentNode.insertBefore(tmpCanvas, canvas);
        
        // valors per defecte pel tipus de traç (mida, color, etc)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        tmpCtx.strokeStyle = '#000';
        tmpCtx.lineWidth = 3;
        tmpCtx.lineJoin = 'round';
        tmpCtx.lineCap = 'round';   

        // variables que recullen les coordinades del ratolí
        let mouse = { x: 0, y: 0 };
        let startMouse = { x: 0, y: 0 };
        let puntsCursor = [];

        // creació d'un element text area per afegir text (eina)
        let areaText = document.createElement('textarea');
        areaText.id = 'eina-text';
        painting.appendChild(areaText);

        // l'eina per defecte és el pincell
        let tool = 'pincell';

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
        };

        let canviaMidaPincell = () => {
            ctx.lineWidth = document.getElementById('mida-pincell').value;
            document.getElementById('valor-mida-pincell').innerHTML = ctx.lineWidth;
        };

        let onPaint = () => {
            console.log('onPaint');
            if (tool == 'pincell') {
                canvas.addEventListener('mousemove', onPaintPincell, false);
                onPaintPincell();
            } else if (tool == 'linia') {
                canvas.addEventListener('mousemove', onPaintLinia, false);
                onPaintLinia();
            } else if (tool == 'cercle') {
                canvas.addEventListener('mousemove', onPaintCercle, false);
                onPaintCercle();
            } else if (tool == 'rectangle') {
                canvas.addEventListener('mousemove', onPaintRect, false);
                onPaintRect();
            } else if (tool == 'text') {
                canvas.addEventListener('mousemove', dibuixaText, false);
                dibuixaText();
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
                if (tool == 'pincell') {
                    canvas.removeEventListener('mousemove', onPaintPincell, false);
                } else if (tool == 'linia') {
                    canvas.removeEventListener('mousemove', onPaintLinia, false);
                } else if (tool == 'cercle') {
                    canvas.removeEventListener('mousemove', onPaintCercle, false);
                } else if (tool == 'rectangle') {
                    canvas.removeEventListener('mousemove', onPaintRect, false);
                } else if (tool == 'text') {
                    canvas.removeEventListener('mousemove', dibuixaText, false);

                    let lines = areaText.value.split('\n');
                    let processedLines = [];
        
                    let tmpTextCtn = document.createElement('div');
                    tmpTextCtn.style.display = 'none';
                    painting.appendChild(tmpTextCtn);
        
                    for (let i = 0; i < lines.length; j++) {
                        let textNode = document.createTextNode(lines[i][j]);
                        tmpCtx.appendChild(textNode);
        
                        tmpTextCtn.style.position = 'absolute';
                        tmpTextCtn.style.visibility = 'hidden';
                        tmpTextCtn.style.display = 'block';
        
                        let width = tmpTextCtn.style.offsetWidth;
                        let height = tmpTextCtn.style.offsetHeight;
        
                        tmpTextCtn.style.position = '';
                        tmpTextCtn.style.visibility = '';
                        tmpTextCtn.style.display = 'none';
        
                        if (width > parseInt(areaText.style.width)) {
                            break;
                        }                
                    }
        
                    processedLines.push(tmpTextCtn.textContent);
                    tmpTextCtn.innerHTML = '';

                    for (let n = 0; n < processedLines.length; n++) {
                        let processedLines = processedLines[n];

                        tmpCtx.fillText(
                            processedLines,
                            parseInt(areaText.style.left),
                            parseInt(areaText.style.top) + n * parseInt(fs)
                        );
                    }
                }

                // dibuixar en el canvas final i netejar el temporal
                ctx.drawImage(tmpCanvas, 0, 0);
                tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

                // retornar a 0 l'array de punts del cursor
                puntsCursor = [];

                //
                areaText.style.display = 'none';
                areaText.value = '';
            },
            false
        );

        /************ EVENT LISTENERS ************/

        /************ FUNCIONS EINES ************/

        // PINCELL
        let onPaintPincell = () => {
            puntsCursor.push({
                x: mouse.x,
                y: mouse.y
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
                puntsCursor[i + 1].y);
            tmpCtx.stroke();
        };

        // LINIA
        let onPaintLinia = () => {
            // agafa la coordinada inicial
            // i després la coordinada fins on es fa el drag
            // finalment pinta la linia

            // sempre es neteja el canvas temporal abans de dibuixar
            // (per assegurar-nos que està net sempre)
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
            // (per assegurar-nos que està net sempre)
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            tmpCtx.lineWidth = ctx.lineWidth;
            tmpCtx.strokeStyle = ctx.strokeStyle;

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

            tmpCtx.lineWidth = ctx.lineWidth;
            tmpCtx.strokeStyle = ctx.strokeStyle;
            
            let x = Math.min(mouse.x, startMouse.x);
            let y = Math.min(mouse.y, startMouse.y);
            let width = Math.abs(mouse.x - startMouse.x);
            let height = Math.abs(mouse.y - startMouse.y);
            tmpCtx.strokeRect(x, y, width, height);
        };

        // TEXT
        let dibuixaText = () => {
            console.log('dibuixaText');

            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            let x = Math.min(mouse.x, startMouse.x);
            let y = Math.min(mouse.y, startMouse.y);
            let width = Math.abs(mouse.x - startMouse.x);
            let height = Math.abs(mouse.y - startMouse.y);

            areaText.style.left = x + 'px';
            areaText.style.top = y + 'px';
            areaText.style.width = width + 'px';
            areaText.style.height = height + 'px';

            areaText.style.display = 'block';

            
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
                .replace('/^data:image\/[^;]/', 'data:application/octet-stream');
        };

        // PUJAR IMATGE D'ARXIU
        let pujarImatge = (e) => {
            let lectorArxiu = new FileReader();
            lectorArxiu.onload = (e) => {
                let img = new Image();
                img.onload = () => {
                    let w = img.width;
                    let h = img.height
                    // si l'amplada de la imatge és més gran que el canvas, escala
                    if (w > canvas.width) { 
                        w = canvas.width;
                    }
                    // si l'alçada de la imatge és més gran que el canvas, escala
                    if (h > canvas.height) {
                        h = canvas.height;
                    }
                    ctx.drawImage(img, 0, 0, w, h);
                }
                img.src = e.target.result;
            };
            lectorArxiu.readAsDataURL(e.target.files[0]);
        };

        /************ FUNCIONS EINES ************/

        /************ EVENT LISTENERS DELS BOTONS ************/

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
        document.
        getElementById('btn-pujar-imatge')
        .addEventListener('change', pujarImatge, false);
        document.
        getElementById('btn-pujar-imatge')
        .addEventListener('change', pujarImatge, false);
        /************ EVENT LISTENERS DELS BOTONS ************/
    },
    true
);