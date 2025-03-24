export async function initWasm() {
  try {
    const importObj = {};
    const result = await WebAssembly.instantiateStreaming(
      fetch("/stellarium-web-engine.wasm")
    );
    console.log(result);
    return true;
  } catch (e) {
    console.warn(e);
    console.error(`An error occurred when fetching wasm source. Error: ${e}`);
    return false;
  }
}
