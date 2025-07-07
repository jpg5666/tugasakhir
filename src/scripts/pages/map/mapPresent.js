import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { getStoriesWithLocation } from "./mapModel.js";
import { renderMapView } from "./mapView.js";
import { withViewTransition } from "../../utils/transition.js";
import { getStoryList } from "../../data/database.js";

let mapInstance = null;

export function renderMap() {
  const main = document.getElementById("main");
  if (!main) return;
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  withViewTransition(() => {
    main.innerHTML = renderMapView();
  }).finished.then(() => {
    mapPresenter();
  });
}

export async function mapPresenter() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  mapInstance = L.map("map", {
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

  mapInstance.invalidateSize();

  const cluster = L.markerClusterGroup({
    disableClusteringAtZoom: 10,
    maxClusterRadius: 30,
  });

  const icon = L.icon({
    iconUrl: "./images/user.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -64],
  });

  let stories = [];

  if (navigator.onLine) {
    stories = await getStoriesWithLocation();
  } else {
    const cached = await getStoryList();
    stories = cached?.filter((s) => s.lat && s.lon) || [];
  }

  stories.forEach((story) => {
    const marker = L.marker([story.lat, story.lon], { icon });
    marker.bindPopup(`
      <strong>${story.name}</strong><br>
      ${story.description}<br>
      <img src="${story.photoUrl}" alt="Foto" width="100">
    `);
    cluster.addLayer(marker);
  });

  mapInstance.addLayer(cluster);
}
