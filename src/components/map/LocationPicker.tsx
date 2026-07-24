import { useEffect, useRef, useState, type ReactElement } from "react";
import MapGL, { Marker, type MapLayerMouseEvent, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoLocation } from "../../hooks/useGeolocation";

interface LocationPickerProps {
  center: GeoLocation;
  value: GeoLocation | null;
  onChange: (location: GeoLocation) => void;
}

export const LocationPicker = ({ center, value, onChange }: LocationPickerProps): ReactElement => {
  const mapRef = useRef<MapRef>(null);
  const [pin, setPin] = useState<GeoLocation>(value ?? center);

  useEffect(() => {
    if (!value) {
      setPin(center);
      mapRef.current?.flyTo({ center: [center.longitude, center.latitude], duration: 1000 });
    }
  }, [center, value]);

  const setLocation = (location: GeoLocation): void => {
    setPin(location);
    onChange(location);
  };

  const handleMapClick = (e: MapLayerMouseEvent): void => {
    setLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="h-64 w-full">
        <MapGL
          ref={mapRef}
          initialViewState={{ longitude: center.longitude, latitude: center.latitude, zoom: 14 }}
          onClick={handleMapClick}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          style={{ width: "100%", height: "100%" }}
          cursor="crosshair"
        >

          <Marker
            longitude={pin.longitude}
            latitude={pin.latitude}
            draggable
            onDragEnd={(e) => setLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat })}
          >

            <div className="relative -translate-y-1/2">
              <div className="h-6 w-6 rounded-full border-[3px] border-white bg-red-500 shadow-lg" />
              <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-red-500" />
            </div>

          </Marker>

        </MapGL>

      </div>

      <p className="bg-muted px-3 py-1.5 text-xs text-muted-foreground"> 
        Click anywhere on the map, or drag the pin, to set the exact spot. 
      </p>

    </div>
  );
};