// Konfiguration (Daten von Supabase einfügen)
async function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const display = document.getElementById('guestbook-entries');

    // 1. Funktion zum Laden der Nachrichten
    async function loadMessages() {
        const { data, error } = await supabaseClient
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            display.innerHTML = "<p>Fehler beim Laden.</p>";
            return;
        }

        display.innerHTML = data.map(entry => `
            <div class="gb-entry">
                <strong>${entry.name}</strong> <small>${new Date(entry.created_at).toLocaleDateString()}</small>
                <p>${entry.message}</p>
            </div>
        `).join('');
    }

    // 2. Event Listener für das Absenden
    form.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('gb-name').value;
        const message = document.getElementById('gb-message').value;

        const { error } = await supabaseClient
            .from('guestbook')
            .insert([{ name, message }]);

        if (!error) {
            form.reset();
            loadMessages(); // Liste aktualisieren
        }
    };

    loadMessages(); // Initiales Laden
}

initGuestbook();

// Globaler Aufruf für die main.js
window.initGuestbook = initGuestbook;
