import React, { useContext } from 'react';
import { Mail, Phone, MapPin, Wallet, Edit2, ShieldCheck, Activity } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-brand-darkBlue via-brand-green to-brand-lightGreen rounded-b-[3rem] shadow-sm z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 mb-8 flex flex-col md:flex-row items-center md:items-start justify-between">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-brand-lightGreen to-brand-green flex items-center justify-center text-6xl md:text-7xl font-black text-white shadow-lg border-4 border-white">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="absolute bottom-2 right-2 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-brand-green transition-colors border border-gray-100 group-hover:scale-110 transition-transform">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-brand-green/10 text-brand-green text-sm font-bold uppercase tracking-wider rounded-full">
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  {user.role} Member
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-brand-earth/10 text-brand-earth text-sm font-bold uppercase tracking-wider rounded-full">
                  <Activity className="h-4 w-4 mr-1.5" />
                  {user.ecoPoints || 0} Eco Points
                </span>
              </div>
              <p className="text-gray-500 max-w-md">
                Member since {new Date().getFullYear()} • Contributing to a greener future with KUPPA.
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Detail Card 1 - Email */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center space-x-5 group cursor-default">
            <div className="h-14 w-14 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 shadow-inner">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-lg font-bold text-gray-800 truncate">{user.email}</p>
            </div>
          </div>

          {/* Detail Card 2 - Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center space-x-5 group cursor-default">
            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-inner">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
              <p className="text-lg font-bold text-gray-800">{user.phone}</p>
            </div>
          </div>

          {/* Detail Card 3 - Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center space-x-5 group cursor-default">
            <div className="h-14 w-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-lg font-bold text-gray-800">{user.address}</p>
            </div>
          </div>

          {/* Detail Card 4 - Wallet Balance (Only for regular users) */}
          {(user.walletBalance !== undefined) && user.role !== 'Admin' && user.role !== 'Staff' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between group cursor-default">
              <div className="flex items-center space-x-5">
                <div className="h-14 w-14 rounded-full bg-brand-earth/20 flex items-center justify-center text-brand-earth group-hover:scale-110 group-hover:bg-brand-earth group-hover:text-white transition-all duration-300 shadow-inner">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                  <p className="text-2xl font-black text-gray-900">₹{user.walletBalance}</p>
                </div>
              </div>
              <Link to="/wallet" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors">
                View
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
