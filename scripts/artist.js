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

  // Funzionalità Visualizza Altro
  const visualizzaAltro = document.querySelector(".centrale-artista-main a");
  const popularTracks = document.querySelector(".popular-tracks");
  if (visualizzaAltro && popularTracks) {
    const originalList = popularTracks.innerHTML;
    const altSongs = [
      {
        title: "Back to You",
        plays: "98.123.456",
        duration: "3:21",
        img: "assets/imgs/main/image-4.jpg",
      },
      {
        title: "Neon Lights",
        plays: "201.456.789",
        duration: "4:02",
        img: "assets/imgs/main/image-5.jpg",
      },
      {
        title: "Lost in the City",
        plays: "156.789.321",
        duration: "2:58",
        img: "assets/imgs/main/image-6.jpg",
      },
      {
        title: "Midnight Sun",
        plays: "77.654.321",
        duration: "3:44",
        img: "assets/imgs/main/image-7.jpg",
      },
      {
        title: "Electric Dreams",
        plays: "134.567.890",
        duration: "3:11",
        img: "assets/imgs/main/image-8.jpg",
      },
      {
        title: "Golden Hour",
        plays: "222.333.444",
        duration: "4:09",
        img: "assets/imgs/main/image-9.jpg",
      },
      {
        title: "Skyline",
        plays: "88.999.111",
        duration: "2:47",
        img: "assets/imgs/main/image-10.jpg",
      },
    ];
    let showingAlt = false;
    visualizzaAltro.addEventListener("click", function (e) {
      e.preventDefault();
      if (!showingAlt) {
        let html = "";
        altSongs.forEach((song, i) => {
          html += `<li class="d-flex align-items-center py-2">
            <span class="track-number text-secondary">${i + 1}</span>
            <img src="${
              song.img
            }" alt="" width="40" class="me-3 ms-3 rounded" />
            <span class="track-title me-auto">${song.title}</span>
            <span class="track-plays text-secondary text-center">${
              song.plays
            }</span>
            <span class="track-duration text-secondary ms-4">${
              song.duration
            }</span>
          </li>`;
        });
        popularTracks.innerHTML = html;
        this.textContent = "Visualizza Meno";
        showingAlt = true;
      } else {
        popularTracks.innerHTML = originalList;
        this.textContent = "Visualizza Altro";
        showingAlt = false;
      }
    });
  }

  // Handler per le frecce cambio artista
  const leftArrow = document.querySelector(
    ".artist-nav-arrows .bi-chevron-left"
  );
  const rightArrow = document.querySelector(
    ".artist-nav-arrows .bi-chevron-right"
  );

  function cambiaArtista(artistaData) {
    document.querySelector(".centrale-artista-title").textContent =
      artistaData.nome;
    document.querySelector(".centrale-artista-listeners").textContent =
      artistaData.ascoltatori + " ascoltatori mensili";
    document.querySelector(
      ".centrale-artista-cover"
    ).style.backgroundImage = `url('${artistaData.copertina}')`;
    const popularTracks = document.querySelector(".popular-tracks");
    if (popularTracks && artistaData.canzoni) {
      let html = "";
      artistaData.canzoni.forEach((song, i) => {
        html += `<li class="d-flex align-items-center py-2">
          <span class="track-number text-secondary">${i + 1}</span>
          <img src="${song.img}" alt="" width="40" class="me-3 ms-3 rounded" />
          <span class="track-title me-auto">${song.title}</span>
          <span class="track-plays text-secondary text-center">${
            song.plays
          }</span>
          <span class="track-duration text-secondary ms-4">${
            song.duration
          }</span>
        </li>`;
      });
      popularTracks.innerHTML = html;
    }
  }

  function caricaArtistaDaAPI(direzione) {
    const mockArtista = {
      nome: direzione === "next" ? "Imagine Dragons" : "Coldplay",
      ascoltatori: direzione === "next" ? "5.123.456" : "4.987.654",
      copertina:
        direzione === "next"
          ? "assets/imgs/main/image-12.jpg"
          : "assets/imgs/main/image-13.jpg",
      canzoni: [
        {
          title: "Believer",
          plays: "999.999.999",
          duration: "3:24",
          img: "assets/imgs/main/image-14.jpg",
        },
        {
          title: "Thunder",
          plays: "888.888.888",
          duration: "3:07",
          img: "assets/imgs/main/image-15.jpg",
        },
        {
          title: "Demons",
          plays: "777.777.777",
          duration: "2:57",
          img: "assets/imgs/main/image-16.jpg",
        },
      ],
    };
    cambiaArtista(mockArtista);
  }

  if (leftArrow) {
    leftArrow.parentElement.addEventListener("click", function () {
      caricaArtistaDaAPI("prev");
    });
  }
  if (rightArrow) {
    rightArrow.parentElement.addEventListener("click", function () {
      caricaArtistaDaAPI("next");
    });
  }
});
