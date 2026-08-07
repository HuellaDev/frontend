

import type { ReactElement } from "react";
import { Info } from "lucide-react";


const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "0.0.0";


export const AboutSection = (): ReactElement => (
    <div className="flex items-center gap-4 rounded-lg px-3 py-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Info className="size-[18px]" />
        </span>
        <span>
            <span className="block font-medium">Huella</span>
            <span className="block text-sm text-muted-foreground">Version {APP_VERSION}</span>
        </span>
    </div>
);