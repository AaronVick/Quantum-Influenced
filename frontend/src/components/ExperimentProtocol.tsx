import React, { useState } from 'react';
import styled from 'styled-components';
import { generateExperimentalProtocol, ExperimentalProtocol } from '../services/api';

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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 16px;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;

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

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #a0a0a0;
  margin: 8px 0;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background-color: #333;
  color: #e0e0e0;
  border-radius: 12px;
  font-size: 12px;
  margin: 0 4px 4px 0;
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

const AddButton = styled.button`
  background-color: transparent;
  color: #bb86fc;
  border: 1px dashed #bb86fc;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 8px;

  &:hover {
    background-color: rgba(187, 134, 252, 0.1);
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #cf6679;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(207, 102, 121, 0.1);
  }
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  background-color: #333;
  border-radius: 4px;
  padding: 16px;
  font-family: monospace;
  white-space: pre-wrap;
  color: #e0e0e0;
  max-height: 400px;
  overflow-y: auto;
`;

const SuccessMessage = styled.div`
  background-color: rgba(3, 218, 198, 0.1);
  color: #03dac6;
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
`;

const ErrorMessage = styled.div`
  background-color: rgba(207, 102, 121, 0.1);
  color: #cf6679;
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
`;

interface ExperimentProtocolProps {
  onProtocolGenerated: (protocol: ExperimentalProtocol) => void;
}

const ExperimentProtocol: React.FC<ExperimentProtocolProps> = ({ onProtocolGenerated }) => {
  const [title, setTitle] = useState('Consciousness-Quantum Interaction Study');
  const [authors, setAuthors] = useState(['Researcher Name']);
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('An experimental investigation of potential consciousness effects on quantum measurement outcomes.');
  
  const [hypotheses, setHypotheses] = useState([
    {
      id: 'h1',
      description: 'Conscious intention modulates quantum measurement outcomes beyond chance expectation',
      predictions: [
        'Quantum deviations (δ_C) will exceed 0.08 (8%) with statistical significance p<0.01',
        'Deviations will correlate with neural coherence measures (r>0.4)'
      ]
    }
  ]);
  
  const [participants, setParticipants] = useState('Adult participants (18-65 years) with no history of neurological disorders. Target sample size determined by power analysis.');
  const [apparatus, setApparatus] = useState('Quantum random number generator based on vacuum fluctuations, EEG recording equipment with 64 channels, environmental sensors for controlling potential confounds.');
  const [procedure, setProcedure] = useState('Participants will be seated in a electromagnetically shielded room. EEG will be recorded continuously during three conditions: focus, distraction, and control. Each condition will include 50 trials with randomized order.');
  const [dataAnalysis, setDataAnalysis] = useState('Bayesian hypothesis testing will be used alongside frequentist methods. Statistical significance threshold set at p<0.01 with Bonferroni correction for multiple comparisons.');
  
  const [isPreRegistered, setIsPreRegistered] = useState(true);
  const [newAuthor, setNewAuthor] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [protocolPreview, setProtocolPreview] = useState<string | null>(null);
  const [generatedProtocol, setGeneratedProtocol] = useState<ExperimentalProtocol | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      setAuthors([...authors, newAuthor.trim()]);
      setNewAuthor('');
    }
  };
  
  const handleRemoveAuthor = (index: number) => {
    const updatedAuthors = [...authors];
    updatedAuthors.splice(index, 1);
    setAuthors(updatedAuthors);
  };
  
  const handleAddHypothesis = () => {
    const newId = `h${hypotheses.length + 1}`;
    setHypotheses([
      ...hypotheses,
      {
        id: newId,
        description: '',
        predictions: ['']
      }
    ]);
  };
  
  const handleUpdateHypothesis = (index: number, field: string, value: string | string[]) => {
    const updatedHypotheses = [...hypotheses];
    updatedHypotheses[index] = {
      ...updatedHypotheses[index],
      [field]: value
    };
    setHypotheses(updatedHypotheses);
  };
  
  const handleRemoveHypothesis = (index: number) => {
    const updatedHypotheses = [...hypotheses];
    updatedHypotheses.splice(index, 1);
    setHypotheses(updatedHypotheses);
  };
  
  const handleAddPrediction = (hypothesisIndex: number) => {
    const updatedHypotheses = [...hypotheses];
    updatedHypotheses[hypothesisIndex].predictions.push('');
    setHypotheses(updatedHypotheses);
  };
  
  const handleUpdatePrediction = (hypothesisIndex: number, predictionIndex: number, value: string) => {
    const updatedHypotheses = [...hypotheses];
    updatedHypotheses[hypothesisIndex].predictions[predictionIndex] = value;
    setHypotheses(updatedHypotheses);
  };
  
  const handleRemovePrediction = (hypothesisIndex: number, predictionIndex: number) => {
    const updatedHypotheses = [...hypotheses];
    updatedHypotheses[hypothesisIndex].predictions.splice(predictionIndex, 1);
    setHypotheses(updatedHypotheses);
  };
  
  const generatePreview = () => {
    const preview = `
# ${title}

**Version:** ${version}
**Authors:** ${authors.join(', ')}
**Pre-registration:** ${isPreRegistered ? 'Yes' : 'No'}

## Description

${description}

## Hypotheses

${hypotheses.map(h => `### ${h.id}: ${h.description}
${h.predictions.map(p => `- ${p}`).join('\n')}`).join('\n\n')}

## Methods

### Participants

${participants}

### Apparatus

${apparatus}

### Procedure

${procedure}

### Data Analysis

${dataAnalysis}

## Pre-Registration Statement

${isPreRegistered ? 
  'This experimental protocol has been pre-registered before data collection. The complete pre-registration document can be found at the link provided.' 
  : 'This experiment is not pre-registered.'}
`;

    setProtocolPreview(preview);
  };
  
  const handleGenerateProtocol = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Prepare protocol data
      const protocolData: Partial<ExperimentalProtocol> = {
        title,
        authors,
        date: new Date().toISOString(),
        version,
        description,
        hypotheses: hypotheses.map(h => ({
          id: h.id,
          description: h.description,
          predictions: h.predictions
        })),
        methods: {
          participants,
          apparatus,
          procedure,
          dataAnalysis
        },
        preRegistration: isPreRegistered
      };
      
      // Generate protocol document
      const result = await generateExperimentalProtocol(protocolData);
      
      if (result.success && result.protocol) {
        setGeneratedProtocol(result.protocol);
        setSuccessMessage('Protocol successfully generated and ready for download!');
        
        // Pass protocol back to parent component
        onProtocolGenerated(result.protocol);
      } else {
        setErrorMessage(result.error || 'Failed to generate protocol');
      }
      
      setIsGenerating(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsGenerating(false);
    }
  };
  
  return (
    <Container>
      <Title>Experimental Protocol Generator</Title>
      <InfoText>
        Scientific reproducibility requires clear documentation of experimental methods, hypotheses,
        and analysis plans. This generator creates detailed protocol documents that can be pre-registered
        to enhance the credibility of your consciousness-quantum interaction research.
      </InfoText>
      
      <Section>
        <SectionTitle>General Information</SectionTitle>
        
        <FormGroup>
          <Label>Protocol Title</Label>
          <Input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter protocol title"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Authors</Label>
          {authors.map((author, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
              <Input 
                type="text" 
                value={author}
                onChange={(e) => {
                  const updatedAuthors = [...authors];
                  updatedAuthors[index] = e.target.value;
                  setAuthors(updatedAuthors);
                }}
                style={{ marginRight: '8px' }}
              />
              <RemoveButton onClick={() => handleRemoveAuthor(index)}>Remove</RemoveButton>
            </div>
          ))}
          <div style={{ display: 'flex' }}>
            <Input 
              type="text" 
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Add author"
              style={{ marginRight: '8px' }}
            />
            <Button onClick={handleAddAuthor}>Add</Button>
          </div>
        </FormGroup>
        
        <FormGroup>
          <Label>Version</Label>
          <Input 
            type="text" 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g., 1.0.0"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Protocol Description</Label>
          <TextArea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the purpose and scope of this experiment"
          />
        </FormGroup>
        
        <Checkbox>
          <input 
            type="checkbox" 
            checked={isPreRegistered}
            onChange={() => setIsPreRegistered(!isPreRegistered)}
            id="pre-registration"
          />
          <label htmlFor="pre-registration">
            Pre-register this protocol (recommended for scientific rigor)
          </label>
        </Checkbox>
      </Section>
      
      <Section>
        <SectionTitle>Hypotheses and Predictions</SectionTitle>
        <InfoText>
          Clearly stated hypotheses with specific, testable predictions are essential for
          falsifiability. Each hypothesis should have at least one quantifiable prediction.
        </InfoText>
        
        {hypotheses.map((hypothesis, index) => (
          <Card key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle>Hypothesis {index + 1}</CardTitle>
              <RemoveButton onClick={() => handleRemoveHypothesis(index)}>Remove</RemoveButton>
            </div>
            
            <FormGroup>
              <Label>ID</Label>
              <Input 
                type="text" 
                value={hypothesis.id}
                onChange={(e) => handleUpdateHypothesis(index, 'id', e.target.value)}
                placeholder="e.g., H1"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea 
                value={hypothesis.description}
                onChange={(e) => handleUpdateHypothesis(index, 'description', e.target.value)}
                placeholder="State your hypothesis clearly"
              />
            </FormGroup>
            
            <Label>Predictions</Label>
            {hypothesis.predictions.map((prediction, predIndex) => (
              <div key={predIndex} style={{ display: 'flex', marginBottom: '8px' }}>
                <TextArea 
                  value={prediction}
                  onChange={(e) => handleUpdatePrediction(index, predIndex, e.target.value)}
                  placeholder="Specific, quantifiable prediction"
                  style={{ marginRight: '8px' }}
                />
                <RemoveButton onClick={() => handleRemovePrediction(index, predIndex)}>Remove</RemoveButton>
              </div>
            ))}
            
            <AddButton onClick={() => handleAddPrediction(index)}>+ Add Prediction</AddButton>
          </Card>
        ))}
        
        <AddButton onClick={handleAddHypothesis}>+ Add Hypothesis</AddButton>
      </Section>
      
      <Section>
        <SectionTitle>Methods</SectionTitle>
        
        <FormGroup>
          <Label>Participants</Label>
          <TextArea 
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Describe participant selection, inclusion/exclusion criteria, sample size calculation"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Apparatus</Label>
          <TextArea 
            value={apparatus}
            onChange={(e) => setApparatus(e.target.value)}
            placeholder="Describe equipment, software, and materials used"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Procedure</Label>
          <TextArea 
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            placeholder="Describe experimental procedure, conditions, and trial structure"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Data Analysis</Label>
          <TextArea 
            value={dataAnalysis}
            onChange={(e) => setDataAnalysis(e.target.value)}
            placeholder="Describe statistical methods, significance thresholds, corrections"
          />
        </FormGroup>
      </Section>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <Button onClick={generatePreview}>Preview Protocol</Button>
        <Button 
          onClick={handleGenerateProtocol} 
          disabled={isGenerating || !title || authors.length === 0}
        >
          {isGenerating ? 'Generating...' : 'Generate Protocol Document'}
        </Button>
      </div>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      
      {protocolPreview && (
        <>
          <SectionTitle>Protocol Preview</SectionTitle>
          <PreviewContainer>
            {protocolPreview}
          </PreviewContainer>
        </>
      )}
      
      {generatedProtocol && (
        <Card>
          <CardTitle>Generated Protocol</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ marginRight: '8px' }}>Protocol ID:</span>
            <Tag>{generatedProtocol.experimentId || 'Unknown'}</Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Status:</span>
            <Tag style={{ backgroundColor: isPreRegistered ? '#03dac6' : '#cf6679' }}>
              {isPreRegistered ? 'Pre-registered' : 'Not Pre-registered'}
            </Tag>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default ExperimentProtocol; 