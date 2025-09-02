import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PatientPortal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('symptoms');
  
  // Symptom Checker State
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Skin Analysis State
  const [skinTab, setSkinTab] = useState('skin');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skinResult, setSkinResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const commonSymptoms = [
    'fever', 'cough', 'headache', 'fatigue', 'nausea', 'vomiting',
    'diarrhea', 'joint pain', 'muscle ache', 'shortness of breath',
    'chest pain', 'abdominal pain', 'rash', 'dizziness', 'sore throat'
  ];

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const predictDisease = async () => {
    if (symptoms.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/ai/symptoms/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ symptoms })
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeSkin = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/ai/skin/predict', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSkinResult(data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Portal</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'symptoms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Symptom Checker
          </button>
          <button
            onClick={() => setActiveTab('skin')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'skin'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Skin/Nail Analysis
          </button>
        </nav>
      </div>

      {/* Symptom Checker Tab */}
      {activeTab === 'symptoms' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Symptoms</h2>
            
            {/* Add Custom Symptom */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Add custom symptom..."
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  onClick={() => {
                    if (newSymptom.trim()) {
                      addSymptom(newSymptom.trim().toLowerCase());
                      setNewSymptom('');
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Common Symptoms */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Common Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => addSymptom(symptom)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Selected Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={predictDisease}
              disabled={symptoms.length === 0 || loading}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Prediction'}
            </button>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
              <div className="space-y-2">
                <p><strong>Predicted Disease:</strong> {prediction.disease}</p>
                {prediction.confidence && (
                  <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
                )}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This is an AI prediction for informational purposes only. 
                    Please consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skin/Nail Analysis Tab */}
      {activeTab === 'skin' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Skin & Nail Analysis</h2>
            
            {/* Sub-tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-4">
                <button
                  onClick={() => setSkinTab('skin')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    skinTab === 'skin'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  Skin
                </button>
                <button
                  onClick={() => setSkinTab('nail')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    skinTab === 'nail'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  Nail
                </button>
              </nav>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Upload {skinTab} image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs max-h-64 object-contain border rounded-md"
                />
              </div>
            )}

            <button
              onClick={analyzeSkin}
              disabled={!selectedImage || analyzing}
              className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : `Analyze ${skinTab}`}
            </button>
          </div>

          {/* Analysis Results */}
          {skinResult && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <div className="space-y-2">
                <p><strong>Classification:</strong> {skinResult.label}</p>
                <p><strong>Confidence:</strong> {(skinResult.confidence * 100).toFixed(1)}%</p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This AI analysis is for informational purposes only. 
                    Please consult with a dermatologist for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
