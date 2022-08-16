import playList from './playList.js';
const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const nameU = document.querySelector('.name');
const body = document.getElementsByTagName('body')[0];
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

const song = document.querySelector('.song');
const progress = document.querySelector('.progress');
const progressCont = document.querySelector('.progress__cont');

const audioPlayer = document.querySelector('.player');
// const audio = document.querySelector('.audio');
const prevBtn = document.querySelector('.play-prev');
const nextBtn = document.querySelector('.play-next');
const play = document.querySelector('.play');
const playListCont = document.querySelector('.play-list');
const current = document.querySelector('.current');


let isPlay = false;
let playNum = 0;
const audio = new Audio(playList[playNum].src);

let randomNum = Math.floor(Math.random() * 20) + 1;

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}
showTime();

function showDate() {
    const day = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = day.toLocaleDateString('en-US', options);
    date.textContent = currentDate;
}

function getTimeOfDay() {
    const greet = new Date();
    const hours = greet.getHours();
    if (hours > 24 || hours < 6) return "night";
    else if (hours < 12) return "morning";
    else if (hours < 18) return "afternoon";
    else return "evening";
}

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    const greetingText = `Good ${timeOfDay}`;
    greeting.textContent = greetingText;
}

function setLocalStorage() {
    let name = nameU;
    let cityT = city;
    localStorage.setItem('name', name.value);
    localStorage.setItem('cityT', city.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        let name = nameU;
        let cityT = city;
        name.value = localStorage.getItem('name');

        if (localStorage.getItem('cityT')) {
            city.value = localStorage.getItem('cityT');
        } else {
            city.value = 'Minsk';
        }
        getWeather();
    }
}
window.addEventListener('load', getLocalStorage)

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = randomNum.toString().padStart(2, "0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/ErkhanDV/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;
    }
}
setBg();

function getSlideNext() {
    randomNum = randomNum >= 20 ? 1 : ++randomNum;
    setBg();
}
slideNext.addEventListener('click', getSlideNext)


function getSlidePrev() {
    randomNum == 0 ? randomNum = 20 : randomNum--;
    setBg();
}
slidePrev.addEventListener('click', getSlidePrev)

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=f634968257025693e5f2f044309c4f72&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].main;
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

}

city.addEventListener('change', () => getWeather(city.value));

async function getQuotes() {
    const quotes = '../js/phases.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let pharaseNum = getRandomNum(0, Object.keys(data).length - 1)
    author.innerHTML = data[pharaseNum].author;
    quote.innerHTML = `\"${data[pharaseNum].text}\"`;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);

function toggleBtn() {
    play.classList.toggle('pause');
}
play.addEventListener('click', toggleBtn);

function playAudio() {
    setsongTitle();
    setPauseList();
    playActive();
    if (!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}
play.addEventListener('click', playAudio);




function playNext() {
    playNum = playNum == playList.length - 1 ? 0 : ++playNum;
    isPlay = isPlay == true ? false : true;
    audio.src = playList[playNum].src;
    playAudio();
}
nextBtn.addEventListener('click', playNext)

function playPrev() {
    playNum = playNum == 0 ? playList.length - 1 : --playNum;
    isPlay = isPlay == true ? false : true;
    audio.src = playList[playNum].src;
    playAudio();
}
prevBtn.addEventListener('click', playPrev)

audio.addEventListener("ended", playNext);


// create button list
playList.forEach(item => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('play');
    button.classList.add('play-icon');
    button.classList.add('btn');
    li.classList.add('play-item');
    li.innerHTML = item.title;
    playListCont.append(li);
    li.prepend(button);
});

const playBtn = document.querySelectorAll('.play-icon');

function setPauseList(){
    playBtn.forEach((el) => el.classList.remove('pause'));
    if (play.classList.contains ('pause')){
        playBtn[playNum].classList.add('pause');
    }
}


function playActive() {
    playBtn.forEach((el) => el.classList.remove('item-active'));
    playBtn[playNum].classList.add('item-active');
}

function setsongTitle() {
    song.innerHTML = playList[playNum].title;
}


playBtn.forEach((e)=> { e.addEventListener('click',((e)=> {
    playNum=playList.findIndex(el => el.title === e.target.parentNode.textContent);
    // console.log( "до If  " + isPlay)

    audio.src = playList[playNum].src;
    // isPlay == false

    if (isPlay == false || !play.classList.contains ('pause')){
        toggleBtn();
        setPauseList();
        playAudio();
        // console.log("1й If  " + isPlay)
    }
    else if(isPlay == true || play.classList.contains ('pause')){

        toggleBtn();
        playAudio();
        setPauseList();
        // console.log("2й If  " + isPlay)
    }

}))})


audio.addEventListener(
    'loadeddata',
    () => {
        audioPlayer.querySelector(".playtime .length").textContent = getTimeCodeFromNum(
            audio.duration
        );
        audio.volume = .75;
        setsongTitle();
    },
    false
);


// Progress bar
function updateProgress(ev) {
    const { duration, currentTime } = ev.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    current.innerHTML = getTimeCodeFromNum(audio.currentTime);
}
audio.addEventListener('timeupdate', updateProgress)

// set progress

function setProgress(ev) {
    const width = this.clientWidth;
    const clickX = ev.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}
progressCont.addEventListener('click', setProgress)

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".volume-slider");
volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false)


audioPlayer.querySelector(".volume__button").addEventListener("click", () => {
    const volumeEl = audioPlayer.querySelector(".volume-container .volume");
    audio.muted = !audio.muted;
    if (audio.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});







