import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import Button from '../ui/Button';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurantId }) => {
  const { addToCart, cart } = useStore();
  const quantityInCart = cart.find(i => i.menuItem.id === item.id)?.quantity || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          {item.tags?.map(tag => (
             <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
               {tag}
             </span>
          ))}
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
            <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
            <Button
              size="sm"
              variant={quantityInCart > 0 ? 'secondary' : 'outline'}
              className="rounded-full w-8 h-8 p-0"
              onClick={() => addToCart(item, restaurantId)}
            >
              <Plus size={16} />
            </Button>
        </div>
      </div>
      {item.imageUrl && (
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
    </motion.div>
  );
};

export default MenuItemCard;