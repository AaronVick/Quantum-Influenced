from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import numpy as np
from urllib.parse import parse_qs
from scipy import stats
from scipy.signal import welch
import datetime
import logging
from typing import Dict, List, Tuple, Optional, Union

# Configure logging for experimental replication
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('experiment_log.txt'),
        logging.StreamHandler()
    ]
)

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the required modules
from backend.src.conscious_state import ConsciousState
from backend.src.quantum_simulator import QuantumSimulator
from backend.src.ml_reconstructor import MLReconstructor

# Initialize components
quantum_simulator = QuantumSimulator()
ml_reconstructor = MLReconstructor()

# Define explicit null hypotheses for falsifiability
NULL_HYPOTHESES = {
    "h0_no_deviation": "H₀: Consciousness has no measurable impact on quantum collapse probabilities (δ_C(i) = 0 for all i)",
    "h0_no_correlation": "H₀: Any observed deviations are not correlated with conscious states (r = 0)",
    "h0_unreconstructable": "H₀: Conscious states cannot be reconstructed from quantum measurement patterns (error ≥ η)",
    "h0_random_fluctuation": "H₀: Any observed patterns are due to random fluctuations, not consciousness effects"
}

# Quantitative predictions for experimental testing
QUANTITATIVE_PREDICTIONS = {
    # Predictions for neural coherence modulation experiments
    "neural_coherence": {
        "tACS_effect": {
            "description": "Applying transcranial alternating current stimulation (tACS) at alpha frequency (8-12 Hz) will increase neural coherence and proportionally enhance quantum deviations",
            "baseline_coherence": 0.3,  # Typical baseline neural coherence
            "expected_coherence_increase": 0.2,  # Expected coherence increase with tACS
            "expected_deviation_multiplier": 1.8,  # Expected multiplier for quantum deviation magnitude
            "confidence_interval": [1.5, 2.1],  # 95% confidence interval
            "minimum_effect_size": 0.4,  # Cohen's d minimum for significance
            "testable_threshold": 0.15  # Minimum measurable deviation difference
        },
        "meditation_effect": {
            "description": "Focused meditation will increase alpha-band coherence by 0.15-0.25 and amplify quantum deviations by 1.3-1.7x",
            "baseline_coherence": 0.3,
            "expected_coherence_increase": 0.2,
            "expected_deviation_multiplier": 1.5,
            "confidence_interval": [1.3, 1.7],
            "minimum_effect_size": 0.35,
            "testable_threshold": 0.12
        },
        "theta_gamma_coupling": {
            "description": "Increased theta-gamma phase-amplitude coupling correlates with consciousness access and increases deviation magnitude by 1.4-1.9x",
            "baseline_coupling": 0.25,
            "expected_increase": 0.15,
            "expected_deviation_multiplier": 1.65,
            "confidence_interval": [1.4, 1.9],
            "minimum_effect_size": 0.38,
            "testable_threshold": 0.14
        }
    },
    
    # Predictions for quantum measurement outcomes
    "quantum_measurements": {
        "deviation_threshold": {
            "description": "Consciousness-induced deviations in quantum measurements will exceed 0.08 (8%) with neural coherence > 0.4",
            "minimum_deviation": 0.08,  # 8% minimum deviation
            "required_coherence": 0.4,
            "p_value_threshold": 0.01,  # More stringent than typical 0.05
            "effect_size_threshold": 0.5,  # Cohen's d
            "testable_samples": 1000  # Minimum sample size needed for detection
        },
        "phase_modulation": {
            "description": "Conscious states modulate quantum phase by 0.2π-0.4π radians, proportional to neural coherence",
            "minimum_phase_shift": 0.2 * np.pi,  # 0.2π radians
            "maximum_phase_shift": 0.4 * np.pi,  # 0.4π radians
            "coherence_correlation": 0.6,  # Expected correlation coefficient
            "p_value_threshold": 0.01,
            "effect_size_threshold": 0.6,
            "testable_samples": 500
        },
        "frequency_specificity": {
            "description": "Alpha-band (8-12 Hz) neural oscillations correlate with quantum deviations most strongly (r > 0.5), compared to other frequency bands",
            "expected_alpha_correlation": 0.5,
            "expected_theta_correlation": 0.3,
            "expected_beta_correlation": 0.2,
            "expected_gamma_correlation": 0.25,
            "p_value_threshold": 0.01,
            "effect_size_threshold": 0.45,
            "testable_samples": 750
        }
    },
    
    # Predictions for entropic and information-theoretic measurements
    "information_metrics": {
        "entropy_reduction": {
            "description": "Conscious observation reduces Shannon entropy of quantum measurements by 0.1-0.3 bits compared to theoretical expectations",
            "minimum_entropy_reduction": 0.1,  # bits
            "maximum_entropy_reduction": 0.3,  # bits
            "correlation_with_coherence": 0.5,
            "p_value_threshold": 0.01,
            "effect_size_threshold": 0.5,
            "testable_samples": 600
        },
        "mutual_information": {
            "description": "Mutual information between neural activity and quantum deviations exceeds 0.2 bits with high coherence (>0.5)",
            "minimum_mutual_information": 0.2,  # bits
            "required_coherence": 0.5,
            "p_value_threshold": 0.01,
            "effect_size_threshold": 0.55,
            "testable_samples": 800
        }
    }
}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Get the parameters from the request
        num_tests = data.get('numTests', 10)
        dimension = data.get('dimension', 10)
        eta_threshold = data.get('etaThreshold', 0.3)  # Bounded error threshold (η)
        
        # Set coherence levels if provided
        if 'neuralCoherence' in data:
            neural_coherence = data.get('neuralCoherence', 0.8)
        else:
            neural_coherence = None
            
        if 'quantumCoherence' in data:
            quantum_coherence = data.get('quantumCoherence', 0.9)
            quantum_simulator.set_quantum_coherence(quantum_coherence)
        
        # Set up the ML reconstructor with the appropriate threshold
        ml_reconstructor.eta_threshold = eta_threshold
        
        # Log experiment configuration for replication
        logging.info(f"Starting experiment: dim={dimension}, tests={num_tests}, η={eta_threshold}, "
                     f"neural_coherence={neural_coherence}, quantum_coherence={quantum_simulator.quantum_coherence}")
        
        # Run the batch tests
        results = []
        for i in range(num_tests):
            test_result = self._run_single_test(dimension, neural_coherence)
            results.append(test_result)
            
            # Log each test for replication
            logging.info(f"Test {i+1}/{num_tests}: "
                         f"Neural coherence={test_result['simulationResults']['originalState']['coherence_level']}, "
                         f"Reconstruction error={test_result['reconstructionError']}, "
                         f"All criteria satisfied={test_result['verificationCriteria']['allCriteriaSatisfied']}")
        
        # Calculate success rates for each verification criterion
        criterion1_successes = sum(1 for r in results if r['verificationCriteria']['deviationSignificant'])
        criterion2_successes = sum(1 for r in results if r['verificationCriteria']['coherenceCorrelated'])
        criterion3_successes = sum(1 for r in results if r['verificationCriteria']['boundedReconstruction'])
        full_verification_successes = sum(1 for r in results if r['verificationCriteria']['allCriteriaSatisfied'])
        
        # Calculate null hypothesis rejection rates
        h0_deviation_rejections = sum(1 for r in results if r['nullHypothesesRejected']['h0_no_deviation'])
        h0_correlation_rejections = sum(1 for r in results if r['nullHypothesesRejected']['h0_no_correlation'])
        h0_reconstruction_rejections = sum(1 for r in results if r['nullHypothesesRejected']['h0_unreconstructable'])
        h0_random_rejections = sum(1 for r in results if r['nullHypothesesRejected']['h0_random_fluctuation'])
        all_nulls_rejected = sum(1 for r in results if all(r['nullHypothesesRejected'].values()))
        
        # Evaluate results against quantitative predictions
        prediction_evaluations = self._evaluate_predictions(results, neural_coherence)
        
        # Log aggregate results
        logging.info(f"Experiment completed: "
                     f"Deviation Significant Rate={criterion1_successes/num_tests}, "
                     f"Coherence Correlated Rate={criterion2_successes/num_tests}, "
                     f"Bounded Reconstruction Rate={criterion3_successes/num_tests}, "
                     f"Full Verification Rate={full_verification_successes/num_tests}, "
                     f"All Null Hypotheses Rejected Rate={all_nulls_rejected/num_tests}")
        
        # Prepare the response
        response = {
            'results': results,
            'verificationRates': {
                'deviationSignificantRate': criterion1_successes / num_tests,
                'coherenceCorrelatedRate': criterion2_successes / num_tests,
                'boundedReconstructionRate': criterion3_successes / num_tests,
                'fullVerificationRate': full_verification_successes / num_tests
            },
            'nullHypothesisRates': {
                'h0NoDeviationRejectionRate': h0_deviation_rejections / num_tests,
                'h0NoCorrelationRejectionRate': h0_correlation_rejections / num_tests,
                'h0UnreconstructableRejectionRate': h0_reconstruction_rejections / num_tests,
                'h0RandomFluctuationRejectionRate': h0_random_rejections / num_tests,
                'allNullsRejectedRate': all_nulls_rejected / num_tests
            },
            'quantitativePredictions': QUANTITATIVE_PREDICTIONS,
            'predictionEvaluations': prediction_evaluations,
            'nullHypotheses': NULL_HYPOTHESES,
            'etaThreshold': eta_threshold,
            'timestamp': datetime.datetime.now().isoformat(),
            'experimentId': f"exp_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
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
    
    def _evaluate_predictions(self, results, neural_coherence):
        """
        Evaluate the results against quantitative predictions to determine if they match expectations.
        """
        # Extract necessary data
        mean_deviations = np.mean([np.max(np.abs(r['simulationResults']['perturbation'])) for r in results])
        coherence_correlation = np.mean([r['verificationCriteria']['coherenceCorrelation'] for r in results])
        mean_entropy_diff = np.mean([r['informationMetrics']['entropyDifference'] for r in results])
        mean_mutual_info = np.mean([r['informationMetrics']['mutualInformation'] for r in results])
        
        # Calculate phase modulation metrics if available
        phase_metrics = []
        for r in results:
            if 'phaseInformation' in r['simulationResults']:
                phase_metrics.append(np.max(np.abs(r['simulationResults']['phaseInformation'])))
        mean_phase_shift = np.mean(phase_metrics) if phase_metrics else 0
        
        # Prepare response structure
        evaluations = {
            "neural_coherence": {},
            "quantum_measurements": {},
            "information_metrics": {}
        }
        
        # Evaluate neural coherence predictions
        # For simulation purposes, we assume tACS was applied when neural_coherence > 0.5
        if neural_coherence and neural_coherence > 0.5:
            # Simulate tACS effect by comparing to baseline
            tacs_pred = QUANTITATIVE_PREDICTIONS['neural_coherence']['tACS_effect']
            baseline_dev = tacs_pred['baseline_coherence'] * 0.1  # Baseline deviation magnitude (10% of coherence)
            expected_dev = baseline_dev * tacs_pred['expected_deviation_multiplier']
            met_threshold = mean_deviations >= expected_dev * 0.8  # Allow 20% tolerance
            
            evaluations['neural_coherence']['tACS_effect'] = {
                'expected_deviation': float(expected_dev),
                'observed_deviation': float(mean_deviations),
                'meets_prediction': met_threshold,
                'percent_of_expected': float(mean_deviations / expected_dev * 100) if expected_dev > 0 else 0,
                'significant': met_threshold and mean_deviations > tacs_pred['testable_threshold']
            }
        else:
            # Use baseline prediction
            met_threshold = mean_deviations >= 0.05  # Minimum baseline effect
            
            evaluations['neural_coherence']['baseline'] = {
                'expected_deviation': 0.05,
                'observed_deviation': float(mean_deviations),
                'meets_prediction': met_threshold,
                'percent_of_expected': float(mean_deviations / 0.05 * 100) if mean_deviations > 0 else 0,
                'significant': met_threshold
            }
        
        # Evaluate quantum measurement predictions
        dev_pred = QUANTITATIVE_PREDICTIONS['quantum_measurements']['deviation_threshold']
        evaluations['quantum_measurements']['deviation_threshold'] = {
            'expected_deviation': dev_pred['minimum_deviation'],
            'observed_deviation': float(mean_deviations),
            'meets_prediction': mean_deviations >= dev_pred['minimum_deviation'],
            'percent_of_expected': float(mean_deviations / dev_pred['minimum_deviation'] * 100),
            'significant': mean_deviations >= dev_pred['minimum_deviation'] and neural_coherence >= dev_pred['required_coherence']
        }
        
        if phase_metrics:
            phase_pred = QUANTITATIVE_PREDICTIONS['quantum_measurements']['phase_modulation']
            evaluations['quantum_measurements']['phase_modulation'] = {
                'expected_minimum_shift': float(phase_pred['minimum_phase_shift']),
                'expected_maximum_shift': float(phase_pred['maximum_phase_shift']),
                'observed_shift': float(mean_phase_shift),
                'meets_prediction': mean_phase_shift >= phase_pred['minimum_phase_shift'],
                'percent_of_expected': float(mean_phase_shift / phase_pred['minimum_phase_shift'] * 100),
                'significant': mean_phase_shift >= phase_pred['minimum_phase_shift']
            }
        
        # Evaluate information-theoretic predictions
        entropy_pred = QUANTITATIVE_PREDICTIONS['information_metrics']['entropy_reduction']
        evaluations['information_metrics']['entropy_reduction'] = {
            'expected_minimum_reduction': entropy_pred['minimum_entropy_reduction'],
            'expected_maximum_reduction': entropy_pred['maximum_entropy_reduction'],
            'observed_reduction': float(mean_entropy_diff),
            'meets_prediction': (mean_entropy_diff >= entropy_pred['minimum_entropy_reduction'] and 
                                mean_entropy_diff <= entropy_pred['maximum_entropy_reduction']),
            'percent_of_expected': float(mean_entropy_diff / entropy_pred['minimum_entropy_reduction'] * 100),
            'significant': mean_entropy_diff >= entropy_pred['minimum_entropy_reduction']
        }
        
        mi_pred = QUANTITATIVE_PREDICTIONS['information_metrics']['mutual_information']
        evaluations['information_metrics']['mutual_information'] = {
            'expected_minimum': mi_pred['minimum_mutual_information'],
            'observed_value': float(mean_mutual_info),
            'meets_prediction': mean_mutual_info >= mi_pred['minimum_mutual_information'],
            'percent_of_expected': float(mean_mutual_info / mi_pred['minimum_mutual_information'] * 100),
            'significant': (mean_mutual_info >= mi_pred['minimum_mutual_information'] and
                            (neural_coherence is None or neural_coherence >= mi_pred['required_coherence']))
        }
        
        return evaluations
    
    def _run_single_test(self, dimension, neural_coherence=None):
        """
        Run a single test implementing the three-criteria verification framework.
        """
        # Generate random conscious state
        conscious_state = ConsciousState.random(dimension, neural_coherence)
        
        # Generate quantum collapse patterns with phase information
        simulation_results = quantum_simulator.generate_collapse_patterns(conscious_state)
        
        # Reconstruct conscious state using both probability and phase information
        reconstructed_state, error, is_valid_reconstruction = ml_reconstructor.reconstruct(
            simulation_results, conscious_state
        )
        
        # Implement the three verification criteria from the paper
        verification_results = self._verify_consciousness_access(
            simulation_results, conscious_state, reconstructed_state, error
        )
        
        # Test against null hypotheses
        null_hypothesis_results = self._test_null_hypotheses(
            simulation_results, conscious_state, reconstructed_state, error, verification_results
        )
        
        # Calculate information-theoretic metrics
        info_metrics = self._calculate_information_metrics(simulation_results)
        
        return {
            'simulationResults': simulation_results,
            'reconstructionError': float(error),
            'boundedReconstruction': is_valid_reconstruction,
            'verificationCriteria': verification_results,
            'nullHypothesesRejected': null_hypothesis_results['rejected'],
            'nullHypothesesPValues': null_hypothesis_results['pValues'],
            'nullHypothesesEffectSizes': null_hypothesis_results['effectSizes'],
            'controlComparisons': null_hypothesis_results['controlComparisons'],
            'informationMetrics': info_metrics
        }
    
    def _test_null_hypotheses(self, simulation_results, original_state, reconstructed_state, error, verification_results):
        """
        Explicitly test each null hypothesis with appropriate statistical tests 
        and control comparisons to enhance falsifiability.
        """
        # Extract data for analysis
        observed_probs = np.array(simulation_results['finalProbabilities'])
        expected_probs = np.array(simulation_results['standardProbabilities'])
        deviations = observed_probs - expected_probs
        
        # Results containers
        rejected = {}
        p_values = {}
        effect_sizes = {}
        control_comparisons = {}
        
        # H0_1: No deviation from quantum randomness (δ_C(i) = 0 for all i)
        # Use chi-square test which is already calculated in verification_results
        p_deviation = verification_results['deviationPValue']
        rejected['h0_no_deviation'] = p_deviation < 0.05
        p_values['h0_no_deviation'] = p_deviation
        
        # Calculate Cohen's d as effect size for deviation
        d_deviation = np.mean(np.abs(deviations)) / (np.std(expected_probs) + 1e-10)
        effect_sizes['h0_no_deviation'] = float(d_deviation)
        
        # Create control condition: randomly shuffled deviations
        shuffled_deviations = np.copy(deviations)
        np.random.shuffle(shuffled_deviations)
        chi2_control, p_control = self._calculate_chi_square(
            expected_probs + shuffled_deviations, 
            expected_probs
        )
        control_comparisons['h0_no_deviation'] = {
            'description': 'Comparison with randomly shuffled deviations',
            'controlPValue': float(p_control),
            'testPValue': p_deviation,
            'pValueRatio': float(p_deviation / max(p_control, 1e-10))
        }
        
        # H0_2: No correlation between deviations and conscious state (r = 0)
        # Use correlation coefficient and test of significance
        r_correlation = verification_results['coherenceCorrelation']
        # Fisher z-transformation for correlation significance test
        z_obs = 0.5 * np.log((1 + r_correlation) / (1 - r_correlation + 1e-10))
        se_z = 1 / np.sqrt(len(deviations) - 3)
        z_stat = z_obs / se_z
        p_correlation = 2 * (1 - stats.norm.cdf(abs(z_stat)))
        rejected['h0_no_correlation'] = p_correlation < 0.05
        p_values['h0_no_correlation'] = float(p_correlation)
        effect_sizes['h0_no_correlation'] = float(r_correlation)  # r itself is the effect size
        
        # Control: correlation with random vector
        random_state = np.random.rand(dimension)
        r_control = self._calculate_correlation(deviations, random_state)
        z_control = 0.5 * np.log((1 + r_control) / (1 - r_control + 1e-10))
        z_stat_control = z_control / se_z
        p_control_corr = 2 * (1 - stats.norm.cdf(abs(z_stat_control)))
        control_comparisons['h0_no_correlation'] = {
            'description': 'Correlation with random vector instead of conscious state',
            'controlPValue': float(p_control_corr),
            'testPValue': float(p_correlation),
            'effectSizeRatio': float(abs(r_correlation) / max(abs(r_control), 1e-10))
        }
        
        # H0_3: Conscious states cannot be reconstructed from measurements (error ≥ η)
        # Use t-test comparing reconstruction error with threshold
        # Convert error to a standardized score against η threshold
        std_error = np.std([verification_results['reconstructionError'], verification_results['etaThreshold']])
        t_stat = (verification_results['etaThreshold'] - verification_results['reconstructionError']) / (std_error + 1e-10)
        df = 1  # degrees of freedom
        p_reconstruction = 1 - stats.t.cdf(t_stat, df)
        rejected['h0_unreconstructable'] = verification_results['boundedReconstruction']
        p_values['h0_unreconstructable'] = float(p_reconstruction)
        
        # Effect size: how much better than threshold (as ratio)
        effect_size_reconst = (verification_results['etaThreshold'] - verification_results['reconstructionError']) / verification_results['etaThreshold']
        effect_sizes['h0_unreconstructable'] = float(effect_size_reconst)
        
        # Control: reconstruction with random measurement pattern
        random_patterns = np.random.rand(len(observed_probs))
        random_patterns = random_patterns / sum(random_patterns)  # normalize
        random_sim_results = dict(simulation_results)
        random_sim_results['finalProbabilities'] = random_patterns.tolist()
        _, random_error, _ = ml_reconstructor.reconstruct(
            random_sim_results, original_state
        )
        control_comparisons['h0_unreconstructable'] = {
            'description': 'Reconstruction using random measurement patterns',
            'controlError': float(random_error),
            'testError': float(verification_results['reconstructionError']),
            'errorRatio': float(verification_results['reconstructionError'] / max(random_error, 1e-10)),
            'controlBelowThreshold': random_error < verification_results['etaThreshold']
        }
        
        # H0_4: Patterns are due to random fluctuations, not consciousness
        # Use bootstrapping to estimate probability of pattern arising by chance
        bootstrap_samples = 1000
        bootstrap_successes = 0
        
        # Prepare distribution for bootstrap - use expected probabilities
        bootstrap_dist = expected_probs
        
        # Run bootstrap simulations
        for _ in range(bootstrap_samples):
            # Generate random sample from expected distribution
            bootstrap_sample = np.random.choice(
                np.arange(len(bootstrap_dist)),
                size=sum(simulation_results['collapsePatterns']),
                p=bootstrap_dist
            )
            
            # Count occurrences to create bootstrap collapse pattern
            bootstrap_pattern = np.zeros(len(bootstrap_dist))
            for idx in bootstrap_sample:
                bootstrap_pattern[idx] += 1
                
            # Normalize to get probabilities
            bootstrap_probs = bootstrap_pattern / sum(bootstrap_pattern)
            
            # Calculate deviations from expected
            bootstrap_devs = bootstrap_probs - expected_probs
            
            # Calculate maximum deviation
            max_bootstrap_dev = np.max(np.abs(bootstrap_devs))
            max_observed_dev = np.max(np.abs(deviations))
            
            # Count if bootstrap deviation is >= observed
            if max_bootstrap_dev >= max_observed_dev:
                bootstrap_successes += 1
        
        # Calculate p-value from bootstrap
        p_bootstrap = bootstrap_successes / bootstrap_samples
        rejected['h0_random_fluctuation'] = p_bootstrap < 0.05
        p_values['h0_random_fluctuation'] = float(p_bootstrap)
        
        # Effect size: ratio of observed max deviation to average bootstrap max deviation
        effect_sizes['h0_random_fluctuation'] = float(max_observed_dev / (np.mean(np.abs(deviations)) + 1e-10))
        
        control_comparisons['h0_random_fluctuation'] = {
            'description': 'Bootstrap test comparing observed deviations with random sampling',
            'bootstrapSamples': bootstrap_samples,
            'bootstrapSuccesses': bootstrap_successes,
            'observedMaxDeviation': float(max_observed_dev)
        }
        
        return {
            'rejected': rejected,
            'pValues': p_values,
            'effectSizes': effect_sizes,
            'controlComparisons': control_comparisons
        }
    
    def _verify_consciousness_access(self, simulation_results, original_state, 
                                    reconstructed_state, error):
        """
        Implement the three-criteria verification framework from the paper.
        
        Returns a dict with verification results for each criterion.
        """
        # Extract data for analysis
        observed_probs = np.array(simulation_results['finalProbabilities'])
        expected_probs = np.array(simulation_results['standardProbabilities'])
        deviations = observed_probs - expected_probs
        
        # Criterion 1: Deviation from quantum randomness
        # Use chi-square test to determine if the deviations are statistically significant
        chi2, p_value = self._calculate_chi_square(observed_probs, expected_probs)
        deviation_significant = p_value < 0.05  # Significant at 95% confidence level
        
        # Criterion 2: Correlation with subjective experience (coherence)
        # In simulation, we correlate deviations with neural coherence level
        # In a real experiment, this would correlate with subjective reports
        coherence_correlation = self._calculate_correlation(
            np.abs(deviations), 
            np.ones(len(deviations)) * original_state.coherence_level
        )
        coherence_correlated = coherence_correlation > 0.3  # Moderate correlation threshold
        
        # Criterion 3: Bounded error reconstruction
        # This is already calculated by the reconstructor (error < η)
        bounded_reconstruction = error < ml_reconstructor.eta_threshold
        
        # All criteria must be satisfied for full verification
        all_criteria_satisfied = (
            deviation_significant and 
            coherence_correlated and 
            bounded_reconstruction
        )
        
        # Verify probability conservation constraint
        sum_deviation = np.sum(deviations)
        probability_conserved = abs(sum_deviation) < 1e-8
        
        return {
            'deviationSignificant': deviation_significant,
            'deviationPValue': float(p_value),
            'chiSquare': float(chi2),
            'coherenceCorrelated': coherence_correlated,
            'coherenceCorrelation': float(coherence_correlation),
            'boundedReconstruction': bounded_reconstruction,
            'reconstructionError': float(error),
            'etaThreshold': float(ml_reconstructor.eta_threshold),
            'probabilityConserved': probability_conserved,
            'probabilitySum': float(sum_deviation),
            'allCriteriaSatisfied': all_criteria_satisfied
        }
    
    def _calculate_information_metrics(self, simulation_results):
        """
        Calculate information-theoretic metrics as specified in Section 6 of the paper.
        """
        # Extract data
        observed_probs = np.array(simulation_results['finalProbabilities'])
        expected_probs = np.array(simulation_results['standardProbabilities'])
        perturbation = np.array(simulation_results['perturbation'])
        phase_info = np.array(simulation_results['phaseInformation'])
        
        # Calculate Shannon entropy
        shannon_entropy = -np.sum(observed_probs * np.log2(observed_probs + 1e-10))
        expected_entropy = -np.sum(expected_probs * np.log2(expected_probs + 1e-10))
        entropy_difference = expected_entropy - shannon_entropy
        
        # Multi-scale entropy (simplified implementation)
        # In a full implementation, this would use more sophisticated methods
        scales = [1, 2, 4, 8]
        mse = []
        for scale in scales:
            # Coarse-grain the data
            coarse_grained = np.array([
                np.mean(perturbation[i:i+scale]) 
                for i in range(0, len(perturbation), scale)
            ])
            
            # Calculate sample entropy for this scale
            # Simplified entropy calculation for demonstration
            if len(coarse_grained) > 1:
                variance = np.var(coarse_grained)
                if variance > 0:
                    sample_entropy = 0.5 * np.log(2 * np.pi * np.e * variance)
                    mse.append(float(sample_entropy))
                else:
                    mse.append(0.0)
            else:
                mse.append(0.0)
        
        # Mutual information between perturbation and phase
        # Simplified calculation for demonstration
        mutual_info = 0.0
        if len(phase_info) == len(perturbation):
            # Normalize data
            pert_norm = (perturbation - np.mean(perturbation)) / (np.std(perturbation) + 1e-10)
            phase_norm = (phase_info - np.mean(phase_info)) / (np.std(phase_info) + 1e-10)
            
            # Calculate correlation
            correlation = self._calculate_correlation(pert_norm, phase_norm)
            
            # Estimate mutual information from correlation for Gaussian variables
            # I(X;Y) ≈ -0.5 * log(1 - ρ²) for Gaussian X,Y with correlation ρ
            if abs(correlation) < 1.0:
                mutual_info = -0.5 * np.log(1 - correlation**2)
        
        # Spectral analysis of perturbation
        # Simplified implementation
        if len(perturbation) > 10:
            try:
                f, psd = welch(perturbation, nperseg=min(len(perturbation), 32))
                peak_freq_idx = np.argmax(psd)
                peak_freq = float(f[peak_freq_idx])
                spectral_entropy = -np.sum((psd / np.sum(psd)) * np.log2(psd / np.sum(psd) + 1e-10))
            except:
                peak_freq = 0.0
                spectral_entropy = 0.0
        else:
            peak_freq = 0.0
            spectral_entropy = 0.0
        
        return {
            'shannonEntropy': float(shannon_entropy),
            'expectedEntropy': float(expected_entropy),
            'entropyDifference': float(entropy_difference),
            'multiScaleEntropy': mse,
            'mutualInformation': float(mutual_info),
            'spectralPeakFrequency': float(peak_freq),
            'spectralEntropy': float(spectral_entropy)
        }
    
    def _calculate_chi_square(self, observed, expected):
        """Calculate chi-square test for goodness of fit."""
        chi2_stat = np.sum(((observed - expected) ** 2) / expected)
        p_value = 1 - stats.chi2.cdf(chi2_stat, len(observed) - 1)
        return chi2_stat, p_value
    
    def _calculate_correlation(self, a, b):
        """Calculate Pearson correlation coefficient."""
        if len(a) != len(b) or len(a) == 0:
            return 0
            
        a_mean = np.mean(a)
        b_mean = np.mean(b)
        numerator = np.sum((a - a_mean) * (b - b_mean))
        denominator = np.sqrt(np.sum((a - a_mean) ** 2) * np.sum((b - b_mean) ** 2))
        
        if denominator == 0:
            return 0
        
        return numerator / denominator

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return 