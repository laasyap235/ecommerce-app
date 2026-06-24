import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut, Package } from 'lucide-react';

const Navbar = ({
  logoText = 'ShopHub',
  navLinks = [
    { label: 'Home', path: '/' },
  ],
  cartCount = 0,
  isLoggedIn = false,
  userName = '',
  onSignInClick,
  onSignOutClick,
  onCartClick,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClasses = ({ isActive }) =>
    `font-medium transition duration-200 ${
      isActive ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900 shrink-0"
          >
            {logoText}
          </button>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Account */}
            <div className="relative" ref={accountRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition duration-200"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline">{userName || 'Account'}</span>
                    <ChevronDown size={16} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                      <button
                        onClick={() => {
                          navigate('/orders');
                          setAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Package size={16} />
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          onSignOutClick && onSignOutClick();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onSignInClick ? onSignInClick() : navigate('/signin')}
                  className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition duration-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Cart — navigates to /cart by default */}
            <button
              onClick={() => onCartClick ? onCartClick() : navigate('/cart')}
              className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;