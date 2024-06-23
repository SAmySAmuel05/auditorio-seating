document.addEventListener("DOMContentLoaded", () => {
    const auditorium = document.getElementById("auditorium");
    const zoneSummary = document.getElementById("zoneSummary");
    const resetButton = document.getElementById("resetButton");
    const zoneButtons = document.querySelectorAll(".zone-button");
    const rows = 10;
    const cols = 10;
    let seats = [];
    let currentZone = null;

    const savedSeats = JSON.parse(localStorage.getItem('seats')) || {};

    zoneButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentZone = button.dataset.zone;
            showSeats(currentZone);
        });
    });

    function showSeats(zone) {
        auditorium.innerHTML = '';
        seats = [];
        auditorium.style.display = 'grid';

        const zoneSeats = savedSeats[zone] || Array(rows * cols).fill("false");

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const seat = createSeat(zoneSeats[i * cols + j]);
                seats.push(seat);
                auditorium.appendChild(seat);
            }
        }
        updateSummary();
    }

    function createSeat(status) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.dataset.occupied = status;
        if (status === "true") {
            seat.classList.add("occupied");
        }
        seat.addEventListener("click", () => toggleSeat(seat));
        return seat;
    }

    function toggleSeat(seat) {
        seat.dataset.occupied = seat.dataset.occupied === "false" ? "true" : "false";
        seat.classList.toggle("occupied");
        updateSummary();
        saveSeats();
    }

    function updateSummary() {
        const occupiedSeats = seats.filter(seat => seat.dataset.occupied === "true").length;
        const totalSeats = seats.length;
        zoneSummary.textContent = `Zona ${currentZone} - Total de asientos: ${totalSeats}, Ocupados: ${occupiedSeats}, Libres: ${totalSeats - occupiedSeats}`;
    }

    function saveSeats() {
        const seatStatus = seats.map(seat => seat.dataset.occupied);
        savedSeats[currentZone] = seatStatus;
        localStorage.setItem('seats', JSON.stringify(savedSeats));
    }

    function resetSeats() {
        seats.forEach(seat => {
            seat.dataset.occupied = "false";
            seat.classList.remove("occupied");
        });
        updateSummary();
        saveSeats();
    }

    resetButton.addEventListener("click", resetSeats);

    updateSummary();
});
