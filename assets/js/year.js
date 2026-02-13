"use strict"

function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Beim Laden ausführen
document.addEventListener('DOMContentLoaded', updateYear);

// Falls die Seite später geladen wird (in unserer SPA)
// rufen wir die Funktion auch direkt auf
updateYear();