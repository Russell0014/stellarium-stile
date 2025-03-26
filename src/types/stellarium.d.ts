// src/types/stellarium.d.ts
declare global {
    interface Window {
        StelWebEngine: typeof StelWebEngine;
    }

    function StelWebEngine(options: {
        wasmFile: string;
        canvas: HTMLElement | null;
        onReady?: (stel: StellariumEngine) => void;
        translateFn?: (domain: string, str: string) => string;
    }): Promise<StellariumEngine>;

    interface StellariumEngine {
        core: {
            observer: {
                longitude: number;
                latitude: number;
                elevation: number;
                utc: number;
            };
            fov: number;
            selection: any;
            atmosphere: {
                visible: boolean;
            };
            landscapes: {
                current: string;
                visible: boolean;
            };
        };
        calendar: any;
        listLandscapes: () => string[];
        getViewportSize: () => [number, number];
        setViewportSize: (width: number, height: number) => void;
        // Add other methods as you discover them
    }
}

export {};
