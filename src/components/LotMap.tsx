import { useEffect, useRef } from "react";
import { SITE } from "@/data/site";

const PIN_HTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48" aria-hidden="true"><path fill="#782F40" stroke="#CEB888" stroke-width="2.2" d="M18 2.4c-8.1 0-14.6 6.5-14.6 14.6 0 10.4 14.6 28.2 14.6 28.2S32.6 27.4 32.6 17C32.6 8.9 26.1 2.4 18 2.4z"/><circle cx="18" cy="16.6" r="5.6" fill="#CEB888"/></svg>`;

function loadLeaflet(): Promise<any> {
  const w = window as Window & { L?: any };
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve, reject) => {
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/vendor/leaflet.css";
      link.setAttribute("data-leaflet", "1");
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = "/vendor/leaflet.js";
    s.onload = () => resolve((window as Window & { L?: any }).L);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export function LotMap() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let cancelled = false;
    const { lat, lng } = SITE.location;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !el.current) return;
        map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        map.fitBounds(
          [
            [30.436, -84.3065],
            [30.4412, -84.2988],
          ],
          { padding: [12, 12] },
        );
        const icon = L.divIcon({
          className: "tribe-pin",
          html: PIN_HTML,
          iconSize: [36, 48],
          iconAnchor: [18, 46],
        });
        L.marker([lat, lng], { icon, title: "Tailgate Tribe" })
          .addTo(map)
          .bindPopup("Tailgate Tribe · east of Lot 8");
        setTimeout(() => map.invalidateSize(), 200);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div ref={el} className="map-frame h-96 w-full" title="Map to Tailgate Tribe" />
    </div>
  );
}