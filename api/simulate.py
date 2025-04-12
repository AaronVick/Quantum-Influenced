from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import numpy as np
from urllib.parse import parse_qs

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the required modules from the backend
from backend.src.conscious_state import ConsciousState
from backend.src.quantum_simulator import QuantumSimulator
from backend.src.ml_reconstructor import MLReconstructor

# Initialize components
quantum_simulator = QuantumSimulator()
ml_reconstructor = MLReconstructor()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Process the simulation request
        conscious_state = ConsciousState.from_dict(data['consciousState'])
        
        # Generate quantum collapse patterns
        collapse_patterns = quantum_simulator.generate_collapse_patterns(conscious_state)
        
        # Reconstruct conscious state
        reconstructed_state, error = ml_reconstructor.reconstruct(collapse_patterns)
        threshold = data.get('threshold', 0.1)
        below_threshold = error < threshold
        
        # Prepare the response
        response = {
            'originalState': conscious_state.to_dict(),
            'collapsePatterns': collapse_patterns.tolist(),
            'reconstructedState': reconstructed_state.to_dict(),
            'error': float(error),
            'belowThreshold': below_threshold
        }
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return 