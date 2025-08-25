const botaoBuscar = document.getElementById("botaoBuscar");

var center = [-7.17823297640175, -38.77776149398453];

var map = L.map("map", {
  zoomControl: true,
  scrollWheelZoom: true,
}).setView(center, 13);

var icone = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var marker = L.marker(center, {
  draggable: true,
  icon: icone,
}).addTo(map);

marker.bindPopup("Localização inicial").openPopup();

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors',
  maxZoom: 19,
}).addTo(map);

map.on("click", (evt) => {
  marker.setLatLng(evt.latlng);
  map.setView(evt.latlng);
  marker.bindPopup("Posição selecionada:<br>Lat: " + evt.latlng.lat.toFixed(5) + "<br>Lng: " + evt.latlng.lng.toFixed(5)).openPopup();
});

map.locate();

map.on("locationfound", (evt) => {
  map.setView(evt.latlng);
  marker.setLatLng(evt.latlng);
});

map.on("dblclick", (evt) => {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${evt.latlng.lat}&lon=${evt.latlng.lng}&format=jsonv2`
  )
    .then((data) => data.json())
    .then((local) => console.log(local.address));
});

botaoBuscar.addEventListener("click", () => {
  const local = document.getElementById("local").value;

  fetch(`https://nominatim.openstreetmap.org/search?q=${local}&format=jsonv2`)
    .then((result) => result.json())
    .then((locais) => {
      if (locais) {
        const ponto = [locais[0].lat, locais[0].lon];
        map.setView(ponto);
        marker.setLatLng(ponto);
      }
    });
  botaoBuscar.addEventListener("click", async () => {
    const local = document.getElementById("local").value;

    try {
      const result = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${local}&format=jsonv2`
      );
      const locais = await result.json();

      if (locais && locais.length > 0) {
        const ponto = [locais[0].lat, locais[0].lon];
        map.setView(ponto);
        marker.setLatLng(ponto);
      } else {
        alert("Local não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o local:", error);
      alert("Ocorreu um erro ao tentar buscar o local.");
    }
  });
  
});

