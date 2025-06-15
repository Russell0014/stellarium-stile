import planetData from '../assets/skydata/planets/planet_data.json';
import westernSkyculture from '../assets/skydata/skycultures/western/index.json';
import kamilaroiSkyculture from '../assets/skydata/skycultures/kamilaroi/index.json';
import type { SearchResults, SearchResult } from '../types/stellarium';

// Interface for constellation data from skycultures
interface Constellation {
	id: string;
	common_name: {
		english: string;
		native?: string;
	};
	iau?: string;
}

// Combine planet and constellation data into a single searchable collection
const getSkyObjects = (): Record<string, SearchResult[]> => {
	const allData: Record<string, SearchResult[]> = {};

	// Process planet data and add each planet as a search result
	Object.entries(planetData).forEach(([name, data]) => {
		if (!allData[name]) {
			allData[name] = [];
		}

		// Create a search result for the planet
		const planetResult: SearchResult = {
			interest: data.interest || 5.0, // High interest for planets
			match: `NAME ${name}`,
			model: 'planet',
			model_data: {
				...data.model_data,
			},
			names: [name],
			short_name: name,
			types: ['SSO', 'Pl'],
		};

		allData[name].push(planetResult);
	});

	// Add Moon as a searchable object
	allData['Moon'] = [
		{
			interest: 5.0,
			match: 'NAME Moon',
			model: 'moon',
			model_data: {},
			names: ['Moon'],
			short_name: 'Moon',
			types: ['Moo', 'SSO'],
		},
	];

	// Add Sun as a searchable object
	allData['Sun'] = [
		{
			interest: 5.0,
			match: 'NAME Sun',
			model: 'sun',
			model_data: {},
			names: ['Sun'],
			short_name: 'Sun',
			types: ['Sun', 'SSO'],
		},
	];

	// Process western constellation data
	if (westernSkyculture && westernSkyculture.constellations) {
		westernSkyculture.constellations.forEach((constellation: Constellation) => {
			const constellationName = constellation.common_name.english;
			const constellationNativeName = constellation.common_name.native;
			const constellationId = constellation.id;
			const constellationIAU = constellation.iau || '';

			// Create a key for the constellation using its English name
			const key = constellationName.replace(/\s+/g, '');

			if (!allData[key]) {
				allData[key] = [];
			}

			// Create a search result for the constellation
			const constellationResult: SearchResult = {
				interest: 4.8, // High interest for constellations
				match: `NAME ${constellationName}`,
				model: 'constellation',
				model_data: {},
				names: [constellationName, constellationNativeName, `${constellationIAU}`, constellationId],
				short_name: constellationNativeName,
				types: ['Con', 'Western'],
			};

			allData[key].push(constellationResult);
		});
	}

	// Process Kamilaroi constellation data
	if (kamilaroiSkyculture && kamilaroiSkyculture.constellations) {
		kamilaroiSkyculture.constellations.forEach((constellation: Constellation) => {
			const constellationName = constellation.common_name.english;
			const constellationNativeName = constellation.common_name.english;
			const constellationId = constellation.id;

			// Create a key for the constellation using its English name
			const key = constellationName.replace(/\s+/g, '');

			if (!allData[key]) {
				allData[key] = [];
			}

			// Create a search result for the constellation
			const constellationResult: SearchResult = {
				interest: 4.7, // High interest for constellations
				match: `NAME ${constellationName}`,
				model: 'constellation',
				model_data: {},
				names: [constellationName, constellationNativeName, constellationId],
				short_name: constellationNativeName,
				types: ['Con', 'Kamilaroi'],
			};

			allData[key].push(constellationResult);
		});
	}

	return allData;
};

// Cache of all sky objects for fast lookup
const skyObjects = getSkyObjects();

/**
 * Search for sky objects by name
 * @param query Search string (case insensitive)
 * @param limit Maximum number of results to return
 * @param currentSkyculture Current skyculture (western or kamilaroi)
 * @returns Matching sky objects
 */
export const searchSkyObjects = async (
	query: string,
	limit: number = 10,
	currentSkyculture: string = '',
): Promise<SearchResults> => {
	query = query.toUpperCase();
	const results: SearchResult[] = [];

	// If query is empty, return empty results
	if (!query) {
		return [];
	}

	// Normalize the skyculture name for comparison
	const normalizedSkyculture = currentSkyculture.toLowerCase();

	// Search for exact matches first (prioritize planets, sun, moon)
	const directMatches = [
		'SUN',
		'MOON',
		'MERCURY',
		'VENUS',
		'EARTH',
		'MARS',
		'JUPITER',
		'SATURN',
		'URANUS',
		'NEPTUNE',
		'PLUTO',
	];

	for (const name of directMatches) {
		if (name.includes(query) && skyObjects[name.charAt(0) + name.slice(1).toLowerCase()]) {
			results.push(...skyObjects[name.charAt(0) + name.slice(1).toLowerCase()]);

			// If we have enough results already, return them
			if (results.length >= limit) {
				return results.slice(0, limit);
			}
		}
	}

	// Check if query is looking for constellations specifically
	const isConstellationQuery =
		query.includes('CONSTELLATION') || query.includes('CON') || query.includes('STAR PATTERN');

	// Filter specific types if needed
	let typeFilter: string[] = [];
	if (isConstellationQuery) {
		typeFilter = ['Con'];
	}

	// Then search through all objects
	for (const [name, objectList] of Object.entries(skyObjects)) {
		for (const obj of objectList) {
			// Skip if we've already added this object
			if (results.some((r) => r.match === obj.match)) {
				continue;
			}

			// Apply type filter if needed
			if (typeFilter.length > 0 && !obj.types?.some((t) => typeFilter.includes(t))) {
				continue;
			}

			// Filter constellations based on the current skyculture
			if (obj.model === 'constellation' && normalizedSkyculture) {
				// If it's a constellation, check if it matches the current skyculture
				const objSkyculture = obj.types
					?.find((t) => t === 'Western' || t === 'Kamilaroi')
					?.toLowerCase();

				// Skip this constellation if it doesn't match the current skyculture
				if (objSkyculture !== normalizedSkyculture) {
					continue;
				}
			}

			// Check if the object name matches the query
			const objNames = obj.names || [];
			const mainName = obj.match || '';
			const shortName = obj.short_name || '';
			const objTypes = obj.types || [];

			// Extract the name without "NAME " prefix for better matching
			const cleanName = mainName.startsWith('NAME ') ? mainName.substring(5) : mainName;

			// If doing constellation search, prioritize constellations
			if (isConstellationQuery && objTypes.includes('Con')) {
				// Exact match for constellation search
				results.push(obj);

				// If we have enough results, return them
				if (results.length >= limit) {
					return results.slice(0, limit);
				}
				continue;
			}

			// Search in all names
			const hasMatch =
				cleanName.toUpperCase().includes(query) ||
				shortName.toUpperCase().includes(query) ||
				objNames.some((n) => n && n.toUpperCase().includes(query));

			if (hasMatch) {
				results.push(obj);

				// If we have enough results, return them
				if (results.length >= limit) {
					return results.slice(0, limit);
				}
			}
		}
	}

	// Sort results by interest level (descending) and then by type priority
	return results
		.sort((a, b) => {
			// First sort by interest
			const interestDiff = (b.interest || 0) - (a.interest || 0);
			if (interestDiff !== 0) return interestDiff;

			// Then prioritize objects by type (constellations, planets)
			const aIsCon = a.types?.includes('Con') ? 1 : 0;
			const bIsCon = b.types?.includes('Con') ? 1 : 0;
			const aIsPlanet = a.types?.includes('Pl') ? 1 : 0;
			const bIsPlanet = b.types?.includes('Pl') ? 1 : 0;

			// Constellations first
			if (aIsCon !== bIsCon) return bIsCon - aIsCon;
			// Then planets
			if (aIsPlanet !== bIsPlanet) return bIsPlanet - aIsPlanet;

			// Finally sort alphabetically by name
			return (a.short_name || '').localeCompare(b.short_name || '');
		})
		.slice(0, limit);
};

// Export for testing
export const _skyObjects = skyObjects;
