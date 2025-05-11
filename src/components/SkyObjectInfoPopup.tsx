import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchResult } from '../types/stellarium';
import planetData from '../assets/skydata/planets/planet_data.json';
// Import constellation descriptions as a dynamic import
import constellationDescriptionsJson from '../assets/skydata/constellation_descriptions.json';
// Import icons
import constellationSVG from '../assets/icons/constellation.svg';
import planetSVG from '../assets/icons/planet.svg';
import closeSVG from '../assets/icons/close.svg';

interface SkyObjectInfoPopupProps {
	isOpen: boolean;
	onClose: () => void;
	skyObject: SearchResult | null;
}

const SkyObjectInfoPopup: React.FC<SkyObjectInfoPopupProps> = ({ isOpen, onClose, skyObject }) => {
	if (!isOpen || !skyObject) return null;

	// Get description based on object type
	const getDescription = (): string => {
		if (!skyObject) return '';

		if (skyObject.model === 'planet' || skyObject.model === 'sun' || skyObject.model === 'moon') {
			// For planets, sun, and moon
			const objName = skyObject.short_name;

			// For planets, use the Wikipedia description from planet_data.json
			if (planetData[objName] && planetData[objName].wikipedia_description) {
				return planetData[objName].wikipedia_description;
			}

			// Default description for celestial bodies without specific data
			return `${objName} is a celestial body in our solar system.`;
		} else if (skyObject.model === 'constellation') {
			// For constellations, find the description in the constellation_descriptions.json
			// Try to find the constellation ID - check all names for a match
			let constellationId = null;

			// Check if any name starts with 'CON ', which is a constellation ID
			for (const name of skyObject.names) {
				if (
					name.startsWith('CON ') ||
					name.includes('CON western') ||
					name.includes('CON kamilaroi')
				) {
					constellationId = name;
					break;
				}
			}

			// If no CON prefix found, use the last name as a fallback
			if (!constellationId && skyObject.names.length > 0) {
				constellationId = skyObject.names[skyObject.names.length - 1];
			}

			// Find the description in the JSON
			const constellationInfo = constellationDescriptionsJson.find(
				(item) => item.id === constellationId,
			);

			if (constellationInfo) {
				return constellationInfo.description;
			}

			// Default description for constellations without specific data
			return `${skyObject.names[0]} is a constellation in the sky.`;
		}

		// Default description for unknown types
		return `${skyObject.short_name} is a celestial object.`;
	};

	// Get alternative names
	const getAlternativeNames = (): string[] => {
		if (!skyObject) return [];

		// For planets, use the names from planet_data.json
		if (skyObject.model === 'planet' || skyObject.model === 'sun' || skyObject.model === 'moon') {
			const objName = skyObject.short_name;

			// Check if the object has additional names in planet_data.json
			if (planetData[objName] && planetData[objName].noctua && planetData[objName].noctua.names) {
				// Filter out the short_name and NAME prefix
				return planetData[objName].noctua.names.filter(
					(name) => name !== skyObject.short_name && !name.startsWith('NAME '),
				);
			}
		}

		// For constellations and other objects, use the names from the SearchResult
		if (skyObject.names) {
			// Filter out the main name and any technical IDs or prefixes
			return skyObject.names.filter(
				(name) =>
					name !== skyObject.short_name &&
					!name.startsWith('NAME ') &&
					!name.startsWith('HIP ') &&
					!name.startsWith('CON ') &&
					!name.includes('CON western') &&
					!name.includes('CON kamilaroi'),
			);
		}

		return [];
	};

	// Determine the type of object
	const getObjectType = (): string => {
		if (!skyObject) return '';

		if (skyObject.model === 'planet') return 'Planet';
		if (skyObject.model === 'sun') return 'Star';
		if (skyObject.model === 'moon') return 'Moon';
		if (skyObject.model === 'constellation') {
			// Check if it's a Western or Kamilaroi constellation
			const skyculture = skyObject.types?.find((t) => t === 'Western' || t === 'Kamilaroi');
			return skyculture ? `${skyculture} Constellation` : 'Constellation';
		}

		return 'Celestial Object';
	};

	// Get the appropriate icon based on object type
	const getObjectIcon = (): string => {
		if (!skyObject) return planetSVG;

		if (skyObject.model === 'constellation') {
			return constellationSVG;
		}

		// Default to star icon for planets, stars, and other objects
		return planetSVG;
	};

	// Added useEffect to handle clicks outside the popup
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Check if click is outside the popup content
			const popupElement = document.getElementById('sky-object-popup-content');
			if (popupElement && !popupElement.contains(event.target as Node)) {
				onClose();
			}
		};

		// Add event listener to window
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// Cleanup
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	return (
		<PopupOverlay>
			<PopupContent id='sky-object-popup-content'>
				<PopupHeader>
					<Title>
						<SkyObjectIcon
							src={getObjectIcon()}
							alt={getObjectType() + ' icon'}
						/>
						<TitleText>
							{skyObject.short_name}
							<ObjectType>{getObjectType()}</ObjectType>
						</TitleText>
					</Title>
					<CloseButton onClick={onClose}>
						<img
							src={closeSVG}
							alt='Close'
						/>
					</CloseButton>
				</PopupHeader>

				{getAlternativeNames().length > 0 && (
					<Section>
						<SectionTitle>Also known as</SectionTitle>
						<NamesList>{getAlternativeNames().join(', ')}</NamesList>
					</Section>
				)}

				<Description>{getDescription()}</Description>
			</PopupContent>
		</PopupOverlay>
	);
};

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
	margin: 60px 20px 0 0;
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

export default SkyObjectInfoPopup;
