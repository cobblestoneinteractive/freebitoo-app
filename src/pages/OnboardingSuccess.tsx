import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const OnboardingSuccess: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-primary-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-200"
                >
                    <CheckCircle size={48} strokeWidth={3} />
                </motion.div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bravo!</h1>
                <p className="text-xl text-gray-600 mb-8">Ora puoi usare Freebitoo!</p>

                <Button
                    onClick={() => navigate('/')}
                    size="lg"
                    className="w-full max-w-xs animate-bounce-subtle"
                >
                    Go to Home
                </Button>
            </motion.div>
        </div>
    );
};

export default OnboardingSuccess;
