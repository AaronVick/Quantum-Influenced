import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Styled components
const SimulatorContainer = styled.div`
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

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ControlGroup = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 20px;
`;

const ControlTitle = styled.h3`
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

const VisualizationArea = styled.div`
  margin-top: 30px;
  background-color: rgba(10, 15, 25, 0.8);
  border-radius: 8px;
  padding: 20px;
  position: relative;
  height: 400px;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ResultsPanel = styled.div`
  margin-top: 30px;
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 20px;
`;

const ResultTitle = styled.h3`
  color: #90b0ff;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
  padding-bottom: 10px;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ResultCard = styled.div`
  background-color: rgba(20, 25, 40, 0.7);
  border-radius: 6px;
  padding: 15px;
  
  h4 {
    color: #64e3ff;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 5px;
  }
  
  .unit {
    color: #a0a0b8;
    font-size: 0.9rem;
  }
  
  .highlight {
    color: ${props => props.color || '#64e3ff'};
    font-weight: 500;
  }
`;

const StatsTable = styled.div`
  margin-top: 15px;
  width: 100%;
  
  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(70, 90, 120, 0.2);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .label {
    color: #a0a0b8;
  }
  
  .value {
    color: #f0f0f0;
    font-weight: 500;
  }
`;

// Define interface for the component
interface QrngSimulatorProps {}

// Define the component
const QrngSimulator: React.FC<QrngSimulatorProps> = () => {
  // State for simulation parameters
  const [qrngType, setQrngType] = useState<string>('photon');
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [intentFactor, setIntentFactor] = useState<number>(0.2);
  const [coherenceFactor, setCoherenceFactor] = useState<number>(0.5);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  
  // Canvas ref for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for animation
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  
  // Function to run the simulation
  const runSimulation = () => {
    setIsRunning(true);
    
    // Reset any previous results
    setResults(null);
    
    // Start visualization
    startVisualization();
    
    // Simulate QRNG with consciousness interaction
    setTimeout(() => {
      const simulationResults = simulateQrngInteraction(
        qrngType,
        sampleSize,
        intentFactor,
        coherenceFactor
      );
      
      setResults(simulationResults);
      setIsRunning(false);
    }, 3000); // Simulate processing time
  };
  
  // Function to start canvas visualization
  const startVisualization = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear previous animation frame if any
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }
    
    // Particles for visualization
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      alpha: number;
      state: number;
    }[] = [];
    
    // Create initial particles
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.2,
        color: getRandomColor(),
        alpha: Math.random() * 0.5 + 0.3,
        state: Math.random() > 0.5 ? 1 : 0 // Quantum state (0 or 1)
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Wave function visualization
      drawWaveFunction(ctx, canvas.width, canvas.height, Date.now() / 1000);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Move particles
        particle.y += particle.speed;
        
        // Reset if particles go off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
          particle.state = Math.random() > 0.5 ? 1 : 0;
        }
        
        // Apply "consciousness" influence based on intentFactor
        if (Math.random() < intentFactor * 0.01) {
          particle.state = 1; // Bias towards state 1
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.state === 1 
          ? `rgba(155, 125, 255, ${particle.alpha})` 
          : `rgba(100, 227, 255, ${particle.alpha})`;
        ctx.fill();
        
        // Draw connection lines for "entanglement" visualization
        if (coherenceFactor > 0.2) {
          const nearbyParticles = particles.filter(p => 
            p !== particle && 
            getDistance(particle.x, particle.y, p.x, p.y) < coherenceFactor * 100
          );
          
          nearbyParticles.forEach(p => {
            const distance = getDistance(particle.x, particle.y, p.x, p.y);
            const alpha = 0.1 * (1 - distance / (coherenceFactor * 100));
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
            ctx.stroke();
          });
        }
      });
      
      const frame = requestAnimationFrame(animate);
      setAnimationFrame(frame);
    };
    
    // Start animation
    const frame = requestAnimationFrame(animate);
    setAnimationFrame(frame);
  };
  
  // Helper function to draw wave function
  const drawWaveFunction = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) => {
    const centerY = height / 2;
    const amplitude = 50 * coherenceFactor;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let x = 0; x < width; x += 5) {
      const frequency = 0.01 + 0.01 * intentFactor;
      const y = centerY + 
        amplitude * Math.sin(x * frequency + time) * 
        Math.exp(-Math.pow((x - width/2) / (width/4), 2));
      
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.stroke();
  };
  
  // Helper function to calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  // Helper function to get random color
  const getRandomColor = () => {
    const colors = [
      'rgba(100, 227, 255, 0.8)',
      'rgba(155, 125, 255, 0.8)',
      'rgba(255, 125, 150, 0.8)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationFrame]);
  
  // Function to simulate QRNG interaction with consciousness
  const simulateQrngInteraction = (
    type: string,
    samples: number,
    intent: number,
    coherence: number
  ) => {
    // Arrays to store random bits
    const controlBits: number[] = [];
    const influencedBits: number[] = [];
    
    // Generate control bits (pure quantum random)
    for (let i = 0; i < samples; i++) {
      controlBits.push(Math.random() > 0.5 ? 1 : 0);
    }
    
    // Generate influenced bits (with consciousness parameter)
    for (let i = 0; i < samples; i++) {
      // Base probability
      let prob = 0.5;
      
      // Apply intent factor (biases towards 1)
      prob += intent * 0.1;
      
      // Apply coherence factor (makes sequence more ordered)
      if (i > 0 && coherence > 0.5) {
        // Tendency to follow previous bit
        prob = influencedBits[i-1] === 1 ? prob + 0.1 * (coherence - 0.5) : prob - 0.1 * (coherence - 0.5);
      }
      
      // Ensure probability stays within bounds
      prob = Math.max(0, Math.min(1, prob));
      
      // Generate bit with modified probability
      influencedBits.push(Math.random() < prob ? 1 : 0);
    }
    
    // Calculate statistics
    const controlOnes = controlBits.filter(bit => bit === 1).length;
    const controlZeros = samples - controlOnes;
    const controlRatio = controlOnes / samples;
    
    const influencedOnes = influencedBits.filter(bit => bit === 1).length;
    const influencedZeros = samples - influencedOnes;
    const influencedRatio = influencedOnes / samples;
    
    // Calculate entropy (randomness measure)
    const controlEntropy = calculateEntropy(controlBits);
    const influencedEntropy = calculateEntropy(influencedBits);
    
    // Calculate autocorrelation (measure of pattern)
    const controlAutocorrelation = calculateAutocorrelation(controlBits);
    const influencedAutocorrelation = calculateAutocorrelation(influencedBits);
    
    // Statistical significance test (chi-square for deviation from expected 50/50)
    const expectedCount = samples / 2; // 50% ones expected
    
    const controlChiSquare = Math.pow(controlOnes - expectedCount, 2) / expectedCount + 
                            Math.pow(controlZeros - expectedCount, 2) / expectedCount;
                            
    const influencedChiSquare = Math.pow(influencedOnes - expectedCount, 2) / expectedCount + 
                              Math.pow(influencedZeros - expectedCount, 2) / expectedCount;
    
    // p-value approximation from chi-square (1 degree of freedom)
    const controlPValue = 1 - chicdf(controlChiSquare, 1);
    const influencedPValue = 1 - chicdf(influencedChiSquare, 1);
    
    // Calculate effect size (difference between distributions)
    const effectSize = Math.abs(influencedRatio - controlRatio);
    
    return {
      sampleSize: samples,
      qrngType: type,
      intentFactor: intent,
      coherenceFactor: coherence,
      control: {
        ones: controlOnes,
        zeros: controlZeros,
        ratio: controlRatio,
        entropy: controlEntropy,
        autocorrelation: controlAutocorrelation,
        chiSquare: controlChiSquare,
        pValue: controlPValue
      },
      influenced: {
        ones: influencedOnes,
        zeros: influencedZeros,
        ratio: influencedRatio,
        entropy: influencedEntropy,
        autocorrelation: influencedAutocorrelation,
        chiSquare: influencedChiSquare,
        pValue: influencedPValue
      },
      effectSize,
      significant: influencedPValue < 0.05
    };
  };
  
  // Calculate entropy of a bit sequence
  const calculateEntropy = (bits: number[]) => {
    const counts = [0, 0]; // Count of 0s and 1s
    
    bits.forEach(bit => {
      counts[bit]++;
    });
    
    let entropy = 0;
    const n = bits.length;
    
    [0, 1].forEach(value => {
      const p = counts[value] / n;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    });
    
    return entropy;
  };
  
  // Calculate autocorrelation of a bit sequence
  const calculateAutocorrelation = (bits: number[], lag = 1) => {
    let sum = 0;
    const n = bits.length;
    
    for (let i = 0; i < n - lag; i++) {
      sum += (bits[i] === bits[i + lag]) ? 1 : -1;
    }
    
    return sum / (n - lag);
  };
  
  // Approximation of chi-square cumulative distribution function
  const chicdf = (x: number, k: number) => {
    // This is a simplified approximation
    if (x <= 0) return 0;
    
    const a = 0.5 * k;
    const b = 0.5 * x;
    let c = 1;
    let sum = 1;
    let term = 1;
    
    for (let i = 1; i <= 100; i++) {
      term *= b / (a + i);
      c += term;
      
      if (term < 1e-10) break;
    }
    
    return 1 - Math.exp(-b) * c;
  };
  
  return (
    <SimulatorContainer>
      <SectionTitle>ΨC Systems + QRNG Interaction Simulator</SectionTitle>
      
      <ControlPanel>
        <ControlGroup>
          <ControlTitle>QRNG Parameters</ControlTitle>
          
          <InputGroup>
            <InputLabel>Random Number Generator Type:</InputLabel>
            <SelectField 
              value={qrngType}
              onChange={(e) => setQrngType(e.target.value)}
              disabled={isRunning}
            >
              <option value="photon">Photon Path QRNG</option>
              <option value="radioactive">Radioactive Decay QRNG</option>
              <option value="electronic">Electronic Noise QRNG</option>
            </SelectField>
          </InputGroup>
          
          <InputGroup>
            <InputLabel>Sample Size:</InputLabel>
            <InputField 
              type="number" 
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              min="100"
              max="10000"
              step="100"
              disabled={isRunning}
            />
          </InputGroup>
        </ControlGroup>
        
        <ControlGroup>
          <ControlTitle>Consciousness Parameters</ControlTitle>
          
          <InputGroup>
            <InputLabel>Intentional Influence Factor (0-1):</InputLabel>
            <InputField 
              type="range" 
              min="0"
              max="1"
              step="0.01"
              value={intentFactor}
              onChange={(e) => setIntentFactor(Number(e.target.value))}
              disabled={isRunning}
            />
            <div style={{ textAlign: 'center', color: '#a0b8ff' }}>{intentFactor.toFixed(2)}</div>
          </InputGroup>
          
          <InputGroup>
            <InputLabel>Quantum Coherence Factor (0-1):</InputLabel>
            <InputField 
              type="range" 
              min="0"
              max="1"
              step="0.01"
              value={coherenceFactor}
              onChange={(e) => setCoherenceFactor(Number(e.target.value))}
              disabled={isRunning}
            />
            <div style={{ textAlign: 'center', color: '#a0b8ff' }}>{coherenceFactor.toFixed(2)}</div>
          </InputGroup>
          
          <RunButton 
            onClick={runSimulation}
            disabled={isRunning}
          >
            {isRunning ? 'Simulation Running...' : 'Run Simulation'}
          </RunButton>
        </ControlGroup>
      </ControlPanel>
      
      <VisualizationArea>
        <Canvas ref={canvasRef} />
      </VisualizationArea>
      
      {results && (
        <ResultsPanel>
          <ResultTitle>Simulation Results</ResultTitle>
          
          <ResultGrid>
            <ResultCard>
              <h4>Overall Effect Analysis</h4>
              <div className="value" style={{ color: results.significant ? '#64FFB4' : '#FF6464' }}>
                {results.significant ? 'Significant' : 'Not Significant'}
              </div>
              <div className="unit">p-value: {results.influenced.pValue.toFixed(5)}</div>
              <div className="unit">Effect size: {results.effectSize.toFixed(4)}</div>
              <div className="unit" style={{ marginTop: '10px' }}>
                {results.significant 
                  ? 'The conscious influence appears to have a statistically significant effect on quantum randomness'
                  : 'No statistically significant deviation from quantum randomness was detected'}
              </div>
            </ResultCard>
            
            <ResultCard>
              <h4>Control vs. Influenced Distribution</h4>
              <StatsTable>
                <div className="row">
                  <div className="label">Control Ones:</div>
                  <div className="value">{results.control.ones} ({(results.control.ratio * 100).toFixed(2)}%)</div>
                </div>
                <div className="row">
                  <div className="label">Influenced Ones:</div>
                  <div className="value">{results.influenced.ones} ({(results.influenced.ratio * 100).toFixed(2)}%)</div>
                </div>
                <div className="row">
                  <div className="label">Deviation:</div>
                  <div className="value">
                    {((results.influenced.ratio - results.control.ratio) * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="row">
                  <div className="label">Chi-square value:</div>
                  <div className="value">{results.influenced.chiSquare.toFixed(3)}</div>
                </div>
              </StatsTable>
            </ResultCard>
            
            <ResultCard>
              <h4>Information-Theoretic Analysis</h4>
              <StatsTable>
                <div className="row">
                  <div className="label">Control Entropy:</div>
                  <div className="value">{results.control.entropy.toFixed(4)} bits</div>
                </div>
                <div className="row">
                  <div className="label">Influenced Entropy:</div>
                  <div className="value">{results.influenced.entropy.toFixed(4)} bits</div>
                </div>
                <div className="row">
                  <div className="label">Control Autocorrelation:</div>
                  <div className="value">{results.control.autocorrelation.toFixed(4)}</div>
                </div>
                <div className="row">
                  <div className="label">Influenced Autocorrelation:</div>
                  <div className="value">{results.influenced.autocorrelation.toFixed(4)}</div>
                </div>
              </StatsTable>
            </ResultCard>
            
            <ResultCard>
              <h4>Simulation Parameters</h4>
              <StatsTable>
                <div className="row">
                  <div className="label">QRNG Type:</div>
                  <div className="value">{results.qrngType}</div>
                </div>
                <div className="row">
                  <div className="label">Sample Size:</div>
                  <div className="value">{results.sampleSize}</div>
                </div>
                <div className="row">
                  <div className="label">Intent Factor:</div>
                  <div className="value">{results.intentFactor.toFixed(2)}</div>
                </div>
                <div className="row">
                  <div className="label">Coherence Factor:</div>
                  <div className="value">{results.coherenceFactor.toFixed(2)}</div>
                </div>
              </StatsTable>
            </ResultCard>
          </ResultGrid>
        </ResultsPanel>
      )}
    </SimulatorContainer>
  );
};

export default QrngSimulator; 