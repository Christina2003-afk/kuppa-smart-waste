import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1b4332] to-brand-green text-white pt-16 pb-8 border-t-[6px] border-[#ffc107]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-14 w-14 overflow-hidden rounded-full flex items-center justify-center bg-white shadow-sm">
                <img src="/logo.png" alt="KUPPA Logo" className="h-full w-full object-cover scale-[1.35]" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-white">KUPPA</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              From Waste to Worth. An AI and IoT-Based Smart Hygiene Waste Collecting Platform with Community Organic Resource Exchange.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/smart-bin" className="text-gray-300 hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/locate" className="text-gray-300 hover:text-white transition-colors">Find a Bin</Link></li>
              <li><Link to="/exchange" className="text-gray-300 hover:text-white transition-colors">Community Exchange</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sustainability Report</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-lightGreen flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">Eco Valley, Smart City Hub, Green State, 10101</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-lightGreen flex-shrink-0" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-lightGreen flex-shrink-0" />
                <span className="text-gray-300 text-sm">hello@kuppa.eco</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} KUPPA Technologies. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Designed for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
