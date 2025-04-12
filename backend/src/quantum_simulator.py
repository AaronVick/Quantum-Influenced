import numpy as np
from .conscious_state import ConsciousState

class QuantumSimulator:
    """
    Simulates quantum collapse patterns based on conscious states.
    
    In the theoretical framework, quantum collapse patterns (π) are influenced
    by conscious states (C) according to the formula:
    P_C(i) = |α_i|² + δ_C(i)
    
    where |α_i|² is the standard quantum probability and δ_C(i) is the
    perturbation function that depends on the conscious state.
    """
    
    def __init__(self, num_basis_states=100, num_samples=1000, epsilon=1e-6, alpha=1.5):
        """
        Initialize the quantum simulator.
        
        Args:
            num_basis_states (int): Number of basis states in the quantum system
            num_samples (int): Number of collapse samples to generate
            epsilon (float): Scale limit factor for perturbation (ϵ ≪ 1)
            alpha (float): Exponent for coherence scaling (|δ_C| ∝ Γ^α)
        """
        self.num_basis_states = num_basis_states
        self.num_samples = num_samples
        self.epsilon = epsilon  # Scale limit factor
        self.alpha = alpha      # Coherence scaling exponent
        self.quantum_coherence = 0.9  # Default quantum coherence level (ΓQ)
    
    def set_quantum_coherence(self, coherence_level):
        """
        Set the quantum coherence level of the system.
        
        Args:
            coherence_level (float): Quantum coherence level (ΓQ) between 0 and 1
        """
        self.quantum_coherence = max(0.0, min(1.0, coherence_level))
    
    def generate_standard_probabilities(self):
        """
        Generate standard quantum probabilities |α_i|².
        
        Returns:
            tuple: (np.ndarray, np.ndarray) - (probabilities, complex amplitudes)
        """
        # Generate random complex amplitudes
        amplitudes = np.random.normal(0, 1, self.num_basis_states) + \
                     1j * np.random.normal(0, 1, self.num_basis_states)
        
        # Normalize to ensure sum of probabilities is 1
        norm = np.sqrt(np.sum(np.abs(amplitudes) ** 2))
        amplitudes = amplitudes / norm
        
        # Calculate probabilities from amplitudes
        probabilities = np.abs(amplitudes) ** 2
        
        return probabilities, amplitudes
    
    def calculate_quantum_state(self, amplitudes, conscious_state):
        """
        Calculate the quantum state influenced by a conscious state through phase modulation.
        
        This implements the energy-neutral influence mechanism from the theoretical framework.
        
        Args:
            amplitudes (np.ndarray): Complex amplitudes of the quantum state
            conscious_state (ConsciousState): The conscious state
            
        Returns:
            np.ndarray: Modified complex amplitudes
        """
        # Apply phase modulation based on the conscious state
        phase_shifts = np.array([
            conscious_state.phase_modulation(i) 
            for i in range(self.num_basis_states)
        ])
        
        # Scale phase shifts by coherence levels
        # Scale factor is determined by both neural and quantum coherence
        coherence_factor = (
            conscious_state.coherence_level * 
            self.quantum_coherence
        ) ** self.alpha
        
        phase_shifts = phase_shifts * coherence_factor
        
        # Apply phase shifts (energy-neutral influence)
        modified_amplitudes = amplitudes * np.exp(1j * phase_shifts)
        
        # Ensure normalization is preserved
        norm = np.sqrt(np.sum(np.abs(modified_amplitudes)**2))
        modified_amplitudes = modified_amplitudes / norm
        
        return modified_amplitudes
    
    def calculate_perturbation(self, conscious_state, standard_probs):
        """
        Calculate the perturbation function δ_C(i) with rigorous constraints.
        
        Args:
            conscious_state (ConsciousState): The conscious state
            standard_probs (np.ndarray): Standard quantum probabilities
            
        Returns:
            np.ndarray: Array of perturbation values
        """
        # Get raw perturbation values from conscious state
        raw_perturbation = np.array([
            conscious_state.perturbation_function(i)
            for i in range(self.num_basis_states)
        ])
        
        # Scale perturbation by coherence levels (|δ_C| ∝ Γ^α)
        # Scale factor is determined by both neural and quantum coherence
        coherence_factor = (
            conscious_state.coherence_level * 
            self.quantum_coherence
        ) ** self.alpha
        
        raw_perturbation = raw_perturbation * coherence_factor
        
        # Apply Section X constraints:
        
        # 1. Scale Limit: |δ_C(i)| ≤ ϵ·|α_i|²
        # Ensure perturbation is bounded by quantum uncertainty
        max_perturbation = self.epsilon * standard_probs
        raw_perturbation = np.clip(raw_perturbation, -max_perturbation, max_perturbation)
        
        # 2. Probability Conservation: ∑ δ_C(i) = 0
        # Adjust to ensure no net probability creation/destruction
        current_sum = np.sum(raw_perturbation)
        raw_perturbation = raw_perturbation - (current_sum / self.num_basis_states)
        
        return raw_perturbation
    
    def generate_collapse_patterns(self, conscious_state):
        """
        Generate quantum collapse patterns based on a conscious state.
        
        This implements both phase modulation (energy-neutral) and 
        probability perturbation influences.
        
        Args:
            conscious_state (ConsciousState): The conscious state influencing the collapse
            
        Returns:
            dict: Contains collapse counts, phase information, and original state
        """
        # Generate standard quantum probabilities and amplitudes
        standard_probs, amplitudes = self.generate_standard_probabilities()
        
        # Apply phase modulation (energy-neutral influence)
        modified_amplitudes = self.calculate_quantum_state(amplitudes, conscious_state)
        modified_probs = np.abs(modified_amplitudes) ** 2
        
        # Calculate perturbation with rigorous constraints
        perturbation = self.calculate_perturbation(conscious_state, standard_probs)
        
        # Apply perturbation to probabilities
        final_probs = modified_probs + perturbation
        
        # Ensure probabilities are valid (non-negative and sum to 1)
        final_probs = np.maximum(final_probs, 0)
        final_probs = final_probs / np.sum(final_probs)
        
        # Generate collapse samples
        collapse_samples = np.random.choice(
            self.num_basis_states,
            size=self.num_samples,
            p=final_probs
        )
        
        # Count occurrences of each basis state
        collapse_counts = np.bincount(collapse_samples, minlength=self.num_basis_states)
        
        # Extract phase information from modified amplitudes
        phase_info = np.angle(modified_amplitudes)
        
        return {
            'collapsePatterns': collapse_counts.tolist(),
            'phaseInformation': phase_info.tolist(),
            'standardProbabilities': standard_probs.tolist(),
            'finalProbabilities': final_probs.tolist(),
            'perturbation': perturbation.tolist(),
            'originalState': conscious_state.to_dict(),
            'coherenceFactor': float((conscious_state.coherence_level * self.quantum_coherence) ** self.alpha)
        } 