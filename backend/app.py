from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from src.quantum_simulator import QuantumSimulator
from src.conscious_state import ConsciousState
from src.ml_reconstructor import MLReconstructor
from src.llm_interface import LLMInterface

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize components
quantum_simulator = QuantumSimulator()
ml_reconstructor = MLReconstructor()
llm_interface = LLMInterface(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    model_name=os.getenv("MODEL_NAME")
)

@app.route('/api/simulate', methods=['POST'])
def simulate():
    data = request.json
    conscious_state = ConsciousState.from_dict(data['consciousState'])
    
    # Generate quantum collapse patterns
    collapse_patterns = quantum_simulator.generate_collapse_patterns(conscious_state)
    
    # Reconstruct conscious state
    reconstructed_state, error = ml_reconstructor.reconstruct(collapse_patterns)
    threshold = data.get('threshold', 0.1)
    below_threshold = error < threshold
    
    return jsonify({
        'originalState': conscious_state.to_dict(),
        'collapsePatterns': collapse_patterns.tolist(),
        'reconstructedState': reconstructed_state.to_dict(),
        'error': float(error),
        'belowThreshold': below_threshold
    })

@app.route('/api/generate-proof', methods=['POST'])
def generate_proof():
    data = request.json
    query = data.get('query', '')
    
    proof = llm_interface.generate_proof(query)
    
    return jsonify({
        'proof': proof
    })

@app.route('/api/test-framework', methods=['POST'])
def test_framework():
    data = request.json
    num_tests = data.get('numTests', 10)
    dimension = data.get('dimension', 10)
    threshold = data.get('threshold', 0.1)
    
    results = []
    for i in range(num_tests):
        # Generate random conscious state
        conscious_state = ConsciousState.random(dimension)
        
        # Generate quantum collapse patterns
        collapse_patterns = quantum_simulator.generate_collapse_patterns(conscious_state)
        
        # Reconstruct conscious state
        reconstructed_state, error = ml_reconstructor.reconstruct(collapse_patterns)
        below_threshold = error < threshold
        
        results.append({
            'testId': i,
            'error': float(error),
            'belowThreshold': below_threshold
        })
    
    success_rate = sum(1 for r in results if r['belowThreshold']) / num_tests
    
    return jsonify({
        'results': results,
        'successRate': success_rate,
        'threshold': threshold
    })

if __name__ == '__main__':
    app.run(debug=True) 