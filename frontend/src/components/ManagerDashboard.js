import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Progress,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaBoxes, FaUpload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ClinicalTrials from './ClinicalTrials';
import ColdChainMonitoring from './ColdChainMonitoring';
import AIDrugVerification from './AIDrugVerification';

const ManagerDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileHistory, setFileHistory] = useState([]);
  const { user, token } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadProgress(0);
      const response = await fetch('http://localhost:8000/files/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadProgress(100);
        
        toast({
          title: 'File uploaded successfully',
          description: `Blockchain hash: ${result.blockchain_hash.substring(0, 16)}...`,
          status: 'success',
          duration: 5000
        });
        
        setSelectedFile(null);
        fetchFileHistory();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  };

  const fetchFileHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/blockchain/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFileHistory(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching file history:', error);
    }
  };

  const InventoryManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Paracetamol", stock: 1250, minStock: 500, status: "In Stock", expiry: "2024-12-15" },
          { name: "Amoxicillin", stock: 89, minStock: 100, status: "Low Stock", expiry: "2024-11-30" },
          { name: "Insulin", stock: 340, minStock: 200, status: "In Stock", expiry: "2024-10-20" },
          { name: "Aspirin", stock: 15, minStock: 50, status: "Critical", expiry: "2024-09-10" },
          { name: "Ibuprofen", stock: 750, minStock: 300, status: "In Stock", expiry: "2025-01-25" },
          { name: "Morphine", stock: 45, minStock: 30, status: "In Stock", expiry: "2024-11-05" }
        ].map((item, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Current Stock:</span>
                <span className="font-medium">{item.stock}</span>
              </div>
              <div className="flex justify-between">
                <span>Min Required:</span>
                <span className="font-medium">{item.minStock}</span>
              </div>
              <div className="flex justify-between">
                <span>Expiry Date:</span>
                <span className="font-medium">{item.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FileManagement = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📁 File Upload & Blockchain Storage</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Hospital Record</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.jpg,.png"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-2">Supported: PDF, DOC, DOCX, JPG, PNG</p>
          </div>

          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">ℹ️</span>
                <div>
                  <p className="font-semibold text-blue-900">Selected: {selectedFile.name}</p>
                  <p className="text-sm text-blue-700">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{width: `${uploadProgress}%`}}
              />
            </div>
          )}

          <button
            onClick={handleFileUpload}
            disabled={!selectedFile}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            📤 Upload to Blockchain
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">⛓️ Recent Blockchain Activity</h3>
        <div className="space-y-3">
          {[
            { item: "Patient_Record_001.pdf", action: "File uploaded", block: "0x1a2b3c", type: "Upload", time: "2 mins ago" },
            { item: "Lab_Results_045.pdf", action: "File verified", block: "0x2b3c4d", type: "Verification", time: "15 mins ago" },
            { item: "Prescription_089.jpg", action: "File uploaded", block: "0x3c4d5e", type: "Upload", time: "1 hour ago" },
            { item: "Medical_History_012.docx", action: "File accessed", block: "0x4d5e6f", type: "Access", time: "2 hours ago" },
            { item: "Surgery_Report_023.pdf", action: "File uploaded", block: "0x5e6f7g", type: "Upload", time: "3 hours ago" }
          ].map((activity, index) => (
            <div
              key={index}
              className="bg-white/50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{activity.item}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500">Block: {activity.block}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'Upload' ? 'bg-blue-100 text-blue-700' :
                    activity.type === 'Verification' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {activity.type}
                  </span>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full blur-xl bg-gradient-to-r from-blue-400/40 to-purple-400/40" 
             style={{top: '10%', left: '10%'}} />
        <div className="absolute w-80 h-80 rounded-full blur-xl bg-gradient-to-r from-purple-400/40 to-pink-400/40" 
             style={{top: '60%', right: '15%'}} />
        <div className="absolute w-72 h-72 rounded-full blur-xl bg-gradient-to-r from-green-400/35 to-blue-400/35" 
             style={{top: '30%', right: '30%'}} />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hospital Manager Portal
            </h1>
            <p className="text-gray-700 mt-1">Welcome, {user?.full_name}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inventory Items</p>
                <p className="text-3xl font-bold text-gray-900">2,847</p>
                <p className="text-sm text-green-600">↗ +12% this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📦
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-3xl font-bold text-orange-500">23</p>
                <p className="text-sm text-orange-600">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                ⚠️
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">$1.2M</p>
                <p className="text-sm text-green-600">↗ +8% this quarter</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-red-500">7</p>
                <p className="text-sm text-red-600">Awaiting review</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                📋
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList className="mb-6">
              <Tab>📦 Inventory</Tab>
              <Tab>🧪 Clinical Trials</Tab>
              <Tab>❄️ Cold Chain</Tab>
              <Tab>🤖 AI Verification</Tab>
              <Tab>📁 File Management</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <InventoryManagement />
              </TabPanel>

              <TabPanel>
                <ClinicalTrials />
              </TabPanel>

              <TabPanel>
                <ColdChainMonitoring />
              </TabPanel>

              <TabPanel>
                <AIDrugVerification />
              </TabPanel>

              <TabPanel>
                <FileManagement />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
