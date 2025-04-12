from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from urllib.parse import parse_qs

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the required modules
from backend.src.llm_interface import LLMInterface

# Initialize LLM interface
llm_interface = LLMInterface(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    model_name=os.environ.get("MODEL_NAME", "claude-3-sonnet-20240229")
)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Get the query from the request
        query = data.get('query', '')
        
        # Generate the proof
        proof = llm_interface.generate_proof(query)
        
        # Prepare the response
        response = {
            'proof': proof
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