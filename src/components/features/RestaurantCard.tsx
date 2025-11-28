import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Info } from 'lucide-react';
import { Restaurant } from '../../types';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { t } = useLanguage();

  return (
    <Link to={`/restaurant/${restaurant.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {restaurant.deliveryFee === 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="orange">{t('restaurant.freeDelivery')}</Badge>
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1">
            <Clock size={12} className="text-gray-500" />
            {restaurant.deliveryTimeRange}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-sm font-semibold text-gray-800">
              <span>{restaurant.rating}</span>
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-3">{restaurant.cuisineType}</p>
          
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
            <Info size={12} />
            <span className="truncate">{restaurant.description}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;