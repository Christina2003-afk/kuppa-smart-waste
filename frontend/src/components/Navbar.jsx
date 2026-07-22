import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
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
                <div className="flex items-center space-x-1 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Logout
                </button>
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
