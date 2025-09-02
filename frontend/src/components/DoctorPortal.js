import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const DoctorPortal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Adherence State
  const [patientId, setPatientId] = useState('');
  const [adherenceData, setAdherenceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chat State
  const [chatRoomId, setChatRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAdherence = async () => {
    if (!patientId.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/adherence/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAdherenceData(data);
      } else {
        alert('Patient not found or access denied');
      }
    } catch (error) {
      console.error('Error fetching adherence:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const connectToChat = () => {
    if (!chatRoomId.trim()) return;

    if (ws) {
      ws.close();
    }

    const websocket = new WebSocket(`ws://localhost:8000/ws/chat/${chatRoomId}`);
    
    websocket.onopen = () => {
      setConnected(true);
      setMessages([]);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, { ...message, isOwn: false }]);
    };

    websocket.onclose = () => {
      setConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    setWs(websocket);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ws || !connected) return;

    const message = {
      text: newMessage,
      sender: 'Doctor',
      timestamp: new Date().toISOString()
    };

    ws.send(JSON.stringify(message));
    setMessages(prev => [...prev, { ...message, isOwn: true }]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full blur-xl bg-gradient-to-r from-blue-400/40 to-purple-400/40" 
             style={{top: '10%', left: '10%'}} />
        <div className="absolute w-80 h-80 rounded-full blur-xl bg-gradient-to-r from-purple-400/40 to-pink-400/40" 
             style={{top: '60%', right: '15%'}} />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Doctor Portal
        </h1>
        <p className="text-gray-700 mt-1">Patient Care & Monitoring Dashboard</p>
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
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('adherence')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'adherence'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            💊 Patient Adherence
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            💬 Patient Chat
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-green-600">↗ +8% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  👥
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Adherence</p>
                  <p className="text-3xl font-bold text-gray-900">84.2%</p>
                  <p className="text-sm text-green-600">↗ +2.1% this week</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-red-600">↗ +1 today</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                  🚨
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="text-3xl font-bold text-gray-900">42</p>
                  <p className="text-sm text-blue-600">↗ +5 today</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  💬
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Patient Adherence Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', adherence: 78 },
                    { month: 'Feb', adherence: 82 },
                    { month: 'Mar', adherence: 79 },
                    { month: 'Apr', adherence: 85 },
                    { month: 'May', adherence: 88 },
                    { month: 'Jun', adherence: 84 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="adherence" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🏥 Department Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Cardiology', value: 35, color: '#3b82f6' },
                        { name: 'Diabetes', value: 28, color: '#10b981' },
                        { name: 'Oncology', value: 22, color: '#f59e0b' },
                        { name: 'Neurology', value: 15, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {[
                        { name: 'Cardiology', value: 35, color: '#3b82f6' },
                        { name: 'Diabetes', value: 28, color: '#10b981' },
                        { name: 'Oncology', value: 22, color: '#f59e0b' },
                        { name: 'Neurology', value: 15, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🔔 Recent Activity</h3>
            <div className="space-y-3">
              {[
                { type: 'alert', message: 'Patient P003 missed medication dose', time: '5 mins ago', priority: 'high' },
                { type: 'success', message: 'Patient P001 completed weekly check-in', time: '15 mins ago', priority: 'low' },
                { type: 'info', message: 'New lab results available for P002', time: '1 hour ago', priority: 'medium' },
                { type: 'alert', message: 'Patient P005 reported side effects', time: '2 hours ago', priority: 'high' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      activity.priority === 'high' ? 'bg-red-500' :
                      activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
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

      {/* Patient Adherence Tab */}
      {activeTab === 'adherence' && (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🏥 Patient Adherence Monitoring</h2>
            
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter Patient ID or Email"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={fetchAdherence}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>

          {adherenceData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Adherence Results</h3>
              
              {/* Adherence Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Adherence Score</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {adherenceData.adherence_score ? `${adherenceData.adherence_score.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      adherenceData.adherence_score >= 80 ? 'bg-green-500' :
                      adherenceData.adherence_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${adherenceData.adherence_score || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <h4 className="text-md font-semibold mb-3">Recent Medication Logs</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Medication</th>
                        <th className="px-4 py-2 text-left">Due Time</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Logged At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {adherenceData.logs.slice(0, 10).map((log, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{log.medication}</td>
                          <td className="px-4 py-2">{new Date(log.due_time).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.taken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {log.taken ? 'Taken' : 'Missed'}
                            </span>
                          </td>
                          <td className="px-4 py-2">{new Date(log.logged_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patient Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Chat</h2>
            
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={chatRoomId}
                onChange={(e) => setChatRoomId(e.target.value)}
                placeholder="Enter Patient ID for chat room"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={connectToChat}
                className={`px-6 py-2 rounded-md ${
                  connected 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {connected ? 'Connected' : 'Connect'}
              </button>
            </div>

            {connected && (
              <div className="border rounded-lg">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">
                          <strong>{message.sender}:</strong> {message.text}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorPortal;
