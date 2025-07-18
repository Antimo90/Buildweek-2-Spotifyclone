async function generateAlbumCards() {
  const container = document.querySelector("#album-list .row");
  container.innerHTML = "";

  const albums = [
    "Night Visions",
    "The Eminem Show",
    "Parachutes",
    "25",
    "Hybrid Theory",
    "Scorpion",
    "Imagine Dragons",
    "Absolution",
  ];

  for (let i = 0; i < albums.length; i++) {
    try {
      const searchResponse = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
          albums[i]
        )}`
      );
      if (!searchResponse.ok) throw new Error("Errore nella ricerca album");

      const searchData = await searchResponse.json();
      const album = searchData.data[0]?.album;

      const colDiv = document.createElement("div");
      colDiv.className = "col col-6 col-md-6 col-lg-3"; // due per riga su desktop
      colDiv.id = `album-${i + 1}`;

      if (album) {
        colDiv.innerHTML = `
          <div class="d-flex flex-column align-items-start w-100 bg-dark text-white rounded mb-2 shadow p-2">
            <div class="d-flex align-items-center w-100" style="cursor: pointer;" onclick="showAlbumDetails('${
              album.title
            }')">
              <img src="${
                album.cover_medium
              }" class="rounded me-1" style='width: 50px;' alt="${album.title}">
              <h5 class="mb-0" style='font-size: 10px;'>${album.title}</h5>
            </div>
            ${
              album.artist
                ? `<span class="artist-link text-info" data-artist-id="${album.artist.id}" style="cursor:pointer; font-size:11px; margin-left:55px;">${album.artist.name}</span>`
                : ""
            }
          </div>
        `;
      } else {
        colDiv.innerHTML = `
          <div class="d-flex align-items-center bg-secondary text-white rounded p-2 mb-2 shadow">
            <img src="https://placehold.co/80x80?text=?" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" alt="Non trovato">
            <h5 class="mb-0">${albums[i]}</h5>
          </div>
        `;
      }

      container.appendChild(colDiv);
    } catch (err) {
      console.error(err);
    }
  }
}

window.addEventListener("DOMContentLoaded", generateAlbumCards);

// Gestione click su nome artista
// Funzione placeholder showArtistPage(artistId) da implementare o collegare a quella esistente
function showArtistPage(artistId) {
  // Mostra la sezione artista e carica i dati
  // Puoi sostituire questa funzione con la tua logica esistente
  // Esempio base:
  showData(3); // Se hai già una funzione che mostra la pagina artista
  // Qui puoi aggiungere la fetch ai dati artista e il popolamento della pagina
  // ...
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("artist-link")) {
    const artistId = e.target.getAttribute("data-artist-id");
    showArtistPage(artistId);
  }
});

/* ALBUM CAROSELLI */
async function generateCarousel(albums, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (let albumName of albums) {
    try {
      const searchResponse = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
          albumName
        )}`
      );
      if (!searchResponse.ok) throw new Error("Errore nella ricerca album");

      const searchData = await searchResponse.json();
      const album = searchData.data[0]?.album;

      const cardDiv = document.createElement("div");
      cardDiv.style.minWidth = "180px";
      cardDiv.className = "text-white text-center";
      cardDiv.style.cursor = "pointer";

      if (album) {
        cardDiv.innerHTML = `
          <div onclick="showAlbumDetails('${album.title}')" class="bg-dark rounded p-2 shadow">
            <img src="${album.cover_medium}" class="img-fluid rounded mb-2" style="width: 100%; height: 180px; object-fit: cover;" alt="${album.title}">
            <h6 class="mb-0">${album.title}</h6>
          </div>
        `;
      } else {
        cardDiv.innerHTML = `
          <div class="bg-secondary rounded p-2 shadow">
            <img src="https://placehold.co/180x180?text=?" class="img-fluid rounded mb-2" style="width: 100%; height: 180px; object-fit: cover;" alt="Non trovato">
            <h6 class="mb-0">${albumName}</h6>
          </div>
        `;
      }

      container.appendChild(cardDiv);
    } catch (err) {
      console.error(err);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  generateCarousel(
    ["NF", "Agust D", "Sia", "Bruno Mars", "Banners", "Stray Kids"],
    "carousel-1"
  );

  generateCarousel(
    [
      "Bungchan",
      "Lana Del Rai",
      "After Hours",
      "DAMN.",
      "Avicii",
      "Future Nostalgia",
    ],
    "carousel-2"
  );

  generateCarousel(
    ["Currents", "Alan Walker", "Marshmello", "X&Y", "Golden Hour", "Starboy"],
    "carousel-3"
  );

  generateCarousel(
    [
      "Justice",
      "folklore",
      "BTS",
      "Astroworld",
      "Sabrina Carpenter",
      "Fine Line",
    ],
    "carousel-4"
  );
});
