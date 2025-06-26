// SONIDOS MEJORADOS PARA LA APLICACIÓN FAMILIAR

// Función mejorada para reproducir sonidos más agradables
const reproducirSonidoMejorado = (tipo, configuracion) => {
  if (!configuracion.sonidosActivados) return;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    switch (tipo) {
      case 'success': // Completar tarea
        reproducirMelodiaSuccess(audioContext);
        break;
      case 'reward': // Reclamar recompensa
        reproducirFanfarriaReward(audioContext);
        break;
      case 'error':
        reproducirSonidoError(audioContext);
        break;
    }
  } catch (error) {
    console.warn('No se pudo reproducir el sonido:', error);
  }
};

// Melodía alegre para completar tareas
const reproducirMelodiaSuccess = (audioContext) => {
  const notas = [
    { freq: 523.25, time: 0 },     // C5
    { freq: 587.33, time: 0.1 },   // D5
    { freq: 659.25, time: 0.2 },   // E5
    { freq: 698.46, time: 0.3 }    // F5
  ];
  
  notas.forEach(nota => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(nota.freq, audioContext.currentTime + nota.time);
    osc.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + nota.time);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + nota.time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + nota.time + 0.15);
    
    osc.start(audioContext.currentTime + nota.time);
    osc.stop(audioContext.currentTime + nota.time + 0.15);
  });
};

// Fanfarria especial para recompensas
const reproducirFanfarriaReward = (audioContext) => {
  // Secuencia más elaborada y celebratoria
  const secuencia = [
    { freq: 523.25, time: 0, duration: 0.1 },    // C5
    { freq: 659.25, time: 0.1, duration: 0.1 },  // E5
    { freq: 783.99, time: 0.2, duration: 0.1 },  // G5
    { freq: 1046.5, time: 0.3, duration: 0.2 },  // C6 (octava)
    { freq: 783.99, time: 0.5, duration: 0.1 },  // G5
    { freq: 1046.5, time: 0.6, duration: 0.3 }   // C6 final
  ];
  
  secuencia.forEach(nota => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(nota.freq, audioContext.currentTime + nota.time);
    osc.type = 'triangle'; // Sonido más cálido
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + nota.time);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + nota.time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + nota.time + nota.duration);
    
    osc.start(audioContext.currentTime + nota.time);
    osc.stop(audioContext.currentTime + nota.time + nota.duration);
  });
};

// Sonido de error más suave
const reproducirSonidoError = (audioContext) => {
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(220, audioContext.currentTime);
  osc.frequency.linearRampToValueAtTime(196, audioContext.currentTime + 0.5);
  osc.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.5);
};
