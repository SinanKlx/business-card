// Diese Datei ist optional, da die Slideshow bereits in main.js integriert ist
// Falls du sie separat haben willst:

"use strict"

class Slideshow {
    constructor(containerSelector = '.slideShow') {
        this.container = document.querySelector(containerSelector);
        this.slides = [];
        this.currentIndex = 0;
        this.interval = null;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.slides = Array.from(this.container.children);
        if (this.slides.length === 0) return;
        
        // Alle Slides ausblenden
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Ersten Slide zeigen
        this.showSlide(0);
        
        // Intervall starten
        this.start();
    }
    
    showSlide(index) {
        // Alten Slide ausblenden
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].style.display = 'none';
        }
        
        // Neuen Slide anzeigen
        this.currentIndex = index % this.slides.length;
        this.slides[this.currentIndex].style.display = 'block';
    }
    
    next() {
        this.showSlide(this.currentIndex + 1);
    }
    
    start(interval = 4000) {
        this.stop(); // Vorheriges Intervall stoppen
        this.interval = setInterval(() => this.next(), interval);
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Automatisch starten wenn auf Home-Seite
document.addEventListener('DOMContentLoaded', function() {
    // Nur initialisieren wenn wir auf der Home-Seite sind
    if (document.querySelector('#page-home.active')) {
        const slideshow = new Slideshow('#page-home .slideShow');
    }
});

// Globale Variable für manuellen Zugriff
window.Slideshow = Slideshow;