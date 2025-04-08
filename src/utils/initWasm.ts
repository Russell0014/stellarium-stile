// src/utils/initWasm.ts
export async function initWasm(canvasId: string = 'stel-canvas') {
	if (typeof window.StelWebEngine !== 'function') {
		console.error('StelWebEngine not loaded. Make sure stellarium-web-engine.js is loaded.');
		return null;
	}

	return window.StelWebEngine({
		wasmFile: './stellarium-web-engine.wasm',
		canvas: document.getElementById(canvasId),
		onReady: function (stel) {
			console.log('Stellarium engine ready', { stel });
			return stel;
		},
	});
}
