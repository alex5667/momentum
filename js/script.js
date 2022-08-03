const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');


function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
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
    let hours = greet.getHours();
    let  currgreeting;
    if (hours < 5)  currgreeting = "Good night"; 
        else if (hours < 12)  currgreeting = "Good morning";
        else if (hours < 18) currgreeting = "Good afternoon";
        else if (hours < 24) currgreeting = "Good evening"; 
        else currgreeting = "Good night";
        greeting.textContent = currgreeting;
}
getTimeOfDay();

