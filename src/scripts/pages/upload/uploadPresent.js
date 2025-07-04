import { uploadModel } from "./uploadModel.js";
import {
  renderUploadForm,
  renderUploadSection,
  setupUploadFormEvents,
  getUploadElements,
  togglePreview,
  updateLatLonInputs,
  getLatLonInputs,
  initMapAndMarker,
  startCameraPreview,
  stopCameraPreview,
  resetFormUI,
  displayAlert,
} from "./uploadView.js";

import { redirectToHome } from "./uploadModel.js";

let mediaStream = null;
let captured = false;

export function renderUploadPage() {
  renderUploadSection((main) => {
    main.innerHTML = renderUploadForm();
  });
}

export function uploadPresenter() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupUploadFormEvents({
        onCapture: handleCapture,
        onSubmit: handleSubmit,
        onBack: handleBackToHome,
      });
      initUploadProcess();
    });
  });
}

function initUploadProcess() {
  const { video } = getUploadElements();
  captured = false;
  togglePreview(false);

  startCameraPreview(
    video,
    (stream) => {
      mediaStream = stream;
    },
    () => {
      displayAlert("Tidak bisa mengakses kamera.");
    }
  );

  const mapInstance = initMapAndMarker({
    onLatLngUpdate: (lat, lon) => updateLatLonInputs(lat, lon),
    initialLat: -6.2,
    initialLon: 106.8,
  });

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.setMarkerPosition(latitude, longitude);
      updateLatLonInputs(latitude, longitude);
    },
    () => {
      mapInstance.setMarkerPosition(-6.2, 106.8);
    }
  );
}

function handleCapture() {
  const { video, canvas, fileInput } = getUploadElements();
  if (!mediaStream) {
    displayAlert("Kamera belum aktif.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    displayAlert("Gagal memproses gambar.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        displayAlert("Gagal mengambil gambar dari kamera.");
        return;
      }
      const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      captured = true;
      togglePreview(true, URL.createObjectURL(file));
    },
    "image/jpeg",
    0.9
  );
}

async function handleSubmit() {
  const { descInput, fileInput, form, previewImg, video } = getUploadElements();
  const { lat, lon } = getLatLonInputs();
  const description = descInput.value.trim();
  const photo = fileInput.files[0];

  if (!captured || !photo) {
    displayAlert("Silakan ambil gambar terlebih dahulu!");
    return;
  }
  if (!description) {
    displayAlert("Deskripsi tidak boleh kosong!");
    return;
  }

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  formData.append("lat", lat);
  formData.append("lon", lon);

  const result = await uploadModel.uploadStoryData(formData);
  if (!result.error) {
    displayAlert("Cerita berhasil diunggah!");
    stopCameraPreview(video, mediaStream);
    resetFormUI(form, fileInput, previewImg, video);
    handleBackToHome();
  } else {
    displayAlert(result.message || "Gagal mengunggah cerita.");
  }
}

function handleBackToHome() {
  const { video } = getUploadElements();
  stopCameraPreview(video, mediaStream);
  redirectToHome();
}
