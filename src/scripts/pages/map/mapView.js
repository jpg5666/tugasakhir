import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

let mapInstance = null;

export function renderMapView() {
  return `
    <section class="map-page">
      <h1>Peta Cerita</h1>
      <p>Berikut adalah peta yang menampilkan lokasi cerita...</p>
      <div id="map" style="height: 500px;"></div>
    </section>
  `;
}

export function initMap(mapId = "map") {
  const mapEl = document.getElementById(mapId);
  if (!mapEl) return null;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  mapInstance = L.map(mapId, {
    center: [-2.5489, 118.0149],
    zoom: 5,
    minZoom: 3,
    maxZoom: 18,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapInstance);

  return mapInstance;
}

export function addMarkersToMap(map, stories) {
  if (!map) return;

  const cluster = L.markerClusterGroup({
    disableClusteringAtZoom: 10,
    maxClusterRadius: 30,
  });

  const icon = L.icon({
    iconUrl: "./public/images/user.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -64],
  });

  stories.forEach((story) => {
    const marker = L.marker([story.lat, story.lon], { icon });
    marker.bindPopup(`
      <strong>${story.name}</strong><br>
      ${story.description}<br>
      <img src="${story.photoUrl}" alt="Foto" width="100">
    `);
    cluster.addLayer(marker);
  });

  map.addLayer(cluster);
}

export function invalidateMapSize(map) {
  if (map) {
    map.invalidateSize();
  }
}

export function removeMapInstance() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
}
