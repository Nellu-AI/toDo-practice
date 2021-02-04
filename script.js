const button = document.getElementById("addButton");
const loader = document.getElementById("loader");
const mainApp = document.getElementById("main");
const myModal = document.getElementById("modal");
const closeModButton = document.getElementById("closeModBtn");
const addTaskBtn = document.getElementById("addTaskBtn");

const listTasksId = [];
let maxTasks = 1000;

//Список задач

const tasks = [
  {
    id: "MXGV",
    body: "Task 1 - to do list",
    date: "2020-02-04",
    status: "important",
  },
  {
    id: "u9n",
    body: "Task 2 - to do list",
    date: "2021-02-04",
    status: "basic",
  },
  {
    id: "ZRC6",
    body: "Task 3 - to do list",
    date: "2021-05-04",
    status: "very important",
  },
  {
    id: "Ia4",
    body: "Task 4 - to do list",
    date: "2021-12-04",
    status: "long-term",
  },
];

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

// Page loading function
function pageLoaded() {
  const objOfTasks = tasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

  renderAllTasks(objOfTasks);

  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000);
  }).then(() => {
    mainApp.style.display = "block";
    loader.style.display = "none";
  });
}

function renderAllTasks(tasksList) {
  if (!tasksList) {
    console.error("Передайте список задача");
    return;
  }

  let fragment = "";
  Object.values(tasksList).forEach((task) => {
    let newEl = taskTemplate(task);
    fragment += newEl;
  });
  tableBody.insertAdjacentHTML("beforeend", fragment);
}

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

function taskTemplate({ id, body, date, status } = {}) {
  return `
  <div class="task grid-lay">
    <div class="task-id" data-index="${id}">#${id}</div>
    <div class="task-description">${body}</div>
    <div class="task-date">${date}</div>
    <div class="task-status">${status}</div>
    <div class="task-actions">
      <span class="edit-icon"><i class="fas fa-edit fa-2x"></i></span>
      <span class="remove-icon"><i class="fas fa-trash fa-2x"></i></span>
    </div>
  </div>
  `;
}
