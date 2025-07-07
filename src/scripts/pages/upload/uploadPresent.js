import { uploadModel, navigateToHome } from "./uploadModel.js";
import {
  renderUploadForm,
  renderUploadSection,
  getUploadElements,
  togglePreview,
  updateLatLonInputs,
  getLatLonInputs,
  initMapAndMarker,
  startCameraPreview,
  stopCameraPreview,
  displayAlert,
  removeUploadMapInstance,
} from "./uploadView.js";
import { subscribeToPushNotification } from "../../utils/push.js";

let mediaStream = null;
let captured = false;

function initUploadProcess() {
  const { video } = getUploadElements();
  if (!video) return;
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

  if (!mapInstance) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.setMarkerPosition(latitude, longitude);
      updateLatLonInputs(latitude, longitude);
    },
    () => {
      const fallbackLat = -6.2;
      const fallbackLon = 106.8;
      mapInstance.setMarkerPosition(fallbackLat, fallbackLon);
      updateLatLonInputs(fallbackLat, fallbackLon); // ✅ ini penting
    }
  );
}

function handleCapture() {
  const { video, canvas, fileInput } = getUploadElements();
  if (!mediaStream) {
    displayAlert("Kamera belum aktif.");
    return;
  }
  if (!video || !canvas || !fileInput) return;

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

async function handleFormSubmit(e) {
  e.preventDefault();
  const { descInput, fileInput } = getUploadElements();
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

  try {
    const result = await uploadModel.executeUpload(formData);
    if (!result.error) {
      await subscribeToPushNotification(description);
      handleBackToHome();
    } else {
      displayAlert(result.message || "Gagal mengunggah cerita.");
    }
  } catch {
    displayAlert("Tidak ada jaringan pada saat ini.");
  }
}

function handleBackToHome() {
  const { video } = getUploadElements();
  stopCameraPreview(video, mediaStream);
  removeUploadMapInstance();
  navigateToHome();
}

function initializePageLogic() {
  const { form, captureBtn, backButton } = getUploadElements();
  if (!form) return;

  form.addEventListener("submit", handleFormSubmit);
  if (captureBtn) captureBtn.addEventListener("click", handleCapture);
  if (backButton) backButton.addEventListener("click", handleBackToHome);

  initUploadProcess();
}

export function uploadPresenter() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  renderUploadSection((main) => {
    main.innerHTML = renderUploadForm();
    requestAnimationFrame(initializePageLogic);
  });
}
