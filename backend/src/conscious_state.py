import numpy as np

class ConsciousState:
    """
    Represents a parametric conscious state as a vector.
    
    In the theoretical framework, a conscious state (C) is represented as a
    vector in a high-dimensional space, where each dimension corresponds to
    a specific aspect of consciousness.
    """
    
    def __init__(self, vector, coherence_level=0.8):
        """
        Initialize a conscious state with a vector representation.
        
        Args:
            vector (np.ndarray): Vector representation of the conscious state
            coherence_level (float): Neural coherence level (ΓEEG) between 0 and 1
        """
        self.vector = np.array(vector, dtype=np.float32)
        self.dimension = len(vector)
        self.coherence_level = max(0.0, min(1.0, coherence_level))  # Ensure between 0 and 1
        
        # Normalize the vector
        norm = np.linalg.norm(self.vector)
        if norm > 0:
            self.vector = self.vector / norm
    
    @classmethod
    def random(cls, dimension=10, coherence_level=None):
        """
        Generate a random conscious state.
        
        Args:
            dimension (int): Dimension of the conscious state vector
            coherence_level (float, optional): Neural coherence level (ΓEEG)
                If None, a random coherence level between 0.5 and 1.0 is used
            
        Returns:
            ConsciousState: Randomly generated conscious state
        """
        vector = np.random.randn(dimension)
        # If coherence level not provided, generate a random one (biased toward higher coherence)
        if coherence_level is None:
            coherence_level = 0.5 + 0.5 * np.random.random()  # Between 0.5 and 1.0
        return cls(vector, coherence_level)
    
    @classmethod
    def from_dict(cls, data):
        """
        Create a conscious state from a dictionary.
        
        Args:
            data (dict): Dictionary containing the vector representation
                        and optionally the coherence level
            
        Returns:
            ConsciousState: Conscious state created from the dictionary
        """
        coherence_level = data.get('coherence_level', 0.8)
        return cls(data['vector'], coherence_level)
    
    def to_dict(self):
        """
        Convert the conscious state to a dictionary.
        
        Returns:
            dict: Dictionary representation of the conscious state
        """
        return {
            'vector': self.vector.tolist(),
            'dimension': self.dimension,
            'coherence_level': float(self.coherence_level)
        }
    
    def perturbation_function(self, index):
        """
        Calculate the perturbation function δ_C(i) for a given index.
        
        In the theoretical framework, this function represents how a
        conscious state perturbs the standard quantum probabilities.
        
        Args:
            index (int): Index to calculate the perturbation for
            
        Returns:
            float: Perturbation value
        """
        # Using a sinusoidal perturbation that depends on the conscious state
        weights = self.vector
        phase = sum(w * np.sin(i * np.pi / self.dimension) for i, w in enumerate(weights))
        return 0.1 * np.sin(index * np.pi / self.dimension + phase)
    
    def phase_modulation(self, index):
        """
        Calculate the phase modulation function γ_i for quantum phase shifts.
        
        This implements the energy-neutral influence through phase modulation.
        Phase shifts preserve energy while altering measurement probabilities.
        
        Args:
            index (int): Index to calculate the phase modulation for
            
        Returns:
            float: Phase shift value in radians
        """
        # Generate phase shifts based on conscious state vector components
        weights = self.vector
        phase_factor = sum(w * np.cos(i * np.pi / self.dimension) for i, w in enumerate(weights))
        
        # Scale based on position in the basis state spectrum
        position_factor = np.sin(index * np.pi / (2 * self.dimension))
        
        # Return phase shift - bounded to small values to maintain subtle influence
        return 0.2 * phase_factor * position_factor  # Max phase shift of 0.2 radians 