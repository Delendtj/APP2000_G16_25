//KL
function initMap() {
    var mapElement = document.getElementById('map');
    if (mapElement) {
        new google.maps.Map(mapElement, {
            center: { lat: 59.412369, lng: 9.067760 },
            zoom: 15
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initMap(); 
});

        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("spill-form");
            const spillListe = document.getElementById("spill-liste");
            let spill = JSON.parse(localStorage.getItem("spill")) || [];

            function oppdaterListe() {
                spillListe.innerHTML = "";
                spill.forEach((s, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><input type='text' value='${s.navn}' onchange="oppdaterSpill(${index}, 'navn', this.value)"></td>
                        <td>${s.dato}</td>
                        <td>${s.bane}</td>
                        <td>
                            <button class='poeng-knapp' onclick="endrePoeng(${index}, -1)">-</button>
                            <span id="poeng-${index}">${s.poeng || 0}</span>
                            <button class='poeng-knapp' onclick="endrePoeng(${index}, 1)">+</button>
                        </td>
                        <td><button class='delete-btn' onclick="slettSpill(${index})">Slett</button></td>
                    `;
                    spillListe.appendChild(row);
                });
            }

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const navn = document.getElementById("spillnavn").value;
                const dato = document.getElementById("dato").value;
                const bane = document.getElementById("bane").value;
                spill.push({ navn, dato, bane, poeng: 0 });
                localStorage.setItem("spill", JSON.stringify(spill));
                oppdaterListe();
                form.reset();
            });

            window.slettSpill = (index) => {
                spill.splice(index, 1);
                localStorage.setItem("spill", JSON.stringify(spill));
                oppdaterListe();
            };

            window.endrePoeng = (index, endring) => {
                spill[index].poeng = (spill[index].poeng || 0) + endring;
                if (spill[index].poeng < 0) spill[index].poeng = 0;
                localStorage.setItem("spill", JSON.stringify(spill));
                document.getElementById(`poeng-${index}`).textContent = spill[index].poeng;
            };

            window.oppdaterSpill = (index, felt, verdi) => {
                spill[index][felt] = verdi;
                localStorage.setItem("spill", JSON.stringify(spill));
            };

            oppdaterListe();
        });