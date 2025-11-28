import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Check, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../lib/utils';
import Button from '../components/ui/Button';
import { restaurants } from '../lib/mockData';
import { useLanguage } from '../context/LanguageContext';

const OrderSuccess: React.FC = () => {
  const { lastOrder } = useStore();
  const { t } = useLanguage();

  if (!lastOrder) {
    return <Navigate to="/" replace />;
  }

  const restaurant = restaurants.find(r => r.id === lastOrder.restaurantId);
  const isPickup = lastOrder.deliveryMethod === 'pickup';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-lg mx-auto text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8"
      >
        <Check size={48} className="text-primary-600" strokeWidth={3} />
      </motion.div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{t('success.title')}</h1>
      <p className="text-gray-500 text-lg mb-8">
        {isPickup 
          ? t('success.messagePickup') 
          : t('success.message')
        } 
        <span className="font-semibold text-gray-900"> {restaurant?.name}</span>.
        <br />
        {isPickup 
          ? <span className="block mt-2 text-sm bg-gray-50 p-2 rounded">{restaurant?.address}</span>
          : null
        }
        <span className="block mt-4">
            {isPickup ? t('success.etaPickup') : t('success.eta')} <span className="font-semibold text-primary-600">{restaurant?.deliveryTimeRange}</span>.
        </span>
      </p>

      <div className="w-full bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <span className="text-gray-500 text-sm">{t('success.orderId')}</span>
          <span className="font-mono font-medium text-gray-900">#{(Math.random() * 10000).toFixed(0).padStart(4, '0')}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-4">{t('checkout.summary')}</h3>
        <ul className="space-y-3 mb-4">
           {lastOrder.items.map((item, idx) => (
             <li key={idx} className="flex justify-between text-sm">
               <span className="text-gray-600">{item.quantity}x {item.menuItem.name}</span>
               <span className="font-medium">{formatCurrency(item.menuItem.price * item.quantity)}</span>
             </li>
           ))}
        </ul>
        <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4">
          <span>{t('cart.total')}</span>
          <span>{formatCurrency(lastOrder.total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
         <Link to="/" className="w-full">
           <Button variant="outline" className="w-full" size="lg">
             <Home className="mr-2" size={18} /> {t('success.home')}
           </Button>
         </Link>
         {/* In a real app, this would act as a 'Track Order' */}
         <Button className="w-full" size="lg" disabled>
             {t('success.track')} <ArrowRight className="ml-2" size={18} />
         </Button>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;