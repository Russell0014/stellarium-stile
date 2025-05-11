import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchResult } from '../types/stellarium';
import planetData from '../assets/skydata/planets/planet_data.json';
// Import constellation descriptions as a dynamic import
import constellationDescriptionsJson from '../assets/skydata/constellation_descriptions.json';

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
        if (name.startsWith('CON ') || name.includes('CON western') || name.includes('CON kamilaroi')) {
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
        (item) => item.id === constellationId
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
        return planetData[objName].noctua.names.filter(name => 
          name !== skyObject.short_name && 
          !name.startsWith('NAME ')
        );
      }
    }
    
    // For constellations and other objects, use the names from the SearchResult
    if (skyObject.names) {
      // Filter out the main name and any technical IDs or prefixes
      return skyObject.names.filter(name => 
        name !== skyObject.short_name && 
        !name.startsWith('NAME ') && 
        !name.startsWith('HIP ') &&
        !name.startsWith('CON ') &&
        !name.includes('CON western') &&
        !name.includes('CON kamilaroi')
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
      const skyculture = skyObject.types?.find(t => t === 'Western' || t === 'Kamilaroi');
      return skyculture ? `${skyculture} Constellation` : 'Constellation';
    }
    
    return 'Celestial Object';
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        <PopupHeader>
          <Title>{skyObject.short_name}</Title>
          <ObjectType>{getObjectType()}</ObjectType>
        </PopupHeader>
        
        {getAlternativeNames().length > 0 && (
          <Section>
            <SectionTitle>Alternative Names</SectionTitle>
            <NamesList>
              {getAlternativeNames().map((name, index) => (
                <NameItem key={index}>{name}</NameItem>
              ))}
            </NamesList>
          </Section>
        )}
        
        <Section>
          <SectionTitle>Description</SectionTitle>
          <Description>{getDescription()}</Description>
        </Section>
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const PopupContent = styled.div`
  background-color: rgba(10, 10, 20, 0.9);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  color: white;
  position: relative;
  border: 1px solid rgba(100, 100, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const PopupHeader = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 15px;
`;

const Title = styled.h2`
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #ffffff;
`;

const ObjectType = styled.div`
  font-size: 14px;
  color: #aaaaff;
  font-style: italic;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #aaaaff;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-line;
`;

const NamesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NameItem = styled.li`
  padding: 4px 0;
  font-size: 16px;
`;

export default SkyObjectInfoPopup;