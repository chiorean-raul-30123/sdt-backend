import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { CourierDto } from "../types";
import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Props = {
  couriers: CourierDto[];
  height?: number | string;
};

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [points, map]);
  return null;
}

export default function CouriersMap({ couriers, height = 480 }: Props) {
  const points = useMemo(
    () =>
      couriers
        .filter(c => typeof c.latitude === "number" && typeof c.longitude === "number")
        .map(c => [c.latitude as number, c.longitude as number]) as [number, number][],
    [couriers]
  );

  // fallback view (RO aproximativ)
  const fallbackCenter: [number, number] = [45.9432, 24.9668];

  return (
    <div style={{ width: "100%", height, borderRadius: 8, overflow: "hidden", border: "1px solid #ddd" }}>
      <MapContainer center={fallbackCenter} zoom={7} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {couriers.map(c => {
          if (typeof c.latitude !== "number" || typeof c.longitude !== "number") return null;
          return (
            <Marker key={c.id} position={[c.latitude, c.longitude]} icon={redIcon}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{c.firstName} {c.lastName}</strong>
                  {c.phone ? <div>📞 {c.phone}</div> : null}
                  <div>ID: {c.id}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
