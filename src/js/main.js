import { load } from 'js-yaml';

// Function to request a response from a URL
const req = url => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status === 200) {
        return xhr.responseText;
    }
};

// Days of the week and month names
const ww = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Return day of the week or month name based on a datetime object
const weekday = t => ww[t.getDay()];
const month = t => mm[t.getMonth()];

// Millisecond shortcuts (milliseconds * seconds * minutes...)
const msh = 36e5;
const msd = msh*24;

// Add hours or days to a datetime object
const addHours = (d, h) => new Date(d.getTime() + h * msh);
const addDays = (d, dd) => new Date(d.getTime() + dd * msd);

// Format a date or time into a string
const formatDate = n => {
    n = n.getDate();
    return (n % 10 === 1 && n % 100 != 11) ? `${n}st`
    : (n % 10 === 2 && n % 100 != 12) ? `${n}nd`
    : (n % 10 === 3 && n % 100 != 13) ? `${n}rd`
    : `${n}th`
}
const formatTime = d => {
    const hh = d.getHours();
    const m = d.getMinutes().toString().padStart(2, 0);
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    return `${h}:${m} ${dd}`;
}

// Shortcuts to combine stringified datetimes
const monthDay = t => `${month(t)} ${formatDate(t)}`;
const fullDate = t => `${weekday(t)}, ${monthDay(t)}`;
const monthDayTime = t => `${monthDay(t)} at ${formatTime(t)}`;
const fullDayTime = t => `${fullDate(t)}, ${formatTime(t)}`;

// Class-related functions
const checkClass = c => document.getElementsByClassName(c).length > 0;
const setClass = (c, str, n=0) => document.getElementsByClassName(c)[n].innerHTML = str;

// Returns data based on existance of external website string
const linkData = str => {
    const href = str.match('^http') ? str : `https://raritanlibrary.org/${str}`;
    const rel = str.match('^http') ? ` rel="noopener"` : ``;
    return `href="${href}" target="_blank"${rel}`;
}

// Get current time
const now = new Date();

/* FRONT PAGE ****************************************************************/

// Load news data
const newsData = req(`https://raw.githubusercontent.com/raritanlibrary/www/main/src/data/news.yaml`)
let news = load(newsData);

// Set month in header
const monthNow = Number(getComputedStyle(document.documentElement).getPropertyValue('--m'));
if (checkClass("month")) {
    monthHead = `${mm[monthNow]} ${addDays(now, 30).getFullYear()} Edition`
    setClass("month", monthHead);
}

// Sort and delete excess news data
news = news.sort((a, b) => a.date - b.date);
for (let i = 0; i < news.length; i++) {
    let entry = news[i];
    if (entry.date < addDays(now, -30) || entry.hidden) {
        news.splice(i, 1);
        i--;
    }
}

// Set content
if (checkClass(`news__content`)) {
    // Inject news into HTML
    let newsOutput = ``;
    news.forEach(post => {
        newsOutput = `
        <div class="center">
            <h2>${post.name}</h2>
            <p class="news__desc">${post.desc}</p>
        </div>
        `
    });

    // Set the content to the class
    setClass(`news__content`, newsOutput)
}

/* BACK PAGE ****************************************************************/

// Load event data
const eventData = req(`https://raw.githubusercontent.com/raritanlibrary/www/main/src/data/events.yaml`)
let events = load(eventData);

// Organize event data
events.forEach(event => {
    if (event.date === "tbd") {
        event.dateName = event.dateSort = new Date(16e12 + 30 * monthNow * msd);
    } else if (event.length === "range") {
        event.dateSort = event.date[0] < now ? now : event.date[0];
        event.dateName = event.date[1];
        event.range = true;
        event.length = 1;
    } else if (Array.isArray(event.date)) {
        const numDays = event.date.length;
        for (let i = 0; i < numDays; i++) {
            let day = event.date[i];
            if (addHours(day, event.length) < now && numDays !== 1) {
                event.date.shift();
                i--;
            } else {
                event.dateSort = day;
                event.dateName = event.date[event.date.length-1];
                break;
            }
        }
    } else {
        event.dateName = event.dateSort = event.date;
    }
});

// Sort and delete excess event data
const nextNow = addDays(now, 14);
const nextFirst = new Date(`${month(nextNow)} 1 ${nextNow.getFullYear()} 10:00:00 -5`);
events = events.sort((a, b) => a.dateSort - b.dateSort);
for (let i = 0; i < events.length; i++) {
    let event = events[i];
    if (event.dateName < nextFirst) {
        events.splice(i, 1);
        i--;
    }
}

// Set content
let endTime;
let eventOutput = ``;
events.forEach(event => {
    let eventDate;
    endTime = event.noendtime ? `` : ` - ${formatTime(addHours(event.dateName, event.length))}`;
    if (event.date === 'tbd') {
        eventDate = `Date:&nbsp;TBD`
    } else if (event.range) {
        eventDate = `${fullDate(event.date[0])} - ${fullDate(event.date[1])}`;
    } else if (Array.isArray(event.date) && event.date.length > 1) {
        if (event.date[0].getDate() === event.date[1].getDate()) {
            eventDate = `${fullDate(event.date[0])}, ${formatTime(event.date[0])} and ${formatTime(event.date[1])}`;
        } else {
            eventDate = `${weekday(event.date[0])}s at ${formatTime(event.date[0])}${endTime} <br>`;
            event.date.forEach((day, i) => {
                eventDate += i < event.date.length - 1 ? `${monthDay(day)},&nbsp;` : monthDay(day)
            });
        }
    } else if (Array.isArray(event.date) && event.date.length === 1) {
        eventDate = `${fullDayTime(event.date[0])}${endTime}`;
    } else {
        eventDate = `${fullDayTime(event.date)}${endTime}`;
    }
    if (addHours(event.dateName, event.length) >= now) {
        eventOutput += `
        <div class="event">
            <img class="event__img" src="https://raritanlibrary.org/img/events/${event.img}.webp">
            <div class="event__desc">
                <h4 class="event__title">${event.name}</h4>
                <p class="event__date">${eventDate}</p>
                <br>
                <p class="event__blurb">${event.blurb.replace(' Registration is required.', '')}</p>
            </div>
        </div>
        `
    }
});
setClass(`programs__content`, eventOutput)