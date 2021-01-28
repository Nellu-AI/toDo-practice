const button = document.getElementById("addButton");
const loader = document.getElementById("loader");
const mainApp = document.getElementById("main");
const myModal = document.getElementById("modal");
const closeModButton = document.getElementById("closeModBtn");

// Input fields for new task
const taskContent = document.getElementById("taskContent");
const taskDate = document.getElementById("taskDate");
const taskStatus = document.getElementById("taskStatus");

let today = new Date().toISOString().substr(0, 10);

window.addEventListener("load", pageLoaded);

button.addEventListener("click", onClickButton);

closeModButton.addEventListener("click", closeModal);

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

  checkInputContent([taskContent, taskDate]);
}

function closeModal() {
  event.preventDefault();
  myModal.classList.remove("show");
}

function checkInputContent(array) {
  array.forEach((element) => {
    console.log(element.value.length);
  });
}
