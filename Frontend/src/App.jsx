// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ArtProvider } from './context/ArtContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page Components
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import UserProfile from './components/UserProfile';
import ArtistDashboard from './components/ArtistDashboard';
import Leaderboard from './components/Leaderboard';
import AboutPage from './pages/AboutPage';
import ArtUploadPage from './pages/ArtUploadPage';
import ArtAnalyzer from './components/ArtAnalyzer';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
import LeaderboardTest from './components/LeaderboardTest';
import SharedArtworkPage from './pages/SharedArtworkPage';

function App() {
  return (
    <AuthProvider>
      <ArtProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-white font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/dashboard" element={<ArtistDashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/upload-art" element={<ArtUploadPage />} />
                <Route path="/artAnalyzer" element={<ArtAnalyzer />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/leaderboard-test" element={<LeaderboardTest />} />
                <Route path="/shared/:shareToken" element={<SharedArtworkPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ArtProvider>
    </AuthProvider>
  );
}

export default App;
