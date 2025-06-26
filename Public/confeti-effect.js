
export function lanzarConfeti() {
  const duration = 1 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    // Confeti desde los laterales
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
