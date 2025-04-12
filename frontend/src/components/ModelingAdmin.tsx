import React, { useState } from 'react';
import styled from 'styled-components';
import ModelingNavigation from './ModelingNavigation';
import LandauerCalculator from './modeling/LandauerCalculator';
import QRNGInteractionSimulator from './modeling/QRNGInteractionSimulator';
import ThermodynamicTester from './modeling/ThermodynamicTester';

const AdminContainer = styled.div`
  padding: 30px;
  background-color: #0a0c14;
  color: #f0f0f0;
  min-height: 100vh;
`;

const AdminHeader = styled.header`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdminTitle = styled.h1`
  background: linear-gradient(90deg, #64e3ff, #9b7dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-size: 2.2rem;
  margin: 0;
`;

const ReturnButton = styled.button`
  background-color: rgba(30, 40, 70, 0.5);
  color: #aaa;
  border: 1px solid rgba(70, 90, 120, 0.6);
  border-radius: 6px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(100, 227, 255, 0.15);
    color: #fff;
  }
`;

interface ModelingAdminProps {
  onReturn: () => void;
}

const ModelingAdmin: React.FC<ModelingAdminProps> = ({ onReturn }) => {
  const [activeSection, setActiveSection] = useState<string>('landauer');

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Quantum-Consciousness Modeling</AdminTitle>
        <ReturnButton onClick={onReturn}>
          Return to Main Application
        </ReturnButton>
      </AdminHeader>

      <ModelingNavigation 
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {activeSection === 'landauer' && <LandauerCalculator />}
      {activeSection === 'qrng' && <QRNGInteractionSimulator />}
      {activeSection === 'thermodynamics' && <ThermodynamicTester />}
    </AdminContainer>
  );
};

export default ModelingAdmin; 