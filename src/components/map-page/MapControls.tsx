import type { ReactElement } from "react";
import { Box, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
export type MapStyleKey = "liberty" | "dark" | "fiord";

interface MapStyle {
  label: string;
  url: string;
}

interface MapControlsProps {
  styleKey: MapStyleKey;
  setStyleKey: (value: MapStyleKey) => void;
  mapStyles: Record<MapStyleKey, MapStyle>;
  is3D: boolean;
  setIs3D: (value: boolean) => void;
  isLocating: boolean;
  locate: () => void;
}

export const MapControls = ({
  styleKey,
  setStyleKey,
  mapStyles,
  is3D,
  setIs3D,
  isLocating,
  locate,
}: MapControlsProps): ReactElement => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">

      <div className="flex items-center gap-1 rounded-full border border-border p-1">

        {(Object.keys(mapStyles) as MapStyleKey[]).map((key) => (

          <Button
            key={key}
            type="button"
            size="sm"
            variant={styleKey === key ? "default" : "ghost"}
            className="h-7 rounded-full px-3 text-xs"
            onClick={() => setStyleKey(key)}
          >

            {mapStyles[key].label}

          </Button>
        ))}

      </div>

      <Button
        type="button"
        size="sm"
        variant={is3D ? "default" : "outline"}
        className="h-7 gap-1.5 rounded-full px-3 text-xs"
        onClick={() => setIs3D(!is3D)}
      >

        <Box className="h-3.5 w-3.5" />

        3D

      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 gap-1.5 rounded-full px-3 text-xs"
        onClick={locate}
        disabled={isLocating}
      >

        <Locate className="h-3.5 w-3.5" />

        {isLocating
          ? "Locating..."
          : "Locate me"}
          
      </Button>


      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        Lost
      </span>


      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-blue-500" />
        Sighted
      </span>

    </div>
  );
};