const button = document.getElementById("addButton");
const loader = document.getElementById("loader");
const mainApp = document.getElementById("main");
const myModal = document.getElementById("modal");
const closeModButton = document.getElementById("closeModBtn");
const addTaskBtn = document.getElementById("addTaskBtn");

const listTasksId = [];
let maxTasks = 1000;

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

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-icon")) {
    let parentTask = e.target.parentElement.parentElement;
    parentTask.remove();
    let idToRemove = parentTask.firstElementChild.dataset.index;
    removeIdFrom(+idToRemove);
  } else if (e.target.classList.contains("fa-trash")) {
    let parentTask = e.target.parentElement.parentElement.parentElement;
    parentTask.remove();
    let idToRemove = parentTask.firstElementChild.dataset.index;
    removeIdFrom(+idToRemove);
  } else if (e.target.classList.contains("edit-icon") || e.target.classList.contains("fa-edit")) {
    let parentDiv;
    if (e.target.tagName === "SPAN") {
      parentDiv = e.target.parentElement.parentElement;
    } else {
      parentDiv = e.target.parentElement.parentElement.parentElement;
    }
    const ItemsArr = [...parentDiv.children];
    let TaskText = ItemsArr[1].innerText;
    let TaskDate = ItemsArr[2].innerText;
    let TaskStat = ItemsArr[3].innerText;
    console.log(TaskText, TaskDate, TaskStat);
    // editTask(TaskText, TaskDate, TaskStat);
  }
});

// Functions

// Edit task text and settings

function editTask(text, date, status) {
  myModal.classList.add("show");

  taskDate.value = date;
  taskContent.value = text;

  if (status === "very important") {
    taskStatus.selectedIndex = 1;
  } else if (status === "basic") {
    taskStatus.selectedIndex = 2;
  } else {
    taskStatus.selectedIndex = 3;
  }

  addTaskBtn.disabled = true; // in process
}
// Remove id from list

function removeIdFrom(id) {
  let indexToRemove = listTasksId.indexOf(id);
  if (indexToRemove !== -1) {
    listTasksId.splice(indexToRemove, 1);
  }
}

// Page loading function
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
  taskContent.value = "";

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
  if (inputText.value.length == 0 || inputStatus.value == "none" || inputText.value.length < 8) {
    return false;
  }
  return true;
}
// Add new task for button ADD
function addNewTask() {
  let Text = taskContent.value;
  let Date = taskDate.value;
  let Status = taskStatus.value;
  let idTask = Math.floor(Math.random() * maxTasks + 1);

  idTask = checkNewTaskId(idTask);
  // console.log(idTask);
  if (idTask) {
    let newTask = taskTemplate(idTask, Text, Date, Status);

    addingTaskProcess(newTask);
  }
}

function checkNewTaskId(id) {
  if (listTasksId.indexOf(id) === -1) {
    listTasksId.push(id);
    return id;
  } else if (listTasksId.length < maxTasks) {
    let newId = Math.floor(Math.random() * maxTasks + 1);
    return checkNewTaskId(newId);
  } else {
    return false;
  }
}

function addingTaskProcess(newTask) {
  new Promise((resolve, reject) => {
    loader.style.display = "block";
    setTimeout(() => {
      closeModal();
      resolve();
    }, 1000);
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          loader.style.display = "none";
          resolve();
        }, 2000);
      });
    })
    .then(() => {
      tableBody.insertAdjacentHTML("beforeend", newTask);
    });
}

function taskTemplate(...arr) {
  return `
  <div class="task grid-lay">
    <div class="task-id" data-index="${arr[0]}">#${arr[0]}</div>
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
