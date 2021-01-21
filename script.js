const button = document.getElementById("addButton");
const loader = document.getElementById("loader");
const mainApp = document.getElementById("main");
const myModal = document.getElementById("modal");
const closeModButton = document.getElementById("closeModBtn");

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
}

function closeModal() {
  myModal.classList.remove("show");
}
