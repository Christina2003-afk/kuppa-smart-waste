import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { OrganicItemCard } from '../components/Cards';

const OrganicExchange = () => {
  const [activeTab, setActiveTab] = useState('Available');

  const items = [
    { id: 1, category: 'Egg Shells', title: 'Crushed Egg Shells (2kg)', description: 'Perfect for tomato plants. Cleaned and crushed.', user: 'Sarah M.', timePosted: '2 hours ago', type: 'Available' },
    { id: 2, category: 'Coffee Grounds', title: 'Fresh Coffee Grounds', description: 'From a local cafe. Great for composting.', user: 'Cafe Beans', timePosted: '5 hours ago', type: 'Available' },
    { id: 3, category: 'Banana Peels', title: 'Looking for Banana Peels', description: 'Need about 5kg for a large compost pile.', user: 'David W.', timePosted: '1 day ago', type: 'Requested' },
    { id: 4, category: 'Dry Leaves', title: 'Bags of Dry Autumn Leaves', description: '3 large bags available. Good carbon source.', user: 'Elena R.', timePosted: '1 day ago', type: 'Available' },
    { id: 5, category: 'Compost', title: 'Mature Compost Wanted', description: 'Looking for rich compost for my spring garden.', user: 'Mike T.', timePosted: '2 days ago', type: 'Requested' },
  ];

  const filteredItems = items.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Organic Resource Exchange</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Share, request, and reuse organic materials within your community.
            </p>
          </div>
          <button className="bg-brand-green hover:bg-brand-lightGreen text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Post a Listing</span>
          </button>
        </div>

        {/* Filters and Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          <div className="flex space-x-2 w-full md:w-auto bg-gray-100 p-1 rounded-xl">
            <button 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Available' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('Available')}
            >
              Available Resources
            </button>
            <button 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Requested' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('Requested')}
            >
              Requested
            </button>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <OrganicItemCard 
              key={item.id}
              category={item.category}
              title={item.title}
              description={item.description}
              user={item.user}
              timePosted={item.timePosted}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No listings found in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganicExchange;
