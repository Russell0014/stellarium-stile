// Import StellariumEngine type from the global scope
declare global {
	interface Window {
		StelWebEngine: (options: {
			wasmFile: string;
			canvas: HTMLElement | null;
			onReady?: (stel: StellariumEngine) => void;
			translateFn?: (domain: string, str: string) => string;
		}) => Promise<StellariumEngine>;
	}
	// Extend the Date interface to include the setJD method
	interface Date {
		setJD(jd: number): void;
		getJD(): number;
		setMJD(mjd: number): void;
		getMJD(): number;
	}

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

	// Constellation rendering settings
	interface StellariumConstellations {
		visible: boolean;
		bounds_visible: boolean;
		illustrations_bscale: number;
		images_visible: boolean;
		labels_visible: boolean;
		lines_animation: boolean;
		lines_visible: boolean;
		show_only_pointed: boolean;
	}

	// Skyculture settings
	interface StellariumSkycultures {
		current_id: string;
		addDataSource: (options: { url: string; key: string }) => void;
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
		constellations: StellariumConstellations;
		skycultures: StellariumSkycultures;
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
		ra: number; // Right ascension
		dec: number; // Declination
		alt: number; // Altitude
		az: number; // Azimuth
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

	// Options for the goToObject method
	interface GoToOptions {
		duration?: number;
		zoom?: number;
	}

	// Constellation boundary definition
	interface ConstellationBoundary {
		id: string;
		name: string;
		points: number[][]; // Array of [ra, dec] coordinates
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

export interface SEngineHelpers {
	// Observer location helpers
	setObserverLocation: (
		engine: StellariumEngine | null,
		longitude: number,
		latitude: number,
		elevation?: number,
	) => void;
	setObserverLocationByAddress: (engine: StellariumEngine | null, address: string) => Promise<void>;

	// View control helpers
	getFOV: (engine: StellariumEngine | null) => number;
	setFOV: (engine: StellariumEngine | null, fov: number) => void;
	getViewportSize: (engine: StellariumEngine | null) => [number, number];
	setViewportSize: (engine: StellariumEngine | null, width: number, height: number) => void;

	// Display settings helpers
	toggleAtmosphere: (engine: StellariumEngine | null, visible?: boolean) => void;
	toggleStars: (engine: StellariumEngine | null, visible?: boolean) => void;
	toggleConstellations: (engine: StellariumEngine | null, visible?: boolean) => void;
	setStarSize: (engine: StellariumEngine | null, size: number) => void;
	setProjection: (engine: StellariumEngine | null, type: string) => void;

	// Landscape helpers
	getLandscapes: (engine: StellariumEngine | null) => string[];
	setLandscape: (engine: StellariumEngine | null, landscapeName: string) => void;
	toggleLandscapeVisibility: (engine: StellariumEngine | null, visible?: boolean) => void;

	// Navigation helpers
	goToObject: (engine: StellariumEngine | null, objId: string, options?: GoToOptions) => void;
	goToCoordinates: (
		engine: StellariumEngine | null,
		longitude: number,
		latitude: number,
		duration?: number,
	) => void;

	// Search and object info helpers
	searchObjects: (query: string, limit: number) => Promise<SearchResult[]>;

	searchObject: (query: string) => Promise<SearchResult | null>;

	getObjectInfo: (engine: StellariumEngine | null, objId: string) => ObjectInfo | null;

	// Coordinate conversion
	screenToSky: (engine: StellariumEngine | null, x: number, y: number) => SkyPosition | null;
	skyToScreen: (
		engine: StellariumEngine | null,
		ra: number,
		dec: number,
	) => [number, number] | null;

	// Utility helpers
	takeScreenshot: (engine: StellariumEngine | null) => string | null;
	getConstellationBoundaries: (engine: StellariumEngine | null) => ConstellationBoundary[];

	// Skyculture helpers
	getSkycultures: (engine: StellariumEngine | null) => string[];
	getCurrentSkyculture: (engine: StellariumEngine | null) => string;
	setSkyculture: (engine: StellariumEngine | null, skyculture: string) => void;

	// Data helpers
	addDataSource: (engine: StellariumEngine | null, url: string) => Promise<void>;
	setData: (engine: StellariumEngine | null, key: string, value: any) => void;
	getData: (engine: StellariumEngine | null, key: string) => any;
}

export type SearchResult = {
	interest: number;
	match: string;
	model: string;
	model_data: {
		Bmag?: number;
		Umag?: number;
		Vmag?: number;
		angle?: number;
		de?: number;
		dimx?: number;
		dimy?: number;
		pm_de?: number;
		pm_ra?: number;
		morpho?: string;
		ra?: number;
		rv?: number;
	};
	names: string[];
	short_name: string;
	types: string[];
};

export type SearchResults = SearchResult[];

export {};
