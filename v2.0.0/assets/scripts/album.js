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
    document.querySelector('#data2 .album-info strong').textContent = albumData.artist.name;

        const albumInfoP = document.querySelector('#data2 .album-info p');
        albumInfoP.innerHTML = `
            Album<br>
            <strong class="text-white">${albumData.artist.name}</strong> • ${albumData.release_date.split('-')[0]} • ${albumData.nb_tracks} brani • ${Math.floor(albumData.duration / 60)} min
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
  } catch (err) {
    console.error(err);
    alert("Errore nel caricamento dei dati");
  }
};

// Richiama la funzione al caricamento pagina
window.addEventListener("DOMContentLoaded", generateAlbumCards);