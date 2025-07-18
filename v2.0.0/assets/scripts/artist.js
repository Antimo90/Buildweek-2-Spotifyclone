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

function showPopularTracks(artistId = 416239) {
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
