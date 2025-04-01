import React from "react";
import moment from "moment";
import { SEngineHelpers } from "@/types/stellarium";
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

const swh: SEngineHelpers = {
  // Date/time helper functions
  getCurrentDate: (): string => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },

  setObserverTime: (engine_: StellariumEngine | null, utcTime: Date): void => {
    if (!engine_) return;

    // Convert date to unix timestamp in seconds
    engine_.core.observer.utc = moment(utcTime).valueOf() / 1000;
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

  setFOV: (engine: StellariumEngine | null, fov: number): void => {
    if (!engine) return;
    engine.core.fov = fov;
  },

  getViewportSize: (engine: StellariumEngine | null): [number, number] => {
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

  toggleStars: (engine: StellariumEngine | null, visible?: boolean): void => {
    if (!engine) return;

    if (visible !== undefined) {
      engine.core.stars.visible = visible;
    } else {
      engine.core.stars.visible = !engine.core.stars.visible;
    }
  },

  setStarSize: (engine: StellariumEngine | null, size: number): void => {
    if (!engine) return;
    engine.core.stars.size = size;
  },

  setProjection: (engine: StellariumEngine | null, type: string): void => {
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
  searchObjects: async (result: string, limit: number): Promise<SearchResult[]> => {
    //Use Proxy Durign Dev otherwise CORS
    const apiUrl = import.meta.env.MODE === 'development'
      //Local Proxy Path
      ? '/api/v1/skysources/?q=' + result + '&limit=' + limit

      //Real API for Production
      : import.meta.env.VITE_NOCTUASKY_API_SERVER + '/api/v1/skysources/?q=' + result + '&limit=' + limit; 
  
    console.log('Using API:', apiUrl);
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
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
  takeScreenshot: (engine: StellariumEngine | null): string | null => {
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

  setData: (engine: StellariumEngine | null, key: string, value: any): void => {
    if (!engine) return;
    engine.setData(key, value);
  },

  getData: (engine: StellariumEngine | null, key: string): any => {
    if (!engine) return null;
    return engine.getData(key);
  },
};

export default swh;
