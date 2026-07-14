import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import { LatLngBounds } from "leaflet";
import { Earthquake } from "../../types";

// ADD THIS HERE
function FitBounds({ events }: { events: Earthquake[] }) {
  const map = useMap();

  useEffect(() => {
    if (!events.length) return;

    const bounds = new LatLngBounds(
      events.map((e) => [e.latitude, e.longitude] as [number, number])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [events, map]);

  return null;
}


function colorFor(mag: number) {
  if (mag >= 7) return "#991b1b";
  if (mag >= 6) return "#dc2626";
  if (mag >= 5) return "#f97316";
  if (mag >= 3) return "#eab308";
  return "#22c55e";
}

export default function MapCanvas({
  events,
  selectedId,
  onSelect,
}: {
  events: Earthquake[];
  selectedId?: string | null;
  onSelect: (event: Earthquake) => void;
}) {
  
  return (
    <div className="h-[600px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer
  center={[20, 0]}
  zoom={2}
  style={{ height: "100%", width: "100%" }}
  scrollWheelZoom
>
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
<FitBounds events={events} />
        {events.map((e) => (
          <CircleMarker
            key={e.id}
            center={[e.latitude, e.longitude]}
            radius={Math.max(4, e.magnitude * 2)}
            pathOptions={{
              color: colorFor(e.magnitude),
              fillColor: colorFor(e.magnitude),
              fillOpacity: 0.8,
              weight: selectedId === e.id ? 3 : 1,
            }}
            eventHandlers={{
              click: () => onSelect(e),
            }}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-bold">{e.place}</h3>

                <p>
                  <strong>Magnitude:</strong> {e.magnitude}
                </p>

                <p>
                  <strong>Depth:</strong> {e.depth} km
                </p>

                <p>
                  {new Date(e.time).toLocaleString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}