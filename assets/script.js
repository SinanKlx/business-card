(() => {
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');

  function fit() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    columns = Math.floor(window.innerWidth / fontSize);
    drops = new Array(columns).fill(1);
  }

  const fontSize = 18;
  let columns = Math.floor(window.innerWidth / fontSize);
  let drops = new Array(columns).fill(1);
  const chars = '0123456789';

  window.addEventListener('resize', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    fit();
  });

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00FF41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5; // Verlangsamt die Fallgeschwindigkeit
    }

    requestAnimationFrame(draw);
  }

  fit();
  draw();
})();
