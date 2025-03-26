// src/components/MapView.tsx
import { useEffect, useRef } from "react";
import { useSEngine } from "@/context/SEngineContext";

export default function MapView() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { engine, initEngine } = useSEngine();
    const canvasId = "stellarium-canvas";

    useEffect(() => {
        // Initialize the engine if not already done
        if (!engine && canvasRef.current) {
            initEngine(canvasRef.current);
        }

        // If engine is available, you can configure it here
        if (engine) {
            // Example configurations:
            // Set observer location (longitude, latitude in degrees, altitude in meters, accurate timestamp)
            // engine.core.observer.longitude = -122.4194; // San Francisco
            // engine.core.observer.latitude = 37.7749;
            // engine.core.observer.elevation = 0;

            // Set time (example: current time)
            // engine.core.observer.utc = Date.now() / 1000;

            // Enable/disable atmosphere
            // engine.core.atmosphere.visible = true;

            // Set landscape
            // engine.core.landscapes.current = 'guereins'; // or another available landscape
            // engine.core.landscapes.visible = true;

            console.log("Available landscapes:", engine.listLandscapes?.());
            console.log("Current FOV:", engine.core.fov);
        }
    }, [engine, initEngine]);

    return (
        <div className="map-view">
            <h2>Stellarium Sky Map</h2>
            <canvas
                id={canvasId}
                ref={canvasRef}
                width={1000}
                height={1000}
                style={{
                    width: "100vw",
                    height: "100vh",
                    maxWidth: "800px",
                    background: "#000",
                    display: "block",
                    margin: "0 auto",
                    border: "1px solid #333",
                }}
            />
        </div>
    );
}
