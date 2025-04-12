import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { SimulationResponse, BatchTestResponse } from '../services/api';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, ChartTooltip, Legend);

// Styled components for better UI
const ResultsContainer = styled.div`
  margin-top: 20px;
  background-color: rgba(20, 30, 60, 0.3);
  border-radius: 8px;
  padding: 20px;
  color: #f0f0f0;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;

  h2 {
    margin: 0;
    color: #90b0ff;
    font-size: 20px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.active ? 'rgba(100, 150, 255, 0.3)' : 'rgba(40, 50, 80, 0.3)'};
  color: ${props => props.active ? '#fff' : '#aaa'};
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(100, 150, 255, 0.3);
  }
`;

const ResultMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  background-color: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
  padding: 15px;
  min-width: 180px;
  flex: 1;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #90b0ff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MetricValue = styled.div<{ success?: boolean }>`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: ${props => props.success ? '#4caf50' : '#ff5252'};
`;

const MetricStatus = styled.div<{ success?: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.success ? '#81c784' : '#ff8a80'};
  margin-top: 5px;
  font-weight: 500;
`;

const ChartSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 25px;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-width: 45%;
  background-color: rgba(30, 40, 70, 0.5);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
    color: #90b0ff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HelpPanel = styled.div`
  background-color: rgba(40, 50, 80, 0.3);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #4a90e2;
  
  h4 {
    margin-top: 0;
    color: #4a90e2;
    font-size: 16px;
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
    color: #e0e0e0;
  }
  
  ul {
    padding-left: 20px;
    color: #e0e0e0;
  }
  
  li {
    margin-bottom: 8px;
    font-size: 14px;
  }
`;

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

interface SimulationResultsProps {
  results: SimulationResponse | BatchTestResponse;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ results }) => {
  const [activeView, setActiveView] = useState<'summary' | 'detailed'>('summary');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Check if results is a SimulationResponse
  const isSimulationResponse = (results: any): results is SimulationResponse => {
    return 'collapsePatterns' in results;
  };

  // Check if results is a BatchTestResponse
  const isBatchTestResponse = (results: any): results is BatchTestResponse => {
    return 'successRate' in results;
  };

  const renderSimulationResults = (data: SimulationResponse) => {
    const originalVector = data.originalState.vector;
    const reconstructedVector = data.reconstructedState.vector;
    const collapsePatterns = data.collapsePatterns;
    
    // Prepare data for vector comparison chart
    const vectorChartData = {
      labels: Array.from({ length: originalVector.length }, (_, i) => `C${i}`),
      datasets: [
        {
          label: 'Original State',
          data: originalVector,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Reconstructed State',
          data: reconstructedVector,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    // Prepare data for collapse pattern chart
    const collapseChartData = {
      labels: Array.from({ length: collapsePatterns.length }, (_, i) => `${i}`),
      datasets: [
        {
          label: 'Collapse Counts',
          data: collapsePatterns,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Calculate deviation from quantum expectation if available
    let deviationData: any = null;
    let informationMetricsSection: React.ReactNode = null;

    if (data.simulationResults?.standardProbabilities && data.simulationResults?.finalProbabilities) {
      const stdProbs = data.simulationResults.standardProbabilities;
      const actualProbs = data.simulationResults.finalProbabilities;
      
      deviationData = {
        labels: Array.from({ length: stdProbs.length }, (_, i) => `State ${i}`),
        datasets: [
          {
            label: 'Standard Quantum Probability',
            data: stdProbs,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Observed Probability',
            data: actualProbs,
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
    
    // Information metrics section if available
    if (data.informationMetrics) {
      const metrics = data.informationMetrics;
      informationMetricsSection = (
        <ChartContainer>
          <h3>
            Information Metrics
            <InfoTooltip>
              <span className="icon">i</span>
              <span className="tooltip-content">
                These metrics quantify the information theoretic aspects of consciousness-quantum interaction.
                Lower entropy difference suggests consciousness influence is preserving quantum information.
              </span>
            </InfoTooltip>
          </h3>
          <ResultMetrics>
            <MetricCard>
              <h3>Shannon Entropy Δ</h3>
              <MetricValue success={metrics.entropyDifference < 0}>
                {metrics.entropyDifference.toFixed(4)}
              </MetricValue>
              <MetricStatus>
                {metrics.entropyDifference < 0 ? 'Reduced entropy (expected)' : 'Increased entropy'}
              </MetricStatus>
            </MetricCard>
            <MetricCard>
              <h3>Mutual Information</h3>
              <MetricValue success={metrics.mutualInformation > 0.1}>
                {metrics.mutualInformation.toFixed(4)}
              </MetricValue>
              <MetricStatus>
                {metrics.mutualInformation > 0.1 ? 'Significant correlation' : 'Weak correlation'}
              </MetricStatus>
            </MetricCard>
          </ResultMetrics>
        </ChartContainer>
      );
    }
    
    return (
      <>
        <ResultHeader>
          <h2>Simulation Results</h2>
          <button onClick={() => setShowHelp(!showHelp)}>
            {showHelp ? 'Hide Help' : 'Understanding Results'}
          </button>
        </ResultHeader>

        {showHelp && (
          <HelpPanel>
            <h4>Interpreting Consciousness-Quantum Simulation Results</h4>
            <p>
              This simulation tests the hypothesis that consciousness can influence quantum measurement 
              outcomes in a statistically meaningful way. The key measures of success are:
            </p>
            <ul>
              <li><strong>Reconstruction Error:</strong> How accurately we can reconstruct the original conscious state from measurement statistics. Lower values indicate success.</li>
              <li><strong>Vector Comparison:</strong> Visual comparison of original conscious state with its reconstruction from quantum measurements.</li>
              <li><strong>Probability Deviation:</strong> Difference between standard quantum probabilities (|α<sub>i</sub>|<sup>2</sup>) and the observed probabilities with consciousness influence.</li>
              <li><strong>Information Metrics:</strong> Measures like entropy difference and mutual information quantify the information-theoretic aspects of the interaction.</li>
            </ul>
            <p>
              Based on the theoretical framework, we expect: (1) significant probability deviations, 
              (2) accurate state reconstruction, and (3) reduced entropy in the measurement statistics.
            </p>
          </HelpPanel>
        )}

        <TabContainer>
          <Tab active={activeView === 'summary'} onClick={() => setActiveView('summary')}>
            Summary
          </Tab>
          <Tab active={activeView === 'detailed'} onClick={() => setActiveView('detailed')}>
            Detailed Analysis
          </Tab>
        </TabContainer>

        {activeView === 'summary' && (
          <>
            <ResultMetrics>
              <MetricCard>
                <h3>
                  Reconstruction Error
                  <InfoTooltip>
                    <span className="icon">i</span>
                    <span className="tooltip-content">
                      Quantifies how accurately the original conscious state can be reconstructed
                      from quantum measurement outcomes. Lower values indicate stronger consciousness-quantum coupling.
                    </span>
                  </InfoTooltip>
                </h3>
                <MetricValue success={data.belowThreshold}>
                  {data.error.toFixed(4)}
                </MetricValue>
                <MetricStatus success={data.belowThreshold}>
                  {data.belowThreshold 
                    ? '✓ Below threshold (supports hypothesis)' 
                    : '✗ Above threshold (against hypothesis)'}
                </MetricStatus>
              </MetricCard>
              
              {data.verificationCriteria && (
                <>
                  <MetricCard>
                    <h3>
                      Probability Deviation
                      <InfoTooltip>
                        <span className="icon">i</span>
                        <span className="tooltip-content">
                          Statistical significance of deviations from standard quantum probabilities.
                          Significant deviation (p &lt; 0.05) supports consciousness influence.
                        </span>
                      </InfoTooltip>
                    </h3>
                    <MetricValue success={data.verificationCriteria.deviationSignificant}>
                      {data.verificationCriteria.deviationPValue.toFixed(4)}
                    </MetricValue>
                    <MetricStatus success={data.verificationCriteria.deviationSignificant}>
                      {data.verificationCriteria.deviationSignificant 
                        ? 'Significant deviation (p-value)' 
                        : 'Non-significant deviation'}
                    </MetricStatus>
                  </MetricCard>

                  <MetricCard>
                    <h3>
                      Coherence Correlation
                      <InfoTooltip>
                        <span className="icon">i</span>
                        <span className="tooltip-content">
                          Correlation between coherence level and measured quantum deviations.
                          Strong positive correlation supports consciousness influence model.
                        </span>
                      </InfoTooltip>
                    </h3>
                    <MetricValue success={data.verificationCriteria.coherenceCorrelated}>
                      {data.verificationCriteria.coherenceCorrelation.toFixed(4)}
                    </MetricValue>
                    <MetricStatus success={data.verificationCriteria.coherenceCorrelated}>
                      {data.verificationCriteria.coherenceCorrelated 
                        ? 'Correlated with coherence' 
                        : 'Not correlated with coherence'}
                    </MetricStatus>
                  </MetricCard>
                </>
              )}
            </ResultMetrics>
            
            <ChartSection>
              <ChartContainer>
                <h3>
                  Vector Comparison
                  <InfoTooltip>
                    <span className="icon">i</span>
                    <span className="tooltip-content">
                      Comparison between the original conscious state vector and its reconstruction
                      from quantum measurement statistics. Closer alignment supports the hypothesis.
                    </span>
                  </InfoTooltip>
                </h3>
                <Line 
                  data={vectorChartData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        min: -1,
                        max: 1,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#aaa'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#aaa'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: '#ddd'
                        }
                      }
                    }
                  }}
                />
              </ChartContainer>
              
              <ChartContainer>
                <h3>
                  Quantum Collapse Pattern
                  <InfoTooltip>
                    <span className="icon">i</span>
                    <span className="tooltip-content">
                      Distribution of quantum measurement outcomes. Deviations from flat
                      distribution suggest non-random patterns influenced by consciousness.
                    </span>
                  </InfoTooltip>
                </h3>
                <Bar 
                  data={collapseChartData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#aaa'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#aaa'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: '#ddd'
                        }
                      }
                    }
                  }}
                />
              </ChartContainer>
            </ChartSection>
          </>
        )}

        {activeView === 'detailed' && (
          <>
            <ChartSection>
              {deviationData && (
                <ChartContainer>
                  <h3>
                    Probability Deviation Analysis
                    <InfoTooltip>
                      <span className="icon">i</span>
                      <span className="tooltip-content">
                        Compares standard quantum probabilities (|α|²) with observed probabilities.
                        Systematic deviations support the consciousness influence hypothesis.
                      </span>
                    </InfoTooltip>
                  </h3>
                  <Bar 
                    data={deviationData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          },
                          ticks: {
                            color: '#aaa'
                          }
                        },
                        x: {
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          },
                          ticks: {
                            color: '#aaa'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: '#ddd'
                          }
                        }
                      }
                    }}
                  />
                </ChartContainer>
              )}
              
              {informationMetricsSection}

              {data.nullHypothesesRejected && (
                <ChartContainer>
                  <h3>
                    Null Hypothesis Testing
                    <InfoTooltip>
                      <span className="icon">i</span>
                      <span className="tooltip-content">
                        Formal scientific testing of the null hypotheses. Rejection of null
                        hypotheses supports the consciousness-quantum interaction theory.
                      </span>
                    </InfoTooltip>
                  </h3>
                  <ResultMetrics>
                    <MetricCard>
                      <h3>H₀: No Deviation</h3>
                      <MetricValue success={data.nullHypothesesRejected.h0_no_deviation}>
                        {data.nullHypothesesRejected.h0_no_deviation ? 'Rejected' : 'Accepted'}
                      </MetricValue>
                      {data.nullHypothesesPValues && (
                        <MetricStatus>
                          p-value: {data.nullHypothesesPValues.h0_no_deviation.toFixed(4)}
                        </MetricStatus>
                      )}
                    </MetricCard>
                    <MetricCard>
                      <h3>H₀: No Correlation</h3>
                      <MetricValue success={data.nullHypothesesRejected.h0_no_correlation}>
                        {data.nullHypothesesRejected.h0_no_correlation ? 'Rejected' : 'Accepted'}
                      </MetricValue>
                      {data.nullHypothesesPValues && (
                        <MetricStatus>
                          p-value: {data.nullHypothesesPValues.h0_no_correlation.toFixed(4)}
                        </MetricStatus>
                      )}
                    </MetricCard>
                    <MetricCard>
                      <h3>H₀: Unreconstructable</h3>
                      <MetricValue success={data.nullHypothesesRejected.h0_unreconstructable}>
                        {data.nullHypothesesRejected.h0_unreconstructable ? 'Rejected' : 'Accepted'}
                      </MetricValue>
                      {data.nullHypothesesPValues && (
                        <MetricStatus>
                          p-value: {data.nullHypothesesPValues.h0_unreconstructable.toFixed(4)}
                        </MetricStatus>
                      )}
                    </MetricCard>
                  </ResultMetrics>
                </ChartContainer>
              )}
            </ChartSection>
          </>
        )}
      </>
    );
  };

  const renderBatchResults = (data: BatchTestResponse) => {
    // Prepare data for batch test results chart
    const resultLabels = data.results.map(r => `Test ${r.testId}`);
    const errorValues = data.results.map(r => r.error);
    const thresholdLine = Array(data.results.length).fill(data.threshold);
    
    const batchChartData = {
      labels: resultLabels,
      datasets: [
        {
          label: 'Reconstruction Error',
          data: errorValues,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          type: 'bar' as const,
        },
        {
          label: 'Threshold',
          data: thresholdLine,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          type: 'line' as const,
          fill: false,
        },
      ],
    };
    
    return (
      <>
        <ResultHeader>
          <h2>Batch Test Results</h2>
          <button onClick={() => setShowHelp(!showHelp)}>
            {showHelp ? 'Hide Help' : 'Understanding Results'}
          </button>
        </ResultHeader>

        {showHelp && (
          <HelpPanel>
            <h4>Understanding Batch Test Results</h4>
            <p>
              Batch testing evaluates the consistency of the consciousness-quantum interaction
              across multiple trials. This helps establish statistical significance and rule out
              random fluctuations.
            </p>
            <ul>
              <li><strong>Success Rate:</strong> Percentage of tests where reconstruction error was below threshold.</li>
              <li><strong>Individual Tests:</strong> Error values for each test compared to threshold.</li>
              <li><strong>Statistical Significance:</strong> Success rates significantly above chance (50%) support the hypothesis.</li>
            </ul>
          </HelpPanel>
        )}

        <ResultMetrics>
          <MetricCard>
            <h3>
              Success Rate
              <InfoTooltip>
                <span className="icon">i</span>
                <span className="tooltip-content">
                  Percentage of tests where the reconstruction error was below threshold.
                  Higher values indicate more consistent consciousness-quantum interaction.
                </span>
              </InfoTooltip>
            </h3>
            <MetricValue success={data.successRate > 0.5}>
              {(data.successRate * 100).toFixed(1)}%
            </MetricValue>
            <MetricStatus success={data.successRate > 0.5}>
              {data.successRate > 0.5 
                ? 'Above chance level (supports hypothesis)' 
                : 'Below chance level (against hypothesis)'}
            </MetricStatus>
          </MetricCard>
          
          <MetricCard>
            <h3>
              Threshold
              <InfoTooltip>
                <span className="icon">i</span>
                <span className="tooltip-content">
                  Maximum acceptable error for reconstruction. Lower thresholds
                  enforce stricter criteria for hypothesis acceptance.
                </span>
              </InfoTooltip>
            </h3>
            <MetricValue>
              {data.threshold.toFixed(3)}
            </MetricValue>
            <MetricStatus>
              Error threshold (η)
            </MetricStatus>
          </MetricCard>
        </ResultMetrics>
        
        <ChartSection>
          <ChartContainer>
            <h3>
              Test Results
              <InfoTooltip>
                <span className="icon">i</span>
                <span className="tooltip-content">
                  Individual test results showing reconstruction error compared to threshold.
                  Tests with bars below the threshold line support the hypothesis.
                </span>
              </InfoTooltip>
            </h3>
            <Line
              data={batchChartData as any}
              options={{
                responsive: true,
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#aaa'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#aaa'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#ddd'
                    }
                  }
                }
              }}
            />
          </ChartContainer>
        </ChartSection>
      </>
    );
  };

  return (
    <ResultsContainer>
      {isSimulationResponse(results) && renderSimulationResults(results)}
      {isBatchTestResponse(results) && renderBatchResults(results)}
    </ResultsContainer>
  );
};

export default SimulationResults; 