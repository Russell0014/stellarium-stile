import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSEngine } from '@/context/SEngineContext';
import swh from '@/assets/sw_helper';
import arrowSvg from '@/assets/icons/arrow_drop_down.svg';

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
		return name.charAt(0).toUpperCase() + name.slice(1) + ' Skyculture';
	};

	return (
		<SelectWrapper>
			<SkycultureSelect
				value={currentSkyculture}
				onChange={(e) => handleSkycultureChange(e.target.value)}
				$variant='secondary'>
				{skycultures.map((sc) => (
					<option
						key={sc}
						value={sc}>
						{formatSkycultureName(sc)}
					</option>
				))}
			</SkycultureSelect>
			<Arrow
				src={arrowSvg}
				aria-hidden
			/>
		</SelectWrapper>
	);
}

const SelectWrapper = styled.div`
	width: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const SkycultureSelect = styled.select<{ $variant: 'primary' | 'secondary' }>`
	/* kill native arrow */
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;

	width: 100%;
	height: 40px;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	padding: 8px 36px 8px 12px; /* room for arrow on the right */
	cursor: pointer;

	/* centre *both* normal and last line of text */
	text-align: center;
	text-align-last: center;

	${({ $variant }) =>
		$variant === 'primary'
			? `
        color: black;
        background: #fff;
        &:hover { background: #E0E0E0; }
      `
			: `
        color: white;
        background: rgba(0,0,0,.5);
        &:hover { background: rgba(0,0,0,.8); }
      `}
`;

const Arrow = styled.img`
	position: absolute;
	pointer-events: none;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	width: 24px;
	height: auto;
	opacity: 0.85;
`;
