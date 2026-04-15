function formatDate(dateString) {
    if (!dateString) return "-";
    const parts = dateString.split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : dateString;
}

function displayReservations() {
    const tableBody = document.getElementById('reservation-body');
    if (!tableBody) return;

    const reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
    tableBody.innerHTML = '';

    const h1Element = document.querySelector('h1');
    const isPendingPage = document.title.includes("Eingang") || (h1Element && h1Element.innerText.includes("Eingang"));

    const filteredReservations = reservations.map((res, index) => ({ ...res, originalIndex: index }))
        .filter(res => isPendingPage ? res.status === 'Neu' : res.status === 'Bestätigt');

    if (filteredReservations.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 50px; color: #888;">Keine ${isPendingPage ? 'Anfragen' : 'Reservierungen'} im System.</td></tr>`;
        return;
    }

    [...filteredReservations].reverse().forEach((res) => {
        const row = document.createElement('tr');

        let actionButton = isPendingPage
            ? `<button onclick="confirmReservation(${res.originalIndex})" class="confirm-btn" style="background: darkturquoise; color: white; border: none; padding: 5px 10px; cursor: pointer;">Bestätigen</button>`
            : `<button onclick="deleteReservation(${res.originalIndex})" class="delete-btn" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Löschen</button>`;

        row.innerHTML = `
            <td>
                <div class="guest-name">${res.name}</div>
                <div class="guest-meta">${res.email} | ${res.tel}</div>
            </td>
            <td>${formatDate(res.checkin)}</td>
            <td>${formatDate(res.checkout)}</td>
            <td><span class="badge-room">${res.zimmer}</span></td>
            <td class="center">${res.gaeste}</td>
            <td><span class="status ${res.status === 'Neu' ? 'pending' : 'confirmed'}">${res.status}</span></td>
            <td>${actionButton}</td>
        `;
        tableBody.appendChild(row);
    });
}

// --- Logik für das Reservierungsformular ---
function initReservationForm() {
    const resForm = document.getElementById('reservationForm');
    if (!resForm) return;

    resForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newRes = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            tel: document.getElementById('TelNr').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            zimmer: document.getElementById('rooms').value,
            gaeste: document.getElementById('guests').value,
            status: 'Neu'
        };

        const reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
        reservations.push(newRes);
        localStorage.setItem('avenue_reservations', JSON.stringify(reservations));

        alert('Vielen Dank! Ihre Anfrage wurde an die Rezeption übermittelt.');
        this.reset();
    });
}

window.confirmReservation = function(index) {
    let reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
    if (confirm('Anfrage bestätigen? Sie verschiebt sich nun in den Reiter Reservierungen.')) {
        if (reservations[index]) {
            reservations[index].status = 'Bestätigt';
            localStorage.setItem('avenue_reservations', JSON.stringify(reservations));
            displayReservations();
        }
    }
};

window.deleteReservation = function(index) {
    let reservations = JSON.parse(localStorage.getItem('avenue_reservations')) || [];
    if (confirm('Reservierung endgültig löschen?')) {
        reservations.splice(index, 1);
        localStorage.setItem('avenue_reservations', JSON.stringify(reservations));
        displayReservations();
    }
};

window.filterReservations = function() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#reservation-body tr');
    rows.forEach(row => {
        const nameElement = row.querySelector('.guest-name');
        if (nameElement) {
            const name = nameElement.innerText.toLowerCase();
            row.style.display = name.includes(input) ? '' : 'none';
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    displayReservations();
    initReservationForm();
});