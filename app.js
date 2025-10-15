function checkVideoSupport() {
    return !!document.createElement("video").canPlayType;
}

function createVideoControls(video) {
    let videoContainer = video.parentElement;
    let changeProgress = false;
    let changeVolume = false;

    function changeVideoVolume(vol) {
        vol = Math.min(Math.max(vol, 0), 1);
        video.volume = vol;
        videoContainer.style.setProperty("--volume", `${vol * 100}%`);
        mute.classList.toggle("video-mute--muted", vol === 0)
    }

    const controls = document.createElement("div");
    controls.classList.add("video-controls");

    const controlsBg = document.createElement("div");
    controlsBg.classList.add("video-controls-bg");

    const playPause = document.createElement("button");
    playPause.classList.add("video-play");
    playPause.type = "button";
    playPause.innerText = "play / pause";

    const progress = document.createElement("div");
    progress.classList.add("video-progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("video-progress-bar");
    progress.append(progressBar);

    const videoSound = document.createElement("div");
    videoSound.classList.add("video-sound");

    const mute = document.createElement("button");
    mute.classList.add("video-mute");
    mute.type = "button";
    mute.innerText = "mute";

    const volumeSlider = document.createElement("div");
    volumeSlider.classList.add("video-volume");
    const volumeSliderBar = document.createElement("div")
    volumeSliderBar.classList.add("video-volume-bar");
    volumeSlider.append(volumeSliderBar);

    videoSound.append(volumeSlider);
    videoSound.append(mute);

    controls.append(playPause);
    controls.append(progress);
    controls.append(videoSound);
    controls.append(controlsBg);

    playPause.addEventListener("click", () => {
        if (video.paused || video.ended) {
            video.play();
            videoContainer.classList.add("video--start-play");
            videoContainer.classList.add("video--played");
            playPause.classList.add("video-play--pause");
        } else {
            video.pause();
            videoContainer.classList.remove("video--played");
            playPause.classList.remove("video-play--pause");
        }
    });

    mute.addEventListener("click", () => {
        video.muted = !video.muted;
        mute.classList.toggle("video-mute--muted", video.muted);
        if (video.muted) {
            changeVideoVolume(0);
        } else {
            changeVideoVolume(video.volume);
        }
    });

    video.addEventListener("loadedmetadata", () => {
        progress.dataset.max = video.duration;
    });

    video.addEventListener("timeupdate", () => {
        if (!progress.dataset.max) progress.dataset.max = video.duration;
        progressBar.style.width = `${video.currentTime * 100 / video.duration}%`;
    });

    video.addEventListener("ended", () => {
        playPause.classList.remove("video-play--pause");
    });

    progress.addEventListener("mousedown", e => {
        changeProgress = true;
        const rect = progress.getBoundingClientRect();
        const pos = (e.pageX - rect.left) / progress.offsetWidth;
        video.currentTime = pos * video.duration;
    });

    document.addEventListener("mouseup", () => {
        changeProgress = false;
    })

    document.addEventListener("mousemove", (e) => {
        if (changeProgress) {
            const rect = progress.getBoundingClientRect();
            const pos = (e.pageX - rect.left) / progress.offsetWidth;
            video.currentTime = pos * video.duration;
        }
    });

    volumeSlider.addEventListener("mousedown", e => {
        changeVolume = true;
        const rect = volumeSlider.getBoundingClientRect();
        let pos = 1 - (rect.right - e.pageX) / volumeSlider.offsetWidth;
        changeVideoVolume(pos);
    });

    document.addEventListener("mouseup", () => {
        changeVolume = false;
    })

    document.addEventListener("mousemove", (e) => {
        if (changeVolume) {
            const rect = volumeSlider.getBoundingClientRect();
            let pos = 1 - (rect.right - e.pageX) / volumeSlider.offsetWidth;
            changeVideoVolume(pos);
        }
    });

    console.log(video.volume);
    changeVideoVolume(video.volume);

    return controls;
}

function makeCustomVideo() {
    if (checkVideoSupport()) {
        const videos = document.querySelectorAll(".video");

        videos.forEach(vc => {
            const video = vc.querySelector("video");
            const controls = createVideoControls(video);
            video.parentElement.append(controls);
            video.controls = false;
        })
    }
}

makeCustomVideo();