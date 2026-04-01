// --- ALLGEMEINE HELFER ---
function formatDate(dateString) {
    if (!dateString) return "-";
    const parts = dateString.split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : dateString;
}

// --- PORTAL LOGIK (Anzeigen) ---
function displayReservations() {
    const tableBody = document.getElementById('reservation-body');
    if (!tableBody) return;

    const reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
    tableBody.innerHTML = '';

    if (reservations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 50px; color: #888;">Keine Anfragen im System.</td></tr>';
        return;
    }

    // Neueste zuerst anzeigen
    [...reservations].reverse().forEach((res, index) => {
        const actualIndex = reservations.length - 1 - index;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="guest-name">${res.name}</div>
                <div class="guest-meta">${res.email} | ${res.tel}</div>
            </td>
            <td>${formatDate(res.checkin)}</td>
            <td>${formatDate(res.checkout)}</td>
            <td><span class="badge-room">${res.zimmer}</span></td>
            <td class="center">${res.gaeste}</td>
            <td><span class="status pending">${res.status}</span></td>
            <td><button onclick="deleteReservation(${actualIndex})" class="delete-btn">Löschen</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete Button
window.deleteReservation = function(index) {
    let reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
    if (confirm('Anfrage löschen?')) {
        reservations.splice(index, 1);
        localStorage.setItem('avenue_reservations', JSON.stringify(reservations));
        displayReservations();
    }
};

window.clearStorage = function() {
    if (confirm('Alle Daten löschen?')) {
        localStorage.removeItem('avenue_reservations');
        displayReservations();
    }
};

window.filterReservations = function() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#reservation-body tr');
    rows.forEach(row => {
        const name = row.querySelector('.guest-name').innerText.toLowerCase();
        row.style.display = name.includes(input) ? '' : 'none';
    });
};

// --- RESERVIERUNGS LOGIK (Speichern) ---
function initReservationForm() {
    const resForm = document.getElementById('reservationForm');
    if (!resForm) return; // Stoppt, wenn wir nicht auf der Reservierungs-Seite sind

    resForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // DATEN HOLEN (IDs müssen exakt so im HTML stehen!)
        const neueAnfrage = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            tel: document.getElementById('TelNr').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            zimmer: document.getElementById('rooms').value,
            gaeste: document.getElementById('guests').value,
            status: 'Neu'
        };

        let archiv = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
        archiv.push(neueAnfrage);
        localStorage.setItem('avenue_reservations', JSON.stringify(archiv));

        // Erfolgsmeldung zeigen
        resForm.innerHTML = `
            <div class="success-message" style="text-align:center; padding: 40px;">
                <h3 style="color: #bf9b30;">Vielen Dank, ${neueAnfrage.name}!</h3>
                <p>Ihre Anfrage für das ${neueAnfrage.zimmer} wurde gespeichert.</p>
                <button onclick="location.reload()" class="btn-submit">Neue Anfrage</button>
            </div>`;
    });
}

// BEIM LADEN STARTEN
document.addEventListener('DOMContentLoaded', () => {
    displayReservations();
    initReservationForm();
});