// src/components/MapView.tsx
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';
import Header from './Nav/header';
import Footer from './Nav/footer';
import ToggleControls from './ToggleControls';
import SkyObjectInfoPopup from './SkyObjectInfoPopup';
import type { SearchResult } from '../types/stellarium';
import { searchSkyObjects } from '../utils/skyDataSearch';

export default function MapView() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { engine, initEngine } = useSEngine();
	const canvasId = 'stellarium-canvas';
	const [selectedObject, setSelectedObject] = useState<SearchResult | null>(null);
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

	// Function to extract object identifier from a sky object
	const extractObjectIdentifier = (obj: any): string | null => {
		if (!obj || !obj.designations) return null;

		const names = obj.designations();
		if (!names || names.length === 0) return null;

		// For objects with NAME prefix (planets, sun, moon)
		if (names[0].startsWith('NAME ')) {
			return names[0].substring(5); // Return the name without 'NAME ' prefix
		}

		// For constellations (CON prefix)
		if (names[0].startsWith('CON ')) {
			// Extract the constellation name from the identifier
			// Format is usually: 'CON western X' or 'CON kamilaroi Y'
			const parts = names[0].split(' ');
			if (parts.length >= 3) {
				// Return the last part which is usually the constellation abbreviation
				// or a meaningful identifier
				return parts[parts.length - 1];
			}
			return names[0];
		}

		// For other objects, return the first name
		return names[0];
	};

	// Function to convert a sky object from engine to SearchResult format
	const skyObjectToSearchResult = async (obj: any): Promise<SearchResult | null> => {
		if (!obj || !engine) return null;

		try {
			// Get object information
			console.log('obj designations:', obj.designations());
			const names = obj.designations ? obj.designations() : [];
			if (!names || names.length === 0) return null;

			// Extract object identifier for searching
			const identifier = extractObjectIdentifier(obj);
			if (!identifier) return null;

			// Get current skyculture
			const currentSkyculture = engine.core.skycultures.current_id || '';

			// Try to find the object in skyDataSearch
			const searchResults = await searchSkyObjects(identifier, 5, currentSkyculture);

			// If we found a match, return the first result
			if (searchResults && searchResults.length > 0) {
				// Sometimes the search might return multiple results, so find the best match
				// based on the exact identifier
				const exactMatch = searchResults.find((result) => {
					// Check if any name matches our identifier
					return result.names.some(
						(name) => name === identifier || name.endsWith(identifier) || name.includes(identifier),
					);
				});

				return exactMatch || searchResults[0];
			}
		} catch (error) {
			console.error('Error converting sky object to search result:', error);
			return null;
		}
	};

	// Handle canvas click to select sky objects
	const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
		if (!engine || !canvasRef.current) return;

		// Get canvas bounds
		const rect = canvasRef.current.getBoundingClientRect();

		// Calculate click position within canvas (normalized to 0-1)
		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		try {
			// Use setTimeout to give the engine time to process the click
			setTimeout(async () => {
				if (engine.core.selection) {
					// The engine made a selection based on the click
					const selectedObj = engine.core.selection;

					// Convert to search result and open popup
					// Now using async/await since skyObjectToSearchResult is async
					try {
						const searchResult = await skyObjectToSearchResult(selectedObj);
						if (searchResult) {
							setSelectedObject(searchResult);
							setIsPopupOpen(true);
						}
					} catch (error) {
						console.error('Error getting search result:', error);
						setIsPopupOpen(false);
						setSelectedObject(null);
					}
				} else {
					// No selection was made, close popup
					setIsPopupOpen(false);
					setSelectedObject(null);
				}
			}, 50);
		} catch (error) {
			console.error('Error handling canvas click:', error);
			setIsPopupOpen(false);
			setSelectedObject(null);
		}
	};

	// Handle popup close
	const handlePopupClose = () => {
		setIsPopupOpen(false);
		engine.core.selection = {};
		engine.core.lock = {};
	};

	useEffect(() => {
		// Initialize the engine if not already done
		if (!engine && canvasRef.current) {
			initEngine(canvasRef.current);
		}

		// If engine is available, you can configure it here
		if (engine) {
			const core = engine.getModule('core');

			core.dsos.addDataSource({
				url: 'src/assets/skydata/dso/base',
				key: 'base',
			});

			core.landscapes.addDataSource({
				url: 'src/assets/skydata/landscapes/guereins',
				key: 'guereins',
			});
			core.milkyway.addDataSource({
				url: 'src/assets/skydata/surveys/milkyway',
			});
			core.minor_planets.addDataSource({
				url: 'src/assets/skydata/mpcorb.dat',
				key: 'mpc_asteroids',
			});
			core.planets.addDataSource({
				url: 'src/assets/skydata/surveys/sso/moon',
				key: 'moon',
			});

			core.stars.addDataSource({ url: 'src/assets/skydata/stars/base', key: 'base' });

			core.stars.addDataSource({ url: 'src/assets/skydata/stars/minimal', key: 'minimal' });

			core.stars.addDataSource({ url: 'src/assets/skydata/stars/extended', key: 'extended' });

			core.planets.addDataSource({
				url: 'src/assets/skydata/surveys/sso/sun',
				key: 'sun',
			});
			core.planets.addDataSource({
				url: 'src/assets/skydata/surveys/sso/moon',
				key: 'default',
			});

			//TO REMOVE AT SOME POINT ->

			//@ts-ignore
			window.swh = swh;

			//@ts-ignore
			window.engine = engine;

			// <-

			//We cannot get access to the dsos data - so don't make it visible to the user
			core.dsos.visible = false;

			swh.toggleLandscapeVisibility(engine, true);
			// swh.toggleAtmosphere(engine, false);

			// core.observer.utc = 100;
			core.constellations.images_visible = true;
			core.constellations.lines_visible = true;
			core.constellations.show_only_pointed = false;
			core.constellations.labels_visible = true;

			// Set location to Brewarrina Fish Traps
			swh.setObserverLocation(engine, 146.8534, -29.958);

			// Toggle atmosphere
			swh.toggleAtmosphere(engine, true);
			swh.setFOV(engine, 2.09);

			core.landscapes.addDataSource({
				url: 'src/assets/skydata/landscapes/guereins',
				key: 'guereins',
			});

			core.skycultures.addDataSource({
				url: 'src/assets/skydata/skycultures/western',
				key: 'western',
			});
			core.skycultures.addDataSource({
				url: 'src/assets/skydata/skycultures/kamilaroi',
				key: 'kamilaroi',
			});

			// Set default skyculture
			core.skycultures.current_id = 'kamilaroi';
		}
	}, [engine, initEngine]);

	return (
		<>
			<Header />
			<canvas
				id={canvasId}
				ref={canvasRef}
				style={{
					width: '100vw',
					height: '100vh',
					background: '#000',
					display: 'block',
					margin: '0 auto',
					border: '1px solid #333',
					zIndex: '0',
				}}
				onClick={handleCanvasClick}
			/>
			<Footer />
			<SkyObjectInfoPopup
				isOpen={isPopupOpen}
				onClose={handlePopupClose}
				skyObject={selectedObject}
			/>
		</>
	);
}
