// Matrix mit Performance-Optimierungen für Mobile

(() => {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isMobile = window.innerWidth <= 768;
    
    // Performance Einstellungen basierend auf Gerät
    const settings = {
        fontSize: isMobile ? 14 : 18,
        speed: isMobile ? 0.3 : 0.5,
        density: isMobile ? 0.7 : 1.0, // Weniger Zeichen auf Mobile
        fps: isMobile ? 15 : 60,
        opacity: isMobile ? 0.5 : 1.0
    };
    
    let columns = 0;
    let drops = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let lastRender = 0;
    
    function fit() {
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
        
        columns = Math.floor(window.innerWidth / settings.fontSize * settings.density);
        drops = new Array(columns).fill(1);
    }
    
    function draw(timestamp) {
        // FPS Limiter
        if (timestamp - lastRender < 1000 / settings.fps) {
            animationId = requestAnimationFrame(draw);
            return;
        }
        lastRender = timestamp;
        
        // Transparenter Overlay für Matrix-Effekt
        ctx.fillStyle = `rgba(0, 0, 0, ${isMobile ? 0.1 : 0.06})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Zeichenfarbe mit Mobile-Opacity
        ctx.fillStyle = `rgba(0, 255, 65, ${settings.opacity})`;
        ctx.font = `bold ${settings.fontSize}px monospace`;
        
        // Weniger Iterationen auf Mobile
        const step = isMobile ? 2 : 1;
        for (let i = 0; i < drops.length; i += step) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = i * (settings.fontSize / settings.density);
            const y = drops[i] * settings.fontSize;
            
            // Nur zeichnen wenn im sichtbaren Bereich
            if (y < canvas.height / ctx.getTransform().a) {
                ctx.fillText(text, x, y);
            }
            
            // Reset wenn außerhalb
            if (drops[i] * settings.fontSize > canvas.height / ctx.getTransform().a && Math.random() > 0.98) {
                drops[i] = 0;
            }
            drops[i] += settings.speed;
        }
        
        animationId = requestAnimationFrame(draw);
    }
    
    function handleResize() {
        isMobile = window.innerWidth <= 768;
        
        // Einstellungen aktualisieren
        settings.fontSize = isMobile ? 14 : 18;
        settings.speed = isMobile ? 0.3 : 0.5;
        settings.density = isMobile ? 0.7 : 1.0;
        settings.fps = isMobile ? 15 : 60;
        settings.opacity = isMobile ? 0.5 : 1.0;
        
        // Alte Animation stoppen
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Neue Größe und Animation
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        fit();
        lastRender = 0;
        animationId = requestAnimationFrame(draw);
    }
    
    // Event Listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationId) cancelAnimationFrame(animationId);
        } else {
            if (!animationId) animationId = requestAnimationFrame(draw);
        }
    });
    
    // Start
    fit();
    animationId = requestAnimationFrame(draw);
    
    // Cleanup-Funktion
    window.cleanupMatrix = function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        window.removeEventListener('resize', handleResize);
    };
})();