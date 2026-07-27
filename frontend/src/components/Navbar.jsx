import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, UserCircle, ChevronDown, LogOut, Settings, LayoutDashboard, Mail, Phone, MapPin, Wallet } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Smart Bin', path: '/smart-bin' },
    { name: 'Locate Bin', path: '/locate-bin' },
    { name: 'Exchange', path: '/exchange' },
  ];
  
  if (user && user.role !== 'Admin' && user.role !== 'Staff') {
    navLinks.push({ name: 'Wallet', path: '/wallet' });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-12 w-12 overflow-hidden rounded-full flex items-center justify-center border-2 border-brand-green shadow-sm">
                <img src="/logo.png" alt="KUPPA Logo" className="h-full w-full object-cover scale-[1.35] object-center" />
              </div>
              {/* Changed color to brand green for a fresh look */}
              <span className="text-3xl font-extrabold text-brand-green tracking-tight">KUPPA</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-brand-green font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                {(user.role === 'Admin' || user.role === 'Staff') && (
                  <Link 
                    to={user.role === 'Admin' ? '/admin' : '/staff'} 
                    className="text-brand-green font-medium hover:text-brand-darkBlue transition-colors mr-2"
                  >
                    Dashboard
                  </Link>
                )}
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 group"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-r from-brand-green to-brand-darkBlue flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-sm text-gray-700 group-hover:text-brand-darkBlue transition-colors">{user.name}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right z-50">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-brand-green font-medium capitalize mt-0.5">{user.role} Account</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-green/5 hover:text-brand-green transition-colors font-medium"
                        >
                          <UserCircle className="h-4 w-4 mr-3" />
                          View Profile
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <Link to="/login" className="text-brand-darkBlue font-medium hover:text-brand-green transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-brand-green hover:bg-brand-lightGreen text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-brand-green focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-md fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 pb-2 border-t border-gray-200">
                <div className="px-3 mb-2 font-medium text-gray-800">Hi, {user.name}</div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50 flex items-center"
                >
                  <UserCircle className="h-5 w-5 mr-2" /> View Profile
                </Link>
                {/* Logout Button */}
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 flex flex-col space-y-2 border-t border-gray-200 px-3 pb-3">
                <Link
                  to="/login"
                  className="block text-center w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center w-full bg-brand-green text-white px-4 py-2 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
