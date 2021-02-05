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
window.addEventListener("load", pageLoaded); //loading tasks

button.addEventListener("click", onClickButton); //show Modal

closeModButton.addEventListener("click", closeModal); //close Modal

taskContent.addEventListener("input", switchButton); //not active button
taskStatus.addEventListener("change", switchButton); //not active button

tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-trash")) {
    const parent = e.target.closest("[data-id]");
    const id = parent.dataset.id;
    const confirmed = deleteTask(id);
    deleteTaskFromHtml(confirmed, parent);
  } else if (e.target.classList.contains("fa-edit")) {
    const parentDiv = e.target.closest("[data-id]");
    const id = parentDiv.dataset.id;

    editTask(id, parentDiv);
  }
});

// Functions

// Page loading function
function pageLoaded() {
  renderAllTasks(tasks);

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
  tasksList.forEach((task) => {
    let newEl = taskTemplate(task);
    fragment += newEl;
  });
  tableBody.insertAdjacentHTML("beforeend", fragment);
}

// Edit task text and settings

function editTask(id, parent) {
  const taskToEdit = tasks.find((element) => element.id === id);
  myModal.classList.add("show");

  taskDate.value = taskToEdit.date;
  taskContent.value = taskToEdit.body;

  if (taskToEdit.status === "very important") {
    taskStatus.selectedIndex = 1;
  } else if (taskToEdit.status === "basic") {
    taskStatus.selectedIndex = 2;
  } else {
    taskStatus.selectedIndex = 3;
  }

  addTaskBtn.removeEventListener("click", addNewTask);
  addTaskBtn.innerText = "Save changes";
  switchButton();
  addTaskBtn.addEventListener("click", editTaskButton, { once: true });
  function editTaskButton(e) {
    e.preventDefault();
    let Text = taskContent.value;
    let Status = taskStatus.value;
    taskToEdit.body = Text;
    taskToEdit.status = Status;
    new Promise((resolve, reject) => {
      loader.style.display = "block";
      setTimeout(() => {
        myModal.classList.remove("show");
        resolve();
      }, 1000);
    }).then(() => {
      setTimeout(() => {
        loader.style.display = "none";
        parent.querySelector(".task-description .task-text").innerText = Text;
        parent.querySelector(".task-status").innerHTML = Status;
      }, 2000);
    });
  }
}

//Remove task from HTML
function deleteTaskFromHtml(confirmed, el) {
  if (!confirmed) return;
  new Promise((resolve, reject) => {
    loader.style.display = "block";
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    setTimeout(() => {
      loader.style.display = "none";
      el.remove();
    }, 1000);
  });
}

// Remove task from list

function deleteTask(id) {
  const isConfirm = confirm(`Are you sure? Task with id #${id} will be removed`);
  if (!isConfirm) return isConfirm;
  const taskToRemove = tasks.find((element) => element.id === id);
  const taskIndex = tasks.indexOf(taskToRemove);
  if (taskIndex > -1) tasks.splice(taskIndex, 1);
  removeIdFrom(id);
  return isConfirm;
}
// Remove id from list

function removeIdFrom(id) {
  let indexToRemove = listTasksId.indexOf(+id.substr(5));
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
  addTaskBtn.innerText = "Add task";
  addTaskBtn.addEventListener("click", addNewTask);
}

function onButton() {
  addTaskBtn.disabled = false;
}
function offButton() {
  addTaskBtn.disabled = true;
}

function switchButton() {
  if (checkInputContent(taskContent, taskStatus) == false) {
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
function closeModal(e) {
  e.preventDefault();
  myModal.classList.remove("show");
}

function checkInputContent(inputText, inputStatus) {
  if (inputText.value.length == 0 || inputStatus.value == "none" || inputText.value.length < 8) {
    return false;
  }
  return true;
}
// Add new task for button ADD
function addNewTask(e) {
  e.preventDefault();
  let Text = taskContent.value;
  let Date = taskDate.value;
  let Status = taskStatus.value;
  let idTask = Math.floor(Math.random() * maxTasks + 1);

  idTask = checkNewTaskId(idTask);
  // console.log(idTask);
  if (idTask) {
    const newTask = createNewTask(idTask, Text, Date, Status);
    console.log(newTask);
    const newElement = taskTemplate(newTask);
    addingTaskProcess(newElement);
  }
}

function createNewTask(id, body, date, status) {
  const newTask = {
    id: `task-${id}`,
    body,
    date,
    status,
  };
  tasks.push(newTask);
  return { ...newTask };
}

function checkNewTaskId(id) {
  if (listTasksId.indexOf(id) === -1 && listTasksId.length < maxTasks) {
    listTasksId.push(id);
    return id;
  } else if (listTasksId.length < maxTasks) {
    let newId = Math.floor(Math.random() * maxTasks + 1);
    return checkNewTaskId(newId);
  } else {
    console.error("LIST FOR ID IS FULL");
    return false;
  }
}

function addingTaskProcess(newTask) {
  new Promise((resolve, reject) => {
    loader.style.display = "block";
    setTimeout(() => {
      myModal.classList.remove("show");
      resolve();
    }, 1000);
  }).then(() => {
    setTimeout(() => {
      loader.style.display = "none";
      tableBody.insertAdjacentHTML("afterbegin", newTask);
    }, 2000);
  });
}

function taskTemplate({ id, body, date, status } = {}) {
  return `
  <div class="task grid-lay" data-id="${id}">
    <div class="task-id">#${id}</div>
    <div class="task-description"><span class="task-text">${body}</span><span class="edit-icon"><i class="fas fa-edit fa-2x"></i></span></div>
    <div class="task-date">${date}</div>
    <div class="task-status">${status}</div>
    <div class="task-actions">
      <span class="edit-icon"><i class="fas fa-edit fa-2x"></i></span>
      <span class="remove-icon"><i class="fas fa-trash fa-2x"></i></span>
    </div>
  </div>
  `;
}
