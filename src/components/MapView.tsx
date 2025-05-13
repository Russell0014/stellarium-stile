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
			/>
			<Footer />
		</>
	);
}
