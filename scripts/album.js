/* ========== COLOR THIEF PER SFONDO ALBUM ========== */
document.addEventListener('DOMContentLoaded', function() {
  const colorThief = new ColorThief();
  const albumCover = document.querySelector('.album-cover');
  const albumContainer = document.querySelector('.album-container');

  function setBackgroundFromImage() {
    const color = colorThief.getColor(albumCover);
    albumContainer.style.background = `linear-gradient(to top, black 65%, rgb(${color[0]}, ${color[1]}, ${color[2]}))`;
    albumContainer.style.color = '#fff';
  }

  if (albumCover.complete) {
    setBackgroundFromImage();
  } else {
    albumCover.addEventListener('load', setBackgroundFromImage);
  }
});