import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PatientPortal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  // Disease Prediction State
  const [diseaseSymptoms, setDiseaseSymptoms] = useState('');
  const [diseaseHistory, setDiseaseHistory] = useState('');
  const [diseasePrediction, setDiseasePrediction] = useState(null);
  const [predictingDisease, setPredictingDisease] = useState(false);

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

  const predictDiseaseRisk = async () => {
    if (!diseaseSymptoms.trim()) return;
    
    setPredictingDisease(true);
    try {
      const response = await fetch('http://localhost:8000/ai/disease/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          symptoms: diseaseSymptoms,
          medical_history: diseaseHistory 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiseasePrediction(data);
      }
    } catch (error) {
      console.error('Disease prediction error:', error);
    } finally {
      setPredictingDisease(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full blur-xl bg-gradient-to-r from-green-400/40 to-blue-400/40" 
             style={{top: '10%', left: '10%'}} />
        <div className="absolute w-80 h-80 rounded-full blur-xl bg-gradient-to-r from-blue-400/40 to-purple-400/40" 
             style={{top: '60%', right: '15%'}} />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Patient Portal
        </h1>
        <p className="text-gray-700 mt-1">Your Health & Wellness Dashboard</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
      
      {/* Tab Navigation */}
      <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 mb-6">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'symptoms'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            🩺 Symptom Checker
          </button>
          <button
            onClick={() => setActiveTab('skin')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'skin'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            🔬 Skin Analysis
          </button>
          <button
            onClick={() => setActiveTab('disease')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'disease'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Disease Prediction
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Score</p>
                  <p className="text-3xl font-bold text-gray-900">92</p>
                  <p className="text-sm text-green-600">↗ Excellent</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  💚
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medications</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-blue-600">87% adherence</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  💊
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Appointment</p>
                  <p className="text-lg font-bold text-gray-900">Sept 5</p>
                  <p className="text-sm text-purple-600">Dr. Smith</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  📅
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Checkups</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-green-600">This year</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                  🩺
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('symptoms')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <div className="text-2xl mb-2">🩺</div>
                <div className="font-semibold">Check Symptoms</div>
                <div className="text-sm opacity-90">AI-powered health assessment</div>
              </button>
              <button 
                onClick={() => setActiveTab('skin')}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
              >
                <div className="text-2xl mb-2">🔬</div>
                <div className="font-semibold">Skin Analysis</div>
                <div className="text-sm opacity-90">Upload photos for analysis</div>
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                <div className="text-2xl mb-2">💬</div>
                <div className="font-semibold">Chat with Doctor</div>
                <div className="text-sm opacity-90">Get professional advice</div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Recent Activity</h3>
            <div className="space-y-3">
              {[
                { type: 'medication', message: 'Took Metformin 500mg', time: '2 hours ago', status: 'success' },
                { type: 'appointment', message: 'Scheduled follow-up with Dr. Smith', time: '1 day ago', status: 'info' },
                { type: 'analysis', message: 'Completed skin analysis - results normal', time: '3 days ago', status: 'success' },
                { type: 'symptom', message: 'Reported mild headache symptoms', time: '5 days ago', status: 'warning' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    <p className="text-gray-900">{activity.message}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Symptom Checker Tab */}
      {activeTab === 'symptoms' && (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🩺 Select Your Symptoms</h2>
            
            {/* Add Custom Symptom */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Add custom symptom..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-white/80"
                />
                <button
                  onClick={() => {
                    if (newSymptom.trim()) {
                      addSymptom(newSymptom.trim().toLowerCase());
                      setNewSymptom('');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
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
                    className="px-4 py-2 bg-white/60 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-white/80 transition-all"
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
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? '🔄 Analyzing...' : '🔍 Get AI Prediction'}
            </button>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">🎯 AI Prediction Results</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-lg"><strong>Predicted Condition:</strong> {prediction.prediction}</p>
                  {prediction.confidence && (
                    <p className="text-md mt-2"><strong>Confidence Level:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
                  )}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Important Disclaimer:</strong> This AI prediction is for informational purposes only. 
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
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🔬 Skin & Nail Analysis</h2>
            
            {/* Sub-tabs */}
            <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-lg p-1 mb-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setSkinTab('skin')}
                  className={`py-2 px-4 rounded-md font-medium text-sm transition-all ${
                    skinTab === 'skin'
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  Skin
                </button>
                <button
                  onClick={() => setSkinTab('nail')}
                  className={`py-2 px-4 rounded-md font-medium text-sm transition-all ${
                    skinTab === 'nail'
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  Nail
                </button>
              </nav>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-700">
                📸 Upload {skinTab} image for AI analysis:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-700">📋 Image Preview:</h3>
                <div className="bg-white/50 border border-gray-200 rounded-xl p-4 inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-64 object-contain rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            <button
              onClick={analyzeSkin}
              disabled={!selectedImage || analyzing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {analyzing ? '🔄 Analyzing...' : `🔬 Analyze ${skinTab}`}
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

      {/* Disease Prediction Tab */}
      {activeTab === 'disease' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Disease Risk Assessment</h2>
            
            {/* Symptoms Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Describe your symptoms in detail:
              </label>
              <textarea
                value={diseaseSymptoms}
                onChange={(e) => setDiseaseSymptoms(e.target.value)}
                placeholder="Please describe all symptoms you are experiencing, including duration, severity, and any patterns you've noticed..."
                className="w-full p-3 border rounded-md h-32 resize-none"
              />
            </div>

            {/* Medical History */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Medical History (Optional):
              </label>
              <textarea
                value={diseaseHistory}
                onChange={(e) => setDiseaseHistory(e.target.value)}
                placeholder="Any relevant medical history, current medications, family history, or previous conditions..."
                className="w-full p-3 border rounded-md h-24 resize-none"
              />
            </div>

            <button
              onClick={predictDiseaseRisk}
              disabled={!diseaseSymptoms.trim() || predictingDisease}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {predictingDisease ? 'Analyzing Risk...' : 'Assess Disease Risk'}
            </button>
          </div>

          {/* Disease Prediction Results */}
          {diseasePrediction && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Risk Assessment Results</h2>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p><strong>Potential Conditions:</strong></p>
                  <ul className="mt-2 space-y-1">
                    {diseasePrediction.conditions?.map((condition, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{condition.name}</span>
                        <span className="font-medium">{(condition.probability * 100).toFixed(1)}%</span>
                      </li>
                    )) || (
                      <li>{diseasePrediction.prediction || 'Assessment completed'}</li>
                    )}
                  </ul>
                </div>
                
                {diseasePrediction.recommendations && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p><strong>Recommendations:</strong></p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {diseasePrediction.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Important Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace professional medical advice. 
                    If you are experiencing serious symptoms, please seek immediate medical attention or consult with a qualified healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default PatientPortal;
