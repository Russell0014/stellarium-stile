import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SearchResult } from '../types/stellarium';
import planetData from '../assets/skydata/planets/planet_data.json';
import constellationDescriptionsJson from '../assets/skydata/constellation_descriptions.json';
import constellationSVG from '../assets/icons/constellation.svg';
import planetSVG from '../assets/icons/planet.svg';
import closeSVG from '../assets/icons/close.svg';
import starSVG from '../assets/icons/star.svg';

interface SkyObjectInfoPopupProps {
	isOpen: boolean;
	onClose: () => void;
	skyObject: SearchResult | null;
}

const SkyObjectInfoPopup: React.FC<SkyObjectInfoPopupProps> = ({ isOpen, onClose, skyObject }) => {
	if (!isOpen || !skyObject) return null;

	// Strip a leading "NAME " if present
	const getCleanName = (raw: string) => (raw.startsWith('NAME ') ? raw.slice(5) : raw);

	// Find the CON ID from names array
	const getConstellationId = (names: string[]) => {
		for (const name of names) {
			if (name.startsWith('CON ')) return name;
		}
		return names[names.length - 1] || '';
	};

	const cleanShort = getCleanName(skyObject.short_name || skyObject.names[0]);

	// Description logic
	const getDescription = () => {
		const { model, names, short_name } = skyObject;

		if (model === 'planet' || model === 'sun' || model === 'moon') {
			const desc =
				short_name in planetData
					? planetData[short_name as keyof typeof planetData]?.wikipedia_description
					: undefined;
			return desc || `${cleanShort} is a celestial body in our solar system.`;
		}

		if (model === 'constellation') {
			const cid = getConstellationId(names);
			const info = constellationDescriptionsJson.find((c) => c.id === cid);
			return info?.description || `${cleanShort} is a constellation in the sky.`;
		}

		if (model === 'star') {
			return `${cleanShort} is a star in the sky.`;
		}

		// Fallback
		return `${cleanShort} is a celestial object.`;
	};

	// Alt names logic
	const getAlternativeNames = () => {
		const { model, names, short_name } = skyObject;

		// Planets: from data file
		if (model === 'planet' || model === 'sun' || model === 'moon') {
			const noct =
				short_name in planetData
					? planetData[short_name as keyof typeof planetData]?.noctua?.names
					: [];
			return noct.map(getCleanName).filter((name: string) => name !== cleanShort);
		}

		// Others: filter out technical prefixes
		return names
			.map(getCleanName)
			.filter(
				(name) => name !== cleanShort && !name.startsWith('HIP ') && !name.startsWith('CON '),
			);
	};

	// Type & icon
	const getObjectType = () => {
		switch (skyObject.model) {
			case 'planet':
				return 'Planet';
			case 'sun':
			case 'star':
				return 'Star';
			case 'moon':
				return 'Moon';
			case 'constellation': {
				const style = skyObject.types?.find((t) => ['Western', 'Kamilaroi'].includes(t));
				return style ? `${style} Constellation` : 'Constellation';
			}
			default:
				return 'Celestial Object';
		}
	};

	const getObjectIcon = () =>
		skyObject.model === 'constellation'
			? constellationSVG
			: skyObject.model === 'star'
				? starSVG
				: planetSVG;

	// Close-on-outside-click
	useEffect(() => {
		const handleOutside = (e: MouseEvent) => {
			const el = document.getElementById('popup-content');
			if (el && !el.contains(e.target as Node)) onClose();
		};
		if (isOpen) document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	}, [isOpen, onClose]);

	const altNames = getAlternativeNames();
	const typeLabel = getObjectType();
	const icon = getObjectIcon();
	const desc = getDescription();

	return (
		<PopupOverlay>
			<PopupContent id='popup-content'>
				<PopupHeader>
					<Title>
						<SkyObjectIcon
							src={icon}
							alt={typeLabel + ' icon'}
						/>
						<TitleText>
							{cleanShort}
							<ObjectType>{typeLabel}</ObjectType>
						</TitleText>
					</Title>
					<CloseButton onClick={onClose}>
						<img
							src={closeSVG}
							alt='Close'
						/>
					</CloseButton>
				</PopupHeader>

				{altNames.length > 0 && (
					<Section>
						<SectionTitle>Also known as</SectionTitle>
						<NamesList>{altNames.join(', ')}</NamesList>
					</Section>
				)}

				<Description>{desc}</Description>
			</PopupContent>
		</PopupOverlay>
	);
};

export default SkyObjectInfoPopup;

// Styled components
const PopupOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: transparent;
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	z-index: 1000;
	pointer-events: none;
`;

const PopupContent = styled.div`
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.35);
	background: rgba(0, 0, 0, 0.9);
	display: flex;
	width: 350px;
	padding: 24px;
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
	max-height: 80vh;
	overflow-y: auto;
	color: white;
	position: relative;
	margin: 24px 24px 0 0;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	pointer-events: auto;
`;

const CloseButton = styled.button`
	display: flex;
	width: 24px;
	height: 24px;
	justify-content: center;
	align-items: center;
	background: none;
	border: none;

	&:hover {
		opacity: 0.8;
	}
`;

const PopupHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	align-self: stretch;
`;

const Title = styled.h2`
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 0;
`;

const TitleText = styled.span`
	display: flex;
	min-width: 98px;
	flex-direction: column;
	align-items: flex-start;
	color: #fff;
	font-family: 'Open Sans', sans-serif;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px; /* 133.333% */
`;

const ObjectType = styled.div`
	color: rgba(255, 255, 255, 0.6);
	font-family: 'Open Sans', sans-serif;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px; /* 171.429% */
`;

const Section = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	align-self: stretch;
`;

const SectionTitle = styled.h3`
	margin: 0;
	width: 92px;
	color: rgba(255, 255, 255, 0.6);
	font-family: 'Open Sans', sans-serif;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px; /* 200% */
`;

const Description = styled.div`
	align-self: stretch;
	color: rgba(255, 255, 255, 1);
	font-family: 'Open Sans', sans-serif;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
`;

const NamesList = styled.div`
	flex: 1 0 0;
	color: #fff;
	font-family: 'Roboto Mono', monospace;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px; /* 200% */
`;

const SkyObjectIcon = styled.img`
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
