// src/context/SEngineContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { initWasm } from "@/utils/initWasm";


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
                wasmFile: "/stellarium-web-engine.wasm",
                canvas: canvas,
                onReady: function (stel: any) {
                    console.log("Stellarium engine initialized successfully", {
                        stel,
                    });
                    return stel;
                },
            });

            setEngine(stellariumEngine);
        } catch (err) {
            console.error("Failed to initialize Stellarium engine:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SEngineContext.Provider
            value={{ engine, isLoading, error, initEngine }}
        >
            {children}
        </SEngineContext.Provider>
    );
}

export function useSEngine(): SEngineContextType {
    const context = useContext(SEngineContext);
    if (context === undefined) {
        throw new Error("useSEngine must be used within a SEngineProvider");
    }
    return context;
}


//Just included it in types for now
  //Move later?
const iconForType = {
    // Stars
    'Pec?': 'star',
    '**?': 'double_star',
    '**': 'double_star',
    'V*': 'variable_star',
    'V*?': 'variable_star',
    '*': 'star',

    // Candidates
    'As?': 'group_of_stars',
    'SC?': 'group_of_galaxies',
    'Gr?': 'group_of_galaxies',
    'C?G': 'group_of_galaxies',
    'G?': 'galaxy',

    // Multiple objects
    reg: 'region_defined_in_the_sky',
    SCG: 'group_of_galaxies',
    ClG: 'group_of_galaxies',
    GrG: 'group_of_galaxies',
    IG: 'interacting_galaxy',
    PaG: 'pair_of_galaxies',
    'C?*': 'open_galactic_cluster',
    'Gl?': 'globular_cluster',
    GlC: 'globular_cluster',
    OpC: 'open_galactic_cluster',
    'Cl*': 'open_galactic_cluster',
    'As*': 'group_of_stars',
    mul: 'multiple_objects',

    // Interstellar matter
    'PN?': 'planetary_nebula',
    PN: 'planetary_nebula',
    SNR: 'planetary_nebula',
    'SR?': 'planetary_nebula',
    ISM: 'interstellar_matter',

    // Galaxies
    PoG: 'part_of_galaxy',
    QSO: 'quasar',
    G: 'galaxy',

    dso: 'deep_sky',

    // Solar System
    Asa: 'artificial_satellite',
    Moo: 'moon',
    Sun: 'sun',
    Pla: 'planet',
    DPl: 'planet',
    Com: 'comet',
    MPl: 'minor_planet',
    SSO: 'minor_planet',

    Con: 'constellation'
  }
