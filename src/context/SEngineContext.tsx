// file that handles Stellarium Web Engine init

// if wasm is not loaded should we bother loading the webgl stuff (mapview)

import { createContext, useContext, useState, useEffect } from "react";
import type {
  StelEngineProps,
  StelEngineProviderProps,
} from "@/types/StellariumEngineTypes.ts";
import { initWasm } from "@/utils/initWasm";

const SEngineContext = createContext<StelEngineProps | undefined>(undefined);

function useSEngine(): StelEngineProps {
  //   const [sEngineWasm, setSEngineWasm] = useState<unknown | undefined>(
  //     undefined
  //   );
  const [isWasmInit, setIsWasmInit] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const success = await initWasm();
      setIsWasmInit(success);
      console.log(`success: ${success}`);
    })();
  }, []);

  return {
    isWasmInit,
  };
}

export function SEngineProvider({ children }: StelEngineProviderProps) {
  const sEngine = useSEngine();
  return (
    <SEngineContext.Provider value={sEngine}>
      {children}
    </SEngineContext.Provider>
  );
}

export function SEngineConsumer(): StelEngineProps {
  const stelEngine = useContext(SEngineContext);
  if (!stelEngine)
    throw new Error(
      `Error in SEngineConsumer, sEngine must be defined! stelEngine: ${stelEngine}`
    );
  return stelEngine;
}
