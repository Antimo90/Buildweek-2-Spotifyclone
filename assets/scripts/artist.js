let allTracks = [];
let tracksShown = 5;

function renderPopularTracks() {
  const list = document.getElementById("popular-tracks");
  if (!list) return;
  list.innerHTML = "";
  allTracks.slice(0, tracksShown).forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "d-flex align-items-center py-2";
    li.innerHTML = `
      <span class="track-number text-secondary">${index + 1}</span>
      <img src="${
        track.album.cover_small
      }" alt="" width="40" class="me-3 ms-3 rounded">
      <span class="track-title me-auto">${track.title}</span>
      <span class="track-plays text-secondary text-center">${track.rank.toLocaleString()}</span>
      <span class="track-duration text-secondary ms-4">${formatDuration(
        track.duration
      )}</span>
    `;
    list.appendChild(li);
  });
  // Nascondi o mostra i bottoni in base a quante tracce sono mostrate
  const showMoreBtn = document.getElementById("show-more-tracks");
  const showLessBtn = document.getElementById("show-less-tracks");
  if (showMoreBtn) {
    if (tracksShown >= allTracks.length) {
      showMoreBtn.style.display = "none";
    } else {
      showMoreBtn.style.display = "inline";
    }
  }
  if (showLessBtn) {
    if (tracksShown > 5) {
      showLessBtn.style.display = "inline";
    } else {
      showLessBtn.style.display = "none";
    }
  }
}

function showPopularTracks() {
  const artistId = 416239;
  const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=10`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      allTracks = data.data;
      tracksShown = 5; // <-- questa riga resetta sempre a 5
      renderPopularTracks();

      // Aggiungi il listener ogni volta che mostri la lista
      const showMoreBtn = document.getElementById("show-more-tracks");
      const showLessBtn = document.getElementById("show-less-tracks");
      if (showMoreBtn) {
        // Rimuovi eventuali listener precedenti
        showMoreBtn.replaceWith(showMoreBtn.cloneNode(true));
        const newBtn = document.getElementById("show-more-tracks");
        newBtn.addEventListener("click", function (e) {
          e.preventDefault();
          tracksShown += 5;
          renderPopularTracks();
        });
      }
      if (showLessBtn) {
        showLessBtn.replaceWith(showLessBtn.cloneNode(true));
        const newLessBtn = document.getElementById("show-less-tracks");
        newLessBtn.addEventListener("click", function (e) {
          e.preventDefault();
          tracksShown -= 5;
          if (tracksShown < 5) tracksShown = 5;
          renderPopularTracks();
        });
      }
    });
}

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

// Funzione globale per mostrare la pagina artista con dati dinamici
async function showArtistPage(artistId) {
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "block";

  // Mostra un loader mentre carica i dati
  const artistMain = document.querySelector(".centrale-artista-main");
  const trackList = document.getElementById("popular-tracks");
  if (artistMain) artistMain.classList.add("position-relative");
  if (trackList)
    trackList.innerHTML =
      '<div id="artist-loader" class="text-center w-100 my-4"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Caricamento...</span></div></div>';

  const res = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`
  );
  const artist = await res.json();

  // Prendi gli album dell'artista
  const resAlbums = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`
  );
  const albumsData = await resAlbums.json();
  const albums = albumsData.data || [];

  // Prendi le tracce da tutti gli album (fino a trovare 10 canzoni uniche)
  let allTracks = [];
  let trackIds = new Set();
  for (let i = 0; i < albums.length && allTracks.length < 10; i++) {
    const albumId = albums[i].id;
    const resAlbum = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    );
    const albumData = await resAlbum.json();
    if (albumData.tracks && albumData.tracks.data) {
      for (const track of albumData.tracks.data) {
        if (!trackIds.has(track.id)) {
          allTracks.push(track);
          trackIds.add(track.id);
          if (allTracks.length === 10) break;
        }
      }
    }
  }

  document.querySelector(".centrale-artista-title").textContent = artist.name;
  document.querySelector(
    ".centrale-artista-cover"
  ).style.backgroundImage = `url(${artist.picture_xl})`;
  document.querySelector(".centrale-artista-listeners").textContent =
    artist.nb_fan.toLocaleString() + " ascoltatori mensili";

  // Mostra 5 canzoni iniziali, poi altre 5 con Visualizza Altro
  let tracksShown = 5;
  const showMoreBtn = document.getElementById("show-more-tracks");
  let showLessBtn = document.getElementById("show-less-tracks");
  if (!showLessBtn) {
    showLessBtn = document.createElement("a");
    showLessBtn.href = "#";
    showLessBtn.id = "show-less-tracks";
    showLessBtn.className = "text-secondary small ms-3";
    showLessBtn.textContent = "VISUALIZZA MENO";
    showMoreBtn.parentNode.insertBefore(showLessBtn, showMoreBtn.nextSibling);
  }

  function renderTracks() {
    trackList.innerHTML = "";
    allTracks.slice(0, tracksShown).forEach((track, i) => {
      const li = document.createElement("li");
      li.className = "d-flex align-items-center py-2";
      li.innerHTML = `
        <span class=\"track-number text-secondary\">${i + 1}</span>
        <img src=\"${
          track.album && track.album.cover_small ? track.album.cover_small : ""
        }\" alt=\"\" width=\"40\" class=\"me-3 ms-3 rounded\">
        <span class=\"track-title me-auto\">${track.title}</span>
        <span class=\"track-plays text-secondary text-center\">${
          track.rank ? track.rank.toLocaleString() : ""
        }</span>
        <span class=\"track-duration text-secondary ms-4\">${formatDuration(
          track.duration
        )}</span>
      `;
      trackList.appendChild(li);
    });
    // Gestione visibilità bottoni
    if (allTracks.length > 5 && tracksShown < allTracks.length) {
      showMoreBtn.style.display = "inline";
    } else {
      showMoreBtn.style.display = "none";
    }
    if (tracksShown > 5) {
      showLessBtn.style.display = "inline";
    } else {
      showLessBtn.style.display = "none";
    }
  }

  renderTracks();

  showMoreBtn.onclick = function (e) {
    e.preventDefault();
    tracksShown = Math.min(tracksShown + 5, allTracks.length);
    renderTracks();
  };
  showLessBtn.onclick = function (e) {
    e.preventDefault();
    tracksShown = 5;
    renderTracks();
  };
}

// Eventuale codice per il follow-btn e altri listener
document.addEventListener("DOMContentLoaded", function () {
  const followBtn = document.getElementById("follow-btn");
  if (followBtn) {
    followBtn.addEventListener("click", function () {
      if (this.classList.contains("btn-outline-light")) {
        this.textContent = "Segui già";
        this.classList.remove("btn-outline-light");
        this.classList.add("btn-success", "text-white");
      } else {
        this.textContent = "Segui";
        this.classList.remove("btn-success", "text-white");
        this.classList.add("btn-outline-light");
      }
    });
  }
});

// Rendo la sezione artista (#data3) nascosta all'avvio
if (document.getElementById("data3")) {
  document.getElementById("data3").style.display = "none";
}
