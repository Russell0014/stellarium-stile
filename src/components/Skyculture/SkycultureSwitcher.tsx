import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';

export default function SkycultureSwitcher() {
	const { engine } = useSEngine();
	const [currentSkyculture, setCurrentSkyculture] = useState<string>('');
	const [skycultures, setSkycultures] = useState<string[]>([]);

	useEffect(() => {
		if (engine) {
			// Get available skycultures
			const availableSkycultures = swh.getSkycultures(engine);
			setSkycultures(availableSkycultures);

			// Get current skyculture
			const current = swh.getCurrentSkyculture(engine);
			setCurrentSkyculture(current);
		}
	}, [engine]);

	const handleSkycultureChange = (skyculture: string) => {
		if (engine) {
			swh.setSkyculture(engine, skyculture);
			setCurrentSkyculture(skyculture);
		}
	};

	const formatSkycultureName = (name: string): string => {
		return name.charAt(0).toUpperCase() + name.slice(1);
	};

	return (
		<SkycultureContainer>
			<SkycultureLabel>Skyculture:</SkycultureLabel>
			<SkycultureSelect
				value={currentSkyculture}
				onChange={(e) => handleSkycultureChange(e.target.value)}>
				{skycultures.map((skyculture) => (
					<option key={skyculture} value={skyculture}>
						{formatSkycultureName(skyculture)}
					</option>
				))}
			</SkycultureSelect>
		</SkycultureContainer>
	);
}

const SkycultureContainer = styled.div`
	display: flex;
	align-items: center;
	margin-right: auto; /* Push to the left */
	padding-left: 10px;
`;

const SkycultureLabel = styled.span`
	color: white;
	margin-right: 8px;
	font-size: 14px;
`;

const SkycultureSelect = styled.select`
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 4px;
	padding: 4px 8px;
	font-size: 14px;
	cursor: pointer;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}
	
	&:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.5);
	}
`;
