// EFECTO CONFETI PARA RECOMPENSAS

// Función para crear efecto confeti celebratorio
const lanzarConfeti = () => {
  // Crear canvas temporal para confeti
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Partículas de confeti
  const particles = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  
  // Crear partículas
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 3 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20
    });
  }
  
  // Función de animación
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Actualizar posición
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravedad
      p.rotation += p.rotationSpeed;
      
      // Dibujar partícula
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
      
      // Eliminar partículas que salieron de pantalla
      if (p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50) {
        particles.splice(i, 1);
      }
    }
    
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      // Limpiar canvas cuando terminen todas las partículas
      document.body.removeChild(canvas);
    }
  };
  
  animate();
};

// Efecto confeti especial desde el centro
const lanzarConfetiCentro = () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Explosion desde el centro
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const particles = [];
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF69B4'];
  
  // Crear explosión radial
  for (let i = 0; i < 80; i++) {
    const angle = (Math.PI * 2 * i) / 80;
    const velocity = Math.random() * 8 + 4;
    
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 3,
      life: 1,
      decay: Math.random() * 0.02 + 0.01
    });
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Actualizar posición
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravedad ligera
      p.life -= p.decay;
      
      // Dibujar con transparencia
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Eliminar partículas muertas
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  };
  
  animate();
};
