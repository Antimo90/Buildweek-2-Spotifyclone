/* ============================== SEARCH ============================== */
document.getElementById("research").addEventListener("input", function (e) {
  // rimuovo spazi iniziali e finali dal testo digitato
  const query = e.target.value.trim();

  console.log("input digitato:", query);
  // mostra la ricerca

  // se la barra di ricerca è vuota ricarico la home
  if (query.length === 0) {
    console.log("ritorno alla home");
    showHomePage();
    location.reload()
  }

  // se la barra di ricerca ha almeno 3 caratteri inizio la ricerca
  if (query.length > 2) {
    console.log("inizio ricerca per:", query);
    // mostra se la ricerca è partita
    searchSong(query);
  }
});

function showHomePage() {
  centralDiv.innerHTML = homePageContent;
}

function searchSong(query) {
  // effettuo chiamata APi
  console.log("chiamata APi in corso"); // inizio la fetch
  fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
      query
    )}`
  )
    .then((response) => {
      console.log("risposta ricevuta", response); // risposta ricevuta?
      if (!response.ok) {
        // se la risposta non è ok lanciamo l errore
        throw new Error("errore nella fetch");
      }
      return response.json();
      // altrimenti converto in json
    })

    // una volta ottenuto il jsno(data) richiamo la funzione che mostra i risultati su schermo
    // data è un array di oggetti
    .then((data) => {
      console.log("dati ricevuti", data); // array json ricevuto
      console.log("tracce trovate", data.data); // array delle tracce
      displayResults(data.data);
    })
    .catch((error) => {
      // stampo eventuali errori in console
      console.error("errore durante la ricerca:", error);
    });
}

// funzione che riceve array di tracce  e le mostra nel DOM
function displayResults(tracks) {
  // Questo è il contenitore principale dove verranno mostrate le card dei risultati
  const centralDiv = document.getElementsByClassName("homepage")[0];

  console.log("displayResults() chiamata con", tracks.length, "tracce");

  // Costruisci l'HTML con tutte le card
  // Inizializza una variabile 'content' che conterrà l'HTML da inserire in 'central'
  // Include un titolo e un div che fungerà da contenitore flessibile per le card
  let content = `
    <h2 class="text-center my-3">Risultati per la tua ricerca</h2>
    <div id="results" class="d-flex flex-wrap justify-content-center gap-3">
  `;

  // Cicla su ogni traccia musicale contenuta nell'array 'tracks'
  tracks.forEach((track, index) => {
    console.log(
      `Aggiunta traccia ${index + 1}:`,
      track.title,
      "di",
      track.artist.name
    );

    content += `
      <div class="card bg-dark text-light" style="width: 12rem;">
        <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
        <div class="card-body">
          <h6 class="card-title">${track.title}</h6> 
          <p class="card-text">${track.artist.name}</p>
          <audio controls src="${track.preview}" class="w-100 mt-2"></audio>
        </div>
      </div>
    `;
  });

  content += `</div>`;

  // Sovrascrive tutto il contenuto della colonna centrale
  centralDiv.innerHTML = content;

  console.log("Completato");
}

// btn home
// salvo il contenuto iniziale della home page
const centralDiv = document.getElementsByClassName("homepage")[0];
const homePageContent = centralDiv.innerHTML;

// aggiungo evento
document.getElementById("home-btn").addEventListener("click", function () {
  // ripristino home page originale
  centralDiv.innerHTML = homePageContent;
  location.reload()
});

/* ============================== SWITCH PAGES ============================== */
const showData = function (buttonNumber) {
  // Nasconde tutti i data
  const dataContainers = document.querySelectorAll(".data");
  dataContainers.forEach((container) => (container.style.display = "none"));

  // Mostra il "data" rispettivo al bottone cliccato
  document.getElementById("data" + buttonNumber).style.display = "block";

  // Sezione artista (buttonNumber === 3): popola la lista Popolari
  if (buttonNumber === 3 && typeof showPopularTracks === "function") {
    showPopularTracks();
  }
};

// ---------------------------------------------------------------------------------

// Funzione per chiudere ed aprire la sidebar di destra

// recupero gli elementi del bottone e della sidebar

const btnPeople = document.getElementById("btn-people");
const sidebarRight = document.querySelector(".rightbar");
const centralBar = document.querySelector(".column-central-home");

btnPeople.addEventListener("click", () => {
  sidebarRight.classList.toggle("sideOff");
  centralBar.classList.toggle("homepageAll");
});

const btnAdd = document.getElementById("btn-addFriend");
const myForm = document.getElementById("myFriendForm");
const memoryKey = "ListaAmici";

btnAdd.addEventListener("click", () => {
  myForm.classList.toggle("d-none");
});

myForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.getElementById("inputFriend");
  const listFriends = document.getElementById("list-friends");

  if (input.value.trim() !== "") {
    const li = document.createElement("li");
    li.classList.add("d-flex", "align-items-center");
    li.innerHTML = `<i class="bi bi-person-circle me-2 fs-3"></i>${input.value.trim()}`;
    listFriends.appendChild(li);

    salvaLista();

    myForm.reset();
    myForm.classList.add("d-none");
  }
});

const salvaLista = function () {
  const listaDOM = document.querySelectorAll("#list-friends li");
  const items = Array.from(listaDOM).map((li) => li.textContent);
  localStorage.setItem(memoryKey, JSON.stringify(items));
};

window.onload = function () {
  showData(1);
  const savedList = JSON.parse(localStorage.getItem(memoryKey)) || [];
  const ul = document.getElementById("list-friends");

  savedList.forEach((nickname) => {
    const li = document.createElement("li");
    li.classList.add("d-flex", "align-items-center");
    li.innerHTML = `<i class="bi bi-person-circle me-2 fs-3"></i>${nickname}`;
    ul.appendChild(li);
  });
};

