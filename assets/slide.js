let currentIndex = 0;
let slides = document.querySelectorAll('.slideShow div');

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.display = 'none'; // Alle Slides ausblenden
    });

    currentIndex++;
    if (currentIndex > slides.length) {
        currentIndex = 1; // Zurück zum ersten Slide
    }

    slides[currentIndex - 1].style.display = 'block'; // Aktuelles Slide anzeigen
    setTimeout(showSlides, 4000); // Wechselt alle 4 Sekunden
}

document.addEventListener('DOMContentLoaded', (event) => {
    showSlides(); // Startet die Slideshow, wenn das DOM geladen ist
});
