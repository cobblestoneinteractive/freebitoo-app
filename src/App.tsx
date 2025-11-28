
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import OrderReview from './pages/OrderReview';
import OrderSuccess from './pages/OrderSuccess';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/features/auth/ProtectedRoute';
import Onboarding from './pages/Onboarding';
import OnboardingSuccess from './pages/OnboardingSuccess';
import Auth from './pages/Auth';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/onboarding/success" element={<ProtectedRoute><OnboardingSuccess /></ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/restaurant/:slug" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
        <Route path="/order/review" element={<ProtectedRoute><OrderReview /></ProtectedRoute>} />
        <Route path="/order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StoreProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col font-sans">
              <Header />
              <main className="flex-grow">
                <AnimatedRoutes />
              </main>
            </div>
          </HashRouter>
        </StoreProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
