window.onload = () => {

    // recull el primer video que troba al DOM
    let video = document.getElementsByTagName('video')[0];

    // botons
    let playButton = document.getElementById('play-pause');
    let muteButton = document.getElementById('mute');
    let fullscreenButton = document.getElementById('full-screen');

    // barres de progrès
    let seekbar = document.getElementById('seek-bar');
    let volumebar = document.getElementById('volume-bar');

    // PLAY-PAUSE
    playButton.addEventListener('click', () => {
        // si el video està pausat o ha acabat
        if (video.paused || video.ended) {
            video.play();
            // canvia l'icona del botó
            playButton.firstChild.setAttribute('src', 'img/pause-button.png');
        } else {
            video.pause();
            // canvia l'icona del botó
            playButton.firstChild.setAttribute('src', 'img/play-button.png');
        }
    }, true);

    // MUTE
    muteButton.addEventListener('click', () => {
        if (!video.muted) {
            // Mute the video
            video.muted = true;

            // La barra d'audio es posa a 0
            volumebar.value = 0;

            // Update the button text
            muteButton.firstChild.setAttribute('src', 'img/muted-button.png');
        } else {
            // Unmute the video
            video.muted = false;

            // La barra d'audio es posa on estava abans
            volumebar.value = video.volume;

            // Update the button text
            muteButton.firstChild.setAttribute('src', 'img/volume-button.png');
        }
    }, true);

    // FULLSCREEN
    fullscreenButton.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
        } else if (video.webkitRequestFullScreen) {
            video.webkitRequestFullScreen(); // Chrome and Safari
        }
    }, true);

    // SEEK BAR **************************************************
    seekbar.addEventListener('change', () => {
        video.currentTime = video.duration * (seekbar.value / 100);
    }, true);

    seekbar.addEventListener('mousedown', () => {
        video.pause();
    }, true);

    seekbar.addEventListener('mouseup', () => {
        video.play();
    }, true);
    // ***********************************************************

    // VOLUME-BAR
    volumebar.addEventListener('change', () => {
        video.volume = volumebar.value;
    }, true);

    // VIDEO
    // actualitza la seekbar durant la reproducció del video
    video.addEventListener('timeupdate', () => {
        seekbar.value = (100 / video.duration) * video.currentTime;
    }, true);

    video.addEventListener('ended', () => playButton.firstChild.setAttribute('src', 'img/play-button.png'), true)
};