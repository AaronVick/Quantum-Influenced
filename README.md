# Consciousness-Quantum Interaction Simulator

A web application that simulates and tests the theoretical framework for consciousness-quantum interactions.

## Project Overview

This application provides a platform to explore and test a theoretical framework that connects consciousness and quantum mechanics. The framework proposes that conscious states can influence quantum collapse patterns in a measurable way and that these patterns can be used to reconstruct the original conscious states.

### Key Features

1. Define parametric "conscious states" (C) as vectors
2. Generate simulated quantum collapse patterns (π) based on these states
3. Use machine learning to reconstruct conscious states from collapse patterns
4. Calculate reconstruction error and determine if it falls below threshold η
5. Visualize original states, collapse patterns, and reconstructed states
6. Generate mathematical proofs using LLM API


Currently Implemented:
Basic Consciousness State Representation:
Simple vector representation with normalization
Basic perturbation function using sinusoidal modulation
Missing: coherence level, phase modulation function
Basic Quantum Simulator:
Perturbation calculation with scale limit constraint
Probability conservation constraint
Missing: quantum coherence dependence, phase information, scale resonance
Simple ML Reconstruction:
Simplified reconstruction using PCA
Error calculation using cosine distance
Missing: phase information handling, Bayesian methods, neural networks
Basic Constraint Analysis:
Frontend implementation of probability conservation check
Simplified energy neutrality check
Scale limit constraint
Simple linear correlation check
Missing: advanced statistical analysis, phase correlation
Simple Framework Testing:
Basic threshold-based reconstruction error verification
Missing: the three-criteria verification framework with statistical significance
Not Currently Implemented:
Quantum Phase Modulation: The code doesn't implement the phase modulation mechanism described in the README.
Coherence Mechanisms: No tracking or calculation of coherence levels (neural or quantum).
Scale Bridging: No implementation of the scale resonance function.
Advanced Statistical Analysis: No implementation of:
Temporal-spectral decomposition
Wavelet analysis
Multi-scale entropy
Bayesian change point detection
Three-Criteria Verification Framework: The full verification framework isn't implemented.


## Project Structure

```
├── api/                     # Vercel serverless functions
│   ├── simulate.py          # Simulation endpoint
│   ├── generate-proof.py    # Proof generation endpoint
│   ├── test-framework.py    # Batch testing endpoint
│   └── requirements.txt     # Python dependencies for serverless functions
├── backend/                  # Flask backend (local development)
│   ├── src/                  # Backend source code
│   │   ├── conscious_state.py  # Conscious state representation
│   │   ├── quantum_simulator.py  # Quantum collapse simulator
│   │   ├── ml_reconstructor.py  # Machine learning reconstructor
│   │   └── llm_interface.py  # Interface to Claude LLM
│   ├── app.py                # Main Flask application
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   └── src/                  # Frontend source code
│       ├── components/       # React components
│       └── services/         # API services
└── docs/                     # Documentation
    └── theoretical_framework.md  # Framework explanation
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Anthropic API key (for Claude integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/consciousness-quantum-simulator.git
   cd consciousness-quantum-simulator
   ```

2. Set up the backend (for local development):
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   # Edit backend/.env
   ANTHROPIC_API_KEY=your_api_key_here
   MODEL_NAME=claude-3-opus-20240229
   ```

4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application Locally

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deploying to Vercel

### Setup

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Configure environment variables in Vercel:
   - ANTHROPIC_API_KEY: Your Anthropic API key
   - MODEL_NAME: The Claude model name (e.g., "claude-3-opus-20240229")
   - REACT_APP_API_URL: The URL of your API (usually `https://your-project-domain.vercel.app/api`)

### Deploy

From the project root directory, run:
```bash
vercel
```

### Environment Variables

Create a `.env` file in the frontend directory with the following variable:
```
REACT_APP_API_URL=https://your-project-domain.vercel.app/api
```

## Using the Application

1. **Define Conscious State**:
   - Set the dimension of the conscious state vector
   - Manually input vector components or use the randomize button
   - Set the error threshold (η)

2. **Run Simulation**:
   - Click "Run Simulation" to generate quantum collapse patterns
   - View the reconstruction results and error

3. **Generate Mathematical Proofs**:
   - Enter a query about the theoretical framework
   - Click "Generate Mathematical Proof" to get a proof from Claude

## Theoretical Framework

The application is based on a theoretical framework that connects consciousness and quantum mechanics. The key elements of this framework are:

- Conscious states (C) represented as vectors
- Quantum collapse patterns (π) influenced by conscious states via P_C(i) = |α_i|² + δ_C(i)
- A reconstruction function M that attempts to recover C from π
- Error threshold η that determines if the reconstruction is successful

For more details, see [docs/theoretical_framework.md](docs/theoretical_framework.md).

## Core Algorithms and Mathematical Implementation

The application implements several key algorithms that drive the theoretical framework testing:

### 1. Quantum Collapse Simulator

The simulation of quantum collapse patterns influenced by conscious states is the core of the framework, implemented as:

```python
def calculate_quantum_state(self, initial_state, conscious_state):
    """
    Calculate the quantum state including both amplitude and phase information
    influenced by a conscious state.
    """
    # Initialize with standard quantum amplitudes (complex numbers)
    amplitudes = np.array([complex(np.sqrt(p), 0) for p in initial_state])
    
    # Apply conscious influence through phase modulation
    # This implements the quantum phase modulation mechanism from the paper
    phase_shifts = np.array([
        conscious_state.phase_modulation(i) 
        for i in range(len(amplitudes))
    ])
    
    # Apply phase shifts (energy-neutral influence)
    modified_amplitudes = amplitudes * np.exp(1j * phase_shifts)
    
    # Ensure normalization is preserved
    norm = np.sqrt(np.sum(np.abs(modified_amplitudes)**2))
    if norm > 0:
        modified_amplitudes = modified_amplitudes / norm
        
    return modified_amplitudes

def calculate_perturbation(self, conscious_state, standard_probs, coherence_level):
    """
    Calculate probability perturbations with coherence scaling factor
    """
    # Get raw perturbation values from conscious state
    raw_perturbation = np.array([
        conscious_state.perturbation_function(i)
        for i in range(self.num_basis_states)
    ])
    
    # Scale perturbation by coherence level (Γ^α as specified in the paper)
    # |δ_C| ∝ Γ^α for some α > 0
    coherence_factor = coherence_level ** self.alpha  # α typically around 1.5
    raw_perturbation = raw_perturbation * coherence_factor
    
    # Apply Section X constraints:
    
    # 1. Scale Limit: |δ_C(i)| ≤ ϵ·|α_i|²
    max_perturbation = self.epsilon * standard_probs
    raw_perturbation = np.clip(raw_perturbation, -max_perturbation, max_perturbation)
    
    # 2. Probability Conservation: ∑ δ_C(i) = 0
    current_sum = np.sum(raw_perturbation)
    raw_perturbation = raw_perturbation - (current_sum / self.num_basis_states)
    
    return raw_perturbation
```

This algorithm enforces the theoretical constraints of:
- Scale Limit: Perturbations are bounded by quantum uncertainty
- Probability Conservation: No net probability creation/destruction
- Energy Neutrality: Consciousness influence preserves expected energy
- Coherence Dependence: Effect scales with quantum coherence level

### 2. Consciousness State Representation

Conscious states are represented as normalized vectors in high-dimensional space with both magnitude and phase modulation capabilities:

```python
def __init__(self, vector, coherence_level=0.8):
    self.vector = np.array(vector, dtype=np.float32)
    self.dimension = len(vector)
    self.coherence_level = coherence_level  # Neural coherence ΓEEG
    
    # Normalize the vector
    norm = np.linalg.norm(self.vector)
    if norm > 0:
        self.vector = self.vector / norm

def perturbation_function(self, index):
    """Probability perturbation function δ_C(i)"""
    # Using a sinusoidal perturbation that depends on the conscious state
    weights = self.vector
    phase = sum(w * np.sin(i * np.pi / self.dimension) for i, w in enumerate(weights))
    return 0.1 * np.sin(index * np.pi / self.dimension + phase)

def phase_modulation(self, index):
    """Phase modulation function γ_i for quantum phase shifts"""
    # This implements the energy-neutral influence through phase modulation
    # The phase shifts preserve energy while altering measurement probabilities
    weights = self.vector
    phase_factor = sum(w * np.cos(i * np.pi / self.dimension) for i, w in enumerate(weights))
    return phase_factor * np.sin(index * np.pi / (2 * self.dimension))
```

### 3. Scale Bridging Mechanism

The framework implements the scale-bridging mechanism that connects neural-scale processes with quantum phenomena:

```python
def scale_resonance(self, neural_coherence, quantum_coherence, frequency_components):
    """
    Implements the scale resonance function from the paper that bridges
    neural coherence with quantum effects
    """
    # Calculate resonant frequency where neural and quantum scales couple
    resonant_freq = self._calculate_resonant_frequency(
        neural_coherence, quantum_coherence
    )
    
    # Calculate coupling strength based on matching between neural oscillations
    # and the resonant frequency
    coupling_strength = 0.0
    for freq, power in frequency_components:
        # Lorentzian resonance function
        coupling_strength += power / (1 + ((freq - resonant_freq) / self.bandwidth)**2)
    
    # Scale factor determines strength of consciousness-quantum coupling
    return coupling_strength / self.normalization_factor
```

### 4. Machine Learning Reconstruction Algorithm

The framework uses machine learning to reconstruct conscious states from collapse patterns:

```python
def reconstruct(self, collapse_pattern, phase_information=None, original_state=None):
    """
    Reconstruct a conscious state from quantum measurement outcomes
    with bounded error verification
    """
    normalized_pattern = self._normalize_collapse_pattern(collapse_pattern)
    
    if phase_information is not None:
        # Use both probability and phase information for reconstruction
        combined_input = np.concatenate([normalized_pattern, phase_information])
    else:
        combined_input = normalized_pattern
    
    if self.method == 'neural_network':
        # Deep learning reconstruction model
        reconstructed_vector = self.neural_model.predict(
            combined_input.reshape(1, -1)
        ).flatten()
    elif self.method == 'bayesian':
        # Bayesian inference approach
        reconstructed_vector = self._bayesian_reconstruction(combined_input)
    else:
        # Basic PCA-based method
        pca = PCA(n_components=min(10, len(combined_input)))
        reconstructed_vector = pca.fit_transform(
            combined_input.reshape(1, -1)
        ).flatten()
    
    # Create a conscious state from the reconstructed vector
    reconstructed_state = ConsciousState(reconstructed_vector)
    
    # Calculate error if original state is provided
    error = 0.0
    if original_state is not None:
        error = self._calculate_error(original_state, reconstructed_state)
    
    # Verification of bounded error (Axiom 3 from paper)
    is_valid_reconstruction = error < self.eta_threshold
    
    return reconstructed_state, error, is_valid_reconstruction
```

### 5. Advanced Statistical Analysis

The framework provides comprehensive statistical analysis including advanced methods specified in the paper:

```javascript
function analyzeQuantumPatterns(results) {
  // Basic statistical analysis
  const { observedProbs, expectedProbs, deviations } = calculateBasicStatistics(results);
  
  // Advanced statistical analysis as specified in the paper
  
  // 1. Temporal-spectral decomposition
  const spectralAnalysis = calculateFourierTransform(deviations);
  const spectralPeaks = findSignificantPeaks(spectralAnalysis.powerSpectrum);
  
  // 2. Wavelet analysis for localized patterns
  const waveletCoefficients = performWaveletTransform(deviations);
  const significantWavelets = identifySignificantCoefficients(waveletCoefficients);
  
  // 3. Multi-scale entropy analysis
  const entropyScales = calculateMultiScaleEntropy(deviations);
  const entropyProfile = entropyScales.map((e, i) => ({ scale: i+1, entropy: e }));
  
  // 4. Bayesian change point detection
  const changePoints = detectBayesianChangePoints(deviations);
  
  // 5. Information-theoretic analysis
  const mutualInformation = calculateMutualInformation(
    deviations, 
    results.originalState.vector
  );
  
  // Coherence analysis (ΓEEG correlation)
  const coherenceCorrelation = correlateWithCoherence(
    deviations,
    results.neuralCoherence
  );
  
  return {
    basicStats: { observedProbs, expectedProbs, deviations },
    spectralAnalysis,
    significantWavelets,
    entropyProfile,
    changePoints,
    mutualInformation,
    coherenceCorrelation
  };
}
```

### 6. Complete Verification Framework

The application implements the three-criteria verification framework from the paper:

```javascript
function verifyConsciousnessAccess(results, analysis) {
  // The three verification criteria from the paper:
  
  // 1. Criterion: Produces collapse patterns that deviate from quantum randomness
  const deviationSignificance = calculateStatisticalSignificance(
    analysis.deviations,
    analysis.bootstrapSamples
  );
  const criterion1Satisfied = deviationSignificance.pValue < 0.001;
  
  // 2. Criterion: Deviations correlate with reported subjective experiences
  // (simulated in our framework via correlation with the conscious state vector)
  const subjectiveCorrelation = analysis.coherenceCorrelation.pearson;
  const criterion2Satisfied = subjectiveCorrelation > 0.7; // threshold from paper
  
  // 3. Criterion: System can reconstruct conscious states with bounded error
  const reconstructionError = results.reconstructionError;
  const criterion3Satisfied = reconstructionError < results.eta; // η threshold from paper
  
  // Overall verification - all three criteria must be satisfied
  const isVerified = criterion1Satisfied && criterion2Satisfied && criterion3Satisfied;
  
  return {
    isVerified,
    criteria: {
      deviationFromRandomness: {
        satisfied: criterion1Satisfied,
        value: deviationSignificance.pValue,
        threshold: 0.001
      },
      subjectiveCorrelation: {
        satisfied: criterion2Satisfied,
        value: subjectiveCorrelation,
        threshold: 0.7
      },
      boundedReconstruction: {
        satisfied: criterion3Satisfied,
        value: reconstructionError,
        threshold: results.eta
      }
    }
  };
}
```

## Testing Workflow

The testing workflow for validating the theoretical framework involves five stages as specified in the paper:

1. **Defining conscious states**: Set up parameterized vectors representing conscious states with associated neural coherence levels (ΓEEG)

2. **Simulating quantum collapse**: Generate quantum collapse patterns influenced by these states, accounting for:
   - Quantum coherence levels (ΓQ)
   - Scale resonance between neural and quantum systems
   - Phase modulation (energy-neutral influence)
   - Probability perturbations bounded by theoretical constraints

3. **Reconstructing conscious states**: Apply ML algorithms to recover the original state with bounded error (η)

4. **Analyzing against theoretical constraints**:
   - Probability conservation: ∑ δ_C(i) = 0
   - Energy neutrality
   - Scale limit: |δ_C(i)| ≤ ϵ·|α_i|²
   - Quantum linearity
   - Coherence dependence: |δ_C| ∝ Γ^α

5. **Verification framework**:
   - Criterion 1: Quantum randomness deviation (statistical significance)
   - Criterion 2: Correlation with subjective experience (coherence correlation)
   - Criterion 3: Bounded error reconstruction (error < η)

This complete testing workflow provides a rigorous methodology for evaluating the consciousness-quantum interaction framework against all aspects specified in the theoretical paper.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by theoretical models in quantum consciousness
- Built with React, Vercel Serverless Functions, and Claude API 