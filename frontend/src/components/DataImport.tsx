import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { importExternalData, DataImportParams } from '../services/api';

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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
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

  &:hover {
    background-color: #333;
  }
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

  &:hover {
    background-color: #9965f4;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#bb86fc' : '#444'};
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.isDragActive ? 'rgba(187, 134, 252, 0.1)' : '#222'};
  transition: all 0.3s;
`;

const DataPreview = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #222;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
`;

const ErrorMessage = styled.div`
  color: #cf6679;
  padding: 10px;
  margin-top: 10px;
  background-color: rgba(207, 102, 121, 0.1);
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #03dac6;
  padding: 10px;
  margin-top: 10px;
  background-color: rgba(3, 218, 198, 0.1);
  border-radius: 4px;
`;

const InfoPanel = styled.div`
  background-color: #222;
  border-left: 4px solid #03dac6;
  padding: 10px 16px;
  margin-bottom: 16px;
  border-radius: 0 4px 4px 0;
`;

const Accordion = styled.div`
  margin-bottom: 16px;
`;

const AccordionHeader = styled.button`
  width: 100%;
  text-align: left;
  background-color: #333;
  color: #e0e0e0;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #444;
  }
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '16px' : '0'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s;
  background-color: #222;
  border-radius: 0 0 4px 4px;
  opacity: ${props => props.isOpen ? '1' : '0'};
`;

const DataValidator = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: #222;
  border-radius: 4px;
`;

const ValidationItem = styled.div<{ status: 'success' | 'error' | 'pending' }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: ${props => {
    switch(props.status) {
      case 'success': return '#03dac6';
      case 'error': return '#cf6679';
      default: return '#e0e0e0';
    }
  }};
`;

const StatusIcon = styled.span<{ status: 'success' | 'error' | 'pending' }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch(props.status) {
      case 'success': return '#03dac6';
      case 'error': return '#cf6679';
      default: return '#444';
    }
  }};
`;

interface DataImportProps {
  onDataImported: (data: any) => void;
}

type DataSourceType = 'qrng' | 'eeg' | 'neuroimaging' | 'behavioral';
type SourceType = 'file' | 'api' | 'device';
type FileFormat = 'csv' | 'json' | 'binary' | 'edf' | 'nifti';

interface ValidationResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

const DataImport: React.FC<DataImportProps> = ({ onDataImported }) => {
  const [activeTab, setActiveTab] = useState<DataSourceType>('qrng');
  const [sourceType, setSourceType] = useState<SourceType>('file');
  const [source, setSource] = useState('');
  const [format, setFormat] = useState<FileFormat>('csv');
  const [apiKey, setApiKey] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: DataSourceType) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setDataPreview('');
    setFile(null);
    setSource('');
    
    // Set default format based on data type
    switch(tab) {
      case 'qrng':
        setFormat('json');
        break;
      case 'eeg':
        setFormat('edf');
        break;
      case 'neuroimaging':
        setFormat('nifti');
        break;
      case 'behavioral':
        setFormat('csv');
        break;
    }
  };

  const handleSourceTypeChange = (type: SourceType) => {
    setSourceType(type);
    setSource('');
    setFile(null);
    setDataPreview('');
    setError('');
    setSuccess('');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setSource(droppedFile.name);
      
      // Preview file content
      previewFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSource(selectedFile.name);
      
      // Preview file content
      previewFile(selectedFile);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Truncate preview if it's too long
        const truncatedContent = content.length > 1000 
          ? content.substring(0, 1000) + '...'
          : content;
        
        setDataPreview(truncatedContent);
        validateData(file, truncatedContent);
      } catch (err) {
        setError('Failed to read file content');
        setDataPreview('');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setDataPreview('');
    };
    
    // Read file as text
    if (format === 'binary' || format === 'edf' || format === 'nifti') {
      reader.readAsArrayBuffer(file);
      setDataPreview('Binary data preview not available');
    } else {
      reader.readAsText(file);
    }
  };

  const validateData = (file: File, content: string) => {
    // Initialize validation results
    const results: ValidationResult[] = [
      {
        id: 'format',
        name: 'File Format',
        status: 'pending',
        message: 'Checking file format...'
      },
      {
        id: 'structure',
        name: 'Data Structure',
        status: 'pending',
        message: 'Validating data structure...'
      },
      {
        id: 'completeness',
        name: 'Data Completeness',
        status: 'pending',
        message: 'Checking for missing values...'
      }
    ];
    
    setValidationResults(results);
    
    // Validate format
    const formatResult = validateFormat(file, content);
    results[0] = formatResult;
    
    // Validate structure
    const structureResult = validateStructure(content);
    results[1] = structureResult;
    
    // Validate completeness
    const completenessResult = validateCompleteness(content);
    results[2] = completenessResult;
    
    setValidationResults([...results]);
  };

  const validateFormat = (file: File, content: string): ValidationResult => {
    const result: ValidationResult = {
      id: 'format',
      name: 'File Format',
      status: 'pending',
      message: 'Checking file format...'
    };
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch(format) {
      case 'csv':
        if (extension !== 'csv') {
          result.status = 'error';
          result.message = 'Expected .csv file';
        } else if (content.includes(',')) {
          result.status = 'success';
          result.message = 'Valid CSV format';
        } else {
          result.status = 'error';
          result.message = 'Invalid CSV structure';
        }
        break;
      case 'json':
        if (extension !== 'json') {
          result.status = 'error';
          result.message = 'Expected .json file';
        } else {
          try {
            JSON.parse(content);
            result.status = 'success';
            result.message = 'Valid JSON format';
          } catch (e) {
            result.status = 'error';
            result.message = 'Invalid JSON structure';
          }
        }
        break;
      case 'edf':
        if (extension !== 'edf') {
          result.status = 'error';
          result.message = 'Expected .edf file';
        } else {
          result.status = 'success';
          result.message = 'EDF file detected (binary validation not available in preview)';
        }
        break;
      case 'nifti':
        if (extension !== 'nii' && extension !== 'gz') {
          result.status = 'error';
          result.message = 'Expected .nii or .nii.gz file';
        } else {
          result.status = 'success';
          result.message = 'NIfTI file detected (binary validation not available in preview)';
        }
        break;
      default:
        result.status = 'error';
        result.message = 'Unknown format';
    }
    
    return result;
  };

  const validateStructure = (content: string): ValidationResult => {
    const result: ValidationResult = {
      id: 'structure',
      name: 'Data Structure',
      status: 'pending',
      message: 'Validating data structure...'
    };
    
    switch(format) {
      case 'csv':
        // Check if CSV has consistent number of columns
        const lines = content.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          result.status = 'error';
          result.message = 'CSV must have header and at least one data row';
        } else {
          const headerColumns = lines[0].split(',').length;
          const allSameColumns = lines.slice(1).every(line => line.split(',').length === headerColumns);
          
          if (allSameColumns) {
            result.status = 'success';
            result.message = `Valid structure with ${headerColumns} columns`;
          } else {
            result.status = 'error';
            result.message = 'Inconsistent number of columns';
          }
        }
        break;
      case 'json':
        try {
          const json = JSON.parse(content);
          
          // Check if JSON structure is appropriate based on the data type
          if (activeTab === 'qrng') {
            if (Array.isArray(json) || (json.data && Array.isArray(json.data))) {
              result.status = 'success';
              result.message = 'Valid QRNG data structure';
            } else {
              result.status = 'error';
              result.message = 'QRNG data should contain an array of values';
            }
          } else {
            result.status = 'success';
            result.message = 'JSON structure validated';
          }
        } catch (e) {
          result.status = 'error';
          result.message = 'Invalid JSON';
        }
        break;
      default:
        result.status = 'success';
        result.message = 'Structure validation not applicable';
    }
    
    return result;
  };

  const validateCompleteness = (content: string): ValidationResult => {
    const result: ValidationResult = {
      id: 'completeness',
      name: 'Data Completeness',
      status: 'pending',
      message: 'Checking for missing values...'
    };
    
    switch(format) {
      case 'csv':
        // Check for empty fields in CSV
        const lines = content.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          result.status = 'error';
          result.message = 'Insufficient data';
        } else {
          const header = lines[0].split(',');
          let emptyCount = 0;
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            for (let j = 0; j < values.length; j++) {
              if (values[j].trim() === '') {
                emptyCount++;
              }
            }
          }
          
          if (emptyCount === 0) {
            result.status = 'success';
            result.message = 'No missing values';
          } else {
            const totalCells = (lines.length - 1) * header.length;
            const missingPercentage = (emptyCount / totalCells) * 100;
            
            if (missingPercentage < 5) {
              result.status = 'success';
              result.message = `Minor missing data (${emptyCount} cells, ${missingPercentage.toFixed(1)}%)`;
            } else {
              result.status = 'error';
              result.message = `Significant missing data (${emptyCount} cells, ${missingPercentage.toFixed(1)}%)`;
            }
          }
        }
        break;
      case 'json':
        try {
          const json = JSON.parse(content);
          let dataArray: any[] = [];
          
          if (Array.isArray(json)) {
            dataArray = json;
          } else if (json.data && Array.isArray(json.data)) {
            dataArray = json.data;
          }
          
          if (dataArray.length === 0) {
            result.status = 'error';
            result.message = 'Empty data array';
          } else {
            // Check if all required fields are present
            result.status = 'success';
            result.message = `Complete data with ${dataArray.length} records`;
          }
        } catch (e) {
          result.status = 'error';
          result.message = 'Cannot validate completeness (invalid JSON)';
        }
        break;
      default:
        result.status = 'success';
        result.message = 'Completeness validation not applicable';
    }
    
    return result;
  };

  const handleImport = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let importParams: DataImportParams = {
        dataType: activeTab,
        sourceType,
        source
      };
      
      // Add format if not API
      if (sourceType !== 'api') {
        importParams.format = format;
      }
      
      // Add API key if provided
      if (sourceType === 'api' && apiKey) {
        importParams.parameters = { apiKey };
      }
      
      // For file upload, need to handle file data
      if (sourceType === 'file' && file) {
        // In a real implementation, we would upload the file to the server
        // For this demo, we'll simulate by reading the file and sending the content
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            const content = e.target?.result;
            
            // Import via API
            const result = await importExternalData(importParams);
            
            if (result.success && result.data) {
              setSuccess('Data imported successfully!');
              setDataPreview(JSON.stringify(result.data, null, 2).substring(0, 1000) + '...');
              onDataImported(result.data);
            } else {
              setError(result.error || 'Failed to import data');
            }
          } catch (err) {
            setError('Error processing file');
          } finally {
            setIsLoading(false);
          }
        };
        
        reader.onerror = () => {
          setError('Failed to read file');
          setIsLoading(false);
        };
        
        if (format === 'binary' || format === 'edf' || format === 'nifti') {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      } else {
        // Import via API or device
        const result = await importExternalData(importParams);
        
        if (result.success && result.data) {
          setSuccess('Data imported successfully!');
          setDataPreview(JSON.stringify(result.data, null, 2).substring(0, 1000) + '...');
          onDataImported(result.data);
        } else {
          setError(result.error || 'Failed to import data');
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  const getInfoContent = () => {
    switch(activeTab) {
      case 'qrng':
        return (
          <>
            <p>Quantum Random Number Generators (QRNGs) produce random numbers based on inherently random quantum processes.</p>
            <p>You can import data from:</p>
            <ul>
              <li>Local QRNG devices</li>
              <li>Online QRNG services (ANU Quantum Random Numbers, QRNG.io)</li>
              <li>Previously recorded QRNG data files</li>
            </ul>
            <p>For valid tests, ensure data includes timestamps and raw measurement values.</p>
          </>
        );
      case 'eeg':
        return (
          <>
            <p>EEG (Electroencephalogram) data captures brain electrical activity through scalp electrodes.</p>
            <p>Supported formats:</p>
            <ul>
              <li>European Data Format (.edf)</li>
              <li>BrainVision (.vhdr, .vmrk, .eeg)</li>
              <li>EEGLAB (.set)</li>
              <li>Exported CSV with channels as columns</li>
            </ul>
            <p>For best results, include data during both active consciousness tasks and resting states.</p>
          </>
        );
      case 'neuroimaging':
        return (
          <>
            <p>Neuroimaging data from fMRI, MEG or other imaging techniques.</p>
            <p>Supported formats:</p>
            <ul>
              <li>NIfTI files (.nii, .nii.gz)</li>
              <li>DICOM series</li>
              <li>Preprocessed data matrices</li>
            </ul>
            <p>Data should ideally include both anatomical and functional scans to correlate neural activity with consciousness states.</p>
          </>
        );
      case 'behavioral':
        return (
          <>
            <p>Behavioral data captures subject responses, reaction times, and performance metrics.</p>
            <p>Import data from:</p>
            <ul>
              <li>CSV files with trials as rows</li>
              <li>JSON data with structured trial information</li>
              <li>E-Prime, PsychoPy, or other experiment software exports</li>
            </ul>
            <p>Ensure data includes both stimulus information and corresponding responses.</p>
          </>
        );
      default:
        return <p>Select a data type for more information.</p>;
    }
  };

  return (
    <Container>
      <Title>Import Experimental Data</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'qrng'} 
          onClick={() => handleTabChange('qrng')}
        >
          QRNG Data
        </Tab>
        <Tab 
          active={activeTab === 'eeg'} 
          onClick={() => handleTabChange('eeg')}
        >
          EEG Data
        </Tab>
        <Tab 
          active={activeTab === 'neuroimaging'} 
          onClick={() => handleTabChange('neuroimaging')}
        >
          Neuroimaging
        </Tab>
        <Tab 
          active={activeTab === 'behavioral'} 
          onClick={() => handleTabChange('behavioral')}
        >
          Behavioral
        </Tab>
      </TabContainer>
      
      <Accordion>
        <AccordionHeader onClick={() => setIsInfoOpen(!isInfoOpen)}>
          Information about {activeTab.toUpperCase()} Data
          {isInfoOpen ? '▲' : '▼'}
        </AccordionHeader>
        <AccordionContent isOpen={isInfoOpen}>
          <InfoPanel>
            {getInfoContent()}
          </InfoPanel>
        </AccordionContent>
      </Accordion>
      
      <FormGroup>
        <Label>Data Source</Label>
        <Select 
          value={sourceType}
          onChange={(e) => handleSourceTypeChange(e.target.value as SourceType)}
        >
          <option value="file">File Upload</option>
          <option value="api">External API</option>
          <option value="device">Connected Device</option>
        </Select>
      </FormGroup>
      
      {sourceType === 'file' && (
        <>
          <FormGroup>
            <Label>File Format</Label>
            <Select 
              value={format}
              onChange={(e) => setFormat(e.target.value as FileFormat)}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="binary">Binary</option>
              {activeTab === 'eeg' && <option value="edf">EDF (European Data Format)</option>}
              {activeTab === 'neuroimaging' && <option value="nifti">NIfTI</option>}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Upload File</Label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <DropZone 
              isDragActive={isDragActive}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? file.name : 'Drag & drop file here or click to select'}
            </DropZone>
          </FormGroup>
        </>
      )}
      
      {sourceType === 'api' && (
        <>
          <FormGroup>
            <Label>API Endpoint</Label>
            <Input 
              type="text" 
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://api.example.com/data"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>API Key (if required)</Label>
            <Input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
            />
          </FormGroup>
        </>
      )}
      
      {sourceType === 'device' && (
        <FormGroup>
          <Label>Device Identifier</Label>
          <Input 
            type="text" 
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Device ID or connection string"
          />
        </FormGroup>
      )}
      
      <Accordion>
        <AccordionHeader onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>
          Advanced Options
          {isAdvancedOpen ? '▲' : '▼'}
        </AccordionHeader>
        <AccordionContent isOpen={isAdvancedOpen}>
          <FormGroup>
            <Label>Data Preprocessing</Label>
            <Select>
              <option value="none">None</option>
              <option value="normalize">Normalize Values</option>
              <option value="filter">Apply Filter</option>
              <option value="downsample">Downsample</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Validation Strictness</Label>
            <Select>
              <option value="strict">Strict (Reject invalid data)</option>
              <option value="moderate">Moderate (Warn about issues)</option>
              <option value="lenient">Lenient (Accept with warnings)</option>
            </Select>
          </FormGroup>
        </AccordionContent>
      </Accordion>
      
      {dataPreview && (
        <DataValidator>
          <h3>Data Validation</h3>
          {validationResults.map(result => (
            <ValidationItem key={result.id} status={result.status}>
              <StatusIcon status={result.status} />
              <strong>{result.name}:</strong> {result.message}
            </ValidationItem>
          ))}
        </DataValidator>
      )}
      
      {dataPreview && (
        <DataPreview>
          <h3>Data Preview</h3>
          <pre>{dataPreview}</pre>
        </DataPreview>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Button 
        onClick={handleImport} 
        disabled={isLoading || !source || 
          (sourceType === 'file' && !file) || 
          validationResults.some(r => r.status === 'error')}
      >
        {isLoading ? 'Importing...' : 'Import Data'}
      </Button>
    </Container>
  );
};

export default DataImport; 