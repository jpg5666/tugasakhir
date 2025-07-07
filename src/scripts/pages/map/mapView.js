export function renderMapView() {
  return `
    <section class="map-page" style="padding: 24px;">
      <h2 style="margin-bottom: 16px;">Peta Cerita</h2>
      <p style="margin-bottom: 24px;">
        Berikut adalah peta yang menampilkan lokasi cerita yang telah dibagikan. 
        Klik pada marker untuk melihat detail cerita.
      </p>
      <div 
        id="map" 
        style="
          height: 500px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #ddd;
          overflow: hidden;
        "
      ></div>
    </section>
  `;
}
