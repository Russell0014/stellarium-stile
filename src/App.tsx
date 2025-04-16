import '@/App.css';
import MapView from '@/components/MapView';
import { SEngineProvider } from '@/context/SEngineContext';

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
