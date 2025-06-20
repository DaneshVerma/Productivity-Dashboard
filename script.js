function headerContent() {
  let headerTime = document.querySelector(".header1 h1");
  let headerDate = document.querySelector(".header1 h2");
  let headerTempreture = document.querySelector(".header2 h2");
  let headerConditionTxt = document.querySelector(".header2 h4");
  let headerHumidity = document.querySelector(".header2 .humidity");
  let headerFeelLike = document.querySelector(".header2 .feel");
  let headerWind = document.querySelector(".header2 .wind");
  let key = "d69a97f7024d488883c72309252405",
    location = "bhanpuri";
  function weatherUpdate() {
    fetch(
      ` https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`
    ).then((data) => {
      data.json().then((data) => {
        headerTempreture.textContent = data.current.temp_c + "°c";
        headerConditionTxt.textContent = data.current.condition.text;
        headerHumidity.textContent =
          "Humidity : " + data.current.humidity + "%";
        headerFeelLike.textContent =
          "Feelslike : " + data.current.feelslike_c + "°c";
        headerWind.textContent = "Wind : " + data.current.wind_kph + " KM/h";
        console.log(data);
      });
    });
  }
  weatherUpdate();
  function timeDate() {
    let totalMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let totalweekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setInterval(() => {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let date = time.getDate();
      let month = totalMonths[time.getMonth()];
      let year = time.getFullYear();
      let seconds = String(time.getSeconds()).padStart(2, 0);
      if (hours > 12)
        headerTime.innerHTML = `${totalweekDays[time.getDay()]}, ${
          hours - 12
        }:${minutes}:${seconds} PM`;
      else
        headerTime.innerHTML = `${
          totalweekDays[time.getDay()]
        }, ${hours}:${minutes}:${seconds} AM`;
      headerDate.textContent = `${date} ${month} ${year}`;
    }, 1000);
  }
  timeDate();
}

headerContent();
function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let allFullelems = document.querySelectorAll(".fullElem");
  let BackBtn = document.querySelectorAll(".fullElem .back");
  allElems.forEach((elem) => {
    elem.addEventListener("click", () => {
      setTimeout(() => {
        allFullelems[elem.id].style.display = "block";
      }, 100);
    });
  });

  BackBtn.forEach((back) => {
    back.addEventListener("click", () => {
      allFullelems[back.id].style.display = "none";
    });
  });
}
openFeatures();

function todolist() {
  let form = document.querySelector(".add-task form");
  let taskInput = document.querySelector(".add-task form input");
  let taskDetailsinput = document.querySelector(".add-task form textarea");
  let taskImpCheckBox = document.querySelector("#checkbox");

  let currentTask = new Array();

  function renderTask() {
    currentTask = JSON.parse(localStorage.getItem("tasks")) || [];
    let allTask = document.querySelector(".all-task");
    let taskContent = "";
    currentTask.forEach((elem, i) => {
      taskContent += `<div class="task">
                    <h5>${elem.task} <span class="${elem.imp}">IMP</span></h5>
                    <button id=${i}>Mark as completed</button>
                </div>`;
    });

    allTask.innerHTML = taskContent;

    let markCompletedBtn = document.querySelectorAll(".task button");
    markCompletedBtn.forEach((Btn) => {
      Btn.addEventListener("click", () => {
        currentTask.splice(Btn.id, 1);
        localStorage.setItem("tasks", JSON.stringify(currentTask));

        renderTask();
      });
    });
  }
  renderTask();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsinput.value,
      imp: taskImpCheckBox.checked,
    });
    localStorage.setItem("tasks", JSON.stringify(currentTask));
    renderTask();
    taskInput.value = "";
    taskDetailsinput.value = "";
    taskImpCheckBox.checked = false;
  });
}
todolist();

function dailyPlanner() {
  let dayPlanner = document.querySelector(".day-planner");
  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  let hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`
  );
  let timeSlots = "";
  hours.forEach((elem, idx) => {
    let savedData = dayPlanData[idx] || "";
    timeSlots += `<div class="day-planner-time">
  <p>${elem}</p>
  <input id=${idx} type="text" placeholder="....." value=${savedData} >
  </div>
  `;
  });
  dayPlanner.innerHTML = timeSlots;
  let dayInputs = document.querySelectorAll(".day-planner-time input");

  dayInputs.forEach((elem) => {
    elem.addEventListener("input", () => {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

function motivationQuote() {
  fetch("https://api.quotable.io/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.querySelector(
        ".motivational-wrapper"
      ).innerHTML = `<div class="motivation-heading">
                    <h2>Quote Of The Day</h2>
                </div>
                <div class="motivation-quote">
                    <h2>${data.content}</h2>
                </div>
                <div class="motivation-auther">
                    <small>- ${data.author}</small>
                </div>`;
    })
    .catch(() => {
      alert("unable To connect!");
    });
}
motivationQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  let startBtn = document.querySelector(".start-timer");
  let pauseBtn = document.querySelector(".pause-timer");
  let resetBtn = document.querySelector(".reset-timer");
  let sessionIndicator = document.querySelector(".session");
  let totalSeconds = 25 * 60;
  let timeInterval = null;
  let workSession = true;
  function updateTime() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    timer.innerHTML = `${String(minutes).padStart(2, 0)} : ${String(
      seconds
    ).padStart(2, 0)}`;
  }
  updateTime();

  function startTimer() {
    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(timeInterval);
        workSession = !workSession;
        if (workSession) {
          totalSeconds = 25 * 60;
          sessionIndicator.innerHTML = "Work & Work";
          sessionIndicator.style.backgroundColor = `var(--green)`;
        } else {
          totalSeconds = 5 * 60;
          sessionIndicator.innerHTML = "Take a Break";
          sessionIndicator.style.backgroundColor = `var(--blue)`;
        }
      }
      updateTime();
    }, 1000);
  }
  startBtn.addEventListener("click", startTimer);

  function pauseTimer() {
    clearInterval(timeInterval);
  }
  pauseBtn.addEventListener("click", pauseTimer);

  function resetTimer() {
    clearInterval(timeInterval);
    totalSeconds = 25 * 60;
    updateTime();
  }
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

function dailyGoals() {
  document.querySelector(".goal-input")?.focus()
  let goalDiv = document.querySelector(".goal-div");
  let btn = document.querySelector(".set-btn");
  let goalStore = localStorage.getItem("goal");
  let flag = 0;
  if (goalStore) {
    goalDiv.innerHTML = `<h1 class="goal-txt">" ${goalStore}. "</h1>`;
    btn.textContent = "Change";
    flag = 1;
  }
  function change() {
    goalDiv.innerHTML = `<input class="goal-input"  autocomplete="off" name="goal-input" required placeholder="What's your todays goal">`;
    btn.textContent = "Set Goal";
    flag = 0;
  }
  btn.addEventListener("click", () => {
    if (!flag) {
      let input = document.querySelector(".goal-input");
      let goal = input.value;
      if (true) {
        localStorage.setItem("goal", goal);
        let newGoal = localStorage.getItem("goal");
        goalDiv.innerHTML = `<h1 class="goal-txt">" ${newGoal}. "</h1>`;
        flag = 1;
        btn.textContent = "Change";
      } else {
        alert("Write down the Goal to set!");
      }
    } else {
      change();
    }
  });
}
dailyGoals();
