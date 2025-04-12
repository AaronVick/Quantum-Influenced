import React, { useState } from 'react';
import styled from 'styled-components';
import { SimulationResponse, DataImportParams, importExternalData } from '../services/api';

interface ImportAnalysisProps {
  onImport: (results: SimulationResponse) => void;
}

const ImportAnalysis: React.FC<ImportAnalysisProps> = ({ onImport }) => {
  const [isDropActive, setIsDropActive] = useState(false);
  const [useSynthetic, setUseSynthetic] = useState(true);
  const [dataType, setDataType] = useState<'qrng' | 'eeg' | 'neuroimaging' | 'behavioral'>('eeg');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropActive(true);
  };

  const handleDragLeave = () => {
    setIsDropActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropActive(false);
    
    // Check if files were dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    // Check file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Check if this is a valid analysis file
        if (jsonData.results) {
          // If the data contains a results object directly, use that
          onImport(jsonData.results);
        } else if (jsonData.originalState && jsonData.collapsePatterns && jsonData.reconstructedState) {
          // If the data is a simulation result itself
          onImport(jsonData as SimulationResponse);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        alert('Error parsing file: Not a valid analysis file');
        console.error('Parse error:', error);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const handleSyntheticDataGeneration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const importParams: DataImportParams = {
        dataType: dataType,
        sourceType: 'file',  // We'll treat it as a file import
        source: 'synthetic', // Placeholder for synthetic source
        useSyntheticData: true,
        dataSourceType: 'synthetic'
      };
      
      const response = await importExternalData(importParams);
      
      if (response.success && response.data) {
        // Create a SimulationResponse from the imported data
        const simulationResponse: SimulationResponse = {
          originalState: {
            vector: response.data.data?.values || [],
            dimension: response.data.data?.values?.length || 10
          },
          collapsePatterns: response.data.data?.values?.map(() => 1) || [],
          reconstructedState: {
            vector: response.data.data?.values || [],
            dimension: response.data.data?.values?.length || 10
          },
          error: 0.1,
          belowThreshold: true,
          dataSourceType: 'synthetic',
          importTimestamp: new Date().toISOString()
        };
        
        onImport(simulationResponse);
      } else {
        setError(response.error || 'Failed to generate synthetic data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <h3>Import Data for Analysis</h3>
      
      <SyntheticDataSection>
        <SyntheticToggle>
          <input
            type="checkbox"
            id="use-synthetic"
            checked={useSynthetic}
            onChange={() => setUseSynthetic(!useSynthetic)}
          />
          <label htmlFor="use-synthetic">Use synthetic data (no equipment required)</label>
        </SyntheticToggle>
        
        {useSynthetic && (
          <DataTypeOptions>
            <p>Select data type to generate:</p>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  id="data-eeg"
                  name="dataType"
                  value="eeg"
                  checked={dataType === 'eeg'}
                  onChange={() => setDataType('eeg')}
                />
                <label htmlFor="data-eeg">EEG Data</label>
              </RadioOption>
              
              <RadioOption>
                <input
                  type="radio"
                  id="data-qrng"
                  name="dataType"
                  value="qrng"
                  checked={dataType === 'qrng'}
                  onChange={() => setDataType('qrng')}
                />
                <label htmlFor="data-qrng">Quantum RNG</label>
              </RadioOption>
              
              <RadioOption>
                <input
                  type="radio"
                  id="data-behavioral"
                  name="dataType"
                  value="behavioral"
                  checked={dataType === 'behavioral'}
                  onChange={() => setDataType('behavioral')}
                />
                <label htmlFor="data-behavioral">Behavioral</label>
              </RadioOption>
              
              <RadioOption>
                <input
                  type="radio"
                  id="data-neuroimaging"
                  name="dataType"
                  value="neuroimaging"
                  checked={dataType === 'neuroimaging'}
                  onChange={() => setDataType('neuroimaging')}
                />
                <label htmlFor="data-neuroimaging">Neuroimaging</label>
              </RadioOption>
            </RadioGroup>
            
            <GenerateButton 
              onClick={handleSyntheticDataGeneration}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Synthetic Data'}
            </GenerateButton>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </DataTypeOptions>
        )}
      </SyntheticDataSection>
      
      <Divider>
        <span>OR</span>
      </Divider>
      
      <p>Upload a previously exported analysis file to review the results</p>
      
      <DropZone 
        className={isDropActive ? 'active' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag & drop a JSON file here</p>
        <p>- or -</p>
        <input
          type="file"
          id="file-upload"
          accept=".json"
          onChange={handleFileInput}
          hidden
        />
        <UploadButton htmlFor="file-upload">
          Select File
        </UploadButton>
      </DropZone>
      
      <DataSourceNote>
        <p>
          <InfoIcon>ℹ️</InfoIcon>
          {useSynthetic 
            ? 'Synthetic data is for demonstration purposes only. For scientific studies, use actual equipment or data.' 
            : 'Upload real data for formal analysis. Without special hardware, use synthetic data for exploration.'}
        </p>
      </DataSourceNote>
    </StyledContainer>
  );
};

// Add these styled components after the existing ones
const SyntheticDataSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: rgba(20, 25, 45, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(100, 227, 255, 0.2);
`;

const SyntheticToggle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  input {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    color: #f0f0f0;
    cursor: pointer;
  }
`;

const DataTypeOptions = styled.div`
  margin-top: 15px;
  
  p {
    margin-bottom: 10px;
    color: #a0a0b8;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 8px;
    cursor: pointer;
  }
  
  label {
    color: #e0e0e0;
    cursor: pointer;
  }
`;

const GenerateButton = styled.button`
  background: linear-gradient(90deg, #4e54ff, #9b7dff);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(75, 85, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 4px;
  color: #f44336;
  font-size: 14px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
  color: #64e3ff;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(100, 227, 255, 0.3);
  }
  
  span {
    margin: 0 15px;
    font-size: 14px;
    color: #a0a0b8;
  }
`;

const DataSourceNote = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  
  p {
    margin: 0;
    color: #a0a0b8;
    font-size: 13px;
    display: flex;
    align-items: center;
  }
`;

const InfoIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

const StyledContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(30, 40, 70, 0.3);
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #f0f0f0;
  }
  
  p {
    margin-bottom: 20px;
    color: #a0a0b8;
  }
`;

const DropZone = styled.div`
  padding: 30px;
  border: 2px dashed #3d5afe;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: rgba(20, 25, 40, 0.5);
  cursor: pointer;
  
  &.active {
    border-color: #64e3ff;
    background-color: rgba(100, 227, 255, 0.1);
  }
  
  p {
    margin: 5px 0;
    color: #a0a0b8;
  }
`;

const UploadButton = styled.label`
  display: inline-block;
  background: linear-gradient(90deg, #4e54ff, #9b7dff);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(75, 85, 255, 0.3);
  }
`;

export default ImportAnalysis; 