import { useEffect, useState, useRef } from "react";

// wtf
// how to infer the types
// is this even the "right" way to setup
// best way to set up wasm
// how tf do we even call the other c/c++ functions etc.
// what is the params for StelWebEngine
// onReady
//    - how to set locations
//    - how to set landscape
//    - how tf to edit and change data

// findings
// seems that the "default" place is a sky WITHOUT a landscape

// declare global {
//   interface Window {
//     StelWebEngine: any;
//   }
// }

export default function MapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // not sure if we even need this
  // const [engine, setEngine] = useState<unknown>();
  // const engineWasm = "/stellarium-web-engine.wasm" as const;

  // useEffect(() => {
  //   const loadView = async () => {
  //     try {
  //       if (!window.StelWebEngine) {
  //         return;
  //       }
  //       const engine_ = await window.StelWebEngine({
  //         wasmFile: engineWasm,
  //         canvas: canvasRef.current,
  //         // translateFn: (domain: string, str: string) => str,
  //         // onReady: (u: unknown) => u,
  //       });
  //       // console.log(`engine_ ${engine_}`);
  //       // console.log(engine_);
  //       setEngine(() => engine_);
  //     } catch (e) {
  //       console.error(e);
  //       console.error(`engine_ failed?`);
  //     }
  //   };
  //   loadView();
  // }, []);

  return (
    <div>
      <h2>canvas below</h2>
      <canvas ref={canvasRef} />
      <h2>canvas top</h2>
    </div>
  );
}
