import "@/App.css";
import MapView from "@/components/MapView";
import { SEngineProvider } from "@/context/SEngineContext";
import Header from "./components/header";

function App() {
    return (
        <main>
            <SEngineProvider>
                <MapView />
            </SEngineProvider>
        </main>
    );
}

export default App;
