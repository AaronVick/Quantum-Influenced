import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const CalculatorContainer = styled.div`
  background-color: rgba(20, 30, 50, 0.5);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
`;

const SectionTitle = styled.h2`
  color: #64e3ff;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.6rem;
`;

const CalculatorBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const InputPanel = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 25px;
`;

const FormSection = styled.div`
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeading = styled.h3`
  color: #9b7dff;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #a0b8ff;
  font-weight: 500;
`;

const InputField = styled.input`
  background-color: rgba(20, 25, 40, 0.7);
  border: 1px solid rgba(70, 90, 120, 0.6);
  color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 6px;
  width: 100%;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #64e3ff;
  }
`;

const SelectField = styled.select`
  background-color: rgba(20, 25, 40, 0.7);
  border: 1px solid rgba(70, 90, 120, 0.6);
  color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 6px;
  width: 100%;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #64e3ff;
  }
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  color: #a0a0b8;
  margin-top: 5px;
  line-height: 1.4;
`;

const ResultsPanel = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 25px;
`;

const ResultSection = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultValue = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  
  .value {
    font-size: 2.2rem;
    font-weight: 600;
    color: #64e3ff;
    margin-right: 8px;
  }
  
  .unit {
    font-size: 1rem;
    color: #a0b8ff;
  }
`;

const ResultNote = styled.div`
  font-size: 0.9rem;
  color: #c0c0d0;
  line-height: 1.5;
  padding: 12px;
  border-left: 3px solid #64e3ff;
  background-color: rgba(20, 25, 40, 0.5);
  border-radius: 0 6px 6px 0;
  margin-top: 10px;
`;

const ComparisonTable = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #f0f0f0;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(70, 90, 120, 0.4);
  }
  
  th {
    color: #9b7dff;
    font-weight: 500;
    background-color: rgba(20, 25, 40, 0.5);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .highlight {
    color: #64e3ff;
    font-weight: 500;
  }
`;

const EquationContainer = styled.div`
  background-color: rgba(20, 25, 40, 0.7);
  border-radius: 6px;
  padding: 15px;
  margin: 20px 0;
  overflow-x: auto;
  
  .equation {
    font-family: 'Courier New', Courier, monospace;
    color: #f0f0f0;
    text-align: center;
    font-size: 1.2rem;
  }
`;

// Constants
const BOLTZMANN_CONSTANT = 1.380649e-23; // J/K
const PLANCK_CONSTANT = 6.62607015e-34; // J⋅s

// Interfaces
interface LandauerCalculatorProps {}

interface ComputationSystem {
  name: string;
  efficiency: number;
  energyPerOp: number;
  unit: string;
}

// Component
const LandauerCalculator: React.FC<LandauerCalculatorProps> = () => {
  // State variables
  const [temperature, setTemperature] = useState<number>(300); // K
  const [bitsProcessed, setBitsProcessed] = useState<number>(1);
  const [bitOperationType, setBitOperationType] = useState<string>("erasure");
  const [systemComplexity, setSystemComplexity] = useState<number>(1); // Complexity factor
  const [calculationMode, setCalculationMode] = useState<string>("classical");
  
  // Results
  const [landauerLimit, setLandauerLimit] = useState<number>(0);
  const [modifiedLimit, setModifiedLimit] = useState<number>(0);
  const [entropyChange, setEntropyChange] = useState<number>(0);
  const [timeScale, setTimeScale] = useState<number>(0);
  
  // Reference systems
  const computationSystems: ComputationSystem[] = [
    { name: "Human Brain (estimate)", efficiency: 1e-12, energyPerOp: 1e-13, unit: "J" },
    { name: "Current Classical CPU", efficiency: 1e5, energyPerOp: 1e-17, unit: "J" },
    { name: "CMOS Logic Gate (22nm)", efficiency: 1e3, energyPerOp: 1e-19, unit: "J" },
    { name: "Quantum Processor", efficiency: 100, energyPerOp: 1e-21, unit: "J" },
    { name: "Biological Cell Signaling", efficiency: 10, energyPerOp: 1e-20, unit: "J" },
    { name: "Theoretical Reversible", efficiency: 1.1, energyPerOp: 1.1 * calculateBasicLandauerLimit(300), unit: "J" }
  ];
  
  // Calculate the basic Landauer limit for a given temperature
  function calculateBasicLandauerLimit(temp: number): number {
    return BOLTZMANN_CONSTANT * temp * Math.log(2);
  }
  
  // Calculate quantum-limited time scale using Heisenberg uncertainty principle
  function calculateMinimumTimeScale(energy: number): number {
    return PLANCK_CONSTANT / (4 * Math.PI * energy); // Δt ≥ ħ/4πΔE
  }
  
  // Calculate entropy change for the operation
  function calculateEntropyChange(bits: number, temp: number, opType: string): number {
    let entropyChangeFactor = opType === "erasure" ? 1 : 
                             opType === "measurement" ? 0.5 : 
                             opType === "copy" ? 0.3 : 1;
    
    return BOLTZMANN_CONSTANT * Math.log(2) * bits * entropyChangeFactor;
  }
  
  // Calculate the modified Landauer limit based on mode and complexity
  function calculateModifiedLimit(baseLimit: number, mode: string, complexity: number): number {
    let modificationFactor = 1;
    
    // Apply quantum or consciousness-integrated modifications
    if (mode === "quantum") {
      // Quantum modifications include uncertainty relationships
      modificationFactor = 1 + (0.1 * Math.log(complexity));
    } else if (mode === "consciousness") {
      // Consciousness-integrated might allow for entropy manipulation
      modificationFactor = 1 - (0.2 * Math.log(complexity) / complexity);
      modificationFactor = Math.max(0.1, modificationFactor); // Lower bound at 10% of Landauer limit
    }
    
    return baseLimit * modificationFactor;
  }
  
  // Update calculations when inputs change
  useEffect(() => {
    // Basic Landauer limit calculation
    const basicLimit = calculateBasicLandauerLimit(temperature) * bitsProcessed;
    setLandauerLimit(basicLimit);
    
    // Calculate entropy change
    const entropy = calculateEntropyChange(bitsProcessed, temperature, bitOperationType);
    setEntropyChange(entropy);
    
    // Calculate modified limit based on calculation mode and system complexity
    const modified = calculateModifiedLimit(basicLimit, calculationMode, systemComplexity);
    setModifiedLimit(modified);
    
    // Calculate minimum time scale
    const time = calculateMinimumTimeScale(modified);
    setTimeScale(time);
  }, [temperature, bitsProcessed, bitOperationType, calculationMode, systemComplexity]);
  
  // Format scientific notation
  const formatScientific = (value: number): string => {
    return value.toExponential(4).replace("e", " × 10^");
  };
  
  // Format efficiency ratio
  const formatEfficiency = (landauer: number, actual: number): string => {
    return (actual / landauer).toExponential(2).replace("e+", " × 10^");
  };
  
  return (
    <CalculatorContainer>
      <SectionTitle>Landauer Energy Limit Calculator</SectionTitle>
      
      <CalculatorBody>
        <InputPanel>
          <FormSection>
            <SectionHeading>Operation Parameters</SectionHeading>
            
            <InputGroup>
              <InputLabel>Operation Type:</InputLabel>
              <SelectField 
                value={bitOperationType}
                onChange={(e) => setBitOperationType(e.target.value)}
              >
                <option value="erasure">Bit Erasure</option>
                <option value="measurement">Quantum Measurement</option>
                <option value="copy">Information Copy</option>
                <option value="manipulation">Quantum State Manipulation</option>
              </SelectField>
              <InfoText>
                Different bit operations have different minimum energy requirements. 
                Erasure typically requires the full Landauer limit.
              </InfoText>
            </InputGroup>
            
            <InputGroup>
              <InputLabel>Bits Processed:</InputLabel>
              <InputField 
                type="number" 
                value={bitsProcessed}
                onChange={(e) => setBitsProcessed(Math.max(1, Number(e.target.value)))}
                min="1"
                step="1"
              />
              <InfoText>
                Number of bits being processed in a single operation. 
                For quantum systems, this can represent qubits.
              </InfoText>
            </InputGroup>
          </FormSection>
          
          <FormSection>
            <SectionHeading>System Parameters</SectionHeading>
            
            <InputGroup>
              <InputLabel>Temperature (K):</InputLabel>
              <InputField 
                type="number" 
                value={temperature}
                onChange={(e) => setTemperature(Math.max(0.1, Number(e.target.value)))}
                min="0.1"
                step="0.1"
              />
              <InfoText>
                Operating temperature in Kelvin. Room temperature is approximately 300K.
                Quantum computers typically operate at near-absolute zero temperatures.
              </InfoText>
            </InputGroup>
            
            <InputGroup>
              <InputLabel>System Complexity Level:</InputLabel>
              <InputField 
                type="number" 
                value={systemComplexity}
                onChange={(e) => setSystemComplexity(Math.max(1, Number(e.target.value)))}
                min="1"
                max="100"
                step="1"
              />
              <InfoText>
                Higher complexity can affect the energy requirements in non-linear ways,
                especially for consciousness-integrated systems.
              </InfoText>
            </InputGroup>
            
            <InputGroup>
              <InputLabel>Calculation Mode:</InputLabel>
              <SelectField 
                value={calculationMode}
                onChange={(e) => setCalculationMode(e.target.value)}
              >
                <option value="classical">Classical Limit</option>
                <option value="quantum">Quantum-Limited</option>
                <option value="consciousness">Consciousness-Integrated</option>
              </SelectField>
              <InfoText>
                Different theoretical frameworks provide different perspectives on the 
                minimum energy requirements for information processing.
              </InfoText>
            </InputGroup>
          </FormSection>
        </InputPanel>
        
        <ResultsPanel>
          <ResultSection>
            <SectionHeading>Theoretical Energy Limits</SectionHeading>
            
            <EquationContainer>
              <div className="equation">
                {calculationMode === "classical" ? (
                  "E ≥ kT ln(2) × bits"
                ) : calculationMode === "quantum" ? (
                  "E ≥ kT ln(2) × bits × [1 + 0.1ln(C)]"
                ) : (
                  "E ≥ kT ln(2) × bits × [1 - 0.2ln(C)/C]"
                )}
              </div>
            </EquationContainer>
            
            <ResultValue>
              <div className="value">{formatScientific(landauerLimit)}</div>
              <div className="unit">J</div>
            </ResultValue>
            <InfoText>
              Standard Landauer limit at {temperature}K for {bitsProcessed} bit(s)
            </InfoText>
            
            {calculationMode !== "classical" && (
              <>
                <ResultValue>
                  <div className="value">{formatScientific(modifiedLimit)}</div>
                  <div className="unit">J</div>
                </ResultValue>
                <InfoText>
                  {calculationMode === "quantum" ? "Quantum-adjusted" : "Consciousness-adjusted"} Landauer limit
                </InfoText>
              </>
            )}
            
            <ResultNote>
              {calculationMode === "classical" ? (
                "The Landauer principle establishes the minimum energy required to erase information, setting a fundamental limit on computation efficiency."
              ) : calculationMode === "quantum" ? (
                "Quantum effects can modify the Landauer limit, introducing additional energy requirements due to uncertainty relationships and measurement backaction."
              ) : (
                "Consciousness-integrated computing models suggest potential reductions in energy requirements through entropy manipulation, though this remains theoretical."
              )}
            </ResultNote>
          </ResultSection>
          
          <ResultSection>
            <SectionHeading>Additional Metrics</SectionHeading>
            
            <ResultValue>
              <div className="value">{formatScientific(entropyChange)}</div>
              <div className="unit">J/K</div>
            </ResultValue>
            <InfoText>
              Entropy change for the {bitOperationType} operation
            </InfoText>
            
            <ResultValue>
              <div className="value">{formatScientific(timeScale)}</div>
              <div className="unit">s</div>
            </ResultValue>
            <InfoText>
              Theoretical minimum operation time (Heisenberg limit)
            </InfoText>
          </ResultSection>
          
          <ResultSection>
            <SectionHeading>Comparison with Existing Systems</SectionHeading>
            
            <ComparisonTable>
              <Table>
                <thead>
                  <tr>
                    <th>System</th>
                    <th>Energy Per Operation</th>
                    <th>Ratio to Landauer</th>
                  </tr>
                </thead>
                <tbody>
                  {computationSystems.map((system, index) => (
                    <tr key={index}>
                      <td>{system.name}</td>
                      <td>{formatScientific(system.energyPerOp)} {system.unit}</td>
                      <td className={system.name === "Theoretical Reversible" ? "highlight" : ""}>
                        {formatEfficiency(modifiedLimit, system.energyPerOp)}×
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="highlight">Your Calculation</td>
                    <td className="highlight">{formatScientific(modifiedLimit)} J</td>
                    <td className="highlight">1×</td>
                  </tr>
                </tbody>
              </Table>
            </ComparisonTable>
          </ResultSection>
        </ResultsPanel>
      </CalculatorBody>
    </CalculatorContainer>
  );
};

export default LandauerCalculator; 