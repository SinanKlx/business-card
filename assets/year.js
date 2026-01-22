"use strict"

function getYear() {
    // Fügt das aktuelle Jahr in den Footer ein
    document.getElementById('year').textContent = new Date().getFullYear();
}

getYear();