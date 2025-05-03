import { SEngineHelpers } from '@/types/stellarium';
import { SearchResults } from '@/types/stellarium';
import { SearchResult } from '@/types/stellarium';

const DDDate = Date;

DDDate.prototype.setJD = function (jd) {
	this.setTime((jd - 2440587.5) * 86400000);
};

DDDate.prototype.getJD = function (): number {
	return this.getTime() / 86400000 + 2440587.5;
};

DDDate.prototype.getMJD = function () {
	return this.getJD() - 2400000.5;
};

DDDate.prototype.setMJD = function (mjd) {
	this.setJD(mjd + 2400000.5);
};

const swh: SEngineHelpers = {
	// Observer location helpers
	setObserverLocation: (
		engine: StellariumEngine | null,
		longitude: number,
		latitude: number,
		elevation: number = 0,
	): void => {
		if (!engine) return;
		const DD2R = Math.PI / 180;
		engine.core.observer.longitude = longitude * DD2R;
		engine.core.observer.latitude = latitude * DD2R;

		if (elevation !== undefined) {
			engine.core.observer.elevation = elevation;
		}
	},

	setFOV: (engine: StellariumEngine | null, fov: number): void => {
		if (!engine) return;
		engine.core.fov = fov;
	},

	// Display settings helpers
	toggleAtmosphere: (engine: StellariumEngine | null, visible?: boolean): void => {
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

	toggleConstellations: (engine: StellariumEngine | null, visible?: boolean): void => {
		if (!engine) return;

		if (visible !== undefined) {
			engine.core.constellations.images_visible = visible;
		} else {
			engine.core.constellations.images_visible = !engine.core.constellations.images_visible;
		}
	},

	setLandscape: (engine: StellariumEngine | null, landscapeName: string): void => {
		if (!engine) return;
		engine.core.landscapes.current = landscapeName;
	},

	toggleLandscapeVisibility: (engine: StellariumEngine | null, visible?: boolean): void => {
		if (!engine) return;

		if (visible !== undefined) {
			engine.core.landscapes.visible = visible;
		} else {
			engine.core.landscapes.visible = !engine.core.landscapes.visible;
		}
	},

	// maybe keep ? search bar might need it
	goToObject: (engine: StellariumEngine | null, objId: string, options?: GoToOptions): void => {
		if (!engine) return;
		engine.goToObject(objId, options);
	},

	// Search and object info helpers
	searchObjects: async (result: string, limit: number): Promise<SearchResults> => {
		//Use Proxy Durign Dev otherwise CORS
		const apiUrl =
			import.meta.env.MODE === 'development'
				? //Local Proxy Path
					'/api/v1/skysources/?q=' + result + '&limit=' + limit
				: //Real API for Production
					import.meta.env.VITE_NOCTUASKY_API_SERVER +
					'/api/v1/skysources/?q=' +
					result +
					'&limit=' +
					limit;

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

	// Search and object info helpers
	searchObject: async (result: string): Promise<SearchResult | null> => {
		//Use Proxy Durign Dev otherwise CORS
		const apiUrl =
			import.meta.env.MODE === 'development'
				? //Local Proxy Path
					'/api/v1/skysources/?q=' + result
				: //Real API for Production
					import.meta.env.VITE_NOCTUASKY_API_SERVER + '/api/v1/skysources/?q=' + result;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			return await response.json();
		} catch (error) {
			console.error(error);
			return null;
		}
	},

	// Skyculture helpers
	getSkycultures: (engine: StellariumEngine | null): string[] => {
		if (!engine) return [];
		return ['kamilaroi', 'western'];
	},

	getCurrentSkyculture: (engine: StellariumEngine | null): string => {
		if (!engine) return '';
		return engine.core.skycultures.current_id;
	},

	setSkyculture: (engine: StellariumEngine | null, skyculture: string): void => {
		if (!engine) return;
		engine.core.skycultures.current_id = skyculture;
	},

	// Data helpers
	addDataSource: async (engine: StellariumEngine | null, url: string): Promise<void> => {
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
