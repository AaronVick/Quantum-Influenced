import React from 'react';
import styled from 'styled-components';

interface ModelingNavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NavContainer = styled.div`
  background-color: rgba(20, 30, 50, 0.6);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
`;

const NavTitle = styled.h2`
  color: #64e3ff;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.4rem;
  border-bottom: 1px solid rgba(100, 227, 255, 0.3);
  padding-bottom: 10px;
`;

const NavButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const NavButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'rgba(100, 227, 255, 0.2)' : 'rgba(30, 40, 70, 0.5)'};
  color: ${props => props.active ? '#fff' : '#aaa'};
  border: 1px solid ${props => props.active ? 'rgba(100, 227, 255, 0.6)' : 'rgba(70, 90, 120, 0.6)'};
  border-radius: 6px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  flex: 1;
  min-width: 200px;
  text-align: left;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: rgba(100, 227, 255, 0.15);
    color: #fff;
  }
`;

const FeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(40, 50, 80, 0.6);
  border-radius: 6px;
  margin-right: 10px;
  font-size: 16px;
`;

const ModelingNavigation: React.FC<ModelingNavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <NavContainer>
      <NavTitle>Quantum Consciousness Modeling Tools</NavTitle>
      <NavButtons>
        <NavButton 
          active={activeSection === 'landauer'} 
          onClick={() => onNavigate('landauer')}
        >
          <FeatureIcon>🔋</FeatureIcon>
          Landauer Energy Limits
        </NavButton>
        
        <NavButton 
          active={activeSection === 'qrng'} 
          onClick={() => onNavigate('qrng')}
        >
          <FeatureIcon>🎲</FeatureIcon>
          QRNG Interaction Simulation
        </NavButton>
        
        <NavButton 
          active={activeSection === 'thermodynamics'} 
          onClick={() => onNavigate('thermodynamics')}
        >
          <FeatureIcon>🌡️</FeatureIcon>
          Thermodynamic Consistency
        </NavButton>
      </NavButtons>
    </NavContainer>
  );
};

export default ModelingNavigation; 