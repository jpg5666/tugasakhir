import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { withViewTransition } from "../../utils/transition.js";

export function renderUploadForm() {
  return `
    <section class="upload-section">
     <h1>Tambah Cerita Baru</h1>
      <form id="upload-form">
        <input type="text" id="desc" placeholder="Deskripsi" required><br>
        <video id="camera-preview" autoplay playsinline width="100%" style="max-height:200px;"></video>
        <img id="captured-preview" style="max-height:200px; display: none;" />
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <button type="button" id="capture-btn">Ambil Gambar</button><br>
        <input type="file" id="photo" style="display:none;" accept="image/*" />
        <div id="map" style="height: 200px; margin-top: 10px;"></div>
        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lon" name="lon">
        <button type="submit">Upload</button>
      </form>
      <button id="back-to-home" class="back-button">Kembali ke Beranda</button>
    </section>
  `;
}

export function getUploadElements() {
  return {
    form: document.getElementById("upload-form"),
    video: document.getElementById("camera-preview"),
    canvas: document.getElementById("camera-canvas"),
    previewImg: document.getElementById("captured-preview"),
    fileInput: document.getElementById("photo"),
    descInput: document.getElementById("desc"),
    captureBtn: document.getElementById("capture-btn"),
    backButton: document.getElementById("back-to-home"),
  };
}

export function togglePreview(show, src = "") {
  const { previewImg, video } = getUploadElements();
  if (show) {
    previewImg.src = src;
    previewImg.style.display = "block";
    video.style.display = "none";
  } else {
    previewImg.style.display = "none";
    video.style.display = "block";
  }
}

export function updateLatLonInputs(lat, lon) {
  const latInput = document.getElementById("lat");
  const lonInput = document.getElementById("lon");
  if (latInput) latInput.value = lat;
  if (lonInput) lonInput.value = lon;
}

export function getLatLonInputs() {
  return {
    lat: document.getElementById("lat")?.value,
    lon: document.getElementById("lon")?.value,
  };
}

export function setupUploadFormEvents({ onCapture, onSubmit, onBack }) {
  const { form, captureBtn, backButton } = getUploadElements();
  captureBtn?.addEventListener("click", onCapture);
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit(e);
  });
  backButton?.addEventListener("click", onBack);
}

export function initMapAndMarker({ onLatLngUpdate, initialLat, initialLon }) {
  const mapElement = document.getElementById("map");
  if (!mapElement) return null;

  const map = L.map("map").setView([initialLat, initialLon], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([initialLat, initialLon], {
    draggable: true,
    icon: L.icon({
      iconUrl: "./public/images/marker-icon.jpg",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    }),
  }).addTo(map);

  marker.on("moveend", (e) => {
    const { lat, lng } = e.target.getLatLng();
    onLatLngUpdate(lat, lng);
  });

  map.on("click", (e) => {
    marker.setLatLng(e.latlng);
    onLatLngUpdate(e.latlng.lat, e.latlng.lng);
  });

  return {
    setMarkerPosition(lat, lon) {
      map.setView([lat, lon], 15);
      marker.setLatLng([lat, lon]);
      onLatLngUpdate(lat, lon);
    },
  };
}

export function startCameraPreview(videoElement, onStreamReady, onError) {
  if (!videoElement) return onError(new Error("Video element kosong"));
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      onStreamReady(stream);
    })
    .catch(onError);
}

export function stopCameraPreview(videoElement, mediaStream) {
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    if (videoElement) videoElement.srcObject = null;
  }
}

export function resetFormUI(form, fileInput, previewImg, video) {
  form?.reset();
  if (fileInput) fileInput.value = "";
  if (previewImg) {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
  if (video) video.style.display = "block";
}

export function displayAlert(message) {
  alert(message);
}

export function renderUploadSection(callback) {
  const main = document.getElementById("main");
  if (main) withViewTransition(() => callback(main));
}

export function cleanupCameraIfUploadInactive() {
  if (window.location.hash !== "#/upload") {
    const video = document.getElementById("camera-preview");
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
  }
}
