import styled from 'styled-components';
import DateTimeController from '../Date Time/dateTimeController';
import { useSEngine } from '@/context/SEngineContext';
import SkycultureSwitcher from '../Skyculture/SkycultureSwitcher';
import swh from '@/assets/sw_helper';
import { useState } from 'react';

// SVGs:
import constellationSVG from '@/assets/icons/constellation.svg';
import check from '@/assets/icons/check.svg';
import uncheck from '@/assets/icons/uncheck.svg';
import star from '@/assets/icons/star.svg';
import emu from '@/assets/icons/emu.svg';

export default function Footer() {
	const { engine } = useSEngine();
	function trackEmu() {
		const emu = engine.getObj('CON kamilaroi Emu1');
		engine.core.selection = emu;
		engine.pointAndLock(engine.core.selection, 0.5);
		engine.core.selection = {};
		engine.core.lock = {};
	}

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
		<FooterStyle>
			<FooterContainer>
				<ButtonsContainer>
					<ToggleButton
						onClick={toggleConstellations}
						$active={constellationsVisible}>
						<img
							src={constellationSVG}
							alt='constellation icon'
						/>
						<StyledP>Constellations</StyledP>

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
						<StyledP>Stars</StyledP>

						<StatusIcon
							src={starsVisible ? check : uncheck}
							alt=''
						/>
					</ToggleButton>
				</ButtonsContainer>

				<DateTimeController />

				<ButtonsContainer>
					<StyledInlineButton
						$variant='primary'
						onClick={trackEmu}>
						<img
							src={emu}
							alt='constellation icon'
						/>
						<StyledP>Track Emu</StyledP>
					</StyledInlineButton>
					<SkycultureSwitcher />
				</ButtonsContainer>
			</FooterContainer>
		</FooterStyle>
	);
}

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const StyledP = styled.p`
	padding: 0;
	margin: 0;
`;

export const StyledInlineButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
	justify-content: center;
	min-width: 250px;
	height: 40px;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	padding: 8px 12px;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.5);

	${({ $variant }) => {
		switch ($variant) {
			case 'primary':
				return `
					color: black;
					background: #FFF;
					&:hover {
						background: #E0E0E0;
					}
					
				`;
			case 'secondary':
				return `
					color: white;
					background: rgba(0, 0, 0, 0.50);

					&:hover {
						background: rgba(0, 0, 0, 0.8);
					}
				`;
			default:
				return '';
		}
	}}
`;

const ToggleButton = styled.button<{ $active: boolean }>`
	min-width: 250px;
	height: 40px;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	padding: 8px 12px;
	color: white;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	background: rgba(0, 0, 0, 0.5);
	&:hover {
		background: rgba(0, 203, 80, 0.3);
	}

	&:active {
		background: rgba(0, 203, 80, 0.4);
	}
`;

const StatusIcon = styled.img`
	margin-left: auto;
`;

const FooterContainer = styled.div`
	display: flex;
	padding: 24px;
	justify-content: space-between;
	align-items: end;
`;

const FooterStyle = styled.div`
	position: absolute;
	z-index: 1;
	bottom: 0;
	width: 100vw;
	height: auto;
`;
