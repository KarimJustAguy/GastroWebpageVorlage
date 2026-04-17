function initNewsletter() {
    const overlay = document.getElementById('newsletter-overlay');
    const closeBtn = document.getElementById('close-newsletter');

    // Nach 3 Sekunden anzeigen
    setTimeout(() => {
        overlay.classList.add('show');
    }, 7000);

    // Schließ-Logik
    closeBtn.onclick = () => {
        overlay.classList.remove('show');
        localStorage.setItem('newsletterClosed', 'true');
    };
}

// Starten, sobald das Dokument geladen ist
document.addEventListener('DOMContentLoaded', initNewsletter);