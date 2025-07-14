// Trasforma il pulsante FOLLOWING in FOLLOWED al click
const followBtn = document.getElementById("follow-btn");
if (followBtn) {
  followBtn.addEventListener("click", function () {
    if (this.classList.contains("btn-outline-light")) {
      this.innerHTML = '<i class="bi bi-check2-circle me-2"></i>FOLLOWED';
      this.classList.remove("btn-outline-light");
      this.classList.add("btn-success", "text-white");
    } else {
      this.textContent = "FOLLOWING";
      this.classList.remove("btn-success", "text-white");
      this.classList.add("btn-outline-light");
    }
  });
}
