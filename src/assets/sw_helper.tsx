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

// Import StellariumEngine type from the global scope
declare global {
  // Core observer interface for location and time settings
  interface StellariumObserver {
    longitude: number;
    latitude: number;
    elevation: number;
    utc: number;
  }

  // Atmosphere rendering settings
  interface StellariumAtmosphere {
    visible: boolean;
  }

  // Landscape rendering settings
  interface StellariumLandscapes {
    current: string;
    visible: boolean;
  }

  // Projection settings
  interface StellariumProjection {
    type: string;
  }

  // Star rendering settings
  interface StellariumStars {
    visible: boolean;
    size: number;
  }

  // Core module interface
  interface StellariumCore {
    observer: StellariumObserver;
    fov: number;
    selection: any;
    atmosphere: StellariumAtmosphere;
    landscapes: StellariumLandscapes;
    projection: StellariumProjection;
    stars: StellariumStars;
  }

  // Calendar module for date/time management
  interface StellariumCalendar {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  }

  // Position in the sky (coordinates)
  interface SkyPosition {
    ra: number;  // Right ascension
    dec: number; // Declination
    alt: number; // Altitude
    az: number;  // Azimuth
  }

  // Information about celestial objects
  interface ObjectInfo {
    id: string;
    model: string;
    type: string;
    names: string[];
    ra: number;
    dec: number;
    vmag: number;
    distance: number;
  }

  // Search result item
  interface SearchResult {
    id: string;
    model: string;
    match: string;
    distance: number;
    vmag?: number;
  }

  // Options for the goToObject method
  interface GoToOptions {
    duration?: number;
    zoom?: number;
  }

  // Constellation boundary definition
  interface ConstellationBoundary {
    id: string;
    name: string;
    points: number[][];  // Array of [ra, dec] coordinates
  }

  // Main Stellarium Engine interface
  interface StellariumEngine {
    // Core modules
    core: StellariumCore;
    calendar: StellariumCalendar;
    
    // Basic methods
    listLandscapes: () => string[];
    getViewportSize: () => [number, number];
    setViewportSize: (width: number, height: number) => void;
    
    // Data handling
    addDataSource: (url: string) => Promise<void>;
    setData: (key: string, value: any) => void;
    getData: (key: string) => any;
    
    // Observer position methods
    setObserverPositionByAddress: (address: string) => Promise<void>;
    
    // Coordinate conversion
    pointToValues: (x: number, y: number) => SkyPosition;
    valuesToPoint: (ra: number, dec: number) => [number, number];
    
    // Object information and navigation
    getObjectInfo: (objId: string) => ObjectInfo;
    search: (query: string) => SearchResult[];
    goToObject: (objId: string, options?: GoToOptions) => void;
    goTo: (longitude: number, latitude: number, duration?: number) => void;
    
    // Utility methods
    screenshot: () => string;
    getConstellationBoundaries: () => ConstellationBoundary[];
  }
}

interface SEngineHelpers {
  // Date/time helpers
  getCurrentDate: () => string;
  setObserverTime: (engine: StellariumEngine | null, utcTime: Date) => void;
  
  // Observer location helpers
  setObserverLocation: (engine: StellariumEngine | null, longitude: number, latitude: number, elevation?: number) => void;
  setObserverLocationByAddress: (engine: StellariumEngine | null, address: string) => Promise<void>;
  
  // View control helpers
  getFOV: (engine: StellariumEngine | null) => number;
  setFOV: (engine: StellariumEngine | null, fov: number) => void;
  getViewportSize: (engine: StellariumEngine | null) => [number, number];
  setViewportSize: (engine: StellariumEngine | null, width: number, height: number) => void;
  
  // Display settings helpers
  toggleAtmosphere: (engine: StellariumEngine | null, visible?: boolean) => void;
  toggleStars: (engine: StellariumEngine | null, visible?: boolean) => void;
  setStarSize: (engine: StellariumEngine | null, size: number) => void;
  setProjection: (engine: StellariumEngine | null, type: string) => void;
  
  // Landscape helpers
  getLandscapes: (engine: StellariumEngine | null) => string[];
  setLandscape: (engine: StellariumEngine | null, landscapeName: string) => void;
  toggleLandscapeVisibility: (engine: StellariumEngine | null, visible?: boolean) => void;
  
  // Navigation helpers
  goToObject: (engine: StellariumEngine | null, objId: string, options?: GoToOptions) => void;
  goToCoordinates: (engine: StellariumEngine | null, longitude: number, latitude: number, duration?: number) => void;
  
  // Search and object info helpers
  searchObjects: (engine: StellariumEngine | null, query: string) => SearchResult[];
  getObjectInfo: (engine: StellariumEngine | null, objId: string) => ObjectInfo | null;
  
  // Coordinate conversion
  screenToSky: (engine: StellariumEngine | null, x: number, y: number) => SkyPosition | null;
  skyToScreen: (engine: StellariumEngine | null, ra: number, dec: number) => [number, number] | null;
  
  // Utility helpers
  takeScreenshot: (engine: StellariumEngine | null) => string | null;
  getConstellationBoundaries: (engine: StellariumEngine | null) => ConstellationBoundary[];
  
  // Data helpers
  addDataSource: (engine: StellariumEngine | null, url: string) => Promise<void>;
  setData: (engine: StellariumEngine | null, key: string, value: any) => void;
  getData: (engine: StellariumEngine | null, key: string) => any;
}

const swh: SEngineHelpers = {
  // Date/time helper functions
  getCurrentDate: (): string => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
  
  setObserverTime: (
    engine: StellariumEngine | null, 
    utcTime: Date
  ): void => {
    if (!engine) return;
    
    // Convert date to unix timestamp in seconds
    engine.core.observer.utc = moment(utcTime).valueOf() / 1000;
  },
  
  // Observer location helpers
  setObserverLocation: (
    engine: StellariumEngine | null, 
    longitude: number, 
    latitude: number, 
    elevation: number = 0
  ): void => {
    if (!engine) return;
    
    engine.core.observer.longitude = longitude;
    engine.core.observer.latitude = latitude;
    
    if (elevation !== undefined) {
      engine.core.observer.elevation = elevation;
    }
  },
  
  setObserverLocationByAddress: async (
    engine: StellariumEngine | null,
    address: string
  ): Promise<void> => {
    if (!engine) return;
    
    await engine.setObserverPositionByAddress(address);
  },
  
  // View control helpers
  getFOV: (engine: StellariumEngine | null): number => {
    if (!engine) return 0;
    return engine.core.fov;
  },
  
  setFOV: (
    engine: StellariumEngine | null, 
    fov: number
  ): void => {
    if (!engine) return;
    engine.core.fov = fov;
  },
  
  getViewportSize: (
    engine: StellariumEngine | null
  ): [number, number] => {
    if (!engine) return [0, 0];
    return engine.getViewportSize();
  },
  
  setViewportSize: (
    engine: StellariumEngine | null,
    width: number,
    height: number
  ): void => {
    if (!engine) return;
    engine.setViewportSize(width, height);
  },
  
  // Display settings helpers
  toggleAtmosphere: (
    engine: StellariumEngine | null, 
    visible?: boolean
  ): void => {
    if (!engine) return;
    
    if (visible !== undefined) {
      engine.core.atmosphere.visible = visible;
    } else {
      engine.core.atmosphere.visible = !engine.core.atmosphere.visible;
    }
  },
  
  toggleStars: (
    engine: StellariumEngine | null,
    visible?: boolean
  ): void => {
    if (!engine) return;
    
    if (visible !== undefined) {
      engine.core.stars.visible = visible;
    } else {
      engine.core.stars.visible = !engine.core.stars.visible;
    }
  },
  
  setStarSize: (
    engine: StellariumEngine | null,
    size: number
  ): void => {
    if (!engine) return;
    engine.core.stars.size = size;
  },
  
  setProjection: (
    engine: StellariumEngine | null,
    type: string
  ): void => {
    if (!engine) return;
    engine.core.projection.type = type;
  },
  
  // Landscape helpers
  getLandscapes: (engine: StellariumEngine | null): string[] => {
    if (!engine) return [];
    return engine.listLandscapes();
  },
  
  setLandscape: (
    engine: StellariumEngine | null, 
    landscapeName: string
  ): void => {
    if (!engine) return;
    engine.core.landscapes.current = landscapeName;
  },
  
  toggleLandscapeVisibility: (
    engine: StellariumEngine | null, 
    visible?: boolean
  ): void => {
    if (!engine) return;
    
    if (visible !== undefined) {
      engine.core.landscapes.visible = visible;
    } else {
      engine.core.landscapes.visible = !engine.core.landscapes.visible;
    }
  },
  
  // Navigation helpers
  goToObject: (
    engine: StellariumEngine | null,
    objId: string,
    options?: GoToOptions
  ): void => {
    if (!engine) return;
    engine.goToObject(objId, options);
  },
  
  goToCoordinates: (
    engine: StellariumEngine | null,
    longitude: number,
    latitude: number,
    duration?: number
  ): void => {
    if (!engine) return;
    engine.goTo(longitude, latitude, duration);
  },
  
  // Search and object info helpers
  searchObjects: (
    engine: StellariumEngine | null,
    query: string
  ): SearchResult[] => {
    if (!engine) return [];
    return engine.search(query);
  },
  
  getObjectInfo: (
    engine: StellariumEngine | null,
    objId: string
  ): ObjectInfo | null => {
    if (!engine) return null;
    return engine.getObjectInfo(objId);
  },
  
  // Coordinate conversion
  screenToSky: (
    engine: StellariumEngine | null,
    x: number,
    y: number
  ): SkyPosition | null => {
    if (!engine) return null;
    return engine.pointToValues(x, y);
  },
  
  skyToScreen: (
    engine: StellariumEngine | null,
    ra: number,
    dec: number
  ): [number, number] | null => {
    if (!engine) return null;
    return engine.valuesToPoint(ra, dec);
  },
  
  // Utility helpers
  takeScreenshot: (
    engine: StellariumEngine | null
  ): string | null => {
    if (!engine) return null;
    return engine.screenshot();
  },
  
  getConstellationBoundaries: (
    engine: StellariumEngine | null
  ): ConstellationBoundary[] => {
    if (!engine) return [];
    return engine.getConstellationBoundaries();
  },
  
  // Data helpers
  addDataSource: async (
    engine: StellariumEngine | null,
    url: string
  ): Promise<void> => {
    if (!engine) return;
    await engine.addDataSource(url);
  },
  
  setData: (
    engine: StellariumEngine | null,
    key: string,
    value: any
  ): void => {
    if (!engine) return;
    engine.setData(key, value);
  },
  
  getData: (
    engine: StellariumEngine | null,
    key: string
  ): any => {
    if (!engine) return null;
    return engine.getData(key);
  }
};

export default swh;
