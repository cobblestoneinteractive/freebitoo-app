import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';

const Onboarding: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            // Force reload profile in context? 
            // Ideally AuthContext listens to changes or we manually update it.
            // For now, let's just navigate. The ProtectedRoute check might need a refresh.
            // We can reload the page or trigger a re-fetch.
            // Since AuthContext listens to auth state change, but not table changes.
            // We might need to refresh the session or just navigate.

            navigate('/onboarding/success');
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto"
        >
            <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
                <p className="text-gray-500 mb-6">Let's get to know you better.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="Mario"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            placeholder="Rossi"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+39 333 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        helperText="Include country code"
                    />

                    <Button className="w-full mt-6" size="lg" isLoading={isLoading}>
                        Continue
                    </Button>
                </form>
            </div>
        </motion.div>
    );
};

export default Onboarding;
