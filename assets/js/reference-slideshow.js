// ===== REFERENCES SLIDESHOW =====
"use strict"
class ReferencesSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.reference-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoplayBtn = document.getElementById('autoplay-toggle');
        this.timerElement = document.querySelector('.timer');
        
        this.currentSlide = 0;
        this.img = document.querySelectorAll('.reference-img');
        this.totalSlides = this.slides.length;
        this.autoplay = true;
        this.autoplayInterval = 5000; // 5 Sekunden
        this.intervalId = null;
        this.timeLeft = this.autoplayInterval / 1000;
        
        this.init();
    }
    
    init() {
        console.log('Initialisiere References Slideshow mit', this.totalSlides, 'Slides');
        
        for(let i = 0; i <= this.totalSlides; i++) {
            let fullSizeURL = this.img[i].getAttribute('data-fullsize');
            this.img[i].addEventListener('click', () => window.open(fullSizeURL, '_blank'));
        }
        
        
        // Event Listener
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot Navigation
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
        
        // Auto-play Toggle
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        }
        
        // Start Auto-play
        this.startAutoplay();
        
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoplay();
            }
        });
        
        // Initial Slide anzeigen
        this.showSlide(this.currentSlide);
    }
    
    showSlide(index) {
        // Alle Slides verstecken
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Alle Dots zurücksetzen
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktuellen Slide anzeigen
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        // Timer zurücksetzen
        this.resetTimer();
        
        console.log('Zeige Slide:', index + 1, 'von', this.totalSlides);
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.showSlide(this.currentSlide);
        }
    }
    
    startAutoplay() {
        if (this.intervalId) clearInterval(this.intervalId);
        
        this.intervalId = setInterval(() => {
            if (this.autoplay) {
                this.nextSlide();
            }
        }, this.autoplayInterval);
        
        // Timer Animation starten
        this.startTimer();
    }
    
    stopAutoplay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        
        if (this.autoplay) {
            this.autoplayBtn.textContent = '⏸️ Pause';
            this.autoplayBtn.setAttribute('aria-label', 'Pause autoplay');
            this.startAutoplay();
        } else {
            this.autoplayBtn.textContent = '▶️ Play';
            this.autoplayBtn.setAttribute('aria-label', 'Start autoplay');
            this.stopAutoplay();
        }
        
        console.log('Auto-play:', this.autoplay ? 'aktiviert' : 'pausiert');
    }
    
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timeLeft = this.autoplayInterval / 1000;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeLeft = this.autoplayInterval / 1000;
            }
        }, 1000);
    }
    
    resetTimer() {
        this.timeLeft = this.autoplayInterval / 1000;
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = `${this.timeLeft}`;
        }
    }
    
    // Für andere Seiten (wenn Seite gewechselt wird)
    cleanup() {
        this.stopAutoplay();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// ===== INITIALISIERUNG =====

let slideshowInstance = null;

function initReferencesSlideshow() {
    // Falls schon eine Instanz läuft (z.B. vom letzten Besuch), aufräumen
    if (slideshowInstance) {
        slideshowInstance.cleanup();
    }
    
    // Sicherstellen, dass die Elemente auf der Seite auch da sind
    if (document.querySelector('.references-slideshow')) {
        slideshowInstance = new ReferencesSlideshow();
        // Instanz global verfügbar machen für das Cleanup aus main.js
        window.slideshowInstance = slideshowInstance; 
        console.log('References Slideshow gestartet');
    }
}

// Wenn auf References-Seite gewechselt wird
function initPageScripts(pageName) {
    if (pageName === 'references') {
        // Kurze Verzögerung für bessere Performance
        setTimeout(() => {
            initReferencesSlideshow();
        }, 100);
    } else {
        // Slideshow stoppen wenn wir die Seite verlassen
        if (slideshowInstance) {
            slideshowInstance.cleanup();
        }
    }
}

// Globale Funktion für manuelle Steuerung
window.referencesSlideshow = {
    next: () => slideshowInstance?.nextSlide(),
    prev: () => slideshowInstance?.prevSlide(),
    toggle: () => slideshowInstance?.toggleAutoplay()
};