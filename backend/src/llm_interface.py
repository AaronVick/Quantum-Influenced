import os
import anthropic

class LLMInterface:
    """
    Interface for generating mathematical proofs using Claude.
    
    This class interfaces with the Anthropic API to generate mathematical
    proofs and explanations for the theoretical framework.
    """
    
    def __init__(self, api_key=None, model_name="claude-3-opus-20240229"):
        """
        Initialize the LLM interface.
        
        Args:
            api_key (str): API key for Anthropic
            model_name (str): Model name to use
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model_name = model_name
        self.client = anthropic.Anthropic(api_key=self.api_key)
    
    def generate_proof(self, query):
        """
        Generate a mathematical proof or explanation.
        
        Args:
            query (str): Query asking for a proof or explanation
            
        Returns:
            str: Generated proof or explanation
        """
        if not self.api_key:
            return "Error: API key not provided. Please set ANTHROPIC_API_KEY in .env file."
        
        try:
            system_prompt = """
            You are a mathematical assistant specializing in quantum mechanics, consciousness theory, 
            and their intersection. Generate detailed mathematical proofs and explanations related to 
            the theoretical framework for consciousness-quantum interactions.
            
            The framework posits that:
            1. Conscious states (C) can be represented as vectors in a high-dimensional space
            2. Quantum collapse patterns (π) are influenced by conscious states via the formula P_C(i) = |α_i|² + δ_C(i)
            3. A function M exists such that M(π) ≈ C with error below threshold η
            
            Provide rigorous mathematical proofs using proper notation, clear step-by-step reasoning,
            and references to relevant theorems when appropriate.
            """
            
            message = self.client.messages.create(
                model=self.model_name,
                system=system_prompt,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": query}
                ]
            )
            
            return message.content[0].text
        except Exception as e:
            return f"Error generating proof: {str(e)}" 