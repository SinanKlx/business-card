// Konfiguration (Daten von Supabase einfügen)
const SB_URL = "https://bpbpctcsaduqhbbvknuh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnBjdGNzYWR1cWhiYnZrbnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTQ2NzAsImV4cCI6MjA4NjQ3MDY3MH0.KArbHXGlSMEiRfV4_ZUjPffR9nMRY6BdbeuQbv-QIhI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

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

// Globaler Aufruf für die main.js
window.initGuestbook = initGuestbook;