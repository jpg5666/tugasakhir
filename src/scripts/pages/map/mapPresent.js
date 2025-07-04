import { mapModel } from "./mapModel.js";
import {
  renderMapView,
  initMap,
  addMarkersToMap,
  invalidateMapSize,
  removeMapInstance,
} from "./mapView.js";
import { withViewTransition } from "../../utils/transition.js";

let currentMapInstance = null;

export function renderMap() {
  const main = document.getElementById("main");
  if (!main) return;

  removeMapInstance();

  withViewTransition(() => {
    main.innerHTML = renderMapView();
  }).finished.then(() => {
    requestAnimationFrame(mapPresenter);
  });
}

export async function mapPresenter() {
  try {
    currentMapInstance = initMap("map");

    if (!currentMapInstance) return;

    invalidateMapSize(currentMapInstance);

    const stories = await mapModel.getStoriesWithLocation();
    addMarkersToMap(currentMapInstance, stories);
  } catch (error) {
    console.error("Error in mapPresenter:", error);
  }
}
