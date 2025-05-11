import { useState, useEffect } from 'react';
import swh from '../../assets/sw_helper';
import SearchBar from './searchbar';
import type { SearchResults, SearchResult } from '../../types/stellarium';
import { useSEngine } from '../../context/SEngineContext';

export default function SearchBarController() {
	const [search, setSearch] = useState<string>('');
	const [results, setResults] = useState<SearchResults>([]);
	const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
	const { engine } = useSEngine();

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	//Implement Timeout to wait for user to stop typing
	useEffect(() => {
		if (debouncedSearch) {
			if (search === '' || search.length > 10) {
				return;
			}

			const fetchAllData = async () => {
				try {
					const results = await swh.searchObjects(search, 10, engine);
					trim(results);
					setResults(results);
				} catch (error) {
					throw new Error('Error fetching results: ' + error);
				}
			};

			fetchAllData();
		}
	}, [debouncedSearch, engine?.core?.skycultures?.current_id]);

	const trim = (results: SearchResults): SearchResults => {
		results.map((searchresult) => (searchresult.match = searchresult.match.replace('NAME ', '')));
		return results;
	};

	const handleChange = (search: string): void => {
		setSearch(search);
	};

	const onClose = (): void => {
		setSearch('');
		setResults([]);
	};

	const handleResultClick = (result: SearchResult): void => {
		// Extract unique identifier from the result
		const displayName = result.match;

		// Prepare object information to log
		const objectInfo = {
			name: result.names?.[0] || displayName,
			skyObjectType: result.types?.join(', ') || 'Unknown',
			description: result.model_data?.ra 
				? `Position: RA ${result.model_data?.ra?.toFixed(2) || 'N/A'}, Dec ${result.model_data?.de?.toFixed(2) || 'N/A'}`
				: 'No position data',
		};

		// Log sky object information
		console.log(objectInfo);
		
		// Create a safe reference to the "Track Emu" functionality that works
		// This is for future implementation - currently just logging
		console.log(`Object selected: ${displayName}`);

		// Determine the appropriate object ID based on object type
		let objectId = null;
		
		// Handle different object types
		if (result.model === 'planet' || result.model === 'sun' || result.model === 'moon') {
			// For planets, sun, and moon, use "NAME Object"
			objectId = 'NAME ' + result.short_name;
		} else if (result.model === 'constellation' && result.types?.includes('Western') && result.names?.length > 0) {
			// For western constellations, use constellation ID from names array
			const conId = result.names.find(name => name.startsWith('CON western'));
			if (conId) {
				objectId = conId;
			} else if (result.names[result.names.length - 1]) {
				// Fall back to last name in the array (should be the ID)
				objectId = result.names[result.names.length - 1];
			}
		} else if (result.model === 'constellation' && result.types?.includes('Kamilaroi') && result.names?.length > 0) {
			// For Kamilaroi constellations, use the last name in the array (should be the ID)
			objectId = result.names[result.names.length - 1];
		}
		
		console.log('Object ID for navigation:', objectId);
		
		try {
			if (engine && objectId) {
				// Attempt to get the object 
				const searchObj = engine.getObj(objectId);
				
				if (searchObj) {
					// Set as selection and navigate to it
					engine.core.selection = searchObj;
					engine.pointAndLock(engine.core.selection, 0.5);
					console.log('Successfully navigated to object');
				} else {
					console.warn('Could not find object with ID:', objectId);
				}
			}
		} catch (error) {
			console.error('Navigation error:', error);
		}

		// Close the search dropdown
		onClose();
	};

	return (
		<SearchBar
			search={search}
			results={results}
			onSearch={handleChange}
			onClose={onClose}
			onResultClick={handleResultClick}
		/>
	);
}
