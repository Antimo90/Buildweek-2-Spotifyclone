/* ============================== ALBUM FUNCTIONS ============================== */
  window.addEventListener("load", function () {
    const colorThief = new ColorThief();
    const albumCover = document.querySelector(".album-cover");
    const albumContainer = document.querySelector(".album-container");

    function setBackgroundFromImage() {
      try {
        const color = colorThief.getColor(albumCover);
        albumContainer.style.background = `linear-gradient(to top, #121212 80%, rgb(${color[0]}, ${color[1]}, ${color[2]}))`;
      } catch (err) {
        console.error("Errore con ColorThief:", err);
      }
    }

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
      .querySelectorAll(".header");
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

const showAlbumDetails = async function (albumTitle) {
  try {
    const searchResponse = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
        albumTitle
      )}`
    );
    if (!searchResponse.ok) throw new Error("Errore nella ricerca");

    const searchData = await searchResponse.json();
    const firstTrack = searchData.data[0];
    if (!firstTrack) {
      alert("Album non trovato");
      return;
    }

    const albumId = firstTrack.album.id;
    const albumResponse = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
    if (!albumResponse.ok) throw new Error("Errore nel recupero dettagli album");
    const albumData = await albumResponse.json();

    document.querySelector('#data2 .header').innerText = albumData.title;
    document.querySelector('#data2 .hero img').src = albumData.cover_medium;
    document.querySelector('#data2 .album-info h1').innerText = albumData.title;

    const albumInfoP = document.querySelector('#data2 .album-info p');
    albumInfoP.innerHTML = `
      Album<br>
      <h1></h1>
      <img src='${albumData.cover_medium}' class='me-1 rounded-pill' onclick='showData(3)' style='width: 20px'>
      <strong class="text-white" onclick='showData(3)'>${albumData.artist.name}</strong> • ${albumData.release_date.split('-')[0]} • ${albumData.nb_tracks} brani • ${Math.floor(albumData.duration / 60)} min
    `;

    const albumInfoP2 = document.querySelector('#data2 .album-info2 p');
    albumInfoP2.innerHTML = `
      ${albumData.release_date.split('-')[0]} <br> ${albumData.nb_tracks} brani • ${Math.floor(albumData.duration / 60)} min <br>
      <img src='${albumData.cover_medium}' class='me-1 rounded-pill' onclick='showData(3)' style='width: 20px'>
      <strong class="text-white" onclick='showData(3)'>${albumData.artist.name}</strong>
    `;

    /* ----- TRACCE ----- */
    const tbody = document.querySelector("#data2 tbody.track");
    tbody.innerHTML = "";
    albumData.tracks.data.forEach((track, index) => {
      tbody.innerHTML += `
        <tr class="text-light">
          <td class='d-none d-md-table-cell'>${index + 1}</td>
          <td>${track.title} <br> ${albumData.artist.name}</td>
          <td class='d-none d-md-table-cell'>${track.rank}</td>
          <td class='d-none d-md-table-cell'>${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}</td>
          <td class='d-md-none'><i class='bi bi-three-dots-vertical'></i></td>
        </tr>
      `;
    });

    // Mostra la sezione #data2
    showData(2);
    document.title = `${albumData.title}`;
  } catch (err) {
    console.error(err);
    alert("Errore nel caricamento dei dati");
  }
};

// Richiama la funzione al caricamento pagina
window.addEventListener("DOMContentLoaded", generateAlbumCards);