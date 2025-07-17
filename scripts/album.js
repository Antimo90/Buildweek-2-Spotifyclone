/* ========== COLOR THIEF PER SFONDO ALBUM ========== */
document.addEventListener('DOMContentLoaded', function() {
  const colorThief = new ColorThief();
  const albumCover = document.querySelector('.album-cover');
  const albumContainer = document.querySelector('.album-container');

  const setBackgroundFromImage = function() {
    const color = colorThief.getColor(albumCover);
    albumContainer.style.background = `linear-gradient(to top, black 75%, rgb(${color[0]}, ${color[1]}, ${color[2]}))`;
    albumContainer.style.color = '#fff';
  }

  if (albumCover.complete) {
    setBackgroundFromImage();
  } else {
    albumCover.addEventListener('load', setBackgroundFromImage);
  }
});

/* ========== HEADER SCROLL ========== */
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  const playButton = document.querySelector('.btn-play');
  const albumCover = document.querySelector('.album-cover');

  if (window.scrollY > 300) {
    header.classList.add('scrolled');
    header.classList.remove('d-none');
  } else {
    header.classList.remove('scrolled');
    header.classList.add('d-none');
  }

  const headerBottom = header.getBoundingClientRect().bottom;
  const playButtonTop = playButton.getBoundingClientRect().top;

  if (headerBottom >= playButtonTop) {
    playButton.classList.add('sticky-under-header');
  } else {
    playButton.classList.remove('sticky-under-header');
  }

  const minScale = 0.5;
  const maxScroll = 300;
  const scrollY = Math.min(window.scrollY, maxScroll);
  const scale = 1 - ((1 - minScale) * (scrollY / maxScroll));
  albumCover.style.transform = `scale(${scale})`;
});