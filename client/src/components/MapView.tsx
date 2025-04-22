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

			core.dsos.addDataSource({
				url: 'src/assets/test-skydata/dso/base',
				key: 'base',
			});

			core.landscapes.addDataSource({
				url: 'src/assets/test-skydata/landscapes/guereins',
				key: 'guereins',
			});
			core.milkyway.addDataSource({
				url: 'src/assets/test-skydata/surveys/milkyway',
			});
			core.minor_planets.addDataSource({
				url: 'src/assets/test-skydata/mpcorb.dat',
				key: 'mpc_asteroids',
			});
			core.planets.addDataSource({
				url: 'src/assets/test-skydata/surveys/sso/moon',
				key: 'moon',
			});

			core.stars.addDataSource({ url: 'src/assets/test-skydata/stars/minimal', key: 'minimal' });

			core.stars.addDataSource({ url: 'src/assets/test-skydata/stars/extended', key: 'extended' });

			core.planets.addDataSource({
				url: 'src/assets/test-skydata/surveys/sso/sun',
				key: 'sun',
			});
			core.planets.addDataSource({
				url: 'src/assets/test-skydata/surveys/sso/moon',
				key: 'default',
			});

			//@ts-ignore
			window.swh = swh;

			//@ts-ignore
			window.engine = engine;

			swh.toggleLandscapeVisibility(engine, true);
			// swh.toggleAtmosphere(engine, false);

			// core.observer.utc = 100;
			core.constellations.images_visible = true;
			core.constellations.lines_visible = true;

			// Set location to Brewarrina Fish Traps
			swh.setObserverLocation(engine, 146.8534, -29.958);

			// Toggle atmosphere
			swh.toggleAtmosphere(engine, true);
			swh.setFOV(engine, 2.09);

			core.landscapes.addDataSource({
				url: 'src/assets/test-skydata/landscapes/guereins',
				key: 'guereins',
			});

			core.skycultures.addDataSource({
				url: 'src/assets/test-skydata/skycultures/kamilaroi',
				key: 'kamilaroi',
			});
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
			/>
			<Footer />
		</>
	);
}
