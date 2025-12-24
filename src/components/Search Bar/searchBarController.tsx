import { useState, useEffect } from 'react';
import swh from '../../assets/sw_helper';
import SearchBar from './searchbar';
import SkyObjectInfoPopup from '../SkyObjectInfoPopup';
import type { SearchResults, SearchResult } from '../../types/stellarium';
import { useSEngine } from '../../context/SEngineContext';

/**
 * @file SearchBarController.tsx - Controller component for handling search functionality and displaying sky object information
 * @module SearchBarController
 */

/**
 * SearchBarController component
 * Manages search input, fetches search results for Stellarium engine,
 * handles result selection, and displays an information popup for the selected sky object
 * @returns {JSX.Element}
 */
export default function SearchBarController() {
	const [search, setSearch] = useState<string>(''); //State for storyin current search input value
	const [results, setResults] = useState<SearchResults>([]); //State for storing Search Result
	const [debouncedSearch, setDebouncedSearch] = useState<string>(search); // State for debounced search term.
	const [selectedObject, setSelectedObject] = useState<SearchResult | null>(null); // State for currently selected sky object from search results
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); //State to control visibility of sky object popup
	const { engine } = useSEngine(); //Stellarium Engine Instance

	/**
	 * useEffect hook to debounce the search input
	 * Updates `debouncedSearch` 500ms after the 'search' state changes
	 */
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	/**
	 * useEffect hook to fetch search results when `debouncedSearch` or the engine's sky culture changes.
	 * Implements a timeout to wait for the user to stop typing before fetching
	 */
	useEffect(() => {
		if (debouncedSearch) {
			if (search === '' || search.length > 10) {
				return;
			}

			const fetchAllData = async () => {
				//Fetches search data from the Stellarium Helper
				try {
					const results = await swh.searchObjects(search, 10, engine);
					trim(results);
					setResults(results);
				} catch (error) {
					//Need to update Error Handling for to throw specific error
					throw new Error('Error fetching results: ' + error);
				}
			};

			fetchAllData();
		}
		//Depedency array includes debouncedSearch and a property from the engine that might affect search results.
	}, [debouncedSearch, engine?.core?.skycultures?.current_id]);

	/**
	 * Trims the "NAME " prefix from the 'match' property of the search results
	 * This mutates the 'results' array directly.
	 * @param {SearchResults} resultsToTrim - The array of Search Results to Trim
	 * @returns {SarchResults} - Modified Array of Search Results
	 */
	const trim = (results: SearchResults): SearchResults => {
		results.map((searchresult) => (searchresult.match = searchresult.match.replace('NAME ', '')));
		return results;
	};

	/**
	 * Handles changes in the search input field
	 * @param {string} search - The new search string
	 */
	const handleChange = (search: string): void => {
		setSearch(search);
	};

	/**
	 * Handles the closing of search dropdown or cleaning of search
	 * Resets the search input and results
	 */
	const onClose = (): void => {
		setSearch('');
		setResults([]);
	};

	/**
	 * Handles clicking on a search result.
	 * Extracts object information and determines object ID for Stellarium Engine
	 * Navigates to the Object in the engine, and displays an info popup.
	 * @param {SearchResult} result
	 */

	const handleResultClick = (result: SearchResult): void => {
		// Determine the appropriate object ID based on object type
		let objectId = null;

		// Handle different object types
		if (result.model === 'planet' || result.model === 'sun' || result.model === 'moon') {
			// For planets, sun, and moon, use "NAME Object"
			objectId = 'NAME ' + result.short_name;
		} else if (
			result.model === 'constellation' &&
			result.types?.includes('Western') &&
			result.names?.length > 0
		) {
			// For western constellations, use constellation ID from names array
			const conId = result.names.find((name) => name.startsWith('CON western'));
			if (conId) {
				objectId = conId;
			} else if (result.names[result.names.length - 1]) {
				// Fall back to last name in the array (should be the ID)
				objectId = result.names[result.names.length - 1];
			}
		} else if (
			result.model === 'constellation' &&
			result.types?.includes('Kamilaroi') &&
			result.names?.length > 0
		) {
			// For Kamilaroi constellations, use the last name in the array (should be the ID)
			objectId = result.names[result.names.length - 1];
		}

		try {
			if (engine && objectId) {
				// Attempt to get the object
				const searchObj = engine.getObj(objectId);

				if (searchObj) {
					try {
						// Set as selection and navigate to it
						engine.core.selection = searchObj;
						engine.pointAndLock(engine.core.selection, 0.5);
						console.log('Successfully navigated to object');
					} catch (selectionError) {
						console.error('Error during navigation/selection:', selectionError);
					} finally {
						// Always attempt to clear selection after navigation
						try {
							engine.core.selection = {};
							engine.core.lock = {};
						} catch (clearError) {
							console.warn('Error clearing selection after navigation:', clearError);
						}
					}
				} else {
					console.warn('Could not find object with ID:', objectId);
				}
			}
		} catch (error) {
			console.error('Navigation error:', error);
		}

		// Show object info popup
		setSelectedObject(result);
		setIsPopupOpen(true);

		// Close the search dropdown
		onClose();
	};

	// Handle popup close
	const handlePopupClose = () => {
		setIsPopupOpen(false);
		engine.core.selection = 0;
		engine.core.lock = 0;
	};

	return (
		<>
			<SearchBar
				search={search}
				results={results}
				onSearch={handleChange}
				onClose={onClose}
				onResultClick={handleResultClick}
			/>
			<SkyObjectInfoPopup
				isOpen={isPopupOpen}
				onClose={handlePopupClose}
				skyObject={selectedObject}
			/>
		</>
	);
}
