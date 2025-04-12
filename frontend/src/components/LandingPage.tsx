import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Styled components
const LandingPageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #f0f0f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const QuantumCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #0a0c14;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6vh 8vw;
  background: linear-gradient(to right, rgba(10, 12, 20, 0.85), rgba(10, 12, 20, 0.6));
  backdrop-filter: blur(4px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #64e3ff, #9b7dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.4rem);
  color: #a0b8ff;
  font-weight: 300;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const TheorySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
`;

const Equation = styled.div`
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(30, 40, 70, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', serif;
`;

const EquationExplainer = styled.p`
  font-size: 1rem;
  color: #a0a0b8;
  margin-bottom: 3rem;
  text-align: center;
`;

const KeyPoints = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Point = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  padding: 1.5rem;
  background: rgba(30, 40, 70, 0.3);
  border-radius: 12px;
  transition: transform 0.2s ease, background 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(40, 50, 90, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PointIcon = styled.div`
  font-size: 1.5rem;
  color: #64e3ff;
`;

const PointText = styled.div`
  h3 {
    font-size: 1.2rem;
    margin: 0 0 0.5rem 0;
    color: #f0f0f0;
  }
  
  p {
    font-size: 0.95rem;
    color: #a0a0b8;
    margin: 0;
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const CTAButton = styled.button`
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(90deg, #4e54ff, #9b7dff);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(75, 85, 255, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(75, 85, 255, 0.6);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const CTASubtext = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #a0a0b8;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #707080;
  margin-top: 2rem;
`;

interface LandingPageProps {
  onStartSimulation: () => void;
  onGoToModeling?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSimulation, onGoToModeling }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation for quantum particles effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Particle system for quantum visualization
    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;
      decay: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 60 + 180}, 80%, 60%)`;
        this.velocity = {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
      }
      
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
      
      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        
        if (this.alpha < 0) {
          this.alpha = 0;
        }
        
        this.draw();
      }
    }
    
    // Wave function visualization
    class WaveFunction {
      particles: Particle[];
      time: number;
      
      constructor() {
        this.particles = [];
        this.time = 0;
      }
      
      addParticles(x: number, y: number, count: number) {
        for (let i = 0; i < count; i++) {
          this.particles.push(new Particle(x, y));
        }
      }
      
      drawWave() {
        if (!ctx || !canvas) return;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * 0.01 + this.time) * 20 + 
                   Math.sin(x * 0.02 + this.time * 1.5) * 10 +
                   canvas.height / 2;
          ctx.lineTo(x, y);
          
          // Occasionally emit particles along the wave
          if (Math.random() < 0.01) {
            this.addParticles(x, y, 1);
          }
        }
        
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      update() {
        if (!ctx || !canvas) return;
        
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(10, 12, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw quantum wave
        this.drawWave();
        this.time += 0.02;
        
        // Update all particles
        this.particles.forEach((particle, index) => {
          if (particle.alpha <= 0) {
            this.particles.splice(index, 1);
          } else {
            particle.update();
          }
        });
        
        // Add particles at random locations
        if (Math.random() < 0.05) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          this.addParticles(x, y, Math.floor(Math.random() * 3) + 1);
        }
      }
    }
    
    const waveFunction = new WaveFunction();
    
    // Initialize with some particles
    for (let i = 0; i < 50; i++) {
      waveFunction.addParticles(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1
      );
    }
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      waveFunction.update();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <LandingPageContainer>
      <QuantumCanvas ref={canvasRef} />
      
      <ContentContainer>
        <Header>
          <Title>Consciousness-Quantum Interaction Framework</Title>
          <Subtitle>Empirical Testing of Quantum Consciousness Theory</Subtitle>
        </Header>
        
        <MainContent>
          <TheorySection>
            <Equation>
              P<sub>C</sub>(i) = |α<sub>i</sub>|<sup>2</sup> + δ<sub>C</sub>(i)
            </Equation>
            <EquationExplainer>
              Consciousness modifies quantum collapse probabilities through influence function δ<sub>C</sub>
            </EquationExplainer>
            
            <KeyPoints>
              <Point>
                <PointIcon>⦿</PointIcon>
                <PointText>
                  <h3>Measurable Influence</h3>
                  <p>Statistical deviations from quantum randomness</p>
                </PointText>
              </Point>
              
              <Point>
                <PointIcon>⦿</PointIcon>
                <PointText>
                  <h3>Energy-Neutral Effects</h3>
                  <p>Quantum phase modulation preserves expected energy</p>
                </PointText>
              </Point>
              
              <Point>
                <PointIcon>⦿</PointIcon>
                <PointText>
                  <h3>Information Preservation</h3>
                  <p>Bounded-error reconstruction of conscious states</p>
                </PointText>
              </Point>
            </KeyPoints>
          </TheorySection>
          
          <CTASection>
            <CTAButton onClick={onStartSimulation}>
              Run Quantum Simulation
            </CTAButton>
            
            {onGoToModeling && (
              <CTAButton 
                onClick={onGoToModeling} 
                style={{ 
                  marginLeft: '15px',
                  background: 'linear-gradient(90deg, #64e3ff, #4e54ff)'
                }}
              >
                QRNG Interaction Tools
              </CTAButton>
            )}
            
            <CTASubtext>
              Test the theory with rigorous, falsifiable experiments
            </CTASubtext>
          </CTASection>
        </MainContent>
        
        <Footer>
          <p>
            Based on the theoretical framework outlined in "Mathematical Framework for Consciousness Access"
          </p>
        </Footer>
      </ContentContainer>
    </LandingPageContainer>
  );
};

export default LandingPage; 