window.onload = function () {
  changeBodyColor();
  calculateTime();
  writeMessage();
  getResults();
}

function generateTable() {
  let HTML = ``
  for (let i = 0; i < companies.length; i++) {
    let company = companies[i];
    HTML +=
      `<tr>
    <td>${company.ticker}</td>
    <td>$${company.price}</td>
    <td>${company.amount}</td>
    <td>$${company.amount * company.price}</td>
    <td><button id="bm" onclick="buyStock(${i})">Buy More</button></td>
    <td><button id="dlt" value="Delete" onclick="deleteRow(${i})">Remove</button></td>
  </tr>`
  }
  document.getElementById('TB').innerHTML = HTML;
}

function buyStock(index) {
  let amount = Number(
    prompt(`How many ${companies[index].ticker} stocks Whuld you like to buy?`)
  )
  if (isNaN(amount)) {
    alert(`Please enter a right input!`)
  }
  else {
    companies[index].amount += amount;
  }
  generateTable();
}

function showAddCompanyForm() {
  document.getElementById('addCompanyForm').style.display = 'block';
}

function submitForm() {
  let formElement = document.getElementById('addCompanyForm');
  let fd = new FormData(formElement);
  let company = {};
  company.ticker = fd.get('ticker');
  company.price = fd.get('price');
  company.amount = + fd.get('amount');
  companies.push(company);
  generateTable();
  formElement.reset();
}


function deleteRow(index) {
  companies.splice(index, 1);
  generateTable();
}

function upperCase() {
  const x = document.getElementById("UC");
  x.value = x.value.toUpperCase();
}


function isMarketOpen() {
  let now = new Date();
  let hour = now.getHours();
  let min = now.getMinutes();
  hour += min / 60;
  return hour >= 9.5 && hour <= 16;
}

setInterval(function () {
  let now = new Date().toLocaleString();
  document.getElementById('date').innerHTML = now;
}, 1000);


function isBusinesDay() {
  let today = new Date();
  let day = today.getDay();
  return day !== 0 && day !== 6;
}

function writeMessage() {
  let today = new Date();
  let day = today.getDay();
  let dayList = ["Sunday", "Monday", "Tuesday", "Wednesday ", "Thursday", "Friday", "Saturday",];
  let message;

  if (isBusinesDay()) {
    if (isMarketOpen()) {
      message = `The Markets Are Open On ${dayList[day]} From 9:30am Till 4:00pm`;
    } else {
      message = `The Markets Are Closed On ${dayList[day]} At This Time`;
    }
  } else {
    message = `The Markets Are Closed On ${dayList[day]}`;
  }

  document.getElementById('market-status').innerHTML = message;
}

function changeBodyColor() {
  let body = document.body;
  let marketHour = isMarketOpen();
  let marketDay = isBusinesDay();

  if (marketDay) {
    if (marketHour) {
      body.classList.add('open');
      body.classList.remove('closed');
    } else {
      body.classList.add('closed');
      body.classList.remove('open');
    }
  } else {
    body.classList.add('closed');
    body.classList.remove('open');
  }
  console.log(marketDay);
}



function dateToMinutes(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours * 60) + minutes;
}

function differentMinutes(from, to) {
  return dateToMinutes(to) - dateToMinutes(from);
}

function calculateTime() {
  const OPEN_MARKET = new Date(new Date().setHours(9, 30));
  const CLOSED_MARKET = new Date(new Date().setHours(16));
  let fromOpen = differentMinutes(OPEN_MARKET, new Date());
  let toClose = differentMinutes(new Date(), CLOSED_MARKET);
  let fromClose = differentMinutes(CLOSED_MARKET, new Date());
  let p = document.querySelector('#HD');
  if (fromOpen < 0) {
    p.innerHTML = `There Are ${minutesToTime(fromOpen * -1).h}:${minutesToTime(fromOpen * -1).m} To Market Open`;
  } else if (toClose > 0) {
    p.innerHTML = `There Are ${minutesToTime(fromOpen).h}:${minutesToTime(fromOpen).m} From Market Open`;
  } else {
    p.innerHTML = `There Are ${minutesToTime(fromClose).h}:${minutesToTime(fromClose).m} From Market Closed`;
  }
  setInterval(calculateTime, 1000);
}

function minutesToTime(minutes) {
  return {
    h: Math.floor(minutes / 60),
    m: minutes % 60
  }
}

async function getResults() {
  for (let i = 0; i < companies.length; i++) {
    let company = companies[i];
    try{
    let body = await fetch(`https://api.polygon.io/v2/aggs/ticker/${company.ticker}/prev?adjusted=true&apiKey=eCpvZg_ZruTkRqlOEuoyJLEBn_VkmaeV`);
    let response = await body.json();
    let cValue = await response.results[0].c;
    console.log(cValue);
    company.price = cValue;
    }catch(err){
      console.log(err);
    }
  }
generateTable();
}