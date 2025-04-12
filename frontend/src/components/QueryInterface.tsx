import React from 'react';
import styled from 'styled-components';

interface QueryInterfaceProps {
  onSimulate: () => Promise<void>;
  isLoading: boolean;
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({ onSimulate, isLoading }) => {
  return (
    <StyledContainer>
      <h3>Run Simulation</h3>
      <p>Click the button below to run the simulation with your defined conscious state.</p>
      
      <button 
        onClick={onSimulate} 
        disabled={isLoading}
        className="simulate-btn"
      >
        {isLoading ? 'Simulating...' : 'Run Simulation'}
      </button>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(30, 40, 70, 0.3);
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #f0f0f0;
  }
  
  p {
    margin-bottom: 20px;
    color: #a0a0b8;
  }
  
  .simulate-btn {
    width: 100%;
    background: linear-gradient(90deg, #4e54ff, #9b7dff);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
  }
  
  .simulate-btn:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(75, 85, 255, 0.3);
  }
  
  .simulate-btn:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default QueryInterface; 