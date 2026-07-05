import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Search, ExternalLink, Loader2 } from "lucide-react";

type MapPickerProps = {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

const ClickHandler = ({
  onPositionChange,
}: {
  onPositionChange: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

// Componente interno: recentra el mapa cuando cambia la posición por código
// (por ejemplo, al elegir un resultado del buscador), sin esperar a un click.
const RecenterMap = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 17);
    }
  }, [position, map]);

  return null;
};

const MapPicker = ({ latitude, longitude, onChange }: MapPickerProps) => {
  const hasPosition =
    typeof latitude === "number" && typeof longitude === "number";

  const defaultCenter: [number, number] = [-34.9214, -57.9544];
  const position: [number, number] | null = hasPosition
    ? [latitude, longitude]
    : null;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Búsqueda con debounce: espera 500ms después de que el usuario deja de
  // tipear antes de consultar la API, para no disparar un request por cada
  // letra escrita.
  useEffect(() => {
    if (query.trim().length < 4) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&countrycodes=ar`
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error al buscar dirección:", error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (result: NominatimResult) => {
    onChange(parseFloat(result.lat), parseFloat(result.lon));
    setQuery(result.display_name);
    setResults([]);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setQuery(data.display_name ?? "");
    } catch (error) {
      console.error("Error en geocoding inverso:", error);
    }
  };

  const handlePositionChange = (lat: number, lng: number) => {
    onChange(lat, lng);
    reverseGeocode(lat, lng);
  };

  return (
    <div className="lg:col-span-2 relative z-0">
      {/* BUSCADOR */}
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id="map-search-input"
          name="map-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dirección para centrar el mapa..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none focus:border-slate-400"
        />
        {searching && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
          />
        )}

        {results.length > 0 && query.trim().length >= 4 && (
          <ul className="absolute z-1000 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
            {results.map((result, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                >
                  {result.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mb-2 text-xs text-slate-500">
        Buscá la dirección o hacé click directamente en el mapa. Podés
        arrastrar el marcador para ajustar la posición exacta.
      </p>

      <MapContainer
        center={hasPosition ? [latitude, longitude] : defaultCenter}
        zoom={15}
        style={{ width: "100%", height: "400px", borderRadius: "12px", zIndex: 0 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onPositionChange={handlePositionChange} />
        <RecenterMap position={position} />

        {hasPosition && (
          <Marker
            position={[latitude, longitude]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                handlePositionChange(pos.lat, pos.lng);
              },
            }}
          />
        )}
      </MapContainer>

      {/* COORDENADAS + LINK A GOOGLE MAPS */}
      {hasPosition ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-600">
            Ubicación seleccionada:{" "}
            <span className="font-mono text-slate-900">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </span>

          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold text-slate-900 hover:text-red-800 transition"
          >
            Verificar en Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      ) : (
        <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3">
          Todavía no seleccionaste una ubicación en el mapa.
        </p>
      )}
    </div>
  );
};

export default MapPicker;