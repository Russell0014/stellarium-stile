import styled from 'styled-components';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';
import { useState } from 'react';
import constellationSVG from '@/assets/icons/constellation.svg';
import star from '@/assets/icons/star.svg';
import check from '@/assets/icons/check.svg';
import uncheck from '@/assets/icons/uncheck.svg';

export default function ToggleControls() {
	const { engine } = useSEngine();
	const [starsVisible, setStarsVisible] = useState(true);
	const [constellationsVisible, setConstellationsVisible] = useState(true);

	const toggleStars = () => {
		setStarsVisible(!starsVisible);
		swh.toggleStars(engine, !starsVisible);
	};

	const toggleConstellations = () => {
		setConstellationsVisible(!constellationsVisible);
		swh.toggleConstellations(engine, !constellationsVisible);
	};

	return (
		<ControlsContainer>
			<ToggleButton
				onClick={toggleConstellations}
				$active={constellationsVisible}>
				<img
					src={constellationSVG}
					alt='constellation icon'
				/>
				Constellations
				<StatusIcon
					src={constellationsVisible ? check : uncheck}
					alt=''
				/>
			</ToggleButton>
			<ToggleButton
				onClick={toggleStars}
				$active={starsVisible}>
				<img
					src={star}
					alt='star icon'
				/>
				Stars
				<StatusIcon
					src={starsVisible ? check : uncheck}
					alt=''
				/>
			</ToggleButton>
		</ControlsContainer>
	);
}

const ControlsContainer = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 14px;
	border-radius: 5px;
	border: 10px;
	left: 20px;
	bottom: 60px;
	z-index: 1;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;

	background: rgba(0, 0, 0, 0.5);
	/*background: ${(props) =>
		props.$active ? 'rgba(0, 203, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};*/
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

const StatusIcon = styled.img`
	margin-left: auto;
	padding
`;
