// src/components/MapView.tsx
import { useEffect, useRef } from 'react';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';
import Header from './Nav/header';
import Footer from './Nav/footer';

export default function MapView() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { engine, initEngine } = useSEngine();
	const canvasId = 'stellarium-canvas';

	useEffect(() => {
		// Initialize the engine if not already done
		if (!engine && canvasRef.current) {
			initEngine(canvasRef.current);
		}

		// If engine is available, you can configure it here
		if (engine) {
			const core = engine.getModule('core');

			initializeEngineDataSources(engine);

			//@ts-ignore
			window.swh = swh;

			//@ts-ignore
			window.engine = engine;

			swh.toggleLandscapeVisibility(engine, true);
			// swh.toggleAtmosphere(engine, false);

			// core.observer.utc = 100;
			core.constellations.images_visible = true;
			core.constellations.lines_visible = true;

			core.skycultures.addDataSource({
				url: 'src/assets/test-skydata/skycultures/kamilaroi',
				key: 'kamilaroi',
			});
			core.skycultures.current_id = 'kamilaroi';
			core.skycultures.current_id = 'kamilaroi';

			// Set location to Brewarrina Fish Traps
			swh.setObserverLocation(engine, 146.8534, -29.958);

			// Toggle atmosphere
			swh.toggleAtmosphere(engine, true);
			swh.setFOV(engine, 2.09);

			core.skycultures.current_id = 'kamilaroi';

			core.landscapes.addDataSource({
				url: 'src/assets/test-skydata/landscapes/guereins',
				key: 'guereins',
			});
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
			/>
			<Footer />
		</>
	);
}

// @ts-ignore
function initializeEngineDataSources(engine) {
	if (!engine) {
		console.error('Engine not available');
		return;
	}

	const proxyBase = 'http://localhost:5000';

	// Helper function with retry logic

	// @ts-ignore
	async function addDataSourceWithRetry(target, config, retryCount = 0) {
		try {
			target.addDataSource(config);
			console.log(`Successfully added ${config.key || config.url}`);
		} catch (error) {
			console.error(`Failed to initialize ${config.key || config.url}:`, error);
		}
	}

	// Stars data
	addDataSourceWithRetry(engine.core.stars, {
		url: `${proxyBase}/data/stars/minimal`,
		key: 'minimal',
	});

	addDataSourceWithRetry(engine.core.stars, {
		url: `${proxyBase}/data/stars/base`,
		key: 'base',
	});

	addDataSourceWithRetry(engine.core.stars, {
		url: `${proxyBase}/data/stars/extended`,
		key: 'extended',
	});

	// Surveys
	addDataSourceWithRetry(engine.core.stars, {
		url: `${proxyBase}/data/stars/gaia`,
		key: 'gaia',
	});

	addDataSourceWithRetry(engine.core.milkyway, {
		url: `${proxyBase}/data/milkyway/default`,
	});

	addDataSourceWithRetry(engine.core.dss, {
		url: `${proxyBase}/data/dss/default`,
	});

	// DSOs
	addDataSourceWithRetry(engine.core.dsos, {
		url: `${proxyBase}/data/dsos/base`,
		key: 'base',
	});

	addDataSourceWithRetry(engine.core.dsos, {
		url: `${proxyBase}/data/dsos/extended`,
		key: 'extended',
	});

	// Sky cultures
	// addDataSourceWithRetry(engine.core.skycultures, {
	// 	url: `${proxyBase}/data/skycultures/western`,
	// 	key: 'western',
	// });
}
