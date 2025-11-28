import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Minus, Plus, ShoppingBag, X, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const CartItemRow = ({ item, updateQuantity, removeFromCart }: any) => (
  <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
       <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-1">
          <button 
            onClick={() => updateQuantity(item.menuItem.id, 1)}
            className="p-1 hover:bg-white rounded-md transition-colors text-primary-600"
          >
            <Plus size={12} />
          </button>
          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
          <button
             onClick={() => item.quantity > 1 ? updateQuantity(item.menuItem.id, -1) : removeFromCart(item.menuItem.id)}
             className="p-1 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-red-500"
          >
             {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
          </button>
       </div>
       <div className="flex flex-col">
         <span className="text-sm font-medium text-gray-900">{item.menuItem.name}</span>
         <span className="text-xs text-gray-500">{formatCurrency(item.menuItem.price)}</span>
       </div>
    </div>
    <span className="text-sm font-semibold">{formatCurrency(item.menuItem.price * item.quantity)}</span>
  </div>
);

export const CartSidebar: React.FC = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useStore();
  const { t } = useLanguage();
  const location = useLocation();

  if (cart.length === 0) {
    return (
      <div className="hidden lg:block w-96 h-[calc(100vh-80px)] sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="text-gray-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{t('cart.empty')}</h3>
        <p className="text-gray-500 text-sm">{t('cart.emptySubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col w-96 max-h-[calc(100vh-100px)] sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-50/50">
        <h2 className="text-xl font-bold text-gray-900">{t('cart.title')}</h2>
        <button onClick={clearCart} className="text-xs text-red-500 font-medium hover:underline">{t('cart.clear')}</button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
        {cart.map((item) => (
          <CartItemRow 
            key={item.menuItem.id} 
            item={item} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
          />
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 text-lg font-bold">
          <span>{t('cart.subtotal')}</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        {location.pathname !== '/order/review' ? (
          <Link to="/order/review">
            <Button className="w-full text-lg shadow-primary-200 shadow-lg" size="lg">
              {t('cart.checkout')}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export const MobileCartSheet: React.FC = () => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart } = useStore();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (cart.length === 0) return null;
  // Don't show on checkout page to avoid clutter
  if (location.pathname.includes('/order/review') || location.pathname.includes('/order/success')) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-bold text-lg">{t('cart.title')} ({cartCount})</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-4 flex-grow">
                {cart.map((item) => (
                  <CartItemRow 
                    key={item.menuItem.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 pb-8">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <Link to="/order/review" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="lg">{t('cart.checkout')}</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 z-30 lg:hidden"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-primary-900 text-white p-4 rounded-xl shadow-xl flex items-center justify-between hover:bg-primary-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {cartCount}
              </div>
              <span className="font-semibold">{t('cart.viewBasket')}</span>
            </div>
            <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
          </button>
        </motion.div>
      )}
    </>
  );
};