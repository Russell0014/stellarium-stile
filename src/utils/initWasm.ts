export async function initWasm() {

  return StelWebEngine({
    wasmFile: "./stellarium-web-engine.wasm",
    canvas: document.getElementById('stel-canvas'),
    onReady: function(stel) {
      console.log("yay", {stel});
    }
  })
      
}
