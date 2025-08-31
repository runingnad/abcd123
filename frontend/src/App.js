import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleShowLogin = () => {
    setCurrentPage('login');
  };

  return (
    <ChakraProvider>
      {currentPage === 'landing' && <LandingPage onLogin={handleShowLogin} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />}
      {currentPage === 'dashboard' && isAuthenticated && <Dashboard onLogout={handleLogout} />}
      {currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'dashboard' && <LandingPage onLogin={handleShowLogin} />}
    </ChakraProvider>
  );
}

export default App;
