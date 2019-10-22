window.onload = () => {

    // 1. Recull en variables el video i els controls

    // Video
    let video = document.getElementById('video');

    // Buttons
    let playButton = document.getElementById('play-pause');
    let muteButton = document.getElementById('mute');
    let fullScreenButton = document.getElementById('full-screen');

    // Sliders
    let seekBar = document.getElementById('seek-bar');
    let volumeBar = document.getElementById('volume-bar');

    // Event listener for the play/pause button
    playButton.addEventListener('click', () => {
        if (video.paused == true) {
            // Play the video
            video.play();

            // Upgrade the button text to 'Pause'
            playButton.firstChild.setAttribute('src', 'img/pause-button.png');
        } else {
            // Pause the video
            video.pause();

            // Update the button text to 'Play'
            playButton.firstChild.setAttribute('src', 'img/play-button.png');
        }
    });

    // Event listener for the mute button
    muteButton.addEventListener('click', () => {
        if (video.muted == false) {
            // Mute the video
            video.muted = true;

            // La barra d'audio es posa a 0
            volumeBar.value = 0;

            // Update the button text
            muteButton.firstChild.setAttribute('src', 'img/muted-button.png');
        } else {
            // Unmute the video
            video.muted = false;

            // La barra d'audio es posa on estava abans
            volumeBar.value = video.volume;

            // Update the button text
            muteButton.firstChild.setAttribute('src', 'img/volume-button.png');
        }
    });

    // Event listener for the full-screen button
    fullScreenButton.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen(); 
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
        } else if (video.webkitRequestFullScreen) {
            video.webkitRequestFullScreen(); // Chrome and Safari
        }
    });

    // Event listener for the seek bar
    seekBar.addEventListener( 'change', () => {
        // Calculate the new time
        let time = video.duration * (seekBar.value / 100);

        // Update the video time
        video.currentTime = time;
    });

    // Update the seekbar as the video plays
    video.addEventListener('timeupdate', () => {
        // Calculate the slider value
        let value = (100 / video.duration) * video.currentTime;
        
        // Update the slider value
        seekBar.value = value;
    });

    // Pause the video when the slider handle is being dragged
    seekBar.addEventListener('mousedown', () => {
        video.pause();
    });

    // Play the video when the slider handle is dropped
    seekBar.addEventListener('mouseup', () => {
        video.play();
    });

    volumeBar.addEventListener('change', () => {
        // Update the video volume
        video.volume = volumeBar.value;
    });
};