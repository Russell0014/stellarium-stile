import styled from 'styled-components';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';
import { useState } from 'react';

export default function ToggleControls() {
	const { engine } = useSEngine();
	const [atmosphereVisible, setAtmosphereVisible] = useState(true);
	const [starsVisible, setStarsVisible] = useState(true);
	const [landscapeVisible, setLandscapeVisible] = useState(true);
	const [constellationsVisible, setConstellationsVisible] = useState(true);

	const toggleAtmosphere = () => {
		setAtmosphereVisible(!atmosphereVisible);
		swh.toggleAtmosphere(engine, !atmosphereVisible);
	};

	const toggleStars = () => {
		setStarsVisible(!starsVisible);
		swh.toggleStars(engine, !starsVisible);
	};

	const toggleLandscape = () => {
		setLandscapeVisible(!landscapeVisible);
		swh.toggleLandscapeVisibility(engine, !landscapeVisible);
	};

	const toggleConstellations = () => {
		setConstellationsVisible(!constellationsVisible);
		swh.toggleConstellations(engine, !constellationsVisible);
	};

	return (
		<ControlsContainer>
			<ButtonContainer>
				<ToggleButton
					onClick={toggleAtmosphere}
					$active={atmosphereVisible}>
					Atmosphere
				</ToggleButton>
				<ToggleButton
					onClick={toggleStars}
					$active={starsVisible}>
					Stars
				</ToggleButton>
				<ToggleButton
					onClick={toggleLandscape}
					$active={landscapeVisible}>
					Landscape
				</ToggleButton>
				<ToggleButton
					onClick={toggleConstellations}
					$active={constellationsVisible}>
					Constellations
				</ToggleButton>
			</ButtonContainer>
		</ControlsContainer>
	);
}

const ControlsContainer = styled.div`
	position: absolute;
	background: rgba(255, 255, 255, 0.1);
	padding: 14px;
	border-radius: 5px;
	left: 20px;
	bottom: 60px;
	z-index: 1;
`;

const ButtonContainer = styled.div`
	display: flex;
	gap: 10px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
	background: ${(props) => (props.$active ? 'rgba(0, 203, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.3);
	padding: 5px 15px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: rgba(0, 203, 80, 0.3);
	}

	&:active {
		background: rgba(0, 203, 80, 0.4);
	}
`;
