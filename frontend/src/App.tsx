import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import QueryInterface from './components/query-interface';
import SimulationResults from './components/SimulationResults';
import ConsciousStateInput from './components/ConsciousStateInput';
import ConstraintAnalysis from './components/ConstraintAnalysis';
import ImportAnalysis from './components/ImportAnalysis';
import LandingPage from './components/LandingPage';
import ModelingAdmin from './components/ModelingAdmin';
import { simulateQuantumInteraction, SimulationResponse } from './services/api';
import styled from 'styled-components';

// Tutorial overlay component for onboarding
const TutorialOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  padding: 20px;
  text-align: center;
`;

const TutorialContent = styled.div`
  max-width: 800px;
  background-color: rgba(30, 40, 70, 0.9);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
`;

const TutorialStep = styled.div`
  margin-bottom: 30px;
`;

const TutorialHeader = styled.h2`
  color: #90b8ff;
  margin-bottom: 20px;
  font-size: 24px;
`;

const TutorialText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const TutorialButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const HelpButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4a90e2;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  border: none;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

interface TutorialProps {
  visible: boolean;
  currentStep: number;
  onNext: () => void;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ visible, currentStep, onNext, onClose }) => {
  const tutorialSteps = [
    {
      title: "Welcome to the Consciousness-Quantum Simulator",
      content: (
        <>
          <TutorialText>
            This application allows you to explore the theoretical framework for
            consciousness-quantum interactions in a rigorous, scientific way.
          </TutorialText>
          <TutorialText>
            We'll guide you through the key features to help you understand how
            to use this tool for testing hypotheses about consciousness influencing
            quantum measurement outcomes.
          </TutorialText>
        </>
      )
    },
    {
      title: "Setting Conscious State Parameters",
      content: (
        <>
          <TutorialText>
            In the left panel, you can define the parameters of a hypothetical conscious
            state represented as a vector in Hilbert space.
          </TutorialText>
          <TutorialText>
            You can adjust the dimension (related to degrees of freedom in neural systems)
            and set specific vector components or use the preset patterns for common states.
          </TutorialText>
        </>
      )
    },
    {
      title: "Running Simulations",
      content: (
        <>
          <TutorialText>
            After setting up your parameters, click the "Run Simulation" button to
            test how this conscious state might influence quantum measurement outcomes.
          </TutorialText>
          <TutorialText>
            The simulation runs a series of tests based on the mathematical framework:
            P<sub>C</sub>(i) = |α<sub>i</sub>|<sup>2</sup> + δ<sub>C</sub>(i)
          </TutorialText>
        </>
      )
    },
    {
      title: "Interpreting Results",
      content: (
        <>
          <TutorialText>
            Results are presented in two views: Summary and Detailed Analysis.
          </TutorialText>
          <TutorialText>
            Key metrics include reconstruction error (how well we can reconstruct the
            conscious state from quantum measurements), probability deviations, and
            information-theoretic measures.
          </TutorialText>
          <TutorialText>
            The null hypothesis testing section shows whether the data supports or
            rejects formal scientific hypotheses about consciousness-quantum interactions.
          </TutorialText>
        </>
      )
    },
    {
      title: "Scientific Standards",
      content: (
        <>
          <TutorialText>
            This simulation adheres to rigorous scientific principles including:
          </TutorialText>
          <ul style={{ textAlign: 'left', marginBottom: '15px' }}>
            <li>Falsifiability through null hypothesis testing</li>
            <li>Statistical significance measures (p-values)</li>
            <li>Effect size calculations</li>
            <li>Controls for confounding variables</li>
          </ul>
          <TutorialText>
            You're now ready to explore consciousness-quantum interactions with scientific rigor!
          </TutorialText>
        </>
      )
    }
  ];

  const currentTutorial = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <TutorialOverlay visible={visible}>
      <TutorialContent>
        <TutorialStep>
          <TutorialHeader>{currentTutorial.title}</TutorialHeader>
          {currentTutorial.content}
          
          <div>
            <TutorialButton onClick={isLastStep ? onClose : onNext}>
              {isLastStep ? "Start Exploring" : "Next"}
            </TutorialButton>
            {!isLastStep && (
              <TutorialButton 
                onClick={onClose}
                style={{ marginLeft: '15px', backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                Skip Tutorial
              </TutorialButton>
            )}
          </div>
        </TutorialStep>
      </TutorialContent>
    </TutorialOverlay>
  );
};

// Main application component with simulation interface
const SimulationApp: React.FC = () => {
  const [consciousState, setConsciousState] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SimulationResponse | null>(null);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed tutorial before
    const hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial');
    if (!hasCompletedTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const response = await simulateQuantumInteraction(consciousState);
      setResults(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error simulating quantum interaction:', error);
      setIsLoading(false);
    }
  };

  const handleDimensionChange = (dim: number) => {
    setDimensions(dim);
    setConsciousState(Array(dim).fill(0));
  };

  const handleConsciousStateChange = (index: number, value: number) => {
    const newState = [...consciousState];
    newState[index] = value;
    setConsciousState(newState);
  };

  const handleToggleImport = () => {
    setShowImport(!showImport);
  };

  const handleImport = (importedResults: SimulationResponse) => {
    setResults(importedResults);
    setShowImport(false);
  };

  const backToHome = () => {
    navigate('/');
  };

  const handleTutorialNext = () => {
    setTutorialStep(prev => prev + 1);
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('hasCompletedTutorial', 'true');
  };

  const handleShowHelp = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  return (
    <div className="app-container">
      <Tutorial 
        visible={showTutorial}
        currentStep={tutorialStep}
        onNext={handleTutorialNext}
        onClose={handleTutorialClose}
      />
      
      <header className="app-header">
        <h1>Consciousness-Quantum Interaction Simulator</h1>
        <button className="back-button" onClick={backToHome}>Back to Home</button>
      </header>
      
      <div className="main-content">
        <div className="left-panel">
          <ConsciousStateInput 
            dimensions={dimensions}
            consciousState={consciousState}
            onDimensionChange={handleDimensionChange}
            onStateChange={handleConsciousStateChange}
          />
          
          <QueryInterface 
            onSimulate={handleSimulate} 
            isLoading={isLoading}
          />
          
          <div className="import-section">
            <button 
              className="import-toggle-button" 
              onClick={handleToggleImport}
            >
              {showImport ? 'Cancel Import' : 'Import Previous Analysis'}
            </button>
            
            {showImport && (
              <ImportAnalysis onImport={handleImport} />
            )}
          </div>
        </div>
        
        <div className="right-panel">
          {results && (
            <>
              <SimulationResults results={results} />
              <ConstraintAnalysis results={results} />
            </>
          )}
        </div>
      </div>
      
      <HelpButton onClick={handleShowHelp}>?</HelpButton>
    </div>
  );
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/simulation" element={<SimulationApp />} />
        <Route path="/modeling" element={<ModelingView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Landing page wrapper with navigation
const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  const startSimulation = () => {
    navigate('/simulation');
  };
  
  const goToModeling = () => {
    navigate('/modeling');
  };
  
  return <LandingPage onStartSimulation={startSimulation} onGoToModeling={goToModeling} />;
};

// Modeling admin wrapper
const ModelingView: React.FC = () => {
  const navigate = useNavigate();
  
  const returnToMain = () => {
    navigate('/');
  };
  
  return <ModelingAdmin onReturn={returnToMain} />;
};

export default App; 