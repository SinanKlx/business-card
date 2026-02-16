async function initVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    try {
        // 1. IP-Adresse des Besuchers abrufen (externer Service)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();

        // 2. IP in Supabase speichern (upsert verhindert Duplikate durch den Primary Key 'ip')
        await supabaseClient
            .from('page_views')
            .upsert({ ip: ip }, { onConflict: 'ip' });

        // 3. Gesamtzahl der eindeutigen IPs abfragen
        const { count, error } = await supabaseClient
            .from('page_views')
            .select('*', { count: 'exact', head: true });

        if (!error && counterElement) {
            counterElement.textContent = count.toLocaleString();
        }
    } catch (err) {
        console.error("Zähler-Fehler:", err);
        counterElement.textContent = "n/a";
    }
}

initVisitorCounter();