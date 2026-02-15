const axios = require("axios");

async function forwardGeocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "your-mern-project"
    }
  });

  if (!res.data || res.data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    lat: res.data[0].lat,
    lon: res.data[0].lon,
    display_name: res.data[0].display_name
  };
}

module.exports = forwardGeocode;
