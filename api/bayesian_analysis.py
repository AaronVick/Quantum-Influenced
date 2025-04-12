import numpy as np
import scipy.stats as stats
from typing import Dict, List, Tuple, Optional, Union, Any
import logging
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('bayesian_analysis.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class BayesianAnalysis:
    """
    Implements Bayesian statistical analysis methods for the ΨC framework.
    Provides more rigorous hypothesis testing beyond frequentist p-values.
    """
    
    def __init__(self, 
                 prior_distribution: str = 'uniform',
                 prior_params: Dict[str, Any] = None,
                 bayes_factor_threshold: float = 3.0,
                 credible_interval: float = 0.95):
        """
        Initialize Bayesian analysis with priors.
        
        Args:
            prior_distribution: Type of prior distribution ('uniform', 'normal', 'informed')
            prior_params: Parameters for prior distributions
            bayes_factor_threshold: Threshold for Bayes Factor to consider evidence substantial
            credible_interval: Width of credible intervals (default: 95%)
        """
        self.prior_distribution = prior_distribution
        self.prior_params = prior_params or {}
        self.bayes_factor_threshold = bayes_factor_threshold
        self.credible_interval = credible_interval
        
        logger.info(f"Initialized Bayesian analysis with {prior_distribution} priors")
        
    def set_prior(self, 
                  prior_type: str, 
                  params: Dict[str, Any]):
        """
        Set or update prior distribution.
        
        Args:
            prior_type: Type of prior ('uniform', 'normal', 'informed')
            params: Parameters for the prior
        """
        self.prior_distribution = prior_type
        self.prior_params = params
        
        logger.info(f"Updated prior to {prior_type} with parameters {params}")
    
    def calculate_bayes_factor(self, 
                              data: np.ndarray,
                              null_hypothesis: Dict[str, Any],
                              alternative_hypothesis: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculate Bayes Factor comparing alternative to null hypothesis.
        
        Args:
            data: Observed data
            null_hypothesis: Parameters for null hypothesis
            alternative_hypothesis: Parameters for alternative hypothesis
            
        Returns:
            Dict containing Bayes Factor and interpretation
        """
        logger.info(f"Calculating Bayes Factor for data with shape {data.shape if hasattr(data, 'shape') else 'scalar'}")
        
        # Calculate marginal likelihoods
        try:
            log_ml_null = self._calculate_marginal_likelihood(data, null_hypothesis)
            log_ml_alt = self._calculate_marginal_likelihood(data, alternative_hypothesis)
            
            # Bayes Factor (BF10) = P(data|H1) / P(data|H0)
            bayes_factor = np.exp(log_ml_alt - log_ml_null)
            
            # Interpret Bayes Factor according to common guidelines
            interpretation = self._interpret_bayes_factor(bayes_factor)
            
            logger.info(f"Bayes Factor: {bayes_factor:.4f} - {interpretation}")
            
            return {
                "bayes_factor": float(bayes_factor),
                "log_bf": float(log_ml_alt - log_ml_null),
                "interpretation": interpretation,
                "favors_alternative": bayes_factor > self.bayes_factor_threshold
            }
            
        except Exception as e:
            logger.error(f"Error calculating Bayes Factor: {str(e)}")
            return {
                "bayes_factor": 1.0,
                "log_bf": 0.0,
                "interpretation": "Error in calculation",
                "favors_alternative": False,
                "error": str(e)
            }
    
    def calculate_posterior(self, 
                           data: np.ndarray,
                           model: str,
                           prior_params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Calculate posterior distribution given data and prior.
        
        Args:
            data: Observed data
            model: Model specification
            prior_params: Optional override for prior parameters
            
        Returns:
            Dict containing posterior distribution parameters
        """
        prior = prior_params or self.prior_params
        logger.info(f"Calculating posterior for model '{model}' with {len(data)} data points")
        
        try:
            if model == "bernoulli":
                return self._bernoulli_posterior(data, prior)
            elif model == "normal":
                return self._normal_posterior(data, prior)
            elif model == "correlation":
                return self._correlation_posterior(data, prior)
            else:
                raise ValueError(f"Unsupported model: {model}")
                
        except Exception as e:
            logger.error(f"Error calculating posterior: {str(e)}")
            return {
                "error": str(e),
                "posterior_mean": None,
                "posterior_variance": None,
                "credible_interval": None
            }
    
    def calculate_credible_interval(self, 
                                   posterior: Dict[str, Any],
                                   width: float = None) -> Tuple[float, float]:
        """
        Calculate credible interval from posterior.
        
        Args:
            posterior: Posterior distribution parameters
            width: Credible interval width (default: class instance value)
            
        Returns:
            Tuple of (lower, upper) bounds of the credible interval
        """
        width = width or self.credible_interval
        logger.info(f"Calculating {width*100:.1f}% credible interval")
        
        try:
            # For normal posterior
            if "posterior_mean" in posterior and "posterior_variance" in posterior:
                mean = posterior["posterior_mean"]
                std = np.sqrt(posterior["posterior_variance"])
                alpha = (1 - width) / 2
                
                lower = mean + stats.norm.ppf(alpha) * std
                upper = mean + stats.norm.ppf(1 - alpha) * std
                
                logger.info(f"Credible interval: [{lower:.4f}, {upper:.4f}]")
                return (float(lower), float(upper))
            
            # For other posteriors with samples
            elif "posterior_samples" in posterior:
                samples = posterior["posterior_samples"]
                alpha = (1 - width) / 2
                
                lower = np.quantile(samples, alpha)
                upper = np.quantile(samples, 1 - alpha)
                
                logger.info(f"Credible interval from samples: [{lower:.4f}, {upper:.4f}]")
                return (float(lower), float(upper))
            
            else:
                raise ValueError("Posterior must contain mean/variance or samples")
                
        except Exception as e:
            logger.error(f"Error calculating credible interval: {str(e)}")
            return (0.0, 0.0)
    
    def calculate_effect_size(self, data: np.ndarray, control_data: np.ndarray = None) -> Dict[str, float]:
        """
        Calculate Bayesian effect size metrics.
        
        Args:
            data: Experimental data
            control_data: Optional control group data
            
        Returns:
            Dict containing effect size metrics and uncertainty
        """
        logger.info(f"Calculating Bayesian effect size")
        
        try:
            if control_data is not None:
                # Two-sample effect size
                effect_size = self._calculate_two_sample_effect(data, control_data)
            else:
                # One-sample effect size against theoretical expectation
                effect_size = self._calculate_one_sample_effect(data)
            
            return effect_size
            
        except Exception as e:
            logger.error(f"Error calculating effect size: {str(e)}")
            return {
                "effect_size": 0.0,
                "error": str(e)
            }
    
    def calculate_power(self, 
                       effect_size: float,
                       sample_size: int,
                       alpha: float = 0.05) -> Dict[str, float]:
        """
        Calculate statistical power and required sample size.
        
        Args:
            effect_size: Expected effect size
            sample_size: Current or planned sample size
            alpha: Significance level
            
        Returns:
            Dict containing power analysis results
        """
        logger.info(f"Calculating statistical power for effect size {effect_size}, n={sample_size}")
        
        try:
            # Calculate power
            power = stats.norm.cdf(
                stats.norm.ppf(1 - alpha) - effect_size * np.sqrt(sample_size)
            )
            
            # Calculate required sample size for 80% power
            req_sample_size = ((stats.norm.ppf(0.8) + stats.norm.ppf(1 - alpha)) / effect_size) ** 2
            
            return {
                "power": float(power),
                "required_sample_size": int(np.ceil(req_sample_size)),
                "is_sufficient": power >= 0.8,
                "effect_size": float(effect_size),
                "alpha": float(alpha)
            }
            
        except Exception as e:
            logger.error(f"Error calculating power: {str(e)}")
            return {
                "power": 0.0,
                "required_sample_size": 0,
                "is_sufficient": False,
                "error": str(e)
            }
    
    def analyze_quantum_deviations(self, 
                                  observed_probs: np.ndarray,
                                  expected_probs: np.ndarray,
                                  neural_coherence: float = None) -> Dict[str, Any]:
        """
        Perform Bayesian analysis of quantum deviation data.
        
        Args:
            observed_probs: Observed probability distribution
            expected_probs: Expected probability distribution
            neural_coherence: Optional neural coherence level
            
        Returns:
            Dict containing comprehensive Bayesian analysis
        """
        logger.info(f"Analyzing quantum deviations with Bayesian methods")
        
        # Calculate deviations
        deviations = observed_probs - expected_probs
        
        # Set up hypotheses
        null_hypothesis = {
            "name": "No consciousness effect",
            "model": "normal",
            "params": {"mean": 0, "variance": np.var(expected_probs)}
        }
        
        alternative_hypothesis = {
            "name": "Consciousness affects quantum outcomes",
            "model": "normal",
            "params": {"mean": 0, "variance": np.var(expected_probs) * 1.5}
        }
        
        # Analyze with various Bayesian methods
        results = {}
        
        # 1. Bayes Factor analysis
        results["bayes_factor"] = self.calculate_bayes_factor(
            deviations, null_hypothesis["params"], alternative_hypothesis["params"]
        )
        
        # 2. Posterior distribution for deviation magnitude
        results["deviation_posterior"] = self.calculate_posterior(
            np.abs(deviations), "normal"
        )
        
        # 3. Credible interval for the true deviation
        if "posterior_mean" in results["deviation_posterior"]:
            results["credible_interval"] = self.calculate_credible_interval(
                results["deviation_posterior"]
            )
        
        # 4. If neural coherence provided, analyze correlation with Bayesian methods
        if neural_coherence is not None:
            # Create dummy data for correlation analysis
            coherence_vector = np.ones(len(deviations)) * neural_coherence
            
            results["coherence_analysis"] = self.calculate_posterior(
                np.vstack((np.abs(deviations), coherence_vector)).T, 
                "correlation"
            )
        
        # 5. Overall evidence assessment
        results["evidence_strength"] = self._assess_overall_evidence(results)
        
        return results
    
    def _calculate_marginal_likelihood(self, 
                                     data: np.ndarray,
                                     hypothesis: Dict[str, Any]) -> float:
        """
        Calculate log marginal likelihood P(data|hypothesis).
        
        Args:
            data: Observed data
            hypothesis: Hypothesis parameters
            
        Returns:
            Log marginal likelihood
        """
        # For simple normal model
        if "mean" in hypothesis and "variance" in hypothesis:
            mean = hypothesis["mean"]
            variance = hypothesis["variance"]
            
            # Log likelihood for normal distribution
            log_likelihood = -0.5 * np.sum(((data - mean) ** 2) / variance)
            log_likelihood -= 0.5 * len(data) * np.log(2 * np.pi * variance)
            
            return log_likelihood
        
        # For other models, implement specific likelihood calculations
        # This is a simplified implementation
        return 0.0
    
    def _interpret_bayes_factor(self, bf: float) -> str:
        """
        Interpret Bayes Factor using standard guidelines.
        
        Args:
            bf: Bayes Factor value (BF10)
            
        Returns:
            String interpretation
        """
        if bf < 1:
            # Evidence favors null hypothesis (use BF01 = 1/BF10)
            bf_01 = 1 / bf
            
            if bf_01 < 3:
                return "Anecdotal evidence for null hypothesis"
            elif bf_01 < 10:
                return "Moderate evidence for null hypothesis"
            elif bf_01 < 30:
                return "Strong evidence for null hypothesis"
            elif bf_01 < 100:
                return "Very strong evidence for null hypothesis"
            else:
                return "Extreme evidence for null hypothesis"
                
        else:
            # Evidence favors alternative hypothesis
            if bf < 3:
                return "Anecdotal evidence for alternative hypothesis"
            elif bf < 10:
                return "Moderate evidence for alternative hypothesis"
            elif bf < 30:
                return "Strong evidence for alternative hypothesis"
            elif bf < 100:
                return "Very strong evidence for alternative hypothesis"
            else:
                return "Extreme evidence for alternative hypothesis"
    
    def _bernoulli_posterior(self, 
                           data: np.ndarray,
                           prior: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate posterior for Bernoulli/Binomial model using Beta prior.
        
        Args:
            data: Binary data (0/1)
            prior: Prior parameters (alpha, beta)
            
        Returns:
            Dict with posterior parameters
        """
        # Extract prior parameters (default to Beta(1,1) = uniform)
        alpha_prior = prior.get("alpha", 1)
        beta_prior = prior.get("beta", 1)
        
        # Calculate sufficient statistics
        successes = np.sum(data)
        failures = len(data) - successes
        
        # Calculate posterior parameters (Beta distribution)
        alpha_post = alpha_prior + successes
        beta_post = beta_prior + failures
        
        # Calculate posterior mean and variance
        post_mean = alpha_post / (alpha_post + beta_post)
        post_var = (alpha_post * beta_post) / ((alpha_post + beta_post)**2 * (alpha_post + beta_post + 1))
        
        # Generate posterior samples
        post_samples = stats.beta.rvs(alpha_post, beta_post, size=10000)
        
        return {
            "distribution": "beta",
            "posterior_alpha": float(alpha_post),
            "posterior_beta": float(beta_post),
            "posterior_mean": float(post_mean),
            "posterior_variance": float(post_var),
            "posterior_samples": post_samples.tolist()
        }
    
    def _normal_posterior(self, 
                        data: np.ndarray,
                        prior: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate posterior for Normal model with unknown mean.
        
        Args:
            data: Continuous data
            prior: Prior parameters (mean, variance)
            
        Returns:
            Dict with posterior parameters
        """
        # Extract prior parameters
        prior_mean = prior.get("mean", 0)
        prior_variance = prior.get("variance", 1)
        
        # Known data variance (simplification)
        data_variance = np.var(data) if len(data) > 1 else prior_variance
        
        # Calculate sufficient statistics
        n = len(data)
        sample_mean = np.mean(data)
        
        # Calculate posterior parameters
        post_precision = 1/prior_variance + n/data_variance
        post_variance = 1 / post_precision
        post_mean = post_variance * (prior_mean/prior_variance + n*sample_mean/data_variance)
        
        # Generate posterior samples
        post_samples = stats.norm.rvs(post_mean, np.sqrt(post_variance), size=10000)
        
        return {
            "distribution": "normal",
            "posterior_mean": float(post_mean),
            "posterior_variance": float(post_variance),
            "posterior_samples": post_samples.tolist(),
            "sample_mean": float(sample_mean),
            "sample_variance": float(data_variance),
            "sample_size": n
        }
    
    def _correlation_posterior(self, 
                             data: np.ndarray,
                             prior: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate posterior for correlation coefficient.
        
        Args:
            data: 2D array with paired observations
            prior: Prior parameters
            
        Returns:
            Dict with posterior parameters
        """
        # Extract variables
        if data.shape[1] != 2:
            raise ValueError("Data must have exactly 2 columns for correlation analysis")
            
        x = data[:, 0]
        y = data[:, 1]
        
        # Calculate sample correlation
        r, p = stats.pearsonr(x, y)
        
        # Transform to Fisher's z for normal approximation
        z = np.arctanh(r)
        z_se = 1 / np.sqrt(len(x) - 3)
        
        # Prior mean and variance in z-space
        prior_z_mean = prior.get("z_mean", 0)
        prior_z_variance = prior.get("z_variance", 1)
        
        # Posterior in z-space (normal approximation)
        post_z_precision = 1/prior_z_variance + 1/z_se**2
        post_z_variance = 1 / post_z_precision
        post_z_mean = post_z_variance * (prior_z_mean/prior_z_variance + z/z_se**2)
        
        # Transform back to r-space for reporting
        # Generate samples in z-space and transform
        z_samples = stats.norm.rvs(post_z_mean, np.sqrt(post_z_variance), size=10000)
        r_samples = np.tanh(z_samples)
        
        # Point estimates
        post_r_mean = np.tanh(post_z_mean)
        post_r_median = np.median(r_samples)
        
        # Credible interval in r-space
        cred_interval = self.calculate_credible_interval(
            {"posterior_samples": r_samples}
        )
        
        return {
            "correlation": float(r),
            "p_value": float(p),
            "posterior_r_mean": float(post_r_mean),
            "posterior_r_median": float(post_r_median),
            "posterior_samples": r_samples.tolist(),
            "credible_interval": cred_interval,
            "sample_size": len(x)
        }
    
    def _calculate_two_sample_effect(self, 
                                   data: np.ndarray,
                                   control_data: np.ndarray) -> Dict[str, float]:
        """
        Calculate Bayesian effect size for two samples.
        
        Args:
            data: Experimental group data
            control_data: Control group data
            
        Returns:
            Dict with effect size metrics
        """
        # Calculate means and standard deviations
        mean1 = np.mean(data)
        mean2 = np.mean(control_data)
        sd1 = np.std(data, ddof=1)
        sd2 = np.std(control_data, ddof=1)
        n1 = len(data)
        n2 = len(control_data)
        
        # Pooled standard deviation
        pooled_sd = np.sqrt(((n1-1)*sd1**2 + (n2-1)*sd2**2) / (n1 + n2 - 2))
        
        # Cohen's d with correction
        d = (mean1 - mean2) / pooled_sd
        
        # Variance of d
        d_variance = (n1 + n2) / (n1 * n2) + d**2 / (2*(n1 + n2))
        
        # Generate posterior samples for d
        d_samples = stats.norm.rvs(d, np.sqrt(d_variance), size=10000)
        
        # Calculate credible interval
        ci_lower, ci_upper = np.quantile(d_samples, [0.025, 0.975])
        
        return {
            "effect_size": float(d),
            "effect_type": "Cohen's d",
            "standard_error": float(np.sqrt(d_variance)),
            "credible_interval": [float(ci_lower), float(ci_upper)],
            "probability_positive": float(np.mean(d_samples > 0)),
            "mean_difference": float(mean1 - mean2),
            "pooled_sd": float(pooled_sd)
        }
    
    def _calculate_one_sample_effect(self, data: np.ndarray) -> Dict[str, float]:
        """
        Calculate Bayesian effect size for one sample against reference value.
        
        Args:
            data: Experimental data
            
        Returns:
            Dict with effect size metrics
        """
        # Default reference value is 0
        reference = 0
        
        # Calculate mean and standard deviation
        mean = np.mean(data)
        sd = np.std(data, ddof=1)
        n = len(data)
        
        # Cohen's d
        d = (mean - reference) / sd
        
        # Variance of d
        d_variance = 1/n + d**2 / (2*n)
        
        # Generate posterior samples for d
        d_samples = stats.norm.rvs(d, np.sqrt(d_variance), size=10000)
        
        # Calculate credible interval
        ci_lower, ci_upper = np.quantile(d_samples, [0.025, 0.975])
        
        return {
            "effect_size": float(d),
            "effect_type": "Cohen's d (one sample)",
            "standard_error": float(np.sqrt(d_variance)),
            "credible_interval": [float(ci_lower), float(ci_upper)],
            "probability_positive": float(np.mean(d_samples > 0)),
            "mean_difference": float(mean - reference),
            "sample_sd": float(sd)
        }
    
    def _assess_overall_evidence(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess the overall strength of evidence from multiple analyses.
        
        Args:
            results: Dict with various analysis results
            
        Returns:
            Dict with overall assessment
        """
        # Extract key metrics
        bayes_factor = results.get("bayes_factor", {}).get("bayes_factor", 1.0)
        
        # Get deviation posterior
        dev_posterior = results.get("deviation_posterior", {})
        dev_mean = dev_posterior.get("posterior_mean", 0)
        
        # Get credible interval
        cred_interval = results.get("credible_interval", (0, 0))
        excludes_zero = cred_interval[0] > 0 if cred_interval else False
        
        # Coherence analysis
        coherence_analysis = results.get("coherence_analysis", {})
        coherence_r = coherence_analysis.get("posterior_r_mean", 0)
        
        # Calculate evidence scores (0-100 scale)
        bf_score = min(100, 33.3 * np.log10(bayes_factor + 1))
        dev_score = min(100, 100 * dev_mean / 0.1)  # Normalize to expected deviation
        corr_score = min(100, 100 * abs(coherence_r))
        
        # Combined evidence score (weighted average)
        combined_score = 0.4 * bf_score + 0.4 * dev_score + 0.2 * corr_score
        
        # Interpret strength
        if combined_score < 20:
            strength = "Very weak"
        elif combined_score < 40:
            strength = "Weak"
        elif combined_score < 60:
            strength = "Moderate"
        elif combined_score < 80:
            strength = "Strong"
        else:
            strength = "Very strong"
        
        return {
            "combined_evidence_score": float(combined_score),
            "strength": strength,
            "components": {
                "bayes_factor_score": float(bf_score),
                "deviation_score": float(dev_score),
                "correlation_score": float(corr_score)
            },
            "excludes_zero": excludes_zero,
            "interpretation": f"{strength} evidence for consciousness-quantum interaction"
        }

def generate_bayesian_report(analysis_results: Dict[str, Any], 
                             experiment_info: Dict[str, Any]) -> str:
    """
    Generate a human-readable report of Bayesian analysis results.
    
    Args:
        analysis_results: Dict with analysis results
        experiment_info: Dict with experiment metadata
        
    Returns:
        Formatted report as string
    """
    try:
        # Basic experiment info
        report = [
            "# Bayesian Analysis Report",
            f"Experiment ID: {experiment_info.get('experimentId', 'Unknown')}",
            f"Date: {experiment_info.get('timestamp', 'Unknown')}",
            f"Analysis type: {experiment_info.get('analysisType', 'Quantum-Consciousness Interaction')}",
            "\n## Summary of Findings",
        ]
        
        # Overall evidence assessment
        evidence = analysis_results.get("evidence_strength", {})
        if evidence:
            report.append(f"Evidence strength: {evidence.get('strength', 'Unknown')}")
            report.append(f"Combined evidence score: {evidence.get('combined_evidence_score', 0):.1f}/100")
            report.append(f"Interpretation: {evidence.get('interpretation', '')}")
        
        # Bayes Factor results
        bf_results = analysis_results.get("bayes_factor", {})
        if bf_results:
            report.append("\n## Bayes Factor Analysis")
            report.append(f"Bayes Factor (BF10): {bf_results.get('bayes_factor', 0):.4f}")
            report.append(f"Interpretation: {bf_results.get('interpretation', '')}")
            
            if bf_results.get('favors_alternative', False):
                report.append("This indicates support for the consciousness-quantum interaction hypothesis.")
            else:
                report.append("This indicates lack of support for the consciousness-quantum interaction hypothesis.")
        
        # Deviation analysis
        dev_results = analysis_results.get("deviation_posterior", {})
        if dev_results:
            report.append("\n## Deviation Analysis")
            report.append(f"Posterior mean deviation: {dev_results.get('posterior_mean', 0):.4f}")
            
            # Credible interval
            ci = analysis_results.get("credible_interval", (0, 0))
            if ci:
                report.append(f"95% Credible interval: [{ci[0]:.4f}, {ci[1]:.4f}]")
                if ci[0] > 0:
                    report.append("The credible interval excludes zero, supporting a genuine effect.")
                else:
                    report.append("The credible interval includes zero, indicating uncertainty about the effect.")
        
        # Coherence analysis
        coherence_results = analysis_results.get("coherence_analysis", {})
        if coherence_results:
            report.append("\n## Coherence-Deviation Correlation")
            report.append(f"Posterior correlation estimate: {coherence_results.get('posterior_r_mean', 0):.4f}")
            report.append(f"95% Credible interval: [{coherence_results.get('credible_interval', [0,0])[0]:.4f}, {coherence_results.get('credible_interval', [0,0])[1]:.4f}]")
            
            prob_positive = coherence_results.get('probability_positive', 0)
            report.append(f"Probability of positive correlation: {prob_positive:.1%}")
        
        # Conclusions
        report.append("\n## Conclusions")
        
        if evidence and evidence.get('combined_evidence_score', 0) > 50:
            report.append("The Bayesian analysis provides substantial support for the consciousness-quantum interaction hypothesis.")
            report.append("The observed deviations from quantum randomness are unlikely to be explained by chance alone.")
        elif evidence and evidence.get('combined_evidence_score', 0) > 30:
            report.append("The Bayesian analysis provides moderate support for the consciousness-quantum interaction hypothesis.")
            report.append("Additional data would help strengthen or refute this conclusion.")
        else:
            report.append("The Bayesian analysis does not provide strong support for the consciousness-quantum interaction hypothesis.")
            report.append("The observed deviations may be explained by chance or other factors.")
        
        # Recommendations
        report.append("\n## Recommendations")
        
        if evidence and evidence.get('combined_evidence_score', 0) < 50:
            report.append("- Increase sample size to improve statistical precision")
            report.append("- Consider refining measurement techniques to reduce noise")
            report.append("- Test additional control conditions to rule out alternative explanations")
        else:
            report.append("- Replicate findings with independent samples")
            report.append("- Test boundary conditions of the effect")
            report.append("- Explore mechanistic explanations for the observed effects")
        
        return "\n".join(report)
        
    except Exception as e:
        logger.error(f"Error generating Bayesian report: {str(e)}")
        return f"Error generating report: {str(e)}"

if __name__ == "__main__":
    # Example usage
    bayesian_analyzer = BayesianAnalysis(prior_distribution="uniform")
    
    # Mock quantum deviation data
    observed = np.array([0.15, 0.25, 0.1, 0.3, 0.2])
    expected = np.array([0.2, 0.2, 0.2, 0.2, 0.2])
    
    # Run analysis
    results = bayesian_analyzer.analyze_quantum_deviations(observed, expected, neural_coherence=0.7)
    
    # Generate report
    experiment_info = {
        "experimentId": "TEST-123",
        "timestamp": "2023-09-24T10:15:30",
        "analysisType": "Quantum-Consciousness Interaction"
    }
    
    report = generate_bayesian_report(results, experiment_info)
    print(report) 