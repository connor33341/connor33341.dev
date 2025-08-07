import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import './styles/App.scss';

const AppContent: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <div className="App min-h-screen bg-[var(--background)] transition-colors duration-300">
      {!isLoading && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {!isLoading && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  );
};

export default App;