import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurants } from '../lib/mockData';
import { Star, Clock, ArrowLeft, Bike } from 'lucide-react';
import MenuItemCard from '../components/features/MenuItemCard';
import { CartSidebar, MobileCartSheet } from '../components/features/Cart';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const RestaurantDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const restaurant = restaurants.find(r => r.slug === slug);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('restaurant.notFound')}</h2>
        <Link to="/" className="text-primary-600 hover:underline">{t('restaurant.backHome')}</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-20 lg:pb-0"
    >
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        
        <div className="absolute top-4 left-4">
           <Link to="/" className="flex items-center gap-2 text-white bg-black/30 backdrop-blur-md px-3 py-2 rounded-lg hover:bg-black/50 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">{t('common.back')}</span>
           </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl text-white inline-block w-full sm:w-auto">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              <span className="bg-white text-gray-900 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                {restaurant.rating} <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </span>
              <span className="flex items-center gap-1 opacity-90">
                <Clock size={16} /> {restaurant.deliveryTimeRange}
              </span>
              <span className="flex items-center gap-1 opacity-90">
                <Bike size={16} /> {restaurant.deliveryFee === 0 ? t('restaurant.freeDelivery') : `${t('restaurant.deliveryFee')} €${restaurant.deliveryFee}`}
              </span>
              <span className="opacity-75">{restaurant.cuisineType}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Menu Section */}
          <div className="flex-grow">
            {/* Category Navigation - Sticky */}
            <div className="sticky top-16 z-30 bg-gray-50 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-gray-200/50 mb-6">
              {restaurant.categories.map((category) => (
                <a 
                  key={category.id} 
                  href={`#${category.slug}`}
                  className="inline-block mr-3 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-primary-500 hover:text-primary-600 transition-colors snap-start"
                >
                  {category.name}
                </a>
              ))}
            </div>

            <div className="space-y-12">
              {restaurant.categories.map((category) => {
                const items = restaurant.menu.filter(item => item.categoryId === category.id);
                if (items.length === 0) return null;

                return (
                  <div key={category.id} id={category.slug} className="scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      {category.name}
                      <span className="h-px bg-gray-200 flex-grow ml-4"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <MenuItemCard key={item.id} item={item} restaurantId={restaurant.id} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Cart for Desktop */}
          <div className="flex-shrink-0">
             <CartSidebar />
          </div>

        </div>
      </div>

      <MobileCartSheet />
    </motion.div>
  );
};

export default RestaurantDetail;