let videoPlayer = document.getElementById('videoPlayer');
let videoWrapper = document.getElementById('videoWrapper');
let videoSelect = document.getElementById('videoSelect');
let progressBar = document.getElementById('progress');
let steppingInterval;
let isLooping = true;
let scale = 1;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
let normalSpeed = 1;
let fastForwardSpeed = 2;
let slowMotionSpeed = 0.5;
let wasPlaying = false; // To track if the video was playing before stepping

videoPlayer.addEventListener('timeupdate', updateProgress);

videoWrapper.addEventListener('wheel', function(event) {
    event.preventDefault();
    let zoomAmount = 0.1;
    if (event.deltaY > 0) {
        scale = Math.max(1, scale - zoomAmount); // Only zoom in
    } else {
        scale += zoomAmount;
    }
    videoPlayer.style.transform = `scale(${scale})`;
});

videoWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - videoWrapper.offsetLeft;
    startY = e.pageY - videoWrapper.offsetTop;
    scrollLeft = videoWrapper.scrollLeft;
    scrollTop = videoWrapper.scrollTop;
});

videoWrapper.addEventListener('mouseleave', () => {
    isDragging = false;
});

videoWrapper.addEventListener('mouseup', () => {
    isDragging = false;
});

videoWrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - videoWrapper.offsetLeft;
    const y = e.pageY - videoWrapper.offsetTop;
    const walkX = (x - startX) * 2; // Scroll-fast
    const walkY = (y - startY) * 2; // Scroll-fast
    videoWrapper.scrollLeft = scrollLeft - walkX;
    videoWrapper.scrollTop = scrollTop - walkY;
});

videoWrapper.addEventListener('touchstart', handleTouchStart, false);
videoWrapper.addEventListener('touchmove', handleTouchMove, false);

let x1 = null;
let y1 = null;

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;
};

function handleTouchMove(event) {
    if (!x1 || !y1) {
        return;
    }

    let x2 = event.touches[0].clientX;
    let y2 = event.touches[0].clientY;

    let xDiff = x2 - x1;
    let yDiff = y2 - y1;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            scale += 0.1;
        } else {
            scale -= 0.1;
        }
    } else {
        if (yDiff > 0) {
            scale -= 0.1;
        } else {
            scale += 0.1;
        }
    }
    scale = Math.max(1, scale); // Only zoom in
    videoPlayer.style.transform = `scale(${scale})`;

    x1 = null;
    y1 = null;
}

function playPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function stepFrame(direction) {
    videoPlayer.currentTime += direction * (1 / 30); // Assumes 30 fps
}

function startStepping(direction) {
    wasPlaying = !videoPlayer.paused;
    if (wasPlaying) videoPlayer.pause();
    stepFrame(direction);
    steppingInterval = setInterval(() => stepFrame(direction), 100);
}

function stopStepping() {
    clearInterval(steppingInterval);
    if (wasPlaying) {
        setTimeout(() => {
            videoPlayer.play();
        }, 100);
    }
}

function setSpeed() {
    let speed = document.getElementById('speed').value;
    videoPlayer.playbackRate = speed;
    normalSpeed = speed; // Update the normal speed to the new value
}

function loadVideo() {
    let selectedVideo = videoSelect.value;
    let folder = new URLSearchParams(window.location.search).get('folder') || 'offense';
    videoPlayer.src = `/videos/${selectedVideo}?folder=${folder}`;
    videoPlayer.load();
    videoPlayer.play();
}

function nextVideo() {
    let currentIndex = videoSelect.selectedIndex;
    let nextIndex = (currentIndex + 1) % videoSelect.options.length;
    videoSelect.selectedIndex = nextIndex;
    loadVideo();
}

function previousVideo() {
    let currentIndex = videoSelect.selectedIndex;
    let previousIndex = (currentIndex - 1 + videoSelect.options.length) % videoSelect.options.length;
    videoSelect.selectedIndex = previousIndex;
    loadVideo();
}

function changeFolder(folder) {
    window.location.href = `/?folder=${folder}`;
}

function updateProgress() {
    let percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBar.style.width = percentage + '%';
}

function toggleLoop() {
    isLooping = !isLooping;
    videoPlayer.loop = isLooping;
    alert(`Looping is now ${isLooping ? 'enabled' : 'disabled'}`);
}

function startFastForward() {
    wasPlaying = !videoPlayer.paused;
    if (wasPlaying) videoPlayer.pause();
    videoPlayer.playbackRate = fastForwardSpeed;
}

function stopFastForward() {
    videoPlayer.playbackRate = normalSpeed;
    if (wasPlaying) {
        setTimeout(() => {
            videoPlayer.play();
        }, 100);
    }
}

function startSlowMotion() {
    wasPlaying = !videoPlayer.paused;
    if (wasPlaying) videoPlayer.pause();
    videoPlayer.playbackRate = slowMotionSpeed;
}

function stopSlowMotion() {
    videoPlayer.playbackRate = normalSpeed;
    if (wasPlaying) {
        setTimeout(() => {
            videoPlayer.play();
        }, 100);
    }
}
