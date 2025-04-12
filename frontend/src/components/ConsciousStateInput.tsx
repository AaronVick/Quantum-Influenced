import React, { useState } from 'react';
import styled from 'styled-components';

// Tooltip component for providing scientific context
const InfoTooltip = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 8px;
  cursor: help;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: rgba(100, 150, 255, 0.3);
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  .tooltip-content {
    visibility: hidden;
    width: 280px;
    background-color: #0c2544;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -140px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 14px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(120, 170, 255, 0.3);
  }

  &:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
  }
`;

interface ConsciousStateInputProps {
  dimensions: number;
  consciousState: number[];
  onDimensionChange: (dim: number) => void;
  onStateChange: (index: number, value: number) => void;
}

const ConsciousStateInput: React.FC<ConsciousStateInputProps> = ({ 
  dimensions,
  consciousState, 
  onDimensionChange,
  onStateChange
}) => {
  const [threshold, setThreshold] = useState(0.1);
  const [showHelp, setShowHelp] = useState(false);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDimension = parseInt(e.target.value, 10);
    onDimensionChange(newDimension);
  };

  const handleVectorChange = (index: number, value: number) => {
    onStateChange(index, value);
  };

  const handleRandomize = () => {
    const randomVectors = Array(dimensions).fill(0).map(() => Math.random() * 2 - 1);
    for (let i = 0; i < randomVectors.length; i++) {
      onStateChange(i, randomVectors[i]);
    }
  };

  // Preset patterns based on theoretical states
  const applyCoherentState = () => {
    // Create a coherent pattern with phase alignment
    const coherentValues = Array(dimensions).fill(0).map((_, i) => 
      Math.cos(2 * Math.PI * i / dimensions) * 0.5
    );
    for (let i = 0; i < coherentValues.length; i++) {
      onStateChange(i, coherentValues[i]);
    }
  };

  const applyEntangledState = () => {
    // Create an entangled-like pattern (simplified for demonstration)
    const baseValue = 1.0 / Math.sqrt(dimensions);
    const entangledValues = Array(dimensions).fill(baseValue);
    for (let i = 0; i < entangledValues.length; i++) {
      onStateChange(i, i % 2 === 0 ? baseValue : -baseValue);
    }
  };

  return (
    <StyledContainer>
      <div className="header-row">
        <h2>Conscious State Parameters</h2>
        <InfoButton onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? 'Hide Help' : 'Show Help'}
        </InfoButton>
      </div>

      {showHelp && (
        <HelpPanel>
          <h3>Understanding Conscious State Vectors</h3>
          <p>
            This panel allows you to define the parameters of a hypothetical conscious state 
            represented as a vector in Hilbert space. Based on the theoretical framework, each 
            component represents an eigenstate of the consciousness operator.
          </p>
          <ul>
            <li><strong>Dimension:</strong> The Hilbert space dimension, related to degrees of freedom in neural systems.</li>
            <li><strong>Error Threshold (η):</strong> Maximum acceptable error for reconstruction of the conscious state.</li>
            <li><strong>Vector Components:</strong> Specific values between -1 and 1 representing the quantum amplitude.</li>
          </ul>
          <p>
            The simulation will test whether the consciousness-quantum coupling follows the prediction: 
            P<sub>C</sub>(i) = |α<sub>i</sub>|<sup>2</sup> + δ<sub>C</sub>(i)
          </p>
        </HelpPanel>
      )}

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="dimension">
            Dimension:
            <InfoTooltip>
              <span className="icon">i</span>
              <span className="tooltip-content">
                Represents the size of the Hilbert space needed to describe the conscious state.
                Higher dimensions can capture more complex states but require more computational resources.
                Typical values range from 2-50.
              </span>
            </InfoTooltip>
          </label>
          <input
            type="number"
            id="dimension"
            min="2"
            max="50"
            value={dimensions}
            onChange={handleDimensionChange}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="threshold">
            Error Threshold (η):
            <InfoTooltip>
              <span className="icon">i</span>
              <span className="tooltip-content">
                Defines the maximum acceptable error when reconstructing the conscious state
                from quantum measurement statistics. Lower values enforce stricter criteria.
                Based on our theoretical framework, η should be in range 0.01-0.5.
              </span>
            </InfoTooltip>
          </label>
          <input
            type="number"
            id="threshold"
            min="0.01"
            max="0.5"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="vector-inputs">
        <div className="vector-header">
          <h3>Vector Components</h3>
          <div className="preset-buttons">
            <button className="preset-btn" onClick={handleRandomize}>
              Random State
            </button>
            <button className="preset-btn" onClick={applyCoherentState}>
              Coherent State
              <InfoTooltip>
                <span className="icon">i</span>
                <span className="tooltip-content">
                  Applies a wave-like pattern with phase coherence, similar to neural oscillations
                  observed during focused attention or meditation.
                </span>
              </InfoTooltip>
            </button>
            <button className="preset-btn" onClick={applyEntangledState}>
              Entangled State
              <InfoTooltip>
                <span className="icon">i</span>
                <span className="tooltip-content">
                  Creates a pattern resembling quantum entanglement with balanced positive and
                  negative components, potentially analogous to integrated information in
                  consciousness.
                </span>
              </InfoTooltip>
            </button>
          </div>
        </div>

        <div className="vector-container">
          {consciousState.map((value, index) => (
            <div key={index} className="vector-input">
              <label htmlFor={`vector-${index}`}>C<sub>{index}</sub>:</label>
              <input
                type="number"
                id={`vector-${index}`}
                value={value}
                min="-1"
                max="1"
                step="0.1"
                onChange={(e) => handleVectorChange(index, parseFloat(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    </StyledContainer>
  );
};

const HelpPanel = styled.div`
  background-color: rgba(40, 50, 80, 0.3);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #4a90e2;
  
  h3 {
    margin-top: 0;
    color: #4a90e2;
    font-size: 16px;
  }
  
  p, ul {
    font-size: 14px;
    line-height: 1.5;
    color: #e0e0e0;
  }
  
  ul {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

const InfoButton = styled.button`
  background-color: rgba(80, 120, 255, 0.2);
  color: #90b0ff;
  border: 1px solid rgba(80, 120, 255, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(80, 120, 255, 0.3);
  }
`;

const StyledContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(30, 40, 70, 0.3);
  border-radius: 8px;
  
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h2 {
      margin: 0;
      color: #f0f0f0;
      font-size: 18px;
    }
  }
  
  .input-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #f0f0f0;
    display: flex;
    align-items: center;
  }
  
  .input-group input {
    padding: 8px;
    border: 1px solid #2a2a3a;
    border-radius: 4px;
    background-color: rgba(20, 25, 40, 0.5);
    color: #f0f0f0;
  }
  
  .vector-inputs {
    margin-bottom: 20px;
  }
  
  .vector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h3 {
      margin: 0;
      color: #f0f0f0;
    }
    
    .preset-buttons {
      display: flex;
      gap: 10px;
    }
  }
  
  .preset-btn, .randomize-btn {
    background-color: rgba(80, 120, 200, 0.3);
    color: #e0e0ff;
    border: 1px solid rgba(80, 120, 200, 0.5);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
  }
  
  .preset-btn:hover, .randomize-btn:hover {
    background-color: rgba(80, 120, 200, 0.5);
  }
  
  .vector-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
  
  .vector-input {
    display: flex;
    flex-direction: column;
  }
  
  .vector-input label {
    margin-bottom: 5px;
    color: #a0b8ff;
  }
  
  .vector-input input {
    padding: 8px;
    border: 1px solid #2a2a3a;
    border-radius: 4px;
    background-color: rgba(20, 25, 40, 0.5);
    color: #f0f0f0;
  }
`;

export default ConsciousStateInput; 