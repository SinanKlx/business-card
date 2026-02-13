
// ========== SEITEN-MANAGER ==========

// Alle Seiten konfigurieren
const pages = {
    'home': {
        element: document.getElementById('page-home'),
        title: 'CV Sinan Kilic - Home',
        scripts: []  
    },
    'skills': {
        element: document.getElementById('page-skills'),
        title: 'CV Sinan Kilic - Skills',
        scripts: []
    },
    'references': {
        element: document.getElementById('page-references'),
        title: 'CV Sinan Kilic - References',
        scripts: ['assets/js/reference-slideshow.js']
    },
    'cv': {
        element: document.getElementById('page-cv'),
        title: 'CV Sinan Kilic - Professional Career',
        scripts: []
    },
    
    'contact': {
        element: document.getElementById('page-contact'),
        title: 'CV Sinan Kilic - Contact',
        scripts: []
    },

    'guestbook': {
        element: document.getElementById('page-guestbook'),
        title: 'CV Sinan Kilic - Guestbook',
        scripts: ['assets/js/guestbook.js']
    }
};

// Aktuelle Seite speichern
let currentPage = 'home';

// ========== HAUPTFUNKTIONEN ==========

/**
 * Zeigt eine Seite an
 * @param {string} pageId - ID der Seite (z.B. 'home', 'cv')
 */
function showPage(pageId) {
    console.log('Wechsle zu Seite:', pageId);
    
    // Prüfen ob Seite existiert
    if (!pages[pageId]) {
        console.error('Seite nicht gefunden:', pageId);
        showPage('home'); // Fallback zur Startseite
        return;
    }
    
    // 1. Alte Seite ausblenden
    if (pages[currentPage] && pages[currentPage].element) {
        pages[currentPage].element.classList.remove('active');
    }
    
    // 2. Neue Seite anzeigen
    pages[pageId].element.classList.add('active');
    
    // 3. Navigation aktualisieren
    updateNavigation(pageId);
    
    // 4. Titel aktualisieren
    updateTitle(pageId);
    
    // 5. URL aktualisieren (ohne neu zu laden)
    updateURL(pageId);
    
    // 6. Aktuelle Seite speichern
    currentPage = pageId;
    
    // 7. Seitenspezifische Funktionen starten
    runPageScripts(pageId);
}

/**
 * Aktualisiert die Navigation (aktiver Link)
 */
function updateNavigation(pageId) {
    // Alle Links zurücksetzen
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Aktiven Link markieren
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        
        // Dropdown öffnen falls nötig
        const parentDropdown = activeLink.closest('.dropdown');
        if (parentDropdown) {
            parentDropdown.style.display = 'block';
        }
    }
}

/**
 * Aktualisiert den Seitentitel
 */
function updateTitle(pageId) {
    const page = pages[pageId];
    if (page && page.title) {
        document.title = page.title;
        const titleElement = document.getElementById('dynamic-title');
        if (titleElement) {
            titleElement.textContent = page.title;
        }
    }
}

/**
 * Aktualisiert die URL im Browser
 */
function updateURL(pageId) {
    if (window.history && window.history.pushState) {
        window.history.pushState({page: pageId}, '', `#${pageId}`);
    } else {
        // Fallback für ältere Browser
        window.location.hash = pageId;
    }
}

/**
 * Führt seiten-spezifische Skripte aus
 */
function runPageScripts(pageId) {
    const page = pages[pageId];
    
    // 1. Bestehende Logik für Home/CV (Hardcoded)
    if (pageId === 'cv') setTimeout(() => initScrollAnimation(), 100);
    if (pageId === 'home') setTimeout(() => initSlideshow(), 100);

    // 2. Dynamisches Laden der Scripte aus dem 'scripts' Array
    if (page && page.scripts && page.scripts.length > 0) {
        page.scripts.forEach(scriptPath => {
            // Prüfen, ob das Script schon im DOM ist
            let scriptTag = document.querySelector(`script[src="${scriptPath}"]`);
            
            if (!scriptTag) {
                // Script neu erstellen und laden
                scriptTag = document.createElement('script');
                scriptTag.src = scriptPath;
                scriptTag.onload = () => {
                    console.log(`Script geladen: ${scriptPath}`);
                    triggerPageSpecificInit(pageId);
                };
                document.body.appendChild(scriptTag);
            } else {
                // Script ist schon da, nur Init-Funktion triggern
                triggerPageSpecificInit(pageId);
            }
        });
    }

    // 3. Aufräumen: Wenn wir NICHT auf References sind, Slideshow stoppen
    if (pageId !== 'references' && window.slideshowInstance) {
        window.slideshowInstance.cleanup();
    }
}

// Hilfsfunktion, um die Init-Funktionen der externen Scripte aufzurufen
function triggerPageSpecificInit(pageId) {
    if (pageId === 'references' && typeof initReferencesSlideshow === 'function') {
        initReferencesSlideshow();
    }
    if (pageId === 'guestbook' && typeof initGuestbook === 'function') {
        initGuestbook();
    }
}

// ========== SEITENSPEZIFISCHE FUNKTIONEN ==========

/**
 * Scroll-Animation für CV-Seite
 */
function initScrollAnimation() {
    const sections = document.querySelectorAll('#page-cv .section');
    
    // Observer für Scroll-Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Jede Section beobachten
    sections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('Scroll-Animation für CV initialisiert:', sections.length, 'Sections');
}

/**
 * Slideshow für Home-Seite
 */
function initSlideshow() {
    const slides = document.querySelectorAll('#page-home .slideShow > div');
    let currentSlide = 0;
    
    if (slides.length === 0) {
        console.log('Keine Slides gefunden');
        return;
    }
    
    // Alle Slides ausblenden
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Ersten Slide zeigen
    slides[0].style.display = 'block';
    
    // Automatischer Wechsel alle 4 Sekunden
    const slideInterval = setInterval(() => {
        // Nur fortsetzen wenn wir noch auf der Home-Seite sind
        if (currentPage !== 'home') {
            clearInterval(slideInterval);
            return;
        }
        
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.display = 'block';
    }, 4000);
    
    console.log('Slideshow initialisiert:', slides.length, 'Slides');
}

// ========== EVENT HANDLING ==========

/**
 * Initialisiert alle Event Listener
 */
function initEventListeners() {
    // 1. Navigation-Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });
    
    // 2. Browser Zurück/Vor Buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash && pages[hash]) {
            showPage(hash);
        } else {
            showPage('home');
        }
    });
    
    // 3. Dropdown-Hover für Desktop
    const navItems = document.querySelectorAll('nav > ul > li');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const dropdown = this.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const dropdown = this.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    });
    
    // 4. URL Hash ändert sich (manuell)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && pages[hash]) {
            showPage(hash);
        }
    });
}

// ========== INITIALISIERUNG ==========

/**
 * Startet die Anwendung
 */
function initApp() {
    console.log('Starte Single-Page Application');
    
    // 1. Event Listener initialisieren
    initEventListeners();
    
    // 2. Prüfen ob eine Seite in der URL angefordert wird
    const hash = window.location.hash.substring(1);
    
    if (hash && pages[hash]) {
        showPage(hash);
    } else {
        // 3. Standard: Home anzeigen
        showPage('home');
    }
    
    console.log('App initialisiert');
}

// ========== START DER ANWENDUNG ==========

// Warten bis DOM vollständig geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Globale Funktion für externe Aufrufe (falls nötig)
window.showPage = showPage;
window.initScrollAnimation = initScrollAnimation;
window.initSlideshow = initSlideshow;

// ===== MOBILE FUNKTIONEN =====

/**
 * Mobile Dropdown-Toggle
 */
function initMobileDropdowns() {
    const dropdownParents = document.querySelectorAll('nav > ul > li:has(.dropdown)');
    
    dropdownParents.forEach(parent => {
        const trigger = parent.querySelector('a.nav-link');
        const dropdown = parent.querySelector('.dropdown');
        
        if (trigger && dropdown) {
            // Touch-Event für Mobile
            trigger.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Alle anderen Dropdowns schließen
                    document.querySelectorAll('.dropdown.active').forEach(d => {
                        if (d !== dropdown) d.classList.remove('active');
                    });
                    
                    // Dieses Dropdown umschalten
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Klick außerhalb schließt Dropdowns
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('nav > ul > li:has(.dropdown)')) {
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

/**
 * Matrix-Hintergrund für Mobile optimieren
 */
function optimizeMatrixForMobile() {
    if (window.innerWidth <= 768) {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;
        
        // Weniger Zeichen für bessere Performance
        const ctx = canvas.getContext('2d');
        
        // Event-Listener für Performance
        let animationFrame;
        let lastRender = 0;
        const fps = 15; // Weniger FPS auf Mobile
        
        function drawMatrix(timestamp) {
            if (timestamp - lastRender < 1000 / fps) {
                animationFrame = requestAnimationFrame(drawMatrix);
                return;
            }
            
            lastRender = timestamp;
            
            // Vereinfachte Matrix für Mobile
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Dunkler für bessere Lesbarkeit
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Nur jeden zweiten Buchstaben zeichnen
            ctx.fillStyle = '#00FF41';
            ctx.font = '14px monospace'; // Kleinere Schrift
            
            // Dein bestehender Matrix-Code hier, aber reduziert...
            
            animationFrame = requestAnimationFrame(drawMatrix);
        }
        
        // Alte Animation stoppen
        const oldCanvas = canvas.cloneNode(true);
        canvas.parentNode.replaceChild(oldCanvas, canvas);
        
        // Neue starten
        animationFrame = requestAnimationFrame(drawMatrix);
    }
}

/**
 * Touch-Gesten erkennen
 */
function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Horizontales Wischen (Seitenwechsel)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                // Wisch nach rechts -> Vorherige Seite
                navigateToPreviousPage();
            } else {
                // Wisch nach links -> Nächste Seite
                navigateToNextPage();
            }
        }
    }
    
    function navigateToNextPage() {
        const pageIds = Object.keys(pages);
        const currentIndex = pageIds.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pageIds.length;
        showPage(pageIds[nextIndex]);
    }
    
    function navigateToPreviousPage() {
        const pageIds = Object.keys(pages);
        const currentIndex = pageIds.indexOf(currentPage);
        const prevIndex = (currentIndex - 1 + pageIds.length) % pageIds.length;
        showPage(pageIds[prevIndex]);
    }
}

/**
 * Viewport für Mobile optimieren
 */
function optimizeViewport() {
    // Verhindert Zoomen bei Doppel-Tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Verhindert Text-Selection auf Buttons
    document.querySelectorAll('a, button, .nav-link').forEach(el => {
        el.style.webkitTouchCallout = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.userSelect = 'none';
    });
}

// ===== INIT FUNKTION ERWEITERN =====

function initApp() {
    console.log('Starte Single-Page Application');
    
    // 1. Event Listener initialisieren
    initEventListeners();
    
    // 2. Mobile Features
    if (window.innerWidth <= 768) {
        initMobileDropdowns();
        initTouchGestures();
        optimizeViewport();
        optimizeMatrixForMobile();
    }
    
    // 3. Prüfen ob eine Seite in der URL angefordert wird
    const hash = window.location.hash.substring(1);
    
    if (hash && pages[hash]) {
        showPage(hash);
    } else {
        // 4. Standard: Home anzeigen
        showPage('home');
    }
    
    console.log('App initialisiert - Mobile:', window.innerWidth <= 768);
}

// ===== RESIZE HANDLING =====

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (window.innerWidth <= 768) {
            initMobileDropdowns();
        }
    }, 250);
});