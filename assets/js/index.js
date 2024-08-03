let selectedAudio;
let sessionDuration;
let countDownTimerElem = document.getElementById("count-down-timer");
let countDownTimerInterval;
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

stopBtn.disabled = true;

function stopSession() {
    if (selectedAudio) {
        selectedAudio.pause();
        selectedAudio.currentTime = 0;
    }

    sessionDuration = undefined;

    startBtn.disabled = false;
    stopBtn.disabled = true;

    clearInterval(countDownTimerInterval);
    countDownTimerElem.innerHTML = "0h 0m 0s";
}

function startSession() {
    startBtn.disabled = true;
    stopBtn.disabled = false;

    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    sessionDuration = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

    const audioSelector = document.getElementById("audio-selector");
    selectedAudio = new Audio(audioSelector.value);
    selectedAudio.loop = true;
    selectedAudio.play();

    const countDownTime = new Date().getTime() + sessionDuration;

    countDownTimerInterval = setInterval(() => {
        const distance = countDownTime - Date.now();

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countDownTimerElem.innerHTML = `${hours}h ${minutes}m ${seconds}s`;

        if (distance <= 0) {
            clearInterval(countDownTimerInterval);
            countDownTimerElem.innerHTML = "0h 0s 0m";

            stopSession();
            const alarmAudio = new Audio("assets/static/audio/alarm.mp3");
            alarmAudio.play();
            alert("Time's up!");
            alarmAudio.pause();
            alarmAudio.currentTime = 0;

            return;
        }
    }, 1000);
}