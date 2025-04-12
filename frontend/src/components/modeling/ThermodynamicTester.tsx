import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const TesterContainer = styled.div`
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

const ControlsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ControlPanel = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 20px;
`;

const PanelTitle = styled.h3`
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

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(70, 90, 120, 0.4);
  outline: none;
  margin: 10px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #64e3ff;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #64e3ff;
    cursor: pointer;
  }
`;

const SliderValue = styled.div`
  text-align: center;
  color: #a0b8ff;
  font-size: 14px;
  margin-top: 5px;
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

const RunButton = styled.button`
  background: linear-gradient(90deg, #4e54ff, #9b7dff);
  color: white;
  border: none;
  padding: 12px 25px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(75, 85, 255, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: linear-gradient(90deg, #3a3a5a, #5a5a7a);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
`;

const ResultTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(70, 90, 120, 0.4);
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#64e3ff' : '#a0b8ff'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? '#64e3ff' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.active ? '#64e3ff' : '#c0d0ff'};
  }
`;

const TabContent = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled.div<{ status?: string }>`
  background-color: rgba(20, 25, 40, 0.7);
  border-radius: 6px;
  padding: 15px;
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'pass': return '#64FFB4';
      case 'warn': return '#FFD164';
      case 'fail': return '#FF6464';
      default: return 'transparent';
    }
  }};
  
  h4 {
    color: #64e3ff;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => {
      switch(props.status) {
        case 'pass': return '#64FFB4';
        case 'warn': return '#FFD164';
        case 'fail': return '#FF6464';
        default: return '#fff';
      }
    }};
    margin-bottom: 5px;
  }
  
  .unit {
    color: #a0a0b8;
    font-size: 0.9rem;
  }
  
  .description {
    margin-top: 10px;
    color: #c0c0d0;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const Chart = styled.div`
  background-color: rgba(20, 25, 40, 0.7);
  border-radius: 6px;
  padding: 15px;
  height: 300px;
  position: relative;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .placeholder {
    color: #a0a0b8;
    font-style: italic;
  }
`;

const LawsSection = styled.div`
  margin-top: 30px;
`;

const LawCard = styled.div<{ status?: string }>`
  background-color: rgba(20, 25, 40, 0.7);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'pass': return '#64FFB4';
      case 'warn': return '#FFD164';
      case 'fail': return '#FF6464';
      default: return 'transparent';
    }
  }};
  
  h3 {
    color: #64e3ff;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    
    .status-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: ${props => {
        switch(props.status) {
          case 'pass': return '#64FFB4';
          case 'warn': return '#FFD164';
          case 'fail': return '#FF6464';
          default: return '#a0a0b8';
        }
      }};
    }
  }
  
  .description {
    color: #c0c0d0;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  .metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 15px;
  }
  
  .metric-pill {
    background-color: rgba(50, 60, 90, 0.5);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
    color: #a0b8ff;
    
    strong {
      color: #f0f0f0;
      font-weight: 500;
    }
  }
`;

// Define interfaces
interface ThermodynamicTesterProps {}

interface TestResult {
  name: string;
  value: number;
  unit: string;
  status: 'pass' | 'warn' | 'fail';
  description: string;
}

interface LawResult {
  name: string;
  description: string;
  status: 'pass' | 'warn' | 'fail';
  metrics: {
    name: string;
    value: number;
    unit: string;
  }[];
}

// Component definition
const ThermodynamicTester: React.FC<ThermodynamicTesterProps> = () => {
  // State for test parameters
  const [systemType, setSystemType] = useState<string>('neural');
  const [temperature, setTemperature] = useState<number>(310); // ~37°C in Kelvin
  const [entropy, setEntropy] = useState<number>(0.5);
  const [complexity, setComplexity] = useState<number>(7);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // State for results
  const [results, setResults] = useState<{
    metrics: TestResult[];
    laws: LawResult[];
  } | null>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'metrics' | 'laws'>('metrics');
  
  // Function to run the thermodynamic tests
  const runTests = () => {
    setIsRunning(true);
    
    // Simulate processing
    setTimeout(() => {
      const testResults = simulateThermodynamicTests(
        systemType,
        temperature,
        entropy,
        complexity
      );
      
      setResults(testResults);
      setIsRunning(false);
    }, 2000);
  };
  
  // Function to simulate thermodynamic test results
  const simulateThermodynamicTests = (
    type: string,
    temp: number,
    entropyValue: number,
    complexityLevel: number
  ) => {
    // Calculate base energy based on system type and complexity
    const baseEnergy = type === 'neural' 
      ? 0.5 + complexityLevel * 0.2 
      : 0.3 + complexityLevel * 0.15;
    
    // Calculate entropy production rate based on parameters
    const entropyProduction = entropyValue * (temp / 300) * 0.01 * complexityLevel;
    
    // Calculate information content (in bits)
    const informationBits = complexityLevel * 100 * Math.log2(complexityLevel + 1);
    
    // Calculate Landauer limit (kT ln 2 per bit)
    const landauerLimit = 1.38e-23 * temp * Math.log(2) * informationBits;
    
    // Calculate energy efficiency ratio
    const efficiencyRatio = landauerLimit / (baseEnergy * 1e-12);
    
    // Calculate energy conservation (should be near 1.0 for perfect conservation)
    const energyConservation = 1.0 - Math.random() * 0.05 * (1.0 - entropyValue);
    
    // Calculate gibbs free energy change (negative for spontaneous processes)
    const gibbsFreeEnergy = -temp * entropyProduction + baseEnergy * 0.1;
    
    // Calculate whether system is reversible
    const reversibility = Math.max(0, 1.0 - entropyProduction * 2);
    
    // Calculate time-symmetry breaking
    const timeSymmetry = Math.max(0, 1.0 - entropyProduction * 1.5);
    
    // Generate metrics results
    const metrics: TestResult[] = [
      {
        name: 'Energy Conservation',
        value: energyConservation,
        unit: 'ratio',
        status: energyConservation > 0.95 ? 'pass' : energyConservation > 0.9 ? 'warn' : 'fail',
        description: 'Measures whether energy is conserved across all system transformations.'
      },
      {
        name: 'Entropy Production',
        value: entropyProduction,
        unit: 'J/K·s',
        status: entropyProduction < 0.1 ? 'pass' : entropyProduction < 0.2 ? 'warn' : 'fail',
        description: 'Rate of entropy increase during system operation.'
      },
      {
        name: 'Gibbs Free Energy',
        value: gibbsFreeEnergy,
        unit: 'kJ/mol',
        status: gibbsFreeEnergy < 0 ? 'pass' : 'warn',
        description: 'Free energy change determines whether process is spontaneous.'
      },
      {
        name: 'Reversibility Factor',
        value: reversibility,
        unit: 'ratio',
        status: reversibility > 0.7 ? 'pass' : reversibility > 0.3 ? 'warn' : 'fail',
        description: 'Degree to which processes in the system can be reversed.'
      },
      {
        name: 'Landauer Efficiency',
        value: efficiencyRatio,
        unit: 'ratio',
        status: efficiencyRatio < 1.1 ? 'pass' : efficiencyRatio < 1.5 ? 'warn' : 'fail',
        description: 'Ratio of actual energy use to theoretical minimum (Landauer limit).'
      },
      {
        name: 'Time-Symmetry',
        value: timeSymmetry,
        unit: 'ratio',
        status: timeSymmetry > 0.5 ? 'pass' : timeSymmetry > 0.2 ? 'warn' : 'fail',
        description: 'Degree to which process appears the same forward and backward in time.'
      }
    ];
    
    // Generate law results
    const laws: LawResult[] = [
      {
        name: 'First Law of Thermodynamics',
        description: 'Energy can neither be created nor destroyed, only transformed. The total energy of the system and its surroundings must remain constant.',
        status: energyConservation > 0.95 ? 'pass' : energyConservation > 0.9 ? 'warn' : 'fail',
        metrics: [
          {
            name: 'Energy Conservation',
            value: energyConservation,
            unit: 'ratio'
          },
          {
            name: 'Input/Output Balance',
            value: 1.0 - Math.abs(1.0 - energyConservation),
            unit: 'ratio'
          }
        ]
      },
      {
        name: 'Second Law of Thermodynamics',
        description: 'The total entropy of an isolated system always increases over time or remains constant in ideal cases. Processes proceed in the direction of increasing entropy.',
        status: entropyProduction >= 0 ? 'pass' : 'fail',
        metrics: [
          {
            name: 'Entropy Production',
            value: entropyProduction,
            unit: 'J/K·s'
          },
          {
            name: 'Spontaneity',
            value: gibbsFreeEnergy < 0 ? 1 : 0,
            unit: 'boolean'
          }
        ]
      },
      {
        name: 'Landauer Principle',
        description: 'There is a minimum amount of energy required to erase one bit of information, equal to kT ln(2), where k is Boltzmann\'s constant and T is temperature.',
        status: efficiencyRatio < 1.1 ? 'pass' : efficiencyRatio < 1.5 ? 'warn' : 'fail',
        metrics: [
          {
            name: 'Landauer Limit',
            value: landauerLimit * 1e23,
            unit: '×10^-23 J/bit'
          },
          {
            name: 'Efficiency Ratio',
            value: efficiencyRatio,
            unit: 'ratio'
          }
        ]
      },
      {
        name: 'Fluctuation Theorem',
        description: 'For small systems observed for short times, the second law can appear to be violated, but the probability of entropy-reducing events is exponentially lower than entropy-increasing events.',
        status: reversibility > 0 ? 'pass' : 'fail',
        metrics: [
          {
            name: 'Reversibility',
            value: reversibility,
            unit: 'ratio'
          },
          {
            name: 'Time-Symmetry',
            value: timeSymmetry,
            unit: 'ratio'
          }
        ]
      }
    ];
    
    return { metrics, laws };
  };
  
  return (
    <TesterContainer>
      <SectionTitle>Thermodynamic Consistency Tester</SectionTitle>
      
      <ControlsWrapper>
        <ControlPanel>
          <PanelTitle>System Parameters</PanelTitle>
          
          <InputGroup>
            <InputLabel>System Type:</InputLabel>
            <SelectField 
              value={systemType}
              onChange={(e) => setSystemType(e.target.value)}
              disabled={isRunning}
            >
              <option value="neural">Neural ΨC System</option>
              <option value="quantum">Quantum ΨC System</option>
              <option value="hybrid">Hybrid System</option>
            </SelectField>
          </InputGroup>
          
          <InputGroup>
            <InputLabel>System Temperature (K):</InputLabel>
            <InputField 
              type="number" 
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              min="0"
              max="500"
              step="1"
              disabled={isRunning}
            />
            <SliderValue>{temperature}K (~{(temperature - 273.15).toFixed(1)}°C)</SliderValue>
          </InputGroup>
        </ControlPanel>
        
        <ControlPanel>
          <PanelTitle>Consciousness Parameters</PanelTitle>
          
          <InputGroup>
            <InputLabel>Entropy Reduction Factor (0-1):</InputLabel>
            <Slider 
              type="range" 
              min="0"
              max="1"
              step="0.01"
              value={entropy}
              onChange={(e) => setEntropy(Number(e.target.value))}
              disabled={isRunning}
            />
            <SliderValue>{entropy.toFixed(2)}</SliderValue>
          </InputGroup>
          
          <InputGroup>
            <InputLabel>System Complexity Level (1-10):</InputLabel>
            <Slider 
              type="range" 
              min="1"
              max="10"
              step="0.1"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              disabled={isRunning}
            />
            <SliderValue>{complexity.toFixed(1)}</SliderValue>
          </InputGroup>
          
          <RunButton 
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run Thermodynamic Tests'}
          </RunButton>
        </ControlPanel>
      </ControlsWrapper>
      
      {results && (
        <ResultsContainer>
          <ResultTabs>
            <Tab 
              active={activeTab === 'metrics'} 
              onClick={() => setActiveTab('metrics')}
            >
              Thermodynamic Metrics
            </Tab>
            <Tab 
              active={activeTab === 'laws'} 
              onClick={() => setActiveTab('laws')}
            >
              Physical Laws
            </Tab>
          </ResultTabs>
          
          <TabContent>
            {activeTab === 'metrics' && (
              <>
                <MetricsGrid>
                  {results.metrics.map((metric, index) => (
                    <MetricCard key={index} status={metric.status}>
                      <h4>{metric.name}</h4>
                      <div className="value">
                        {metric.value.toFixed(
                          metric.unit === 'ratio' ? 3 : 
                          metric.unit === 'boolean' ? 0 : 2
                        )}
                      </div>
                      <div className="unit">{metric.unit}</div>
                      <div className="description">{metric.description}</div>
                    </MetricCard>
                  ))}
                </MetricsGrid>
                
                <Chart>
                  <div className="placeholder">
                    Interactive chart visualization would appear here
                  </div>
                </Chart>
              </>
            )}
            
            {activeTab === 'laws' && (
              <LawsSection>
                {results.laws.map((law, index) => (
                  <LawCard key={index} status={law.status}>
                    <h3>
                      <span className="status-dot"></span>
                      {law.name}
                    </h3>
                    <div className="description">{law.description}</div>
                    <div className="metrics">
                      {law.metrics.map((metric, i) => (
                        <div key={i} className="metric-pill">
                          {metric.name}: <strong>
                            {metric.unit === 'boolean' 
                              ? (metric.value === 1 ? 'Yes' : 'No')
                              : metric.value.toFixed(
                                  metric.unit === 'ratio' ? 3 : 2
                                )
                            } {metric.unit !== 'boolean' && metric.unit}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </LawCard>
                ))}
              </LawsSection>
            )}
          </TabContent>
        </ResultsContainer>
      )}
    </TesterContainer>
  );
};

export default ThermodynamicTester; 