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

let clickedTasks = 0,
  clickedId = 0,
  clickedDate = 0,
  clickedStat = 0;

//Heading part
const tableHead = document.getElementById("tableHead");
tableHead.addEventListener("click", function (e) {
  let elem = e.target;
  if (elem.classList.contains("_task")) {
    sortTable(1, clickedTasks);
    if (clickedTasks % 3 == 0) {
      tableBody.innerHTML = "";
      renderAllTasks(tasks);
      clickedTasks = 0;
    }
    clickedId = 0;
    clickedDate = 0;
    clickedStat = 0;
    console.log(clickedTasks);
  } else if (elem.classList.contains("_id")) {
    sortTable(0, clickedId);
    if (clickedId % 3 == 0) {
      tableBody.innerHTML = "";
      renderAllTasks(tasks);
      clickedId = 0;
    }
    clickedTasks = 0;
    clickedDate = 0;
    clickedStat = 0;
    console.log(clickedId);
  } else if (elem.classList.contains("_date")) {
    sortTable(2, clickedDate);
    if (clickedDate % 3 == 0) {
      tableBody.innerHTML = "";
      renderAllTasks(tasks);

      clickedDate = 0;
    }
    clickedTasks = 0;
    clickedId = 0;
    clickedStat = 0;
    console.log(clickedDate);
  } else if (elem.classList.contains("_status")) {
    sortTable(3, clickedStat);
    if (clickedStat % 3 == 0) {
      tableBody.innerHTML = "";
      renderAllTasks(tasks);

      clickedStat = 0;
    }
    clickedTasks = 0;
    clickedId = 0;
    clickedDate = 0;
    console.log(clickedStat);
  }
});

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
  tasks.unshift(newTask);
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

// Sort function n - column number
function sortTable(n, numClicked) {
  let rows,
    x,
    y,
    shouldSwitch,
    i,
    switchCount = 0;
  // n = 0 - id
  // n = 1 - descript
  let switching = true;
  let dir = "asc"; //ascending order
  while (switching) {
    switching = false; //no switching is done
    rows = tableBody.getElementsByClassName("task");
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].children[n];
      y = rows[i + 1].children[n];
      if (dir == "asc") {
        if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCount++;
    } else {
      if (switchCount == 0 && dir == "asc" && numClicked == 1) {
        dir = "desc";
        switching = true;
      }
    }
  }
  switch (n) {
    case 0:
      clickedId++;
      break;
    case 1:
      clickedTasks++;
      break;
    case 2:
      clickedDate++;
      break;
    case 3:
      clickedStat++;
      break;
  }
  console.log(dir);
}
