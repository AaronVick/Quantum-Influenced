import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const SimulatorContainer = styled.div`
  background-color: #121212;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SimulatorHeader = styled.div`
  margin-bottom: 20px;
  
  h2 {
    color: #bb86fc;
    margin-bottom: 10px;
  }
  
  p {
    color: #b0b0b0;
    font-size: 14px;
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    background-color: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    color: #e0e0e0;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #bb86fc;
    }
  }
`;

const SimulateButton = styled.button`
  background-color: #bb86fc;
  color: #121212;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #a370f7;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
  
  h3 {
    color: #bb86fc;
    margin-bottom: 15px;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ResultsCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
  
  h4 {
    color: #03dac6;
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  p {
    margin: 5px 0;
    font-size: 14px;
  }
  
  .highlight {
    color: #bb86fc;
    font-weight: 500;
  }
`;

const VisualizationContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  
  canvas {
    width: 100%;
    height: 300px;
    background-color: #1e1e1e;
    border-radius: 8px;
  }
`;

const HelpText = styled.p`
  font-size: 13px;
  color: #999;
  margin-top: 5px;
  font-style: italic;
`;

const IntroPanel = styled.div`
  background-color: rgba(187, 134, 252, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 3px solid #bb86fc;
  
  h3 {
    color: #bb86fc;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  p {
    margin: 0 0 10px;
    line-height: 1.4;
  }
  
  .highlight {
    color: #03dac6;
    font-weight: 500;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 5px;
  cursor: help;
  
  .tooltip-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgba(187, 134, 252, 0.3);
    color: #e0e0e0;
    font-size: 12px;
    font-weight: bold;
  }
  
  .tooltip-content {
    visibility: hidden;
    width: 240px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    text-align: left;
    border-radius: 6px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -120px;
    opacity: 0;
    transition: opacity 0.3s;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    font-size: 12px;
    line-height: 1.4;
  }
  
  &:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = ({ content }: { content: string }) => (
  <TooltipContainer>
    <span className="tooltip-icon">?</span>
    <div className="tooltip-content">{content}</div>
  </TooltipContainer>
);

const SettingsSuggestion = styled.div`
  background-color: rgba(3, 218, 198, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 10px;
  font-size: 13px;
  border-left: 2px solid #03dac6;
  
  strong {
    color: #03dac6;
  }
`;

interface QRNGSimulationParams {
  qrngType: string;
  sampleSize: number;
  consciousnessIntensity: number;
  interactionModel: string;
  entropySource: string;
  measurementBasis: string;
}

interface QRNGInteractionSimulatorProps {
  // Add any props if needed
}

const QRNGInteractionSimulator: React.FC<QRNGInteractionSimulatorProps> = () => {
  const [params, setParams] = useState<QRNGSimulationParams>({
    qrngType: 'photonic',
    sampleSize: 1000,
    consciousnessIntensity: 0.5,
    interactionModel: 'direct',
    entropySource: 'quantum_vacuum',
    measurementBasis: 'standard'
  });
  
  const [results, setResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'sampleSize' || name === 'consciousnessIntensity' 
        ? parseFloat(value) 
        : value
    }));
  };
  
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulated backend call
    setTimeout(() => {
      const baselineBias = Math.random() * 0.01 - 0.005; // Small random baseline bias
      const consciousDeviation = params.consciousnessIntensity * 0.03; // Consciousness effect
      
      // Generate simulated results
      const simulatedResults = {
        baselineDistribution: {
          mean: 0.5 + baselineBias,
          standardDeviation: 0.02 + Math.random() * 0.01,
          totalSamples: params.sampleSize
        },
        consciousnessModifiedDistribution: {
          mean: 0.5 + baselineBias + consciousDeviation,
          standardDeviation: 0.02 + Math.random() * 0.01 - params.consciousnessIntensity * 0.005,
          totalSamples: params.sampleSize
        },
        statisticalTests: {
          chiSquare: {
            value: 3.5 + params.consciousnessIntensity * 5,
            pValue: Math.max(0.001, 0.05 - params.consciousnessIntensity * 0.04),
            significant: params.consciousnessIntensity > 0.4
          },
          ksTest: {
            value: 0.02 + params.consciousnessIntensity * 0.03,
            pValue: Math.max(0.001, 0.05 - params.consciousnessIntensity * 0.03),
            significant: params.consciousnessIntensity > 0.5
          }
        },
        entropyAnalysis: {
          shannonEntropy: 0.99 - params.consciousnessIntensity * 0.02,
          minEntropy: 0.97 - params.consciousnessIntensity * 0.03,
          entropyReduction: params.consciousnessIntensity * 2 + '%'
        },
        quantumCoherence: {
          beforeInteraction: 0.95,
          afterInteraction: 0.95 - params.consciousnessIntensity * 0.1,
          coherenceChange: (params.consciousnessIntensity * 0.1 * 100).toFixed(2) + '%'
        }
      };
      
      setResults(simulatedResults);
      setIsSimulating(false);
      
      // Draw visualization when results are ready
      if (canvasRef) {
        drawDistributionVisualization(canvasRef, simulatedResults);
      }
    }, 1500);
  };
  
  const drawDistributionVisualization = (canvas: HTMLCanvasElement, data: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Draw background
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding); // x-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding); // y-axis
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '12px Arial';
    ctx.fillText('Bit Value Distribution', width / 2 - 60, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frequency', 0, 0);
    ctx.restore();
    
    // Draw baseline distribution
    const drawDistribution = (mean: number, stdDev: number, color: string) => {
      const pointCount = 100;
      const plotWidth = width - 2 * padding;
      const plotHeight = height - 2 * padding;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i <= pointCount; i++) {
        const x = i / pointCount;
        const xPos = padding + x * plotWidth;
        
        // Normal distribution function
        const normalY = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / 
                       (stdDev * Math.sqrt(2 * Math.PI));
        const yPos = height - padding - normalY * plotHeight * 0.3;
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      
      ctx.stroke();
    };
    
    // Draw distributions
    drawDistribution(0.5, 0.08, '#03dac6'); // Baseline
    drawDistribution(
      0.5 + data.consciousnessModifiedDistribution.mean - data.baselineDistribution.mean, 
      0.08 - 0.01 * params.consciousnessIntensity, 
      '#bb86fc'
    ); // Consciousness modified
    
    // Legend
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText('Baseline', width - 100, padding + 15);
    ctx.fillText('Consciousness Modified', width - 170, padding + 35);
    
    ctx.strokeStyle = '#03dac6';
    ctx.beginPath();
    ctx.moveTo(width - 110, padding + 15);
    ctx.lineTo(width - 120, padding + 15);
    ctx.stroke();
    
    ctx.strokeStyle = '#bb86fc';
    ctx.beginPath();
    ctx.moveTo(width - 180, padding + 35);
    ctx.lineTo(width - 190, padding + 35);
    ctx.stroke();
  };
  
  // Handle canvas reference
  useEffect(() => {
    if (results && canvasRef) {
      drawDistributionVisualization(canvasRef, results);
    }
  }, [canvasRef, results]);
  
  return (
    <SimulatorContainer>
      <SimulatorHeader>
        <h2>ΨC Systems + QRNG Interactions Simulator</h2>
        <p>Model how consciousness might interact with quantum random number generators</p>
      </SimulatorHeader>
      
      <IntroPanel>
        <h3>What is this simulator?</h3>
        <p>
          This simulator allows you to explore how consciousness might influence quantum random number generators (QRNGs). 
          QRNGs produce truly random numbers based on quantum mechanical processes like photon path detection or electron tunneling.
        </p>
        <p>
          The <span className="highlight">consciousness-quantum interaction hypothesis</span> suggests that conscious intention or observation 
          might subtly influence these quantum processes, creating slight statistical deviations from pure randomness.
        </p>
        <p>
          Use this tool to experiment with different parameters and see how they might affect quantum randomness patterns.
        </p>
      </IntroPanel>
      
      <InputGrid>
        <div>
          <InputGroup>
            <label htmlFor="qrngType">
              QRNG Type
              <Tooltip content="The physical mechanism used to generate quantum randomness. Photonic systems use light particles (photons) and beam splitters, electronic systems use quantum tunneling effects, and superconducting systems use magnetic flux." />
            </label>
            <select 
              id="qrngType" 
              name="qrngType" 
              value={params.qrngType} 
              onChange={handleInputChange}
            >
              <option value="photonic">Photonic (Beam Splitter)</option>
              <option value="electronic">Electronic (Tunneling)</option>
              <option value="superconducting">Superconducting (Flux)</option>
            </select>
            <HelpText>Photonic QRNGs are the most widely used in consciousness research.</HelpText>
          </InputGroup>
          
          <InputGroup>
            <label htmlFor="sampleSize">
              Sample Size
              <Tooltip content="The number of quantum measurements to take. Larger sample sizes provide more statistical confidence but take longer to run. For preliminary tests, 1,000 samples is sufficient, while serious investigations usually use 10,000+." />
            </label>
            <input 
              type="number" 
              id="sampleSize" 
              name="sampleSize" 
              min="100" 
              max="10000" 
              value={params.sampleSize} 
              onChange={handleInputChange}
            />
            <HelpText>Recommended: 1,000 for quick tests, 10,000 for more robust analysis.</HelpText>
          </InputGroup>
          
          <SettingsSuggestion>
            <strong>Suggested settings:</strong> For beginners, start with the photonic QRNG type and 1,000 samples to see basic effects quickly.
          </SettingsSuggestion>
        </div>
        
        <div>
          <InputGroup>
            <label htmlFor="consciousnessIntensity">
              Consciousness Intensity (0-1)
              <Tooltip content="Represents the theoretical 'strength' of consciousness influence on quantum processes. Higher values simulate stronger mental intention or focus. This is analogous to meditation depth or focused attention in real experiments." />
            </label>
            <input 
              type="range" 
              id="consciousnessIntensity" 
              name="consciousnessIntensity" 
              min="0" 
              max="1" 
              step="0.01" 
              value={params.consciousnessIntensity} 
              onChange={handleInputChange}
            />
            <span>{params.consciousnessIntensity.toFixed(2)}</span>
            <HelpText>0 = no influence, 0.5 = moderate influence, 1 = maximum theoretical influence</HelpText>
          </InputGroup>
          
          <InputGroup>
            <label htmlFor="interactionModel">
              Interaction Model
              <Tooltip content="The theoretical mechanism by which consciousness might affect quantum processes. Direct observation means consciousness directly observes the quantum system; intentional influence implies mental intention; field effect suggests a field-like interaction; entanglement proposes quantum entanglement between brain and QRNG." />
            </label>
            <select 
              id="interactionModel" 
              name="interactionModel" 
              value={params.interactionModel} 
              onChange={handleInputChange}
            >
              <option value="direct">Direct Observation</option>
              <option value="intentional">Intentional Influence</option>
              <option value="field">Field Effect</option>
              <option value="entanglement">Quantum Entanglement</option>
            </select>
            <HelpText>Based on different theoretical frameworks for mind-matter interaction.</HelpText>
          </InputGroup>
          
          <SettingsSuggestion>
            <strong>Suggested experiment:</strong> Try running the simulation multiple times with the same settings but varying consciousness intensity to see the difference in results.
          </SettingsSuggestion>
        </div>
        
        <div>
          <InputGroup>
            <label htmlFor="entropySource">
              Entropy Source
              <Tooltip content="The physical source of quantum randomness. Quantum vacuum refers to vacuum energy fluctuations; thermal noise uses thermal fluctuations in electronic components; radioactive decay uses the timing of radioactive particle emissions." />
            </label>
            <select 
              id="entropySource" 
              name="entropySource" 
              value={params.entropySource} 
              onChange={handleInputChange}
            >
              <option value="quantum_vacuum">Quantum Vacuum</option>
              <option value="thermal_noise">Thermal Noise</option>
              <option value="radioactive_decay">Radioactive Decay</option>
            </select>
            <HelpText>Different entropy sources may show varying susceptibility to consciousness effects.</HelpText>
          </InputGroup>
          
          <InputGroup>
            <label htmlFor="measurementBasis">
              Measurement Basis
              <Tooltip content="The quantum basis used for measurements. Standard uses conventional X/Z basis; diagonal uses superpositions of X+Z; circular uses complex superpositions (X+iZ). Different bases may reveal different aspects of consciousness-quantum interactions." />
            </label>
            <select 
              id="measurementBasis" 
              name="measurementBasis" 
              value={params.measurementBasis} 
              onChange={handleInputChange}
            >
              <option value="standard">Standard (X/Z)</option>
              <option value="diagonal">Diagonal (X+Z)</option>
              <option value="circular">Circular (X+iZ)</option>
            </select>
            <HelpText>Advanced setting: Standard basis is recommended for most users.</HelpText>
          </InputGroup>
          
          <SettingsSuggestion>
            <strong>For advanced users:</strong> Different measurement bases might show varying effects - circular basis may show stronger phase effects while standard basis reveals probability shifts.
          </SettingsSuggestion>
        </div>
      </InputGrid>
      
      <SimulateButton onClick={runSimulation} disabled={isSimulating}>
        {isSimulating ? 'Simulating...' : 'Run Simulation'}
      </SimulateButton>
      
      {results && (
        <ResultsContainer>
          <h3>Simulation Results</h3>
          <p>Analysis of the potential consciousness influence on quantum randomness:</p>
          
          <ResultsGrid>
            <ResultsCard>
              <h4>Baseline Distribution</h4>
              <p>Mean: <span className="highlight">{results.baselineDistribution.mean.toFixed(6)}</span></p>
              <p>Standard Deviation: {results.baselineDistribution.standardDeviation.toFixed(6)}</p>
              <p>Samples: {results.baselineDistribution.totalSamples}</p>
              <HelpText>Expected is 0.5 for an ideal quantum random source.</HelpText>
            </ResultsCard>
            
            <ResultsCard>
              <h4>Consciousness-Modified Distribution</h4>
              <p>Mean: <span className="highlight">{results.consciousnessModifiedDistribution.mean.toFixed(6)}</span></p>
              <p>Standard Deviation: {results.consciousnessModifiedDistribution.standardDeviation.toFixed(6)}</p>
              <p>Mean Shift: <span className="highlight">
                {((results.consciousnessModifiedDistribution.mean - results.baselineDistribution.mean) * 100).toFixed(4)}%
              </span></p>
              <HelpText>Any deviation from baseline suggests potential consciousness influence.</HelpText>
            </ResultsCard>
            
            <ResultsCard>
              <h4>Statistical Analysis</h4>
              <p>Chi-Square: {results.statisticalTests.chiSquare.value.toFixed(4)} 
                (p = {results.statisticalTests.chiSquare.pValue.toFixed(4)})
                {results.statisticalTests.chiSquare.significant ? 
                  ' - Significant' : ' - Not Significant'}
              </p>
              <p>KS Test: {results.statisticalTests.ksTest.value.toFixed(4)} 
                (p = {results.statisticalTests.ksTest.pValue.toFixed(4)})
                {results.statisticalTests.ksTest.significant ? 
                  ' - Significant' : ' - Not Significant'}
              </p>
              <HelpText>p-values below 0.05 indicate statistically significant deviations.</HelpText>
            </ResultsCard>
            
            <ResultsCard>
              <h4>Entropy Analysis</h4>
              <p>Shannon Entropy: {results.entropyAnalysis.shannonEntropy.toFixed(6)}</p>
              <p>Min-Entropy: {results.entropyAnalysis.minEntropy.toFixed(6)}</p>
              <p>Entropy Reduction: <span className="highlight">{results.entropyAnalysis.entropyReduction}</span></p>
              <HelpText>Entropy reduction suggests consciousness might be organizing quantum randomness.</HelpText>
            </ResultsCard>
          </ResultsGrid>
          
          <VisualizationContainer>
            <h3>Distribution Visualization</h3>
            <p>This graph shows how consciousness might shift quantum probability distributions:</p>
            <canvas 
              width={800} 
              height={400} 
              ref={setCanvasRef}
            />
            <HelpText>The turquoise line shows baseline quantum distribution, while the purple line shows potential consciousness-influenced distribution.</HelpText>
          </VisualizationContainer>
          
          <IntroPanel style={{ marginTop: '30px' }}>
            <h3>How to Interpret These Results</h3>
            <p>
              <strong>What to look for:</strong> Statistically significant deviations (p &lt; 0.05) from quantum randomness in the 
              consciousness-influenced condition suggest potential mind-matter interaction effects.
            </p>
            <p>
              <strong>Real-world context:</strong> Actual laboratory QRNG experiments typically show much smaller effects 
              (around 0.001-0.01% deviation) than this simulator may display. The simulator allows you to explore 
              the theoretical relationships between parameters and potential effects.
            </p>
            <p>
              <strong>Scientific caution:</strong> Remember that correlation does not imply causation. Real experiments 
              would need rigorous controls and repeated trials to make substantiated claims about consciousness-quantum interactions.
            </p>
          </IntroPanel>
        </ResultsContainer>
      )}
    </SimulatorContainer>
  );
};

export default QRNGInteractionSimulator; 