import React from "react";
import moment from "moment";

/**
 * The engine parameter refers to the stellarium engine instance
 * that you get from the SEngineContext using the useSEngine hook.
 * 
 * Usage example:
 * ```
 * import swh from '@/assets/sw_helper';
 * import { useSEngine } from '@/context/SEngineContext';
 * 
 * function MyComponent() {
 *   const { engine } = useSEngine();
 *   
 *   useEffect(() => {
 *     if (engine) {
 *       // Set location to New York
 *       swh.setObserverLocation(engine, -74.006, 40.7128);
 *       
 *       // Toggle atmosphere
 *       swh.toggleAtmosphere(engine, true);
 *     }
 *   }, [engine]);
 * }
 * ```
 */

interface SEngineHelpers {
  getCurrentDate: () => string;
  setObserverLocation: (engine: StellariumEngine | null, longitude: number, latitude: number, elevation?: number) => void;
  setObserverTime: (engine: StellariumEngine | null, utcTime: Date) => void;
  getFOV: (engine: StellariumEngine | null) => number;
  setFOV: (engine: StellariumEngine | null, fov: number) => void;
  toggleAtmosphere: (engine: StellariumEngine | null, visible?: boolean) => void;
  getLandscapes: (engine: StellariumEngine | null) => string[];
  setLandscape: (engine: StellariumEngine | null, landscapeName: string) => void;
  toggleLandscapeVisibility: (engine: StellariumEngine | null, visible?: boolean) => void;
}

const swh: SEngineHelpers = {
  // Date helper function
  getCurrentDate: () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
  
  // Observer location helper
  setObserverLocation: (engine, longitude, latitude, elevation = 0) => {
    if (!engine) return;
    
    engine.core.observer.longitude = longitude;
    engine.core.observer.latitude = latitude;
    
    if (elevation !== undefined) {
      engine.core.observer.elevation = elevation;
    }
  },
  
  // Observer time helper
  setObserverTime: (engine, utcTime) => {
    if (!engine) return;
    
    // Convert date to Julian day
    engine.core.observer.utc = moment(utcTime).valueOf() / 1000;
  },
  
  // Field of view helpers
  getFOV: (engine) => {
    if (!engine) return 0;
    return engine.core.fov;
  },
  
  setFOV: (engine, fov) => {
    if (!engine) return;
    engine.core.fov = fov;
  },
  
  // Atmosphere visibility helper
  toggleAtmosphere: (engine, visible) => {
    if (!engine) return;
    
    if (visible !== undefined) {
      engine.core.atmosphere.visible = visible;
    } else {
      engine.core.atmosphere.visible = !engine.core.atmosphere.visible;
    }
  },
  
  // Landscape helpers
  getLandscapes: (engine) => {
    if (!engine) return [];
    return engine.listLandscapes();
  },
  
  setLandscape: (engine, landscapeName) => {
    if (!engine) return;
    engine.core.landscapes.current = landscapeName;
  },
  
  toggleLandscapeVisibility: (engine, visible) => {
    if (!engine) return;
    
    if (visible !== undefined) {
      engine.core.landscapes.visible = visible;
    } else {
      engine.core.landscapes.visible = !engine.core.landscapes.visible;
    }
  }
};

export default swh;
