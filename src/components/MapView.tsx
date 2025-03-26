// src/components/MapView.tsx
import { useEffect, useRef } from "react";
import { useSEngine } from "@/context/SEngineContext";
import swh from "@/assets/sw_helper";

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
      // Set location to New York
      swh.setObserverLocation(engine, -74.006, 40.7128);

      // Toggle atmosphere
      swh.toggleAtmosphere(engine, true);
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
