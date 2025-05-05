const nav_date = document.getElementById("nav-date");
const date = new Date();
const [first, rest] = date.toDateString().split(/ (.+)/);
nav_date.innerHTML = `${first}<br>${rest}`;
