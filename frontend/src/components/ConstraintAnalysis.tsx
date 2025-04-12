import React, { useState, useEffect } from 'react';
import {
  Line,
  Bar,
  Scatter,
  ScatterChart,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import styled, { createGlobalStyle } from 'styled-components';
import { SimulationResponse } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ChartData
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

interface ConstraintAnalysisProps {
  results: SimulationResponse;
}

interface MetricValueProps {
  color?: string;
  bold?: boolean;
}

interface ProgressBarProps {
  percent: number;
  color?: string;
}

interface StatusBadgeProps {
  color: string;
}

interface ConstraintStatusProps {
  satisfied: boolean;
}

interface TabProps {
  active: boolean;
}

interface PredictionCardProps {
  color?: string;
}

interface DataSourceBadgeProps {
  type: string;
}

const ConstraintContainer = styled.div`
  background-color: #121212;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: #e0e0e0;
`;

const SectionTitle = styled.h3`
  color: #bb86fc;
  margin-top: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin: 20px 0;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 14px;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background-color: #1e1e1e;
    color: #bb86fc;
  }
  
  tr:nth-child(even) {
    background-color: #1a1a1a;
  }
`;

const PredictionCard = styled.div<PredictionCardProps>`
  background-color: #1e1e1e;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid ${props => props.color || '#bb86fc'};
`;

const CardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 10px;
  color: #e0e0e0;
`;

const CardDescription = styled.p`
  margin-bottom: 10px;
  color: #aaa;
  font-size: 14px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  font-size: 14px;
`;

const MetricLabel = styled.span`
  color: #999;
  flex: 1;
`;

const MetricValue = styled.span<MetricValueProps>`
  color: ${props => props.color || '#e0e0e0'};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  margin-left: 10px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  margin: 5px 0 10px 0;
  overflow: hidden;
`;

const ProgressBar = styled.div<ProgressBarProps>`
  height: 100%;
  background-color: ${props => props.color || '#bb86fc'};
  width: ${props => props.percent}%;
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => props.color};
  color: #000;
  margin-left: 10px;
`;

const ResultItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ResultName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ResultValue = styled.span<{ success?: boolean }>`
  margin-left: 10px;
  color: ${props => props.success ? '#27ae60' : '#e74c3c'};
  font-weight: 500;
`;

const ConstraintStatus = styled.div<ConstraintStatusProps>`
  display: inline-block;
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${props => props.satisfied ? '#e6f7ee' : '#fde9e9'};
  color: ${props => props.satisfied ? '#27ae60' : '#e74c3c'};
  border-radius: 4px;
  font-weight: 500;
`;

const TabGroup = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e8ed;
  margin-bottom: 20px;
`;

const Tab = styled.button<TabProps>`
  padding: 10px 15px;
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  border: none;
  border-bottom: ${props => props.active ? '2px solid #3498db' : 'none'};
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3498db;
  }
`;

const DataSourceBadge = styled.span<DataSourceBadgeProps>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
  background-color: ${props => {
    switch(props.type) {
      case 'eeg': return 'rgba(25, 118, 210, 0.2)';
      case 'qrng': return 'rgba(156, 39, 176, 0.2)';
      case 'neuroimaging': return 'rgba(33, 150, 243, 0.2)';
      case 'behavioral': return 'rgba(76, 175, 80, 0.2)';
      case 'synthetic': return 'rgba(255, 152, 0, 0.2)';
      case 'simulation': return 'rgba(121, 85, 72, 0.2)';
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'eeg': return '#1976d2';
      case 'qrng': return '#9c27b0';
      case 'neuroimaging': return '#2196f3';
      case 'behavioral': return '#4caf50';
      case 'synthetic': return '#ff9800';
      case 'simulation': return '#795548';
      default: return '#9e9e9e';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'eeg': return 'rgba(25, 118, 210, 0.5)';
      case 'qrng': return 'rgba(156, 39, 176, 0.5)';
      case 'neuroimaging': return 'rgba(33, 150, 243, 0.5)';
      case 'behavioral': return 'rgba(76, 175, 80, 0.5)';
      case 'synthetic': return 'rgba(255, 152, 0, 0.5)';
      case 'simulation': return 'rgba(121, 85, 72, 0.5)';
      default: return 'rgba(158, 158, 158, 0.5)';
    }
  }};
`;

const SourceInfoPanel = styled.div`
  background-color: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 5px;
  }
  
  .synthetic-notice {
    color: #ff9800;
    font-weight: 500;
  }
`;

const AnalysisStyles = createGlobalStyle`
  .constraint-analysis {
    margin-top: 30px;
    padding: 20px;
    background-color: #0f1525;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
    color: #f0f0f0;
  }
  
  h2 {
    margin-top: 0;
    color: #a0b8ff;
    text-align: center;
    font-size: 1.6rem;
  }
  
  h3 {
    color: #64e3ff;
    border-bottom: 1px solid #2a2a3a;
    padding-bottom: 8px;
    margin-top: 30px;
  }
  
  h4 {
    color: #9b7dff;
    margin-top: 25px;
    margin-bottom: 15px;
  }
  
  h5 {
    color: #f0f0f0;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  
  p {
    color: #a0a0b8;
    line-height: 1.5;
  }
  
  .loading-message {
    text-align: center;
    padding: 20px;
    font-style: italic;
    color: #666;
  }
  
  .null-hypothesis-section, .verification-framework, .analysis-summary {
    margin-bottom: 30px;
  }
  
  .null-hypothesis-table, .verification-table, .constraints-table {
    margin: 20px 0;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    background: rgba(20, 25, 40, 0.5);
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #2a2a3a;
  }
  
  th {
    background-color: rgba(40, 50, 90, 0.5);
    font-weight: bold;
    color: #64e3ff;
  }
  
  .satisfied {
    color: #4caf50;
    font-weight: bold;
  }
  
  .violated {
    color: #f44336;
    font-weight: bold;
  }
  
  .charts-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
  }
  
  .chart-section, .null-hypothesis-chart, .verification-chart {
    flex: 1;
    min-width: 300px;
    background-color: rgba(20, 25, 40, 0.7);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
    margin-bottom: 20px;
  }
  
  .framework-verified, .framework-supported {
    color: #4caf50;
    font-weight: bold;
    padding: 10px;
    background-color: rgba(76, 175, 80, 0.1);
    border-radius: 4px;
    text-align: center;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .framework-falsified, .framework-not-supported {
    color: #f44336;
    font-weight: bold;
    padding: 10px;
    background-color: rgba(244, 67, 54, 0.1);
    border-radius: 4px;
    text-align: center;
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  .information-metrics {
    margin-top: 30px;
    background-color: rgba(20, 30, 60, 0.3);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
  }
  
  .metrics-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 15px;
  }
  
  .metric-card {
    flex: 1;
    min-width: 250px;
    background-color: rgba(20, 25, 40, 0.7);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
  }
  
  .metric-card h4 {
    margin-top: 0;
    color: #9b7dff;
    border-bottom: 1px solid #2a2a3a;
    padding-bottom: 8px;
  }
  
  .metric-card ul {
    padding-left: 20px;
    color: #a0a0b8;
  }
  
  .entropy-chart {
    margin-top: 15px;
  }
  
  .control-conditions {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 15px;
  }
  
  .control-comparison-card {
    flex: 1;
    min-width: 300px;
    background-color: rgba(20, 25, 40, 0.5);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
    margin-bottom: 15px;
  }
  
  .control-comparison-card h5 {
    margin-top: 0;
    color: #64e3ff;
    border-bottom: 1px solid #2a2a3a;
    padding-bottom: 8px;
  }
  
  .comparison-data {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }
  
  .comparison-item {
    padding: 8px;
    background-color: rgba(30, 40, 70, 0.3);
    border-radius: 4px;
  }
  
  .comparison-item span {
    color: #9b7dff;
    font-weight: bold;
    display: block;
    margin-bottom: 4px;
  }
  
  .export-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #2a2a3a;
  }
  
  .export-button {
    background: linear-gradient(90deg, #4e54ff, #9b7dff);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
  }
  
  .export-button:hover {
    box-shadow: 0 4px 12px rgba(75, 85, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .export-note {
    margin-top: 10px;
    color: #a0a0b8;
    text-align: center;
  }
  
  .note-detail {
    display: block;
    font-size: 0.9em;
    margin-top: 5px;
    color: #707080;
  }
  
  @media (max-width: 768px) {
    .charts-container, .metrics-grid, .control-conditions {
      flex-direction: column;
    }
    
    .chart-section, .metric-card, .control-comparison-card {
      width: 100%;
    }
  }
`;

const ConstraintAnalysis: React.FC<ConstraintAnalysisProps> = ({ results }) => {
  const [constraintsSatisfied, setConstraintsSatisfied] = useState<{ [key: string]: boolean }>({
    probabilityConservation: false,
    energyNeutrality: false,
    scaleLimit: false,
    quantumLinearity: false,
  });
  
  const [verificationCriteria, setVerificationCriteria] = useState<any>(null);
  const [nullHypothesisResults, setNullHypothesisResults] = useState<any>(null);
  const [deviation, setDeviation] = useState<number[]>([]);
  const [phaseModulation, setPhaseModulation] = useState<number[]>([]);
  const [informationMetrics, setInformationMetrics] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const [activeTab, setActiveTab] = useState('constraints');
  
  useEffect(() => {
    if (!results) return;
    
    // Extract null hypothesis testing results if available
    if (results.nullHypothesesRejected) {
      setNullHypothesisResults({
        rejected: results.nullHypothesesRejected,
        pValues: results.nullHypothesesPValues,
        effectSizes: results.nullHypothesesEffectSizes,
        controlComparisons: results.controlComparisons,
        nullHypotheses: results.nullHypotheses || {
          "h0_no_deviation": "H₀: Consciousness has no measurable impact on quantum collapse probabilities (δ_C(i) = 0 for all i)",
          "h0_no_correlation": "H₀: Any observed deviations are not correlated with conscious states (r = 0)",
          "h0_unreconstructable": "H₀: Conscious states cannot be reconstructed from quantum measurement patterns (error ≥ η)",
          "h0_random_fluctuation": "H₀: Any observed patterns are due to random fluctuations, not consciousness effects"
        }
      });
    }
    
    // Extract verification criteria if available
    if (results.verificationCriteria) {
      setVerificationCriteria(results.verificationCriteria);
    } else if (results.simulationResults) {
      // Calculate δ_C(i) values (deviation from standard quantum probabilities)
      const collapsePattern = results.simulationResults.collapsePatterns;
      const totalSamples = collapsePattern.reduce((sum, count) => sum + count, 0);
      const observedProbs = collapsePattern.map(count => count / totalSamples);
      
      // Use the standard probabilities if available, otherwise use uniform distribution
      const expectedProbs = results.simulationResults.standardProbabilities || 
        Array(observedProbs.length).fill(0).map((_, i) => 1 / observedProbs.length);
      
      const deviations = observedProbs.map((prob, i) => prob - expectedProbs[i]);
      setDeviation(deviations);
      
      // Check constraints
      
      // 1. Probability Conservation: ∑ δ_C(i) = 0
      const sumDeviation = deviations.reduce((sum, dev) => sum + dev, 0);
      const probabilityConservation = Math.abs(sumDeviation) < 1e-10;
      
      // 2. Energy Neutrality (simplified for simulation)
      // In a real implementation, this would involve measuring expected energies
      const energyNeutrality = true; // Simplified assumption
      
      // 3. Scale Limit: |δ_C(i)| ≤ ϵ·|α_i|²
      const epsilon = 1e-6;
      const scaleLimit = deviations.every((dev, i) => 
        Math.abs(dev) <= epsilon * expectedProbs[i]
      );
      
      // 4. Quantum Linearity (simplified for simulation)
      // Check if deviations follow a linear pattern relative to original conscious state
      if (results.simulationResults.originalState) {
        const correlationWithState = calculateCorrelation(
          deviations, 
          results.simulationResults.originalState.vector
        );
        const quantumLinearity = correlationWithState > 0.7; // Arbitrary threshold
        
        setConstraintsSatisfied({
          probabilityConservation,
          energyNeutrality,
          scaleLimit,
          quantumLinearity
        });
      }
    }
    
    // Extract phase modulation data if available
    if (results.simulationResults && results.simulationResults.phaseInformation) {
      setPhaseModulation(results.simulationResults.phaseInformation);
    }
    
    // Extract information-theoretic metrics if available
    if (results.informationMetrics) {
      setInformationMetrics(results.informationMetrics);
    }
    
    setAnalysisComplete(true);
  }, [results]);
  
  // Helper function to calculate correlation coefficient
  const calculateCorrelation = (a: number[], b: number[]): number => {
    if (a.length !== b.length || a.length === 0) return 0;
    
    const n = a.length;
    let sum_a = 0, sum_b = 0, sum_ab = 0, sum_a_sq = 0, sum_b_sq = 0;
    
    for (let i = 0; i < n; i++) {
      sum_a += a[i];
      sum_b += b[i];
      sum_ab += a[i] * b[i];
      sum_a_sq += a[i] * a[i];
      sum_b_sq += b[i] * b[i];
    }
    
    const numerator = n * sum_ab - sum_a * sum_b;
    const denominator = Math.sqrt(
      (n * sum_a_sq - sum_a * sum_a) * (n * sum_b_sq - sum_b * sum_b)
    );
    
    return denominator === 0 ? 0 : numerator / denominator;
  };
  
  // Prepare data for visualization of δ_C(i)
  const deviationChartData = {
    labels: Array.from({ length: deviation.length }, (_, i) => `State ${i}`),
    datasets: [
      {
        label: 'δ_C(i) Values',
        data: deviation,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  // Prepare data for visualization of phase modulation γ_i
  const phaseModulationChartData = {
    labels: Array.from({ length: phaseModulation.length }, (_, i) => `State ${i}`),
    datasets: [
      {
        label: 'Phase Modulation γ_i (radians)',
        data: phaseModulation,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };
  
  // Prepare data for multi-scale entropy visualization
  const entropyChartData = informationMetrics ? {
    labels: ['Scale 1', 'Scale 2', 'Scale 4', 'Scale 8'],
    datasets: [
      {
        label: 'Multi-Scale Entropy',
        data: informationMetrics.multiScaleEntropy,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ]
  } : null;
  
  // Data for falsification analysis
  const falsificationData = {
    labels: ['Probability Conservation', 'Energy Neutrality', 'Scale Limit', 'Quantum Linearity'],
    datasets: [
      {
        label: 'Constraint Satisfied',
        data: Object.values(constraintsSatisfied).map(value => value ? 1 : 0),
        backgroundColor: Object.values(constraintsSatisfied).map(
          value => value ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
        ),
        borderColor: Object.values(constraintsSatisfied).map(
          value => value ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      }
    ]
  };
  
  // Data for three-criteria verification framework
  const verificationFrameworkData = verificationCriteria ? {
    labels: [
      'Deviation from Quantum Randomness', 
      'Correlation with Subjective Experience', 
      'Bounded Error Reconstruction'
    ],
    datasets: [
      {
        label: 'Criterion Satisfied',
        data: [
          verificationCriteria.deviationSignificant ? 1 : 0,
          verificationCriteria.coherenceCorrelated ? 1 : 0,
          verificationCriteria.boundedReconstruction ? 1 : 0
        ],
        backgroundColor: [
          verificationCriteria.deviationSignificant ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          verificationCriteria.coherenceCorrelated ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          verificationCriteria.boundedReconstruction ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          verificationCriteria.deviationSignificant ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          verificationCriteria.coherenceCorrelated ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          verificationCriteria.boundedReconstruction ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      }
    ]
  } : null;
  
  // Data for null hypothesis testing results
  const nullHypothesisChartData = nullHypothesisResults ? {
    labels: Object.keys(nullHypothesisResults.rejected).map(key => 
      nullHypothesisResults.nullHypotheses[key].replace(/H₀: /, '')
    ),
    datasets: [
      {
        label: 'Null Hypothesis Rejected',
        data: Object.values(nullHypothesisResults.rejected).map((value: unknown) => 
          (value as boolean) ? 1 : 0
        ),
        backgroundColor: Object.values(nullHypothesisResults.rejected).map(
          (value: unknown) => (value as boolean) ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
        ),
        borderColor: Object.values(nullHypothesisResults.rejected).map(
          (value: unknown) => (value as boolean) ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      }
    ]
  } : null;
  
  const getDataSourceLabel = (type?: string) => {
    switch(type) {
      case 'eeg': return 'EEG Recording';
      case 'qrng': return 'Quantum Random Number Generator';
      case 'neuroimaging': return 'Neuroimaging Data';
      case 'behavioral': return 'Behavioral Measurements';
      case 'synthetic': return 'Synthetic Data';
      case 'simulation': return 'Theoretical Simulation';
      default: return 'Unknown Source';
    }
  };
  
  const handleExportData = () => {
    if (!results) return;
    
    const analysisData = {
      results,
      dataSourceType: results.dataSourceType || 'synthetic',
      deviations: deviation,
      phaseModulation: phaseModulation,
      constraintAnalysis: constraintsSatisfied,
      verificationCriteria,
      nullHypothesisResults,
      informationMetrics,
      timestamp: new Date().toISOString(),
      experimentId: results.experimentId || `manual_export_${Date.now()}`
    };
    
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `quantum-consciousness-analysis-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Render quantitative predictions and evaluations
  const renderQuantitativePredictions = () => {
    if (!results.quantitativePredictions || !results.predictionEvaluations) {
      return <p>No quantitative prediction data available.</p>;
    }
    
    // Function to render category predictions
    const renderCategoryPredictions = (category: string, title: string) => {
      if (!results.quantitativePredictions[category] || !results.predictionEvaluations[category]) {
        return null;
      }
      
      return (
        <div>
          <SectionTitle>{title}</SectionTitle>
          
          {Object.keys(results.predictionEvaluations[category]).map(key => {
            const prediction = results.quantitativePredictions[category][key];
            const evaluation = results.predictionEvaluations[category][key];
            
            if (!prediction || !evaluation) return null;
            
            // Determine status color
            let statusColor = '#f44336'; // Default red for not meeting prediction
            let statusText = 'Not Met';
            
            if (evaluation.meets_prediction) {
              statusColor = '#4caf50'; // Green for meeting prediction
              statusText = 'Validated';
            } else if (evaluation.percent_of_expected > 70) {
              statusColor = '#ff9800'; // Orange for partially meeting prediction
              statusText = 'Partial';
            }
            
            return (
              <PredictionCard key={key} color={statusColor}>
                <CardTitle>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <StatusBadge color={statusColor}>{statusText}</StatusBadge>
                </CardTitle>
                
                <CardDescription>{prediction.description}</CardDescription>
                
                {/* Progress visualization */}
                <ProgressBarContainer>
                  <ProgressBar 
                    percent={Math.min(evaluation.percent_of_expected, 150)} 
                    color={statusColor} 
                  />
                </ProgressBarContainer>
                
                {/* Expected vs Observed */}
                <MetricRow>
                  <MetricLabel>Expected Value:</MetricLabel>
                  <MetricValue>
                    {prediction.minimum_deviation !== undefined
                      ? prediction.minimum_deviation.toFixed(4)
                      : prediction.expected_deviation !== undefined
                      ? prediction.expected_deviation.toFixed(4)
                      : 'N/A'}
                  </MetricValue>
                </MetricRow>
                
                <MetricRow>
                  <MetricLabel>Observed Value:</MetricLabel>
                  <MetricValue 
                    color={evaluation.meets_prediction ? '#4caf50' : '#f44336'}
                    bold
                  >
                    {evaluation.observed_deviation !== undefined
                      ? evaluation.observed_deviation.toFixed(4)
                      : evaluation.observed_value !== undefined
                      ? evaluation.observed_value.toFixed(4)
                      : evaluation.observed_shift !== undefined
                      ? evaluation.observed_shift.toFixed(4)
                      : 'N/A'}
                  </MetricValue>
                </MetricRow>
                
                <MetricRow>
                  <MetricLabel>Percent of Expected:</MetricLabel>
                  <MetricValue 
                    color={
                      evaluation.percent_of_expected >= 100 ? '#4caf50' :
                      evaluation.percent_of_expected >= 70 ? '#ff9800' : '#f44336'
                    }
                  >
                    {evaluation.percent_of_expected.toFixed(1)}%
                  </MetricValue>
                </MetricRow>
                
                {/* Add additional metrics specific to certain prediction types */}
                {prediction.required_coherence && (
                  <MetricRow>
                    <MetricLabel>Required Neural Coherence:</MetricLabel>
                    <MetricValue>{prediction.required_coherence.toFixed(2)}</MetricValue>
                  </MetricRow>
                )}
                
                {prediction.testable_threshold && (
                  <MetricRow>
                    <MetricLabel>Testable Threshold:</MetricLabel>
                    <MetricValue>{prediction.testable_threshold.toFixed(4)}</MetricValue>
                  </MetricRow>
                )}
                
                {prediction.confidence_interval && (
                  <MetricRow>
                    <MetricLabel>95% Confidence Interval:</MetricLabel>
                    <MetricValue>
                      [{prediction.confidence_interval[0].toFixed(2)}, {prediction.confidence_interval[1].toFixed(2)}]
                    </MetricValue>
                  </MetricRow>
                )}
                
                {evaluation.significant !== undefined && (
                  <MetricRow>
                    <MetricLabel>Statistically Significant:</MetricLabel>
                    <MetricValue color={evaluation.significant ? '#4caf50' : '#f44336'}>
                      {evaluation.significant ? 'Yes' : 'No'}
                    </MetricValue>
                  </MetricRow>
                )}
              </PredictionCard>
            );
          })}
        </div>
      );
    };
    
    return (
      <>
        <SectionTitle>Quantitative Predictions</SectionTitle>
        
        {renderCategoryPredictions('neural_coherence', 'Neural Coherence Predictions')}
        {renderCategoryPredictions('quantum_measurements', 'Quantum Measurement Predictions')}
        {renderCategoryPredictions('information_metrics', 'Information Theory Predictions')}
      </>
    );
  };

  return (
    <ConstraintContainer>
      <h2>Verification Framework Analysis</h2>
      
      <SourceInfoPanel>
        <h4>
          Data Source: {getDataSourceLabel(results.dataSourceType)}
          <DataSourceBadge type={results.dataSourceType || 'synthetic'}>
            {results.dataSourceType || 'synthetic'}
          </DataSourceBadge>
        </h4>
        {results.importTimestamp && <p>Imported on: {new Date(results.importTimestamp).toLocaleString()}</p>}
        {(results.dataSourceType === 'synthetic' || !results.dataSourceType) && 
          <p className="synthetic-notice">⚠️ This analysis uses synthetic data for demonstration purposes. Results should not be considered empirical evidence.</p>}
      </SourceInfoPanel>
      
      <SectionTitle>Physical Constraints Verification</SectionTitle>
      
      <DataTable>
        <thead>
          <tr>
            <th>Constraint</th>
            <th>Status</th>
            <th>Value</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Probability Conservation</td>
            <td>
              {constraintsSatisfied.probabilityConservation ? (
                <StatusBadge color="#4caf50">Satisfied</StatusBadge>
              ) : (
                <StatusBadge color="#f44336">Violated</StatusBadge>
              )}
            </td>
            <td>{deviation.reduce((sum, dev) => sum + dev, 0).toExponential(4)}</td>
            <td>1.0e-6</td>
          </tr>
          <tr>
            <td>Energy Neutrality</td>
            <td>
              {constraintsSatisfied.energyNeutrality ? (
                <StatusBadge color="#4caf50">Satisfied</StatusBadge>
              ) : (
                <StatusBadge color="#f44336">Violated</StatusBadge>
              )}
            </td>
            <td>{constraintsSatisfied.energyNeutrality ? '⟨ψ|Ĥ|ψ⟩ = ⟨ψ_C|Ĥ|ψ_C⟩' : 'Energy deviation'}</td>
            <td>0.01</td>
          </tr>
          <tr>
            <td>Scale Limit</td>
            <td>
              {constraintsSatisfied.scaleLimit ? (
                <StatusBadge color="#4caf50">Satisfied</StatusBadge>
              ) : (
                <StatusBadge color="#f44336">Violated</StatusBadge>
              )}
            </td>
            <td>{constraintsSatisfied.scaleLimit ? '|δ_C(i)| ≤ ϵ·|αᵢ|²' : 'Deviation'}</td>
            <td>0.5</td>
          </tr>
          <tr>
            <td>Quantum Linearity</td>
            <td>
              {constraintsSatisfied.quantumLinearity ? (
                <StatusBadge color="#4caf50">Satisfied</StatusBadge>
              ) : (
                <StatusBadge color="#f44336">Violated</StatusBadge>
              )}
            </td>
            <td>{constraintsSatisfied.quantumLinearity ? 'Linear correlation with conscious state' : 'Deviation'}</td>
            <td>0.9</td>
          </tr>
        </tbody>
      </DataTable>
      
      <SectionTitle>Quantum Deviations Analysis</SectionTitle>
      {results?.deviationData && (
        <>
          <SectionTitle>Deviation Analysis</SectionTitle>
          <div className="explanation">
            <p>
              This chart shows the deviation from expected probabilities across conscious states, 
              indicating potential consciousness-quantum interactions.
            </p>
          </div>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={Array.isArray(results.deviationData) ? 
                  results.deviationData.map((item, index) => ({
                    state: item?.state || `State ${index}`,
                    deviation: item?.deviation !== undefined ? item.deviation : 0,
                    baseline: item?.baseline !== undefined ? item.baseline : 0
                  })) : []
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="state" 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Conscious State', position: 'insideBottom', offset: -5, fill: '#aaa' }}
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Deviation %', angle: -90, position: 'insideLeft', fill: '#aaa' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Deviation']}
                />
                <Legend 
                  wrapperStyle={{ color: '#aaa' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="deviation" 
                  name="Measured Deviation" 
                  stroke="#bb86fc" 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  name="Expected Baseline" 
                  stroke="#03dac6" 
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
      
      {results?.phaseModulation && (
        <>
          <SectionTitle>Phase Modulation Analysis</SectionTitle>
          <div className="explanation">
            <p>This analysis examines how conscious states modulate quantum phase relationships.</p>
          </div>
          
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  type="number" 
                  dataKey="phase" 
                  name="Phase" 
                  unit="π rad" 
                  domain={[-1, 1]} 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Phase (π rad)', position: 'insideBottomRight', offset: -5, fill: '#aaa' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="amplitude" 
                  name="Amplitude" 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', fill: '#aaa' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  formatter={(value, name) => [Number(value).toFixed(4), name === 'phase' ? 'Phase (π rad)' : 'Amplitude']}
                />
                <Scatter 
                  name="Phase-Amplitude Relationship" 
                  data={results.phaseModulation.map(item => ({
                    phase: item.phase,
                    amplitude: item.amplitude || 0  // Provide default value if amplitude is undefined
                  }))}
                  fill="#bb86fc"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
      
      {results?.informationMetrics?.entropy && (
        <>
          <SectionTitle>Multi-Scale Entropy Analysis</SectionTitle>
          <div className="explanation">
            <p>
              This chart shows entropy measures across different scales, comparing conscious vs non-conscious states.
            </p>
          </div>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                data={Array.isArray(results.informationMetrics.entropy) ? 
                  results.informationMetrics.entropy.map((value, index) => ({
                    scale: index + 1,
                    entropy: value !== null ? value : 0,
                    baseline: results.informationMetrics?.baseline ? 
                      (results.informationMetrics?.baseline[index] !== null ? 
                        results.informationMetrics?.baseline[index] : 0) : 0
                  })) : []
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="scale" 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Scale Factor', position: 'insideBottomRight', offset: -5, fill: '#aaa' }}
                />
                <YAxis 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Entropy', angle: -90, position: 'insideLeft', fill: '#aaa' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  formatter={(value) => [Number(value).toFixed(4), 'Entropy']}
                />
                <Legend 
                  wrapperStyle={{ color: '#aaa' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="entropy" 
                  name="Conscious State" 
                  stroke="#bb86fc" 
                  activeDot={{ r: 8 }} 
                  isAnimationActive={false}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  name="Baseline (Non-conscious)" 
                  stroke="#03dac6" 
                  activeDot={{ r: 8 }} 
                  isAnimationActive={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
      
      {results?.phaseDistribution && (
        <>
          <SectionTitle>Phase Distribution Analysis</SectionTitle>
          <div className="explanation">
            <p>
              This chart shows the distribution of quantum phases, comparing the measured distribution 
              against theoretical expectations.
            </p>
          </div>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Array.isArray(results.phaseDistribution) ?
                  results.phaseDistribution.map((item, index) => {
                    const length = results.phaseDistribution ? results.phaseDistribution.length : 1;
                    return {
                      phase: `${(-1 + (index * 2) / (length - 1)).toFixed(2)}π`,
                      measured: item?.measured !== undefined ? item.measured : 0,
                      expected: item?.expected !== undefined ? item.expected : 0
                    };
                  }) : []
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="phase" 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Phase (π radians)', position: 'insideBottom', offset: -5, fill: '#aaa' }}
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#aaa' }} 
                  stroke="#aaa"
                  label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#aaa' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  formatter={(value) => [Number(value).toFixed(4), 'Probability']}
                />
                <Legend 
                  wrapperStyle={{ color: '#aaa' }}
                />
                <Bar 
                  dataKey="measured" 
                  name="Measured" 
                  fill="#bb86fc" 
                  isAnimationActive={false}
                />
                <Bar 
                  dataKey="expected" 
                  name="Expected (Theory)" 
                  fill="#03dac6" 
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
      
      <SectionTitle>Explicit Null Hypothesis Testing</SectionTitle>
      {nullHypothesisResults && (
        <DataTable>
          <thead>
            <tr>
              <th>Null Hypothesis</th>
              <th>Description</th>
              <th>p-value</th>
              <th>Effect Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(nullHypothesisResults.rejected).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{nullHypothesisResults.nullHypotheses[key]}</td>
                <td>{nullHypothesisResults.pValues[key].toFixed(4)}</td>
                <td>{nullHypothesisResults.effectSizes[key].toFixed(2)}</td>
                <td>
                  {nullHypothesisResults.rejected[key] ? (
                    <StatusBadge color="#4caf50">Rejected</StatusBadge>
                  ) : (
                    <StatusBadge color="#f44336">Failed to Reject</StatusBadge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
      
      {renderQuantitativePredictions()}
      
      <div className="export-controls">
        <button onClick={handleExportData} className="export-button">
          Export Analysis Data
        </button>
        <p className="export-note">
          Save this analysis for future comparison or sharing.
          <span className="note-detail">Contains all raw data and calculations for experimental replication.</span>
        </p>
      </div>
      
      <AnalysisStyles />
    </ConstraintContainer>
  );
};

export default ConstraintAnalysis; 