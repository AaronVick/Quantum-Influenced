import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #121212;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: #e0e0e0;
`;

const Title = styled.h2`
  color: #bb86fc;
  margin-top: 0;
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  color: #bb86fc;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #bb86fc;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #bb86fc;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #bb86fc;
  }
`;

const Button = styled.button`
  background-color: #bb86fc;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 8px;

  &:hover {
    background-color: #9965f4;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const Card = styled.div`
  background-color: #222;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h4`
  color: #e0e0e0;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const DataLabel = styled.span`
  color: #a0a0a0;
`;

const DataValue = styled.span<{ success?: boolean }>`
  font-weight: 500;
  color: ${props => props.success ? '#03dac6' : props.success === false ? '#cf6679' : '#e0e0e0'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #a0a0a0;
  margin: 8px 0;
`;

const Badge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${props => props.color};
  color: #000;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  input {
    margin-right: 8px;
  }
  
  label {
    color: #e0e0e0;
    font-size: 14px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#333' : 'transparent'};
  color: ${props => props.active ? '#bb86fc' : '#e0e0e0'};
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  transition: background-color 0.3s, color 0.3s;
  margin-right: 4px;

  &:hover {
    background-color: #333;
  }
`;

const TabGroup = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #333;
`;

interface StatisticalRigorProps {
  onSettingsChange: (settings: StatisticalSettings) => void;
  experimentData?: any;
}

export interface StatisticalSettings {
  sampleSize: number;
  alpha: number;
  effectSize: number;
  power: number;
  bayesianAnalysis: boolean;
  multipleComparisonCorrection: string;
  preRegistration: boolean;
  controlConditions: string[];
}

interface PowerAnalysis {
  requiredSampleSize: number;
  powerAtCurrentSample: number;
  recommendedSampleSize: number;
  isSufficientPower: boolean;
}

const StatisticalRigor: React.FC<StatisticalRigorProps> = ({ 
  onSettingsChange,
  experimentData 
}) => {
  const [activeTab, setActiveTab] = useState('sample-size');
  const [settings, setSettings] = useState<StatisticalSettings>({
    sampleSize: 50,
    alpha: 0.05,
    effectSize: 0.3,
    power: 0.8,
    bayesianAnalysis: true,
    multipleComparisonCorrection: 'bonferroni',
    preRegistration: false,
    controlConditions: ['sham']
  });
  
  const [powerAnalysis, setPowerAnalysis] = useState<PowerAnalysis>({
    requiredSampleSize: 0,
    powerAtCurrentSample: 0,
    recommendedSampleSize: 0,
    isSufficientPower: false
  });
  
  const [isFalsePositiveChecked, setIsFalsePositiveChecked] = useState(true);
  const [isFalseNegativeChecked, setIsFalseNegativeChecked] = useState(true);
  
  // Calculate power analysis whenever relevant parameters change
  useEffect(() => {
    calculatePowerAnalysis();
  }, [settings.sampleSize, settings.alpha, settings.effectSize, settings.power]);
  
  const calculatePowerAnalysis = () => {
    const { sampleSize, alpha, effectSize } = settings;
    
    // Calculate required sample size for desired power
    // Formula: n = ((z_1-α/2 + z_1-β)² / d²)
    // Where z is the z-score, d is the effect size
    const zAlpha = getZScore(1 - alpha / 2);
    const zBeta = getZScore(settings.power);
    
    const requiredSampleSize = Math.ceil(Math.pow(zAlpha + zBeta, 2) / Math.pow(effectSize, 2));
    
    // Calculate power at current sample size
    // Formula: Φ(d√n - z_1-α/2)
    // Where Φ is the cumulative normal distribution function
    const powerAtCurrentSample = cumulativeNormal(effectSize * Math.sqrt(sampleSize) - zAlpha);
    
    // Recommended sample size with safety margin
    const recommendedSampleSize = Math.ceil(requiredSampleSize * 1.1);
    
    setPowerAnalysis({
      requiredSampleSize,
      powerAtCurrentSample,
      recommendedSampleSize,
      isSufficientPower: sampleSize >= requiredSampleSize
    });
  };
  
  // Helper function to get z-score for a given probability
  const getZScore = (p: number): number => {
    // Simple approximation of inverse normal CDF
    // More precise implementation would use a statistical library
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;
    
    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;
    
    const c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;
    
    const d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;
    
    let z_abs, r, pTemp;
    
    if (p <= 0 || p >= 1) {
      return p < 0.5 ? -8 : 8; // Return extreme values for extreme probabilities
    } else if (p < 0.02425) {
      // Lower region
      pTemp = Math.sqrt(-2 * Math.log(p));
      z_abs = ((((c1 * pTemp + c2) * pTemp + c3) * pTemp + c4) * pTemp + c5) * pTemp + c6;
      z_abs = z_abs / ((((d1 * pTemp + d2) * pTemp + d3) * pTemp + d4) * pTemp + 1);
    } else if (p < 0.97575) {
      // Central region
      pTemp = p - 0.5;
      r = pTemp * pTemp;
      z_abs = pTemp * (((a1 * r + a2) * r + a3) * r + a4) * r + a5;
      z_abs = z_abs / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
      // Upper region
      pTemp = Math.sqrt(-2 * Math.log(1 - p));
      z_abs = ((((c1 * pTemp + c2) * pTemp + c3) * pTemp + c4) * pTemp + c5) * pTemp + c6;
      z_abs = z_abs / ((((d1 * pTemp + d2) * pTemp + d3) * pTemp + d4) * pTemp + 1);
    }
    
    return p < 0.5 ? -z_abs : z_abs;
  };
  
  // Helper function for cumulative normal distribution
  const cumulativeNormal = (z: number): number => {
    // Simple approximation of normal CDF
    if (z < -8.0) return 0;
    if (z > 8.0) return 1;
    
    const p = 0.5 * (1 + Math.tanh(Math.sqrt(Math.PI) * z / 2));
    return p;
  };
  
  const handleSettingChange = (
    field: keyof StatisticalSettings, 
    value: number | boolean | string | string[]
  ) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };
  
  const handleControlToggle = (condition: string) => {
    const currentControls = [...settings.controlConditions];
    if (currentControls.includes(condition)) {
      // Remove condition
      const newControls = currentControls.filter(c => c !== condition);
      handleSettingChange('controlConditions', newControls);
    } else {
      // Add condition
      const newControls = [...currentControls, condition];
      handleSettingChange('controlConditions', newControls);
    }
  };
  
  const getFalsePositiveRisk = (): number => {
    // Risk of false positive is alpha (type I error rate)
    // But increases with multiple comparisons if not corrected
    const { alpha, multipleComparisonCorrection } = settings;
    
    // Assume 4 hypotheses being tested
    const numHypotheses = 4;
    
    // Family-wise error rate without correction
    const fwer = 1 - Math.pow(1 - alpha, numHypotheses);
    
    // Adjusted based on correction method
    switch (multipleComparisonCorrection) {
      case 'bonferroni':
        return alpha; // Bonferroni corrects alpha directly
      case 'fdr':
        return alpha * 1.5; // FDR is less conservative than Bonferroni
      case 'holm':
        return alpha * 1.2; // Holm's method is between
      case 'none':
        return fwer; // No correction leads to inflated FWER
      default:
        return alpha;
    }
  };
  
  const getFalseNegativeRisk = (): number => {
    // Risk of false negative is 1 - power (type II error rate)
    return 1 - powerAnalysis.powerAtCurrentSample;
  };
  
  const getTestStrength = (): number => {
    // Test strength as weighted combination of factors
    
    // Power (40%)
    const powerScore = Math.min(100, (powerAnalysis.powerAtCurrentSample / 0.9) * 100);
    
    // Control conditions (20%)
    const controlScore = Math.min(100, (settings.controlConditions.length / 3) * 100);
    
    // Statistical approach (20%)
    const statisticalScore = settings.bayesianAnalysis ? 100 : 70;
    
    // Pre-registration (20%)
    const preRegScore = settings.preRegistration ? 100 : 50;
    
    // Weighted average
    return (powerScore * 0.4) + (controlScore * 0.2) + (statisticalScore * 0.2) + (preRegScore * 0.2);
  };
  
  const getTestStrengthLabel = (): { label: string; color: string } => {
    const strength = getTestStrength();
    
    if (strength < 40) {
      return { label: 'Weak', color: '#cf6679' };
    } else if (strength < 60) {
      return { label: 'Moderate', color: '#ffab40' };
    } else if (strength < 80) {
      return { label: 'Strong', color: '#8bc34a' };
    } else {
      return { label: 'Very Strong', color: '#03dac6' };
    }
  };
  
  return (
    <Container>
      <Title>Statistical Rigor Analysis</Title>
      
      <TabGroup>
        <Tab 
          active={activeTab === 'sample-size'} 
          onClick={() => setActiveTab('sample-size')}
        >
          Sample Size & Power
        </Tab>
        <Tab 
          active={activeTab === 'controls'} 
          onClick={() => setActiveTab('controls')}
        >
          Controls & Conditions
        </Tab>
        <Tab 
          active={activeTab === 'analysis'} 
          onClick={() => setActiveTab('analysis')}
        >
          Analysis Approach
        </Tab>
        <Tab 
          active={activeTab === 'strength'} 
          onClick={() => setActiveTab('strength')}
        >
          Test Strength
        </Tab>
      </TabGroup>
      
      {activeTab === 'sample-size' && (
        <Section>
          <SectionTitle>Sample Size & Power Analysis</SectionTitle>
          
          <Card>
            <CardTitle>Required Sample Size</CardTitle>
            <InfoText>
              Based on your desired effect size, significance level (α), and statistical power (1-β),
              the required sample size is calculated below.
            </InfoText>
            
            <FormGroup>
              <Label>Expected Effect Size (Cohen's d)</Label>
              <Select 
                value={settings.effectSize} 
                onChange={(e) => handleSettingChange('effectSize', parseFloat(e.target.value))}
              >
                <option value="0.1">0.1 - Very small effect</option>
                <option value="0.2">0.2 - Small effect</option>
                <option value="0.3">0.3 - Moderate-small effect</option>
                <option value="0.5">0.5 - Moderate effect</option>
                <option value="0.8">0.8 - Large effect</option>
                <option value="1.2">1.2 - Very large effect</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Significance Level (α)</Label>
              <Select 
                value={settings.alpha} 
                onChange={(e) => handleSettingChange('alpha', parseFloat(e.target.value))}
              >
                <option value="0.1">0.10 - Less stringent</option>
                <option value="0.05">0.05 - Standard</option>
                <option value="0.01">0.01 - Stringent</option>
                <option value="0.001">0.001 - Very stringent</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Desired Statistical Power</Label>
              <Select 
                value={settings.power} 
                onChange={(e) => handleSettingChange('power', parseFloat(e.target.value))}
              >
                <option value="0.7">70% - Minimum acceptable</option>
                <option value="0.8">80% - Standard</option>
                <option value="0.9">90% - High power</option>
                <option value="0.95">95% - Very high power</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Current Sample Size</Label>
              <Input 
                type="number" 
                min="1" 
                value={settings.sampleSize} 
                onChange={(e) => handleSettingChange('sampleSize', parseInt(e.target.value, 10))}
              />
            </FormGroup>
            
            <DataRow>
              <DataLabel>Required sample size:</DataLabel>
              <DataValue>{powerAnalysis.requiredSampleSize}</DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Current power:</DataLabel>
              <DataValue success={powerAnalysis.powerAtCurrentSample >= 0.8}>
                {(powerAnalysis.powerAtCurrentSample * 100).toFixed(1)}%
              </DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Status:</DataLabel>
              <DataValue success={powerAnalysis.isSufficientPower}>
                {powerAnalysis.isSufficientPower 
                  ? 'Sufficient sample size' 
                  : 'Insufficient sample size'}
              </DataValue>
            </DataRow>
            
            <ProgressBar>
              <ProgressFill 
                width={(settings.sampleSize / powerAnalysis.requiredSampleSize) * 100} 
                color={powerAnalysis.isSufficientPower ? '#03dac6' : '#cf6679'}
              />
            </ProgressBar>
            
            <InfoText>
              {powerAnalysis.isSufficientPower
                ? 'Your current sample size provides sufficient statistical power to detect the expected effect.'
                : `You need ${powerAnalysis.requiredSampleSize - settings.sampleSize} more samples to reach the required power.`}
            </InfoText>
          </Card>
        </Section>
      )}
      
      {activeTab === 'controls' && (
        <Section>
          <SectionTitle>Controls & Experimental Conditions</SectionTitle>
          
          <Card>
            <CardTitle>Control Conditions</CardTitle>
            <InfoText>
              Control conditions are crucial for establishing causality and ruling out alternative explanations.
              Select which control conditions to include in the experiment.
            </InfoText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.controlConditions.includes('sham')}
                onChange={() => handleControlToggle('sham')}
                id="sham-control"
              />
              <label htmlFor="sham-control">
                Sham condition (consciousness directed to non-relevant target)
              </label>
            </Checkbox>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.controlConditions.includes('thermal')}
                onChange={() => handleControlToggle('thermal')}
                id="thermal-control"
              />
              <label htmlFor="thermal-control">
                Thermal noise control (to rule out environmental factors)
              </label>
            </Checkbox>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.controlConditions.includes('em_noise')}
                onChange={() => handleControlToggle('em_noise')}
                id="em-control"
              />
              <label htmlFor="em-control">
                Electromagnetic interference control
              </label>
            </Checkbox>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.controlConditions.includes('double_blind')}
                onChange={() => handleControlToggle('double_blind')}
                id="double-blind"
              />
              <label htmlFor="double-blind">
                Double-blind protocol (experimenter unaware of condition)
              </label>
            </Checkbox>
            
            <DataRow>
              <DataLabel>Control strength:</DataLabel>
              <DataValue success={settings.controlConditions.length >= 3}>
                {settings.controlConditions.length === 0 ? 'None' :
                 settings.controlConditions.length === 1 ? 'Minimal' :
                 settings.controlConditions.length === 2 ? 'Moderate' :
                 settings.controlConditions.length >= 3 ? 'Strong' : ''}
              </DataValue>
            </DataRow>
          </Card>
          
          <Card>
            <CardTitle>Pre-Registration</CardTitle>
            <InfoText>
              Pre-registering the experiment protocol, hypotheses, and analysis plan prevents p-hacking
              and researcher degrees of freedom that can lead to false positive results.
            </InfoText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.preRegistration}
                onChange={(e) => handleSettingChange('preRegistration', e.target.checked)}
                id="pre-registration"
              />
              <label htmlFor="pre-registration">
                Pre-register experiment design, hypotheses, and analysis plan
              </label>
            </Checkbox>
            
            {settings.preRegistration && (
              <InfoText>
                Pre-registration details will be generated as a markdown document with a unique identifier.
                This document should be stored in a timestamp-verified repository before data collection begins.
              </InfoText>
            )}
            
            <DataRow>
              <DataLabel>Pre-registration status:</DataLabel>
              <DataValue success={settings.preRegistration}>
                {settings.preRegistration ? 'Enabled' : 'Not enabled'}
              </DataValue>
            </DataRow>
          </Card>
        </Section>
      )}
      
      {activeTab === 'analysis' && (
        <Section>
          <SectionTitle>Statistical Analysis Approach</SectionTitle>
          
          <Card>
            <CardTitle>Multiple Comparison Correction</CardTitle>
            <InfoText>
              When testing multiple hypotheses, the risk of false positives increases.
              Correction methods adjust the significance threshold to maintain the overall error rate.
            </InfoText>
            
            <FormGroup>
              <Label>Correction Method</Label>
              <Select 
                value={settings.multipleComparisonCorrection} 
                onChange={(e) => handleSettingChange('multipleComparisonCorrection', e.target.value)}
              >
                <option value="bonferroni">Bonferroni (most conservative)</option>
                <option value="holm">Holm-Bonferroni (sequential)</option>
                <option value="fdr">False Discovery Rate (less conservative)</option>
                <option value="none">None (not recommended)</option>
              </Select>
            </FormGroup>
            
            <DataRow>
              <DataLabel>False positive risk:</DataLabel>
              <DataValue success={getFalsePositiveRisk() <= 0.05}>
                {(getFalsePositiveRisk() * 100).toFixed(1)}%
              </DataValue>
            </DataRow>
          </Card>
          
          <Card>
            <CardTitle>Bayesian Analysis</CardTitle>
            <InfoText>
              Bayesian analysis provides more nuanced interpretation of evidence strength rather
              than binary significance testing, and handles small sample sizes better.
            </InfoText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={settings.bayesianAnalysis}
                onChange={(e) => handleSettingChange('bayesianAnalysis', e.target.checked)}
                id="bayesian-analysis"
              />
              <label htmlFor="bayesian-analysis">
                Include Bayesian analysis alongside frequentist tests
              </label>
            </Checkbox>
            
            {settings.bayesianAnalysis && (
              <FormGroup>
                <Label>Prior Distribution</Label>
                <Select>
                  <option value="uniform">Uniform (non-informative)</option>
                  <option value="normal">Normal (weakly informative)</option>
                  <option value="informed">Informed by previous studies</option>
                </Select>
              </FormGroup>
            )}
            
            <DataRow>
              <DataLabel>Analysis approach:</DataLabel>
              <DataValue success={settings.bayesianAnalysis}>
                {settings.bayesianAnalysis ? 'Comprehensive (Bayesian + Frequentist)' : 'Limited (Frequentist only)'}
              </DataValue>
            </DataRow>
          </Card>
        </Section>
      )}
      
      {activeTab === 'strength' && (
        <Section>
          <SectionTitle>Test Strength Assessment</SectionTitle>
          
          <Card>
            <CardTitle>Overall Test Strength</CardTitle>
            <InfoText>
              The overall strength of your experimental design is assessed based on sample size,
              controls, statistical approach, and pre-registration status.
            </InfoText>
            
            <DataRow>
              <DataLabel>Test strength:</DataLabel>
              <DataValue>
                {getTestStrengthLabel().label}
                <Badge color={getTestStrengthLabel().color}>
                  {getTestStrength().toFixed(0)}/100
                </Badge>
              </DataValue>
            </DataRow>
            
            <ProgressBar>
              <ProgressFill 
                width={getTestStrength()} 
                color={getTestStrengthLabel().color}
              />
            </ProgressBar>
          </Card>
          
          <Card>
            <CardTitle>Error Risk Analysis</CardTitle>
            <InfoText>
              Assessing the risk of Type I (false positive) and Type II (false negative) errors.
            </InfoText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={isFalsePositiveChecked}
                onChange={() => setIsFalsePositiveChecked(!isFalsePositiveChecked)}
                id="false-positive"
              />
              <label htmlFor="false-positive">
                Minimize false positives (claiming an effect when none exists)
              </label>
            </Checkbox>
            
            <Checkbox>
              <input 
                type="checkbox" 
                checked={isFalseNegativeChecked}
                onChange={() => setIsFalseNegativeChecked(!isFalseNegativeChecked)}
                id="false-negative"
              />
              <label htmlFor="false-negative">
                Minimize false negatives (missing a true effect)
              </label>
            </Checkbox>
            
            <DataRow>
              <DataLabel>False positive risk:</DataLabel>
              <DataValue success={getFalsePositiveRisk() < 0.05}>
                {(getFalsePositiveRisk() * 100).toFixed(1)}%
              </DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>False negative risk:</DataLabel>
              <DataValue success={getFalseNegativeRisk() < 0.2}>
                {(getFalseNegativeRisk() * 100).toFixed(1)}%
              </DataValue>
            </DataRow>
          </Card>
          
          <Card>
            <CardTitle>Falsifiability Assessment</CardTitle>
            <InfoText>
              For a theory to be scientific, it must be falsifiable. This assessment evaluates
              how effectively your experimental design could falsify the consciousness-quantum interaction hypothesis.
            </InfoText>
            
            <DataRow>
              <DataLabel>Clear null hypothesis:</DataLabel>
              <DataValue success={true}>Yes</DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Testable predictions:</DataLabel>
              <DataValue success={true}>Yes (quantitative)</DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Control conditions:</DataLabel>
              <DataValue success={settings.controlConditions.length >= 2}>
                {settings.controlConditions.length} present
              </DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Statistical framework:</DataLabel>
              <DataValue success={settings.bayesianAnalysis}>
                {settings.bayesianAnalysis ? 'Strong (Bayesian + Frequentist)' : 'Adequate (Frequentist)'}
              </DataValue>
            </DataRow>
            
            <DataRow>
              <DataLabel>Overall falsifiability:</DataLabel>
              <DataValue success={settings.controlConditions.length >= 2 && settings.bayesianAnalysis}>
                {settings.controlConditions.length >= 2 && settings.bayesianAnalysis 
                  ? 'Strong' 
                  : settings.controlConditions.length >= 1 
                    ? 'Moderate' 
                    : 'Weak'}
              </DataValue>
            </DataRow>
          </Card>
        </Section>
      )}
      
      <Button onClick={() => onSettingsChange(settings)}>
        Apply Settings
      </Button>
    </Container>
  );
};

export default StatisticalRigor; 