import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search, Filter, Leaf, Wallet, ArrowRight, CheckCircle2, Clock, XCircle, AlertCircle, MapPin, Scale, UploadCloud, User, Phone, Mail, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const StatusChip = ({ status }) => {
  const styles = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
    'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'Accepted by Seller': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Pending Buyer Approval': 'bg-orange-100 text-orange-800 border-orange-200',
    'Pickup Scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
    'Completed': 'bg-gray-100 text-gray-800 border-gray-200',
    'Cancelled': 'bg-red-50 text-red-600 border-red-100',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const MarketplaceCard = ({ item, currentUser, onAccept, onInitiateFulfill, onApproveOffer }) => {
  const isOwner = currentUser && item.user?._id === currentUser._id;
  const isApproved = item.status === 'Approved';
  const isPendingBuyerApproval = item.status === 'Pending Buyer Approval';
  const showAction = !isOwner && isApproved && currentUser;
  const showReviewOffer = isOwner && isPendingBuyerApproval && item.type === 'Requested';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-full relative group"
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <StatusChip status={item.status} />
          <span className="text-xs text-gray-400 font-medium">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
            <Scale className="h-4 w-4 mr-1 text-brand-green" />
            <span className="font-semibold">{item.quantity}</span>
          </div>
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span className="truncate max-w-[100px]">{item.location}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500 font-medium mb-1">
            {item.type === 'Available' ? 'Expected Price' : 'Offered Reward'}
          </p>
          <p className="text-2xl font-black text-[#1b4332]">₹{item.amount}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {item.description}
        </p>

        {/* Timeline Preview */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
            <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> Posted</span>
            <span className="w-8 border-t border-gray-200 border-dashed"></span>
            <span className={`flex items-center ${isApproved ? 'text-brand-green' : ''}`}>
              <CheckCircle2 className="h-3 w-3 mr-1"/> {item.status}
            </span>
          </div>

          {showReviewOffer ? (
            <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100 mb-2">
              <h4 className="font-bold text-orange-800 text-sm mb-3">Seller's Offer for Review</h4>
              {item.offeredImage && (
                item.offeredImage.endsWith('.pdf') ? (
                  <a href={`http://localhost:5001${item.offeredImage}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-white p-4 rounded-lg mb-3 border border-orange-200 hover:bg-orange-50 transition-colors">
                    <FileText className="h-8 w-8 text-orange-500 mb-2" />
                    <span className="text-xs font-bold text-orange-700">View PDF Document</span>
                  </a>
                ) : (
                  <img src={`http://localhost:5001${item.offeredImage}`} alt="Offered product" className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm border border-orange-100" />
                )
              )}
              
              <div className="bg-white/80 p-3 rounded-lg mb-4 text-xs text-gray-600 space-y-2 border border-orange-100">
                <p className="font-bold text-gray-800 border-b border-orange-100 pb-1 mb-2">Seller Details</p>
                {item.fulfilledBy && (
                  <>
                    <p className="flex items-center"><User className="h-3 w-3 mr-2 text-orange-500"/> {item.fulfilledBy.name}</p>
                    <p className="flex items-center"><Phone className="h-3 w-3 mr-2 text-orange-500"/> {item.fulfilledBy.phone}</p>
                    <p className="flex items-center"><Mail className="h-3 w-3 mr-2 text-orange-500"/> {item.fulfilledBy.email}</p>
                  </>
                )}
                <p className="flex items-center pt-1 mt-1 border-t border-orange-50"><MapPin className="h-3 w-3 mr-2 text-orange-500"/> Pickup: {item.offeredLocation}</p>
              </div>
              <button 
                onClick={() => onApproveOffer(item._id)}
                className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-md flex items-center justify-center text-sm"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve & Pay ₹{item.amount}
              </button>
            </div>
          ) : showAction ? (
            <button 
              onClick={() => item.type === 'Requested' ? onInitiateFulfill(item) : onAccept(item._id)}
              className="w-full bg-[#1b4332] text-white py-3 rounded-xl font-bold hover:bg-brand-green transition-all shadow-md flex items-center justify-center group-hover:shadow-lg"
            >
              <span>{item.type === 'Available' ? 'Buy Now' : 'Fulfill Request'}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <div className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-medium text-center text-sm border border-gray-100">
              {isOwner ? 'Your Listing' : (['Pending', 'Under Review'].includes(item.status) ? 'Awaiting Approval' : 'Action Unavailable')}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OrganicExchange = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Available');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Fulfillment Modal State
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [selectedFulfillItem, setSelectedFulfillItem] = useState(null);
  const [fulfillData, setFulfillData] = useState({ offeredImage: '', offeredLocation: '' });

  const [formData, setFormData] = useState({
    title: '', description: '', category: '', type: 'Available', amount: '', quantity: '', location: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/exchange');
      setItems(res.data);
      
      if (user) {
        const userRes = await api.get('/auth/me'); // Assuming standard route to get fresh user data
        setWalletBalance(userRes.data.walletBalance);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to post a listing.');
    try {
      await api.post('/exchange', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', category: '', type: 'Available', amount: '', quantity: '', location: '' });
      fetchData();
      alert('Success! Your listing is now Pending Admin Approval.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post listing.');
    }
  };

  const handleAccept = async (itemId) => {
    if (!window.confirm("Are you sure? This will deduct funds from your wallet (including a 10% platform fee).")) return;
    try {
      await api.put(`/exchange/${itemId}/accept`);
      alert("Success! The transaction has been processed.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed.');
    }
  };

  const handleInitiateFulfill = (item) => {
    setSelectedFulfillItem(item);
    setFulfillData({ file: null, offeredLocation: '' });
    setShowFulfillModal(true);
  };

  const handleFulfillSubmit = async (e) => {
    e.preventDefault();
    if (!fulfillData.file) {
      return alert('Please select a file to upload.');
    }
    
    try {
      // 1. Upload the file first
      const formData = new FormData();
      formData.append('file', fulfillData.file);
      
      const uploadRes = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const fileUrl = uploadRes.data.url;

      // 2. Submit the fulfillment with the returned file URL
      await api.put(`/exchange/${selectedFulfillItem._id}/accept`, {
        offeredImage: fileUrl,
        offeredLocation: fulfillData.offeredLocation
      });
      
      setShowFulfillModal(false);
      alert("Offer submitted to buyer successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit offer.');
    }
  };

  const handleApproveOffer = async (itemId) => {
    if (!window.confirm("Do you approve this offer? The funds will now be transferred to the seller.")) return;
    try {
      await api.put(`/exchange/${itemId}/approve-fulfillment`);
      alert("Offer approved and transaction completed!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve offer.');
    }
  };

  const filteredItems = items.filter(item => {
    if (item.type !== activeTab) return false;
    
    // Only show items to public that are not pending/rejected/cancelled
    const isPubliclyVisible = ['Approved', 'Accepted by Seller', 'Pending Buyer Approval', 'Pickup Scheduled', 'Completed'].includes(item.status);
    
    // Owners can see their own items regardless of status
    const isOwner = user && item.user?._id === user._id;

    return isPubliclyVisible || isOwner;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 relative overflow-hidden font-sans">
      
      {/* Approved Items Notification Banner */}
      {user && items.some(i => i.user?._id === user._id && i.status === 'Approved') && (
        <div className="bg-emerald-500 text-white px-4 py-3 text-center text-sm font-bold shadow-md relative z-[60] flex items-center justify-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Notification: One or more of your listings have been Approved by the Admin and are now live!</span>
        </div>
      )}

      {/* Hero Banner with Cinematic Animated Background */}
      <section className="relative pt-36 pb-28 overflow-hidden rounded-b-[3rem] mb-12 shadow-2xl group bg-[#0a1f16]">
        {/* HTML5 YouTube Video Background - Reliable Fallback */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
          <iframe
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-[1920px] min-h-[1080px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=LXb3EKWsInQ"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            title="Organic Farming Background"
          ></iframe>
        </div>
        
        {/* Very subtle gradient just for text readability at the bottom/center, leaving the beautiful video visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f16] via-[#0a1f16]/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[#0a1f16]/20"></div>

        {/* Animated Fireflies / Light Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: Math.random() * 500, 
                x: Math.random() * 1000, 
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -200 - 100], 
                x: [null, Math.random() * 200 - 100],
                opacity: [0, Math.random() * 0.8 + 0.2, 0] 
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
              className="absolute w-2 h-2 bg-yellow-200 rounded-full blur-[1px] shadow-[0_0_10px_rgba(253,224,71,0.8)]"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `-10%`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-lg"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-emerald-100 uppercase">Live Community Marketplace</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl"
          >
            The Organic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-brand-lightGreen filter drop-shadow-sm">Marketplace</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="text-xl text-emerald-50/90 max-w-2xl mx-auto font-medium leading-relaxed mb-10 drop-shadow-md"
          >
            A verified platform to exchange egg shells, coffee grounds, compost and more. Turn your waste into worth.
          </motion.p>
          
          <motion.button 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            onClick={() => user ? setShowModal(true) : alert('Please log in.')}
            className="bg-gradient-to-r from-white to-emerald-50 text-[#1b4332] px-8 py-4 rounded-full font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center mx-auto space-x-2 border border-white/50 backdrop-blur-sm"
          >
            <Plus className="h-6 w-6" />
            <span>Create Listing / Request</span>
          </motion.button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 mb-10 inline-flex">
          {['Available', 'Requested'].map((tab) => (
            <button 
              key={tab}
              className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'text-[#1b4332]' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <motion.div layoutId="tabMarker" className="absolute inset-0 bg-brand-lightGreen/20 rounded-xl z-0 border border-brand-green/20"></motion.div>
              )}
              <span className="relative z-10">{tab === 'Available' ? 'Marketplace (Selling)' : 'Open Requests (Buying)'}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b4332]"></div></div>
        ) : (
          <motion.div layout className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {filteredItems.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                  <Leaf className="h-16 w-16 text-gray-200 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No active {activeTab.toLowerCase()} listings.</h3>
                  <p className="text-gray-500 max-w-sm">Listings must be approved by an Admin before they appear in the public marketplace.</p>
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map(item => (
                    <MarketplaceCard 
                      key={item._id} 
                      item={item} 
                      currentUser={user} 
                      onAccept={handleAccept} 
                      onInitiateFulfill={handleInitiateFulfill}
                      onApproveOffer={handleApproveOffer}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-[2rem]">
                <h3 className="text-2xl font-black text-gray-900">Post to Marketplace</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full shadow-sm"><XCircle className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleModalSubmit} className="p-8 space-y-6">
                
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.type === 'Available' ? 'border-brand-green bg-brand-lightGreen/10' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'Available'} onChange={() => setFormData({...formData, type: 'Available'})} />
                    <div className="font-bold text-gray-900">I have this</div>
                    <div className="text-xs text-gray-500 mt-1">(Selling a resource)</div>
                  </label>
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.type === 'Requested' ? 'border-brand-green bg-brand-lightGreen/10' : 'border-gray-100 hover:border-gray-300'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'Requested'} onChange={() => setFormData({...formData, type: 'Requested'})} />
                    <div className="font-bold text-gray-900">I need this</div>
                    <div className="text-xs text-gray-500 mt-1">(Buying a resource)</div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50">
                      <option value="">Select...</option>
                      {['Egg Shells', 'Banana Peels', 'Coffee Grounds', 'Dry Leaves', 'Wood Ash', 'Vegetable Waste', 'Coconut Shell', 'Sugarcane Bagasse', 'Compost', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                    <input required type="text" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 5kg or 2 Bags" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Listing Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Give it a clear title" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{formData.type === 'Available' ? 'Price (₹)' : 'Offer (₹)'}</label>
                    <input required type="number" min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" placeholder="₹" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. MG Road, Kochi" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" placeholder="Add details..."></textarea>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-bold">Important Notice</p>
                    <p>All posts require Admin approval. A 10% platform fee applies to all transactions.</p>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-black text-lg hover:bg-brand-green transition-all shadow-lg hover:shadow-xl mt-4">
                  Submit for Approval
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fulfill Request Modal */}
      <AnimatePresence>
        {showFulfillModal && selectedFulfillItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-brand-darkBlue to-brand-green p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black">Fulfill Request</h3>
                  <p className="text-sm font-medium opacity-90 mt-1">Offer your product to the buyer</p>
                </div>
                <button onClick={() => setShowFulfillModal(false)} className="text-white hover:text-gray-200"><XCircle className="h-6 w-6" /></button>
              </div>
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium">You are fulfilling:</p>
                <p className="font-bold text-gray-900">{selectedFulfillItem.title}</p>
                <p className="text-sm text-brand-green font-bold mt-1">Reward: ₹{selectedFulfillItem.amount}</p>
              </div>
              <form onSubmit={handleFulfillSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image or PDF of your product</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-brand-green transition-colors bg-white flex flex-col items-center justify-center cursor-pointer group">
                    <input 
                      required 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={e => setFulfillData({...fulfillData, file: e.target.files[0]})} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-brand-green mb-2 transition-colors" />
                    <p className="text-sm font-medium text-gray-600">
                      {fulfillData.file ? fulfillData.file.name : "Click or drag file to upload"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or PDF up to 5MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
                  <input 
                    required 
                    type="text" 
                    value={fulfillData.offeredLocation} 
                    onChange={e => setFulfillData({...fulfillData, offeredLocation: e.target.value})} 
                    placeholder="e.g. 123 Main St, Kochi" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1b4332] bg-gray-50" 
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-start space-x-2 mt-4">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    This offer will be sent to the buyer. Once they approve the image and location, the funds will be transferred to your wallet.
                  </p>
                </div>
                <button type="submit" className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-black text-lg hover:bg-brand-green transition-all shadow-lg mt-2">
                  Submit Offer
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganicExchange;
