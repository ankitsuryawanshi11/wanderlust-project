const lat = listing.geometry.coordinates[1];
const lon = listing.geometry.coordinates[0];

const map = L.map('map').setView([19.9993, 73.7900], 13); // Mumbai example
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([lat, lon]).addTo(map)
.bindPopup(listing.title)
.openPopup();