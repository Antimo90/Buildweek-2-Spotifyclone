/* ============================== SWITCH PAGES ============================== */
const showData = function (buttonNumber) {
  // Hide all data containers
  const dataContainers = document.querySelectorAll(".data");
  dataContainers.forEach((container) => (container.style.display = "none"));

  // Remove the "active" class from all navigation buttons
  const buttons = document.querySelectorAll(".navigators li a");
  buttons.forEach((button) => button.classList.remove("active"));

  // Show the data container corresponding to the clicked button
  document.getElementById("data" + buttonNumber).style.display = "block";

  // Add the "active" class to the clicked button
  buttons[buttonNumber - 1].classList.add("active");
};

window.onload = function () {
  showData(1);
};