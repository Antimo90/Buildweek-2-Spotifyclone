// Mostra/nasconde l'input di ricerca nella sidebar
document
  .getElementById("search-toggle")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const inputContainer = document.getElementById("search-input-container");
    inputContainer.style.display =
      inputContainer.style.display === "none" ? "block" : "none";
    if (inputContainer.style.display === "block") {
      inputContainer.querySelector("input").focus();
    }
  });
