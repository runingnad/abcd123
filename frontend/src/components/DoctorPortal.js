import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const DoctorPortal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('adherence');
  
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Doctor Portal</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('adherence')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'adherence'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Patient Adherence
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Patient Chat
          </button>
        </nav>
      </div>

      {/* Patient Adherence Tab */}
      {activeTab === 'adherence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Adherence Monitoring</h2>
            
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
  );
};

export default DoctorPortal;
