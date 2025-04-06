// src/context/SEngineContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface SEngineContextType {
	engine: any | null;
	isLoading: boolean;
	error: Error | null;
	initEngine: (canvas: HTMLCanvasElement) => Promise<void>;
}

const SEngineContext = createContext<SEngineContextType | undefined>(undefined);

export function SEngineProvider({ children }: { children: ReactNode }) {
	const [engine, setEngine] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const initEngine = async (canvas: HTMLCanvasElement) => {
		if (engine) return; // Already initialized

		try {
			setIsLoading(true);
			setError(null);

			const stellariumEngine = await window.StelWebEngine({
				wasmFile: '/stellarium-web-engine.wasm',
				canvas: canvas,
				onReady: function (stel: any) {
					console.log('Stellarium engine initialized successfully', {
						stel,
					});
					return stel;
				},
			});

			setEngine(stellariumEngine);
		} catch (err) {
			console.error('Failed to initialize Stellarium engine:', err);
			setError(err instanceof Error ? err : new Error(String(err)));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SEngineContext.Provider value={{ engine, isLoading, error, initEngine }}>
			{children}
		</SEngineContext.Provider>
	);
}

export function useSEngine(): SEngineContextType {
	const context = useContext(SEngineContext);
	if (context === undefined) {
		throw new Error('useSEngine must be used within a SEngineProvider');
	}
	return context;
}
