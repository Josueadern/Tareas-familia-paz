
export function reproducirSonido() {
  const audio = new Audio('./sonidos/celebracion.mp3');
  audio.volume = 0.3;
  audio.play();
}
