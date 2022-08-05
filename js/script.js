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
    timeOfDay = getTimeOfDay();
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
    wind.textContent = `Wind speed: ${data.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

}

city.addEventListener('change', () => getWeather(city.value));

async function getQuotes() {
    const quotes = '../js/phases.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let pharaseNum = getRandomNum(0, Object.keys(data).length)
    author.innerHTML = data[pharaseNum].author;
    quote.innerHTML = `\"${data[pharaseNum].text}\"`;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);




