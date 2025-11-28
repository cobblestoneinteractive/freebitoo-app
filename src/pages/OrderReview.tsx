
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { restaurants } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import { PaymentMethod, DeliveryMethod, PaymentTiming } from '../types';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ArrowLeft, MapPin, User, Bike, ShoppingBag, CreditCard, Banknote, Smartphone, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const OrderReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, currentRestaurantId, deliveryInfo, setDeliveryInfo, placeOrder, user } = useStore();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New Payment States
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('in_person'); // 'online' | 'in_person'
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash'); // 'card' | 'cash' (only relevant for in_person)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  
  const [formData, setFormData] = useState({
    name: deliveryInfo.contact.name || (user?.name || ''),
    phone: deliveryInfo.contact.phone,
    street: deliveryInfo.address.street,
    city: deliveryInfo.address.city,
    zipCode: deliveryInfo.address.zipCode,
  });

  const restaurant = restaurants.find(r => r.id === currentRestaurantId);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) navigate('/');
  }, [cart, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
        navigate('/auth', { state: { from: location } });
    }
  }, [user, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to context
    setDeliveryInfo({
      address: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
      },
      contact: {
        name: formData.name,
        phone: formData.phone,
      },
    });

    const finalDeliveryFee = deliveryMethod === 'pickup' ? 0 : (restaurant?.deliveryFee || 0);

    // If payment is online, the method is technically 'card'
    const finalMethod = paymentTiming === 'online' ? 'card' : paymentMethod;

    await placeOrder(paymentTiming, finalMethod, deliveryMethod, finalDeliveryFee);
    setIsSubmitting(false);
    navigate('/order/success');
  };

  // Validate only contact if pickup, else all fields
  const isValid = deliveryMethod === 'pickup' 
    ? formData.name.trim().length > 0 && formData.phone.trim().length > 0
    : Object.values(formData).every(val => (val as string).trim().length > 0);

  if (!restaurant || !user) return null;

  const finalDeliveryFee = deliveryMethod === 'pickup' ? 0 : restaurant.deliveryFee;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} /> {t('checkout.backMenu')}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Form */}
        <div>
           {/* Delivery Method Toggle - Fixed Spacing */}
           <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm mb-6 flex gap-2">
              <button
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex-1 py-4 px-2 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-colors ${deliveryMethod === 'delivery' ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Bike size={20} /> {t('checkout.delivery')}
              </button>
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex-1 py-4 px-2 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-colors ${deliveryMethod === 'pickup' ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <ShoppingBag size={20} /> {t('checkout.pickup')}
              </button>
           </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <User size={20} className="text-primary-600" /> {t('checkout.contactDetails')}
                </h3>
                <div className="space-y-4">
                  <Input 
                    id="name" 
                    label={t('checkout.labels.name')} 
                    placeholder="Mario Rossi" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    id="phone" 
                    label={t('checkout.labels.phone')} 
                    placeholder="+39 333 123 4567" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    type="tel"
                    required 
                  />
                </div>
             </div>

             {deliveryMethod === 'delivery' ? (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }} 
                 animate={{ opacity: 1, height: 'auto' }} 
                 className="border-t border-gray-100 pt-6"
               >
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <MapPin size={20} className="text-primary-600" /> {t('checkout.deliveryAddress')}
                  </h3>
                  <div className="space-y-4">
                    <Input 
                      id="street" 
                      label={t('checkout.labels.street')}
                      placeholder="Via Roma 1" 
                      value={formData.street} 
                      onChange={handleChange} 
                      required 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        id="city" 
                        label={t('checkout.labels.city')} 
                        placeholder="Roma" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required 
                      />
                      <Input 
                        id="zipCode" 
                        label={t('checkout.labels.zip')} 
                        placeholder="00100" 
                        value={formData.zipCode} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
               </motion.div>
             ) : (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-gray-100 pt-6"
               >
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-primary-600" /> {t('checkout.pickupAddress')}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 flex items-start gap-3">
                    <Store size={20} className="mt-1 text-gray-500" />
                    <div>
                        <p className="font-bold text-gray-900">{restaurant.name}</p>
                        <p className="text-sm">{restaurant.address}</p>
                    </div>
                  </div>
               </motion.div>
             )}
          </form>
        </div>

        {/* Right Col: Order Summary & Payment */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold mb-4">{t('checkout.summary')}</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6 border-b border-gray-100 pb-6 max-h-60 overflow-y-auto pr-2">
                 {cart.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between items-start text-sm">
                       <div className="flex gap-2">
                          <span className="font-bold w-4">{item.quantity}x</span>
                          <span className="text-gray-700">{item.menuItem.name}</span>
                       </div>
                       <span className="text-gray-900 font-medium">{formatCurrency(item.menuItem.price * item.quantity)}</span>
                    </div>
                 ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                 <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                       {deliveryMethod === 'delivery' ? <Bike size={14} /> : <ShoppingBag size={14} />} 
                       {t('restaurant.deliveryFee')}
                    </span>
                    <span className={finalDeliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                       {finalDeliveryFee === 0 ? t('restaurant.freeDelivery') : formatCurrency(finalDeliveryFee)}
                    </span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-3 mt-2">
                     <span>{t('cart.total')}</span>
                     <span>{formatCurrency(cartTotal + finalDeliveryFee)}</span>
                 </div>
              </div>

              {/* PAYMENT SECTION - NEW LOGIC */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                 <h4 className="text-md font-bold text-gray-900 mb-4">{t('checkout.payment.title')}</h4>
                 
                 {/* Step 1: Online vs In-Person */}
                 <p className="text-sm font-medium text-gray-500 mb-2">{t('checkout.payment.when')}</p>
                 <div className="grid grid-cols-2 gap-3 mb-4">
                    <div 
                      onClick={() => setPaymentTiming('online')}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-1 ${paymentTiming === 'online' ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                       <Smartphone size={20} />
                       <span className="font-bold text-xs">{t('checkout.payment.now')}</span>
                    </div>
                    <div 
                      onClick={() => setPaymentTiming('in_person')}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-1 ${paymentTiming === 'in_person' ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                       <User size={20} />
                       <span className="font-bold text-xs">
                           {deliveryMethod === 'delivery' ? t('checkout.payment.later') : t('checkout.payment.laterPickup')}
                       </span>
                    </div>
                 </div>

                 {/* Step 2: Details based on Step 1 */}
                 <motion.div
                    key={paymentTiming}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                 >
                    {paymentTiming === 'online' ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                             <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                 <CreditCard size={16} /> {t('checkout.payment.card')}
                             </div>
                             <Input 
                                placeholder={t('checkout.card.placeholder')}
                                disabled
                                className="bg-white mb-2"
                             />
                             <p className="text-xs text-gray-500">{t('checkout.payment.desc.now')}</p>
                        </div>
                    ) : (
                        <div>
                             <p className="text-sm font-medium text-gray-500 mb-2">{t('checkout.payment.method')}</p>
                             <div className="grid grid-cols-2 gap-3 mb-2">
                                <div 
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50 text-primary-900 ring-1 ring-primary-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <Banknote size={16} />
                                    <span className="text-sm font-medium">{t('checkout.payment.cash')}</span>
                                </div>
                                <div 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 text-primary-900 ring-1 ring-primary-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <CreditCard size={16} />
                                    <span className="text-sm font-medium">POS / Card</span>
                                </div>
                             </div>
                             <p className="text-xs text-gray-500 mt-2">{t('checkout.payment.desc.later')}</p>
                        </div>
                    )}
                 </motion.div>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full text-lg shadow-primary-200 shadow-lg" 
                size="lg"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? t('checkout.sending') : t('checkout.confirm')}
              </Button>
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default OrderReview;
