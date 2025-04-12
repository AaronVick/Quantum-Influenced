import axios from 'axios';

// Use environment variable with fallback to local development URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface SimulationRequest {
  consciousState: {
    vector: number[];
  };
  threshold: number;
}

export interface ExperimentParams {
  // Core parameters
  numTests: number;
  dimension: number;
  threshold: number;
  
  // Consciousness parameters
  neuralCoherence?: number;
  quantumCoherence?: number;
  
  // Control conditions
  includeControlConditions?: boolean;
  controlTypes?: ('sham' | 'thermal' | 'em_noise' | 'random')[];
  
  // Statistical parameters
  significanceLevel?: number;  // Alpha threshold (default: 0.05)
  useBayesianAnalysis?: boolean;
  priorDistribution?: 'uniform' | 'normal' | 'informed'; // Type of prior for Bayesian analysis
  
  // Advanced settings
  preRegistered?: boolean;     // Whether analysis plan is pre-registered
  multipleComparisonCorrection?: 'bonferroni' | 'fdr' | 'holm' | 'none';
  minimumSampleSize?: number;  // Calculate minimum required sample size
  
  // External data integration
  externalDataSource?: 'qrng' | 'eeg' | 'local';
  externalDataPath?: string;   // Path to external data file
}

export interface SimulationResponse {
  originalState: {
    vector: number[];
    dimension: number;
  };
  collapsePatterns: number[];
  reconstructedState: {
    vector: number[];
    dimension: number;
  };
  error: number;
  belowThreshold: boolean;
  
  // Data source tracking
  dataSourceType?: 'synthetic' | 'simulation' | 'behavioral' | 'eeg' | 'neuroimaging' | 'qrng';
  importTimestamp?: string;
  
  // Extended fields for simulation results
  simulationResults?: {
    originalState: {
      vector: number[];
      dimension: number;
      coherence_level?: number;
    };
    collapsePatterns: number[];
    finalProbabilities?: number[];
    standardProbabilities?: number[];
    phaseInformation?: number[];
    perturbation?: number[];
  };
  
  // Visualization data
  deviationData?: Array<{
    state: string;
    deviation: number;
    baseline: number;
  }>;
  
  phaseModulation?: Array<{
    phase: number;
    amplitude: number;
  }>;
  
  phaseDistribution?: Array<{
    measured: number;
    expected: number;
  }>;
  
  // Verification framework fields
  verificationCriteria?: {
    deviationSignificant: boolean;
    deviationPValue: number;
    chiSquare: number;
    coherenceCorrelated: boolean;
    coherenceCorrelation: number;
    boundedReconstruction: boolean;
    reconstructionError: number;
    etaThreshold: number;
    probabilityConserved: boolean;
    probabilitySum: number;
    allCriteriaSatisfied: boolean;
  };
  
  // Null hypothesis testing fields
  nullHypothesesRejected?: {
    h0_no_deviation: boolean;
    h0_no_correlation: boolean;
    h0_unreconstructable: boolean;
    h0_random_fluctuation: boolean;
    [key: string]: boolean;
  };
  
  nullHypothesesPValues?: {
    h0_no_deviation: number;
    h0_no_correlation: number;
    h0_unreconstructable: number;
    h0_random_fluctuation: number;
    [key: string]: number;
  };
  
  nullHypothesesEffectSizes?: {
    h0_no_deviation: number;
    h0_no_correlation: number;
    h0_unreconstructable: number;
    h0_random_fluctuation: number;
    [key: string]: number;
  };
  
  controlComparisons?: {
    h0_no_deviation: any;
    h0_no_correlation: any;
    h0_unreconstructable: any;
    h0_random_fluctuation: any;
    [key: string]: any;
  };
  
  nullHypotheses?: {
    h0_no_deviation: string;
    h0_no_correlation: string;
    h0_unreconstructable: string;
    h0_random_fluctuation: string;
    [key: string]: string;
  };
  
  // Information metrics fields
  informationMetrics?: {
    shannonEntropy: number;
    expectedEntropy: number;
    entropyDifference: number;
    multiScaleEntropy: number[];
    mutualInformation: number;
    spectralPeakFrequency: number;
    spectralEntropy: number;
    entropy?: number[];
    baseline?: number[];
  };
  
  // Bayesian analysis fields
  bayesianAnalysis?: {
    posteriorProbabilities: {
      [hypothesis: string]: number;
    };
    bayesFactors: {
      [comparison: string]: number;
    };
    credibleIntervals: {
      [parameter: string]: [number, number];  // 95% credible interval [lower, upper]
    };
  };
  
  // Control condition results
  controlResults?: {
    type: string;
    verificationCriteria?: any;
    nullHypothesesRejected?: any;
    informationMetrics?: any;
    deviationFromExperimental?: number;
  }[];
  
  // Statistical power analysis
  powerAnalysis?: {
    requiredSampleSize: number;
    achievedPower: number;
    effectSizeEstimate: number;
  };
  
  // Quantitative predictions evaluation
  quantitativePredictions?: any;
  predictionEvaluations?: any;
  
  // Metadata
  experimentId?: string;
  timestamp?: string;
  experimentProtocol?: string;  // Reference to protocol document
  preRegistrationLink?: string;  // Link to pre-registered analysis plan
}

export interface ProofRequest {
  query: string;
}

export interface ProofResponse {
  proof: string;
}

export interface BatchTestRequest {
  numTests: number;
  dimension: number;
  threshold: number;
}

export interface BatchTestResponse {
  results: Array<{
    testId: number;
    error: number;
    belowThreshold: boolean;
  }>;
  successRate: number;
  threshold: number;
}

export interface DataImportParams {
  dataType: 'qrng' | 'eeg' | 'neuroimaging' | 'behavioral';
  sourceType: 'file' | 'api' | 'device';
  source: string;  // File path, API endpoint, or device identifier
  format?: 'csv' | 'json' | 'binary' | 'edf' | 'nifti';
  parameters?: Record<string, any>;  // Additional format-specific parameters
  dataSourceType?: 'synthetic' | 'simulation' | 'behavioral' | 'eeg' | 'neuroimaging' | 'qrng';
  useSyntheticData?: boolean;  // Flag to use synthetic data when actual equipment isn't available
}

export interface ExperimentalProtocol {
  title: string;
  authors: string[];
  date: string;
  version: string;
  description: string;
  experimentId?: string;
  hypotheses: {
    id: string;
    description: string;
    predictions: string[];
  }[];
  methods: {
    participants: string;
    apparatus: string;
    procedure: string;
    dataAnalysis: string;
  };
  preRegistration: boolean;
  downloadUrl?: string;
}

export interface ProtocolGenerationResponse {
  success: boolean;
  protocol?: ExperimentalProtocol;
  error?: string;
}

export const runSimulation = async (
  consciousState: number[],
  threshold: number = 0.1
): Promise<SimulationResponse> => {
  const response = await axios.post<SimulationResponse>(
    `${API_URL}/simulate`,
    {
      consciousState: {
        vector: consciousState
      },
      threshold
    }
  );
  return response.data;
};

export const generateProof = async (
  query: string
): Promise<ProofResponse> => {
  const response = await axios.post<ProofResponse>(
    `${API_URL}/generate-proof`,
    { query }
  );
  return response.data;
};

export const runExperiment = async (
  params: ExperimentParams
): Promise<SimulationResponse> => {
  const response = await axios.post<SimulationResponse>(
    `${API_URL}/test-framework`,
    params
  );
  return response.data;
};

export const importExternalData = async (
  params: DataImportParams
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await axios.post<{ success: boolean; data?: any; error?: string }>(
      `${API_URL}/import-data`,
      params
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const generateExperimentalProtocol = async (
  protocolData: Partial<ExperimentalProtocol>
): Promise<ProtocolGenerationResponse> => {
  try {
    const response = await fetch('/api/generate-protocol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(protocolData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to generate protocol',
      };
    }

    const data = await response.json();
    return {
      success: true,
      protocol: data.protocol,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const runBatchTests = async (
  numTests: number = 10,
  dimension: number = 10,
  threshold: number = 0.1
): Promise<BatchTestResponse> => {
  const response = await axios.post<BatchTestResponse>(
    `${API_URL}/test-framework`,
    {
      numTests,
      dimension,
      threshold
    }
  );
  return response.data;
};

export const simulateQuantumInteraction = async (
  consciousState: number[],
  threshold: number = 0.1
): Promise<SimulationResponse> => {
  // This is just an alias for runSimulation for backward compatibility
  return runSimulation(consciousState, threshold);
}; 