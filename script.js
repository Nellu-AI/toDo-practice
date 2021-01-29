const button = document.getElementById("addButton");
const loader = document.getElementById("loader");
const mainApp = document.getElementById("main");
const myModal = document.getElementById("modal");
const closeModButton = document.getElementById("closeModBtn");
const addTaskBtn = document.getElementById("addTaskBtn");

// Body part of the table
const tableBody = document.querySelector(".task-body");

// Input fields for new task
const taskContent = document.getElementById("taskContent");
const taskDate = document.getElementById("taskDate");
const taskStatus = document.getElementById("taskStatus");

// what date is it today?
let today = new Date().toISOString().substr(0, 10);

// Event listeners
window.addEventListener("load", pageLoaded);

button.addEventListener("click", onClickButton);

closeModButton.addEventListener("click", function (e) {
  e.preventDefault();
  closeModal();
});

addTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addNewTask();
});

taskContent.addEventListener("input", switchButton);
taskStatus.addEventListener("change", switchButton);

// Functions
function pageLoaded() {
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000);
  }).then(() => {
    mainApp.style.display = "block";
    loader.style.display = "none";
  });
}

function onClickButton() {
  myModal.classList.add("show");
  taskDate.value = today;
  taskStatus.selectedIndex = 0;

  switchButton();
}

function onButton() {
  addTaskBtn.disabled = false;
}
function offButton() {
  addTaskBtn.disabled = true;
}

function switchButton() {
  if (checkInputContent(taskContent, taskDate, taskStatus) == false) {
    offButton();
  } else {
    onButton();
  }
  if (taskContent.value.length >= 8) {
    taskContent.className = "taskTxt valid";
  } else {
    taskContent.className = "taskTxt";
  }
  if (taskStatus.value !== "none") {
    taskStatus.className = "taskStat valid";
  } else {
    taskStatus.className = "taskStat";
  }
}

// close window for adding task
function closeModal() {
  myModal.classList.remove("show");
}

function checkInputContent(inputText, inputDate, inputStatus) {
  if (
    inputText.value.length == 0 ||
    inputStatus.value == "none" ||
    inputText.value.length < 8
  ) {
    return false;
  }
  return true;
}
// Add new task for button ADD
function addNewTask() {
  let Text = taskContent.value;
  let Date = taskDate.value;
  let Status = taskStatus.value;
  let idTask = Math.floor(Math.random() * 1000);

  let newTask = taskTemplate(idTask, Text, Date, Status);

  tableBody.insertAdjacentHTML("beforeend", newTask);
}

function taskTemplate(...arr) {
  return `
  <div class="task grid-lay">
    <div class="task-id">#${arr[0]}</div>
    <div class="task-description">${arr[1]}</div>
    <div class="task-date">${arr[2]}</div>
    <div class="task-status">${arr[3]}</div>
    <div class="task-actions">
      <span class="edit-icon"><i class="fas fa-edit fa-2x"></i></span>
      <span class="remove-icon"><i class="fas fa-trash fa-2x"></i></span>
    </div>
  </div>
  `;
}
