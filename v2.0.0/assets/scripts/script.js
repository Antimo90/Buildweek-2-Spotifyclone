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
  const central = document.getElementsByClassName("homepage")[0];

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
  central.innerHTML = content;

  console.log("Completato");
}

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

window.onload = function () {
  showData(1);
};

/* ============================== ALBUM FUNCTIONS ============================== */
document.addEventListener("DOMContentLoaded", function () {
  // colorThief per sfondo
  const colorThief = new ColorThief();
  const albumCover = document.querySelector(".album-cover");
  const albumContainer = document.querySelector(".album-container");

  const setBackgroundFromImage = function () {
    const color = colorThief.getColor(albumCover);
    albumContainer.style.background = `linear-gradient(to top, #121212 80%, rgb(${color[0]}, ${color[1]}, ${color[2]}))`;
  };

  if (albumCover.complete) {
    setBackgroundFromImage();
  } else {
    albumCover.addEventListener("load", setBackgroundFromImage);
  }
});

const scrollContainer = document.querySelector(".scroll-container");
scrollContainer.addEventListener("scroll", function () {
  const headers = scrollContainer.querySelectorAll(".header");
  const playButtons = scrollContainer.querySelectorAll(".btn-play");
  const albumCovers = scrollContainer.querySelectorAll(".album-cover");

  headers.forEach((header) => {
    if (scrollContainer.scrollTop > 300) {
      header.classList.add("scrolled");
      header.classList.remove("d-none");
    } else {
      header.classList.remove("scrolled");
      header.classList.add("d-none");
    }
  });

  playButtons.forEach((playButton) => {
    const header = playButton
      .closest(".album-container")
      .querySelector(".header");
    if (!header) return;

    const headerBottom = header.getBoundingClientRect().bottom;
    const playButtonTop = playButton.getBoundingClientRect().top;

    if (headerBottom >= playButtonTop) {
      playButton.classList.add("sticky-under-header");
    } else {
      playButton.classList.remove("sticky-under-header");
    }
  });

  albumCovers.forEach((albumCover) => {
    const minScale = 0.5;
    const maxScroll = 300;
    const scrollY = Math.min(scrollContainer.scrollTop, maxScroll);
    const scale = 1 - (1 - minScale) * (scrollY / maxScroll);
    albumCover.style.transform = `scale(${scale})`;
  });
});

// ---------------------------------------------------------------------------------

// Funzione per chiudere ed aprire la sidebar di destra

// recupero gli elementi del bottone e della sidebar

const btnPeople = document.getElementById("btn-people");
const sidebarRight = document.querySelector(".rightbar");
const centralBar = document.querySelector(".column-central-home");

btnPeople.addEventListener(`click`, () => {
  sidebarRight.classList.toggle("sideOff");
  centralBar.classList.toggle("homepageAll");
});

// Vado a creare la sezione "aggiungi amici" usando un form con un input da raccogliere che apprarià in un modale, e il nickname inserito verrà aggiunto in una lista messa nella sezione "aggiungi amici"

const btnAdd = document.getElementById("btn-addFriend");
const myForm = document.getElementById("myFriendForm");
const memoryKey = "ListaAmici";

btnAdd.addEventListener(`click`, () => {
  myForm.classList.remove(`d-none`);

  myForm.innerHTML = `<div class="ms-2">
                    <input
                    class="form-control"
                      type="text"
                      placeholder="Inserisci il nickname"
                      required
                      id="inputFriend"
                    />
                  </div>
                  <button class="btn btn-primary" id="btn-friendForm">Aggiungi</button>`;
});

myForm.addEventListener(`submit`, (e) => {
  e.preventDefault();

  const input = document.getElementById("inputFriend");
  const listFriends = document.getElementById("list-friends");

  listFriends.innerHTML += `<li class="d-flex align-items-center"><i class="bi bi-person-circle me-2 fs-3"></i>${input.value}</li>`;

  salvaLista();

  myForm.reset();
});

const salvaLista = function () {
  const listaDOM = document.querySelectorAll(`#list-friends li`);
  const items = Array.from(listaDOM).map((li) => li.textContent);
  localStorage.setItem(memoryKey, JSON.stringify(items));
};

window.onload = function () {
  const savedList = JSON.parse(localStorage.getItem(memoryKey)) || [];
  const ul = document.getElementById("list-friends");

  for (let i = 0; i < savedList.length; i++) {
    const li = document.createElement("li");
    li.innerHTML += `<i class="bi bi-person-circle me-2 fs-3"></i>${savedList[i]}`;
    ul.appendChild(li);
  }
};
