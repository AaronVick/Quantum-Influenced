from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import numpy as np
import pandas as pd
import logging
import datetime
import re
import io
import base64
import zipfile
from urllib.parse import parse_qs
from typing import Dict, List, Tuple, Any, Optional, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('data_import.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Define supported data sources
SUPPORTED_QRNG_SOURCES = {
    "anu": {
        "name": "ANU Quantum Random Number Generator",
        "api_url": "https://qrng.anu.edu.au/API/jsonI.php",
        "description": "QRNG from Australian National University based on quantum vacuum fluctuations"
    },
    "qrng_io": {
        "name": "QRNG.io",
        "api_url": "https://api.qrng.io/v1/rand",
        "description": "Commercial QRNG service based on quantum processes"
    }
}

class DataImportProcessor:
    """Handles importing and processing external experimental data"""
    
    def __init__(self, data_dir="./data"):
        """Initialize with data directory location"""
        self.data_dir = data_dir
        
        # Create data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(os.path.join(data_dir, "qrng"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "eeg"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "neuroimaging"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "behavioral"), exist_ok=True)
        
        logger.info(f"Data import processor initialized with data directory: {data_dir}")
    
    def import_data(self, import_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Import data from various sources based on parameters
        
        Args:
            import_params: Dictionary with import parameters
                - dataType: 'qrng', 'eeg', 'neuroimaging', 'behavioral'
                - sourceType: 'file', 'api', 'device'
                - source: File path, API endpoint, or device identifier
                - format: Optional file format
                - parameters: Additional parameters
                - useSyntheticData: Flag to use synthetic data when actual equipment isn't available
                - dataSourceType: Type of data source ('synthetic', 'simulation', etc.)
                
        Returns:
            Dictionary with import results and metadata
        """
        try:
            data_type = import_params.get('dataType')
            source_type = import_params.get('sourceType')
            source = import_params.get('source')
            use_synthetic = import_params.get('useSyntheticData', False)
            data_source_type = import_params.get('dataSourceType', 'synthetic' if use_synthetic else None)
            
            if not all([data_type, source_type, source]):
                return self._error_response("Missing required parameters")
            
            logger.info(f"Importing {data_type} data from {source_type} source: {source}")
            
            # If synthetic data is explicitly requested, generate it regardless of source
            if use_synthetic:
                logger.info(f"Using synthetic {data_type} data as requested")
                if data_type == 'qrng':
                    return self._generate_synthetic_qrng_data(data_source_type='synthetic')
                elif data_type == 'eeg':
                    return self._generate_synthetic_eeg_data(data_source_type='synthetic')
                elif data_type == 'neuroimaging':
                    return self._generate_synthetic_neuroimaging_data(data_source_type='synthetic')
                elif data_type == 'behavioral':
                    return self._generate_synthetic_behavioral_data(data_source_type='synthetic')
            
            # If not using synthetic data, route to appropriate import method
            if data_type == 'qrng':
                return self._import_qrng_data(source_type, source, import_params)
            elif data_type == 'eeg':
                return self._import_eeg_data(source_type, source, import_params)
            elif data_type == 'neuroimaging':
                return self._import_neuroimaging_data(source_type, source, import_params)
            elif data_type == 'behavioral':
                return self._import_behavioral_data(source_type, source, import_params)
            else:
                return self._error_response(f"Unsupported data type: {data_type}")
                
        except Exception as e:
            logger.error(f"Error importing data: {str(e)}")
            return self._error_response(f"Error importing data: {str(e)}")
    
    def _import_qrng_data(self, source_type: str, source: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import Quantum Random Number Generator data"""
        try:
            if source_type == 'api':
                # Handle API-based QRNG data
                if source.lower() in ['anu', 'qrng.anu.edu.au']:
                    return self._import_anu_qrng_data(params)
                elif source.lower() in ['qrng.io', 'qrng_io']:
                    return self._import_qrng_io_data(params)
                else:
                    # Generic API endpoint
                    return self._error_response("Custom API endpoints not yet supported")
            
            elif source_type == 'file':
                # Handle file-based QRNG data
                file_format = params.get('format', 'csv')
                
                # In a real implementation, we would process the uploaded file
                # For this demo, we'll generate synthetic QRNG data
                return self._generate_synthetic_qrng_data()
            
            elif source_type == 'device':
                # Handle direct device connection
                return self._error_response("Direct device connection not yet supported")
            
            else:
                return self._error_response(f"Unsupported source type: {source_type}")
        
        except Exception as e:
            logger.error(f"Error importing QRNG data: {str(e)}")
            return self._error_response(f"Error importing QRNG data: {str(e)}")
    
    def _import_eeg_data(self, source_type: str, source: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import EEG data"""
        try:
            if source_type == 'file':
                file_format = params.get('format', 'edf')
                
                # In a real implementation, we would process the uploaded file
                # For this demo, we'll generate synthetic EEG data
                return self._generate_synthetic_eeg_data()
            
            elif source_type == 'device':
                # Handle direct device connection
                return self._error_response("Direct EEG device connection not yet supported")
            
            else:
                return self._error_response(f"Unsupported source type for EEG data: {source_type}")
        
        except Exception as e:
            logger.error(f"Error importing EEG data: {str(e)}")
            return self._error_response(f"Error importing EEG data: {str(e)}")
    
    def _import_neuroimaging_data(self, source_type: str, source: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import neuroimaging data"""
        try:
            if source_type == 'file':
                file_format = params.get('format', 'nifti')
                
                # Generate synthetic neuroimaging data
                return self._generate_synthetic_neuroimaging_data()
            
            else:
                return self._error_response(f"Unsupported source type for neuroimaging data: {source_type}")
        
        except Exception as e:
            logger.error(f"Error importing neuroimaging data: {str(e)}")
            return self._error_response(f"Error importing neuroimaging data: {str(e)}")
    
    def _import_behavioral_data(self, source_type: str, source: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import behavioral data"""
        try:
            if source_type == 'file':
                file_format = params.get('format', 'csv')
                
                # Generate synthetic behavioral data
                return self._generate_synthetic_behavioral_data()
            
            else:
                return self._error_response(f"Unsupported source type for behavioral data: {source_type}")
        
        except Exception as e:
            logger.error(f"Error importing behavioral data: {str(e)}")
            return self._error_response(f"Error importing behavioral data: {str(e)}")
    
    def _import_anu_qrng_data(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import data from ANU Quantum Random Number Generator API"""
        try:
            # In a real implementation, we would make an API call to ANU QRNG
            # For this demo, we'll generate synthetic data
            
            # Simulate API response
            data = {
                "type": "uint8",
                "length": 100,
                "data": [np.random.randint(0, 256) for _ in range(100)],
                "success": True
            }
            
            # Save to data directory
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"anu_qrng_{timestamp}.json"
            filepath = os.path.join(self.data_dir, "qrng", filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f)
            
            return {
                "success": True,
                "source": "ANU QRNG",
                "timestamp": datetime.datetime.now().isoformat(),
                "samples": 100,
                "data": data,
                "dataId": f"qrng_{timestamp}",
                "filePath": filepath
            }
            
        except Exception as e:
            logger.error(f"Error importing ANU QRNG data: {str(e)}")
            return self._error_response(f"Error importing ANU QRNG data: {str(e)}")
    
    def _import_qrng_io_data(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import data from QRNG.io API"""
        try:
            # Simulate API response
            data = {
                "success": True,
                "data": [np.random.randint(0, 256) for _ in range(100)]
            }
            
            # Save to data directory
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"qrng_io_{timestamp}.json"
            filepath = os.path.join(self.data_dir, "qrng", filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f)
            
            return {
                "success": True,
                "source": "QRNG.io",
                "timestamp": datetime.datetime.now().isoformat(),
                "samples": 100,
                "data": data,
                "dataId": f"qrng_{timestamp}",
                "filePath": filepath
            }
            
        except Exception as e:
            logger.error(f"Error importing QRNG.io data: {str(e)}")
            return self._error_response(f"Error importing QRNG.io data: {str(e)}")
    
    def _generate_synthetic_qrng_data(self, data_source_type: str = 'synthetic') -> Dict[str, Any]:
        """Generate synthetic QRNG data for demo purposes"""
        try:
            # Generate 1000 random integers (0-255)
            num_samples = 1000
            qrng_data = np.random.randint(0, 256, size=num_samples).tolist()
            
            # Add timestamps
            current_time = datetime.datetime.now()
            timestamps = [(current_time + datetime.timedelta(milliseconds=i*10)).isoformat() 
                          for i in range(num_samples)]
            
            # Create data structure
            data = {
                "metadata": {
                    "source": "Synthetic QRNG Data",
                    "description": "Simulated quantum random numbers",
                    "timestamp": current_time.isoformat(),
                    "samples": num_samples,
                    "dataSourceType": data_source_type
                },
                "data": {
                    "values": qrng_data,
                    "timestamps": timestamps
                },
                "statistics": {
                    "mean": np.mean(qrng_data),
                    "std_dev": np.std(qrng_data),
                    "min": np.min(qrng_data),
                    "max": np.max(qrng_data)
                }
            }
            
            # Save to data directory
            timestamp = current_time.strftime("%Y%m%d_%H%M%S")
            filename = f"synthetic_qrng_{timestamp}.json"
            filepath = os.path.join(self.data_dir, "qrng", filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f)
            
            return {
                "success": True,
                "source": "Synthetic QRNG",
                "timestamp": current_time.isoformat(),
                "samples": num_samples,
                "data": data,
                "dataId": f"qrng_{timestamp}",
                "filePath": filepath,
                "dataSourceType": data_source_type
            }
            
        except Exception as e:
            logger.error(f"Error generating synthetic QRNG data: {str(e)}")
            return self._error_response(f"Error generating synthetic QRNG data: {str(e)}")
    
    def _generate_synthetic_eeg_data(self, data_source_type: str = 'synthetic') -> Dict[str, Any]:
        """Generate synthetic EEG data for demo purposes"""
        try:
            # Generate synthetic EEG data with multiple channels
            sampling_rate = 250  # Hz
            duration = 10  # seconds
            num_samples = sampling_rate * duration
            num_channels = 8
            
            # Channel names based on 10-20 system
            channel_names = ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4']
            
            # Generate time points
            time_points = np.linspace(0, duration, num_samples)
            
            # Generate signals with different frequency components for each channel
            channels_data = {}
            for i, channel in enumerate(channel_names):
                # Base signal: combination of alpha (8-12 Hz), beta (13-30 Hz), theta (4-7 Hz)
                alpha = 5 * np.sin(2 * np.pi * 10 * time_points)  # 10 Hz alpha
                beta = 2 * np.sin(2 * np.pi * 20 * time_points)   # 20 Hz beta
                theta = 3 * np.sin(2 * np.pi * 5 * time_points)   # 5 Hz theta
                
                # Add random phase shift for each channel
                phase_shift = np.random.uniform(0, 2*np.pi)
                
                # Combine signals with different weights for each channel
                signal = alpha * (1 + 0.2*i) + beta * (0.5 - 0.05*i) + theta * (0.8 + 0.1*i)
                
                # Add noise
                noise = np.random.normal(0, 1, num_samples)
                signal += noise * 0.5
                
                channels_data[channel] = signal.tolist()
            
            # Create data structure
            data = {
                "metadata": {
                    "source": "Synthetic EEG Data",
                    "description": "Simulated EEG recording with alpha, beta, and theta components",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "samplingRate": sampling_rate,
                    "duration": duration,
                    "channels": channel_names,
                    "units": "microvolts",
                    "dataSourceType": data_source_type
                },
                "data": {
                    "timePoints": time_points.tolist(),
                    "channels": channels_data
                }
            }
            
            # Save to data directory
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"synthetic_eeg_{timestamp}.json"
            filepath = os.path.join(self.data_dir, "eeg", filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f)
            
            return {
                "success": True,
                "source": "Synthetic EEG",
                "timestamp": datetime.datetime.now().isoformat(),
                "samples": num_samples,
                "channels": num_channels,
                "data": {
                    "metadata": data["metadata"],
                    "preview": {
                        "timePoints": time_points[:100].tolist(),
                        "channels": {ch: values[:100] for ch, values in channels_data.items()}
                    }
                },
                "dataId": f"eeg_{timestamp}",
                "filePath": filepath,
                "dataSourceType": data_source_type
            }
            
        except Exception as e:
            logger.error(f"Error generating synthetic EEG data: {str(e)}")
            return self._error_response(f"Error generating synthetic EEG data: {str(e)}")
    
    def _generate_synthetic_neuroimaging_data(self, data_source_type: str = 'synthetic') -> Dict[str, Any]:
        """Generate synthetic neuroimaging data for demo purposes"""
        try:
            # Generate a simple 3D array representing brain activity
            dim_x, dim_y, dim_z = 64, 64, 32
            voxel_data = np.zeros((dim_x, dim_y, dim_z))
            
            # Create some "active" regions
            # Region 1: Prefrontal cortex approximation
            voxel_data[20:30, 45:55, 20:25] = np.random.uniform(0.6, 0.9, (10, 10, 5))
            
            # Region 2: Visual cortex approximation
            voxel_data[30:40, 20:35, 10:15] = np.random.uniform(0.7, 1.0, (10, 15, 5))
            
            # Add noise
            noise = np.random.normal(0, 0.1, (dim_x, dim_y, dim_z))
            voxel_data += noise
            
            # Clip values to [0, 1]
            voxel_data = np.clip(voxel_data, 0, 1)
            
            # Create metadata
            metadata = {
                "source": "Synthetic fMRI Data",
                "description": "Simulated fMRI activation patterns",
                "timestamp": datetime.datetime.now().isoformat(),
                "dimensions": [dim_x, dim_y, dim_z],
                "voxelSize": [3.0, 3.0, 3.0],  # mm
                "units": "BOLD signal",
                "dataSourceType": data_source_type
            }
            
            # For response, we'll include 2D slices rather than the full 3D volume
            # Extract middle slices from each plane
            slice_x = voxel_data[dim_x//2, :, :].tolist()
            slice_y = voxel_data[:, dim_y//2, :].tolist()
            slice_z = voxel_data[:, :, dim_z//2].tolist()
            
            # Save to data directory
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"synthetic_fmri_{timestamp}.npz"
            filepath = os.path.join(self.data_dir, "neuroimaging", filename)
            
            np.savez_compressed(filepath, 
                               voxel_data=voxel_data,
                               metadata=json.dumps(metadata))
            
            return {
                "success": True,
                "source": "Synthetic fMRI",
                "timestamp": datetime.datetime.now().isoformat(),
                "dimensions": [dim_x, dim_y, dim_z],
                "metadata": metadata,
                "preview": {
                    "slice_x": slice_x,
                    "slice_y": slice_y,
                    "slice_z": slice_z,
                    "dimension": "middle slices from each plane"
                },
                "dataId": f"neuroimaging_{timestamp}",
                "filePath": filepath,
                "dataSourceType": data_source_type
            }
            
        except Exception as e:
            logger.error(f"Error generating synthetic neuroimaging data: {str(e)}")
            return self._error_response(f"Error generating synthetic neuroimaging data: {str(e)}")
    
    def _generate_synthetic_behavioral_data(self, data_source_type: str = 'synthetic') -> Dict[str, Any]:
        """Generate synthetic behavioral data for demo purposes"""
        try:
            # Generate synthetic experiment data with trials
            num_subjects = 10
            num_trials = 50
            
            # Create data structure
            data = {
                "metadata": {
                    "source": "Synthetic Behavioral Data",
                    "description": "Simulated consciousness-task behavior",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "subjects": num_subjects,
                    "trials_per_subject": num_trials,
                    "conditions": ["focus", "distract", "control"],
                    "dataSourceType": data_source_type
                },
                "subjects": []
            }
            
            # Generate data for each subject
            for subject_id in range(1, num_subjects + 1):
                subject_data = {
                    "id": f"S{subject_id:03d}",
                    "age": np.random.randint(18, 65),
                    "gender": np.random.choice(["M", "F", "O"]),
                    "trials": []
                }
                
                # Generate trials for each subject
                for trial_id in range(1, num_trials + 1):
                    # Randomize condition
                    condition = np.random.choice(["focus", "distract", "control"])
                    
                    # Reaction time depends on condition
                    if condition == "focus":
                        rt = np.random.normal(450, 50)  # ms
                        accuracy = np.random.uniform(0.8, 1.0)
                    elif condition == "distract":
                        rt = np.random.normal(650, 80)  # ms
                        accuracy = np.random.uniform(0.6, 0.8)
                    else:  # control
                        rt = np.random.normal(550, 60)  # ms
                        accuracy = np.random.uniform(0.7, 0.9)
                    
                    # Create trial data
                    trial = {
                        "trial_id": trial_id,
                        "condition": condition,
                        "reaction_time": max(0, rt),  # ensure non-negative
                        "accuracy": accuracy,
                        "stimulus_id": np.random.randint(1, 10),
                        "response": np.random.choice([0, 1]),
                        "timestamp": (datetime.datetime.now() + 
                                    datetime.timedelta(seconds=trial_id)).isoformat()
                    }
                    
                    subject_data["trials"].append(trial)
                
                data["subjects"].append(subject_data)
            
            # Save to data directory
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"synthetic_behavioral_{timestamp}.json"
            filepath = os.path.join(self.data_dir, "behavioral", filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f)
            
            # For the response, include summary statistics
            condition_stats = {condition: {"rt": [], "accuracy": []} 
                              for condition in data["metadata"]["conditions"]}
            
            for subject in data["subjects"]:
                for trial in subject["trials"]:
                    condition = trial["condition"]
                    condition_stats[condition]["rt"].append(trial["reaction_time"])
                    condition_stats[condition]["accuracy"].append(trial["accuracy"])
            
            summary_stats = {}
            for condition, stats in condition_stats.items():
                summary_stats[condition] = {
                    "mean_rt": np.mean(stats["rt"]),
                    "std_rt": np.std(stats["rt"]),
                    "mean_accuracy": np.mean(stats["accuracy"]),
                    "std_accuracy": np.std(stats["accuracy"])
                }
            
            return {
                "success": True,
                "source": "Synthetic Behavioral",
                "timestamp": datetime.datetime.now().isoformat(),
                "subjects": num_subjects,
                "trials": num_subjects * num_trials,
                "metadata": data["metadata"],
                "summary": summary_stats,
                "data": {
                    "subject_example": data["subjects"][0],  # Include one subject as example
                },
                "dataId": f"behavioral_{timestamp}",
                "filePath": filepath,
                "dataSourceType": data_source_type
            }
            
        except Exception as e:
            logger.error(f"Error generating synthetic behavioral data: {str(e)}")
            return self._error_response(f"Error generating synthetic behavioral data: {str(e)}")
    
    def _error_response(self, message: str) -> Dict[str, Any]:
        """Generate error response"""
        logger.error(message)
        return {
            "success": False,
            "error": message
        }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # Initialize data processor
            processor = DataImportProcessor()
            
            # Process data import request
            result = processor.import_data(data)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            # Log the error
            logger.error(f"Error in handler: {str(e)}")
            
            # Send error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                "success": False,
                "error": f"Server error: {str(e)}"
            }
            
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return

if __name__ == "__main__":
    # Test data processor
    processor = DataImportProcessor()
    
    # Test QRNG data import
    qrng_params = {
        "dataType": "qrng",
        "sourceType": "file",
        "source": "test.csv",
        "format": "csv"
    }
    
    qrng_result = processor.import_data(qrng_params)
    print(json.dumps(qrng_result, indent=2)) 