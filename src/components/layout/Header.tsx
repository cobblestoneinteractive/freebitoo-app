
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Globe, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { cartCount } = useStore();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it');
  };

  const handleUserClick = () => {
    if (!user) {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-primary-900 font-bold text-lg group-hover:bg-yellow-300 transition-colors shadow-sm">
            F
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">FreeBitoo</span>
        </Link>

        {/* Desktop Location Mockup */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <MapPin size={16} className="text-primary-600" />
          <span>Roma, IT</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            <Globe size={18} />
            <span className="uppercase">{language}</span>
          </button>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary-600">
                  <UserIcon size={18} />
                </div>
                <span className="hidden sm:block">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              </button>
              {/* Dropdown for Logout */}
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUserClick}
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg"
            >
              <UserIcon size={18} />
              <span className="hidden sm:block">Login</span>
            </button>
          )}

          {/* Simple cart indicator for desktop, mostly decorative as we have a sidebar */}
          {cartCount > 0 && (
            <div className="relative">
              <ShoppingBag className="text-gray-600" size={24} />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
