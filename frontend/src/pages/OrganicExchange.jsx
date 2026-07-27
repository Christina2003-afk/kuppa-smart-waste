import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { OrganicItemCard } from '../components/Cards';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const OrganicExchange = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Available');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'Available',
    amount: ''
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/exchange');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch exchange items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to post a listing.');
      return;
    }
    try {
      await api.post('/exchange', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', category: '', type: 'Available', amount: '' });
      fetchItems();
    } catch (err) {
      console.error('Failed to post listing:', err);
      alert('Failed to post listing. Check console.');
    }
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Organic Resource Exchange</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Share, request, and reuse organic materials within your community.
            </p>
          </div>
          <button 
            onClick={() => {
              if (user) {
                setShowModal(true);
              } else {
                alert('Please log in to post a listing.');
              }
            }}
            className="bg-brand-green hover:bg-brand-lightGreen text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center space-x-2"
          >
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <OrganicItemCard 
                key={item._id}
                category={item.category}
                title={item.title}
                description={item.description}
                user={item.user}
                timePosted={item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : 'Just now'}
                amount={item.amount}
                status={item.status}
                type={item.type}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No listings found in this category.</p>
          </div>
        )}

      </div>

      {/* Post Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Create a Listing</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Available'})}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-colors border-2 ${formData.type === 'Available' ? 'border-brand-green bg-brand-green/10 text-brand-green' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  I have an item
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Requested'})}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-colors border-2 ${formData.type === 'Requested' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  I need an item
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Crushed Egg Shells (2kg)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Egg Shells">Egg Shells</option>
                  <option value="Coffee Grounds">Coffee Grounds</option>
                  <option value="Vegetable Scraps">Vegetable Scraps</option>
                  <option value="Dry Leaves">Dry Leaves</option>
                  <option value="Compost">Compost</option>
                  <option value="Wood Ash">Wood Ash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount / Reward (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">₹</span>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 50"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Optional. The amount you want for this, or the reward you offer.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Describe the item, condition, and pickup details..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-green hover:bg-brand-lightGreen transition-colors shadow-md">
                  Post Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrganicExchange;
