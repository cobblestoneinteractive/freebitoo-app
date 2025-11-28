
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // For email signup, we might need to wait for email confirmation or auto-login
        // If auto-login works, AuthContext will pick it up and redirect via ProtectedRoute?
        // Or we manually navigate.
        // If email confirmation is required, show message.
        alert("Check your email for confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t('auth.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto"
    >
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-50 p-6 text-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-primary-200">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegistering ? t('auth.registerTitle') : t('auth.loginTitle')}
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Input
              label={t('auth.email')}
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Button className="w-full mt-4" size="lg" isLoading={isLoading}>
              {isRegistering ? t('auth.registerButton') : t('auth.loginButton')}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Or</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              {t('auth.continueGoogle')}
            </button>
            {/* Apple login omitted for now as it requires more setup */}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-sm text-primary-600 font-medium hover:underline"
            >
              {isRegistering ? t('auth.switchLogin') : t('auth.switchRegister')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
