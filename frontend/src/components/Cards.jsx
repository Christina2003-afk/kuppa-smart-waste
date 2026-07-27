import React from 'react';

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center group">
      <div className="bg-brand-earth/20 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
        <div className="text-brand-green">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export const OrganicItemCard = ({ category, title, description, user, timePosted, amount, status, type }) => {
  const userName = typeof user === 'object' && user?.name ? user.name : user;
  const isAccepted = status === 'Accepted';

  return (
    <div className={`bg-white p-6 rounded-xl border ${isAccepted ? 'border-gray-200 opacity-60' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative`}>
      {isAccepted && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[1px] rounded-xl">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-12 text-lg tracking-wider">
            COMPLETED
          </div>
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-brand-lightGreen/10 text-brand-green px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          {category}
        </span>
        <span className="text-xs text-gray-400">{timePosted}</span>
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
      
      {amount > 0 && (
        <div className="mb-3 inline-flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg border border-yellow-200 shadow-sm">
          <span className="font-bold text-sm">{type === 'Available' ? `Price: ₹${amount}` : `Reward: ₹${amount}`}</span>
        </div>
      )}

      <p className="text-gray-600 text-sm mb-6 flex-grow">{description}</p>
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto relative z-0">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-brand-darkBlue flex items-center justify-center text-white text-xs font-bold shadow-md">
            {userName && userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        </div>
        <button className={`font-medium text-sm transition-colors ${isAccepted ? 'text-gray-400 cursor-not-allowed' : 'text-brand-green hover:underline'}`} disabled={isAccepted}>
          {type === 'Available' ? 'Contact' : 'Fulfill'}
        </button>
      </div>
    </div>
  );
};
