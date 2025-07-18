// codice api
const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
  "query"
)}`;

// richiamo tutti i bottoni
const newPlayer = document.getElementById("newPlayer");
const shufflePlayback = document.getElementById("shuffle-playback");
const skipBackward = document.getElementById("skip-backward");
const playback = document.getElementById("playback");
const skipForward = document.getElementById("skip-forward");
const repeat = document.getElementById("repeat");
const infoSong = document.getElementById("info-song");
const songLyrics = document.getElementById("song-lyrics");
const songQueue = document.getElementById("song-queue");
const device = document.getElementById("device");
const volumeDown = document.getElementById("volume-down");
const cast = document.getElementById("cast");
const fullscreen = document.getElementById("fullscreen");
const currentAlbumCoverElement = document.getElementById("current-album-cover");
const currentSongTitleElement = document.getElementById("current-song-title");
const currentArtistNameElement = document.getElementById("current-artist-name");
const audioPlayer = document.getElementById("audioPlayer");
const progressBar = document.getElementById("progressBar");
const currentTimeElement = document.getElementById("current-time");
const totalDurationElement = document.getElementById("total-duration");
const volumeRange = document.getElementById("volumeRange");
const checkDefault = document.getElementById("checkDefault");
const feedbackMessage = document.getElementById("feedbackMessage");

// Variabili per la Playlist
// array delle canzoni caricate
let currentPlaylist = [];
// traccia della canzone corrente
let currentSongIndex = 0;
//  traccia dello stato di ripetizione
let isRepeatActive = false;

// Funzione per Riprodurre una Canzone
const playSong = function (song) {
  if (song && song.preview) {
    audioPlayer.src = song.preview;
    audioPlayer
      .play()
      .then(() => {
        console.log(`Riproducendo: ${song.title} di ${song.artist.name}`);
        // Aggiorna l'interfaccia utente con il titolo, artista e copertina
        if (currentSongTitleElement) {
          currentSongTitleElement.textContent = song.title;
        }
        if (currentArtistNameElement) {
          currentArtistNameElement.textContent = song.artist.name;
        }
        // Imposta la copertina dell'album
        if (currentAlbumCoverElement && song.album && song.album.cover_medium) {
          // Ho usato cover-medium per una qualità migliore
          currentAlbumCoverElement.src = song.album.cover_medium;
        } else if (currentAlbumCoverElement) {
          // Immagine di fallback se non c'è una copertina dall'API
          currentAlbumCoverElement.src =
            //  immagine di default
            "./Altrove_(Ultimo)_-_Copertina_Album.jpg";
        }
        // Cambia l'icona del pulsante Play/Pause in "pausa"
        playback.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-pause-circle text-white mx-3" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.75 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z"/>
          </svg>`;
      })
      .catch((error) => {
        // Gestisce gli errori di riproduzione
        console.error("Errore durante la riproduzione dell'audio:", error);
        alert(
          "Impossibile riprodurre la canzone. Controlla i permessi di autoplay o l'URL dell'anteprima."
        );
        // Torna all'icona Play in caso di errore
        playback.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play-circle text-white mx-3" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
          </svg>`;
      });
  } else {
    console.warn("Canzone non valida o manca l'URL di anteprima:", song);
    if (currentSongTitleElement)
      currentSongTitleElement.textContent = "Nessuna canzone selezionata";
    if (currentArtistNameElement) currentArtistNameElement.textContent = "";
    if (currentAlbumCoverElement)
      currentAlbumCoverElement.src = "./Altrove_(Ultimo)_-_Copertina_Album.jpg"; // Default cover
    playback.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play-circle text-white mx-3" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
      </svg>`;
  }
};

// --- Funzione per formattare il tempo (es. 03:45) ---
const formatTime = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const getMusicData = function () {
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        console.log("Risposta OK :", response);
        return response.json();
      } else {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
      }
    })
    .then((data) => {
      if (data && Array.isArray(data.data)) {
        // Filtra solo le tracce che hanno un URL di anteprima
        currentPlaylist = data.data.filter(
          (item) => item.type === "track" && item.preview
        );
        console.log("Playlist caricata e filtrata:", currentPlaylist);
        if (currentPlaylist.length > 0) {
          console.log(
            "Canzoni disponibili. La prima canzone è:",
            currentPlaylist[0].title
          );
          // per far partire le canzoni bisogna premere o play o shuffle
        } else {
          console.warn(
            "Nessuna traccia valida con URL di anteprima trovata per la query:",
            query
          );
        }
      } else {
        console.warn(
          "La risposta API non contiene l'array 'data' previsto:",
          data
        );
      }
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

// Bottone "Riproduzione Casuale" (Shuffle)
shufflePlayback.addEventListener("click", () => {
  console.log("Mescolando la playlist...");
  if (currentPlaylist.length === 0) {
    alert("Nessuna canzone nella playlist. Carica prima delle canzoni!");
    return;
  }
  // Algoritmo di Fisher-Yates per mescolare l'array della playlist
  for (let i = currentPlaylist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentPlaylist[i], currentPlaylist[j]] = [
      currentPlaylist[j],
      currentPlaylist[i],
    ];
  }
  // Riparti dalla prima canzone della playlist mescolata
  currentSongIndex = 0;
  // Avvia la riproduzione della prima canzone mescolata
  playSong(currentPlaylist[currentSongIndex]);
  console.log(
    "Playlist mescolata e riproduzione avviata:",
    currentPlaylist[currentSongIndex].title
  );
});

// Bottone "Play/Pausa"
playback.addEventListener("click", () => {
  if (audioPlayer.paused) {
    // Se l'audio è in pausa
    if (audioPlayer.src) {
      // E c'è già una canzone caricata
      audioPlayer
        .play()
        .then(() => {
          // Cambia l'icona a "pausa"
          playback.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-pause-circle text-white mx-3" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.75 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z"/>
                        </svg>
                    `;
        })
        .catch((error) =>
          console.error("Errore nel riprendere la riproduzione:", error)
        );
    } else if (currentPlaylist.length > 0) {
      // Avvia la canzone corrente
      playSong(currentPlaylist[currentSongIndex]);
    } else {
      alert("Nessuna canzone da riprodurre! Carica prima una playlist.");
    }
  } else {
    // Se l'audio è in riproduzione
    audioPlayer.pause();
    // Cambia l'icona a "play"
    playback.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play-circle text-white mx-3" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
            </svg>
        `;
  }
});

// Bottone "Salta Avanti"
skipForward.addEventListener("click", () => {
  if (currentPlaylist.length === 0) return;
  // Prossima canzone
  currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
  playSong(currentPlaylist[currentSongIndex]);
});

// Bottone "Salta Indietro"
skipBackward.addEventListener("click", () => {
  if (currentPlaylist.length === 0) return;
  // Calcola l'indice precedente, gestendo il passaggio dalla prima all'ultima canzone
  currentSongIndex =
    (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  playSong(currentPlaylist[currentSongIndex]);
});

// --- Gestione Barra di Progresso ---
// Aggiorna la barra di progresso e i tempi durante la riproduzione
audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;

  if (!isNaN(duration)) {
    // si assicura che la durata sia un numero valido
    const progressPercent = (currentTime / duration) * 100;
    // Aggiorna il valore della barra di range
    progressBar.value = progressPercent;
    // Aggiorna il tempo corrente
    currentTimeElement.textContent = formatTime(currentTime);
    // Aggiorna la durata totale
    totalDurationElement.textContent = formatTime(duration);
  }
});

// Quando i metadati  della canzone sono caricati
audioPlayer.addEventListener("loadedmetadata", () => {
  if (!isNaN(audioPlayer.duration)) {
    totalDurationElement.textContent = formatTime(audioPlayer.duration);
    // Il valore massimo della barra di range è 100%
    progressBar.max = 100;
    // Resetta la barra all'inizio
    progressBar.value = 0;
    // Resetta il tempo corrente
    currentTimeElement.textContent = "0:00";
  }
});

// Permette all'utente di "cercare"  nella canzone trascinando la barra
progressBar.addEventListener("input", () => {
  // Calcola il tempo di ricerca basandosi sulla posizione della barra e la durata totale
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  // Imposta il tempo di riproduzione
  audioPlayer.currentTime = seekTime;
});

// --- Gestione Volume ---
// Controlla il volume tramite lo slider
volumeRange.addEventListener("input", () => {
  // Il volume di audioPlayer è 0-1, lo slider è 0-100
  audioPlayer.volume = volumeRange.value / 100;
});

// Imposta il volume iniziale all'avvio
audioPlayer.volume = volumeRange.value / 100;

// Logica per il pulsante "Volume Giù"
volumeDown.addEventListener("click", () => {
  if (audioPlayer.volume > 0) {
    // Muta l'audio
    audioPlayer.volume = 0;
    // Sposta lo slider a zero
    volumeRange.value = 0;
  } else {
    // Ripristina il volume a un valore predefinito
    audioPlayer.volume = 0.5;
    // Sposta lo slider a 50
    volumeRange.value = 50;
  }
});

// per il Pulsante "Ripeti" classe
repeat.addEventListener("click", () => {
  // Inverti lo stato (da true a false, o viceversa)
  isRepeatActive = !isRepeatActive;
  console.log("Stato ripeti:", isRepeatActive ? "ATTIVO" : "DISATTIVO");

  if (isRepeatActive) {
    // Aggiungi una classe per "illuminare" il pulsante
    repeat.classList.add("active-repeat");
  } else {
    // Rimuovi la classe per tornare allo stato normale
    repeat.classList.remove("active-repeat");
  }
});
// funzionalita bottone "ripeti"
audioPlayer.addEventListener("ended", () => {
  if (isRepeatActive) {
    // Se la modalità ripeti è attiva, riproduci la canzone corrente dall'inizio
    console.log("Modalità ripeti attiva: riproduco la canzone corrente.");
    // Torna all'inizio della canzone
    audioPlayer.currentTime = 0;
    audioPlayer
      // Riproduci
      .play()
      .catch((error) =>
        console.error(
          "Errore nel riprodurre la canzone in modalità ripeti:",
          error
        )
      );
  } else {
    // Se la modalità ripeti NON è attiva, passa alla prossima canzone come al solito
    skipForward.click();
  }
});
// checkbox per salvare nei preferiti e rimuoverla
checkDefault.addEventListener("change", function () {
  // Pulisci eventuali timer precedenti per evitare sovrapposizioni
  clearTimeout(feedbackMessage.hideTimer);

  if (this.checked) {
    // Se la checkbox è stata selezionata
    feedbackMessage.textContent = "Salvata nei preferiti!";
    feedbackMessage.style.color = "green";
    feedbackMessage.style.visibility = "visible";

    // Imposta un timer per nascondere il messaggio dopo 2 secondi
    feedbackMessage.hideTimer = setTimeout(() => {
      feedbackMessage.style.visibility = "hidden";
    }, 2000);
  } else {
    // Se la checkbox è stata deselezionata
    feedbackMessage.textContent = "Rimossa dai preferiti.";
    feedbackMessage.style.color = "orange";
    feedbackMessage.style.visibility = "visible";

    // Imposta un timer per nascondere il messaggio dopo 2 secondi
    feedbackMessage.hideTimer = setTimeout(() => {
      feedbackMessage.style.visibility = "hidden";
    }, 2000);
  }
});

// Aggiungi un event listener al bottone fullscreen
fullscreen.addEventListener("click", () => {
  // Controlla se il browser è già in modalità fullscreen
  if (document.fullscreenElement) {
    // Se è in fullscreen, esci
    document
      .exitFullscreen()
      .then(() => console.log("Uscito dalla modalità fullscreen"))
      .catch((err) =>
        console.error("Errore nell'uscire dalla modalità fullscreen:", err)
      );
  } else {
    // Se non è in fullscreen, entra.
    // Puoi scegliere quale elemento mettere in fullscreen.
    document.documentElement
      .requestFullscreen()
      .then(() => console.log("Entrato in modalità fullscreen"))
      .catch((err) =>
        console.error("Errore nell'entrare in modalità fullscreen:", err)
      );
  }
});

/*newPlayer.addEventListener('click', () => {
  if (currentPlaylist.length > 0) {
    // Riproduci la canzone corrente nella playlist
    playSong(currentPlaylist[currentSongIndex]);
  } else {
    // Se non ci sono ancora canzoni caricate, potresti volerle recuperare o avvisare l'utente
    alert("Nessuna canzone caricata! Cerca prima della musica.");
  }
});*/

// Esempio di come potresti gestire la selezione di una canzone
const selectSongFromAlbum = function (songId) {
  // Trova l'indice della canzone selezionata nella currentPlaylist
  const index = currentPlaylist.findIndex(song => song.id === songId);
  if (index !== -1) {
    currentSongIndex = index; // Aggiorna l'indice della canzone corrente
    console.log('Canzone selezionata: ${currentPlaylist[currentSongIndex].title}');
    // Non la riproduciamo ancora, solo la selezioniamo
  } else {
    console.warn("Canzone non trovata nella playlist.");
  }
};

newPlayer.addEventListener("click", () => {
  // Controlla se ci sono canzoni nella playlist e se un indice è valido
  if (currentPlaylist.length > 0 && currentSongIndex >= 0 && currentSongIndex < currentPlaylist.length) {
    // Riproduci la canzone all'indice corrente (che dovrebbe essere quella selezionata)
    playSong(currentPlaylist[currentSongIndex]);
  } else if (currentPlaylist.length > 0) {
    // Se la playlist non è vuota ma currentSongIndex non è valido (es. -1 o non impostato)
    // Potresti voler riprodurre la prima canzone o avvisare l'utente di selezionarne una
    console.warn("Nessuna canzone selezionata. Riproduco la prima canzone della playlist.");
    currentSongIndex = 0; // Imposta l'indice alla prima canzone
    playSong(currentPlaylist[currentSongIndex]);
  }
  else {
    // Se non ci sono canzoni caricate affatto
    alert("Nessuna canzone caricata! Cerca prima della musica.");
    getMusicData(); // Opzionalmente, prova a recuperare i dati se la playlist è vuota
  }
});

getMusicData();
