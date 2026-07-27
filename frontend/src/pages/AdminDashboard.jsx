import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Activity, UserCog, Check, X, Map as MapIcon, Navigation, Leaf, Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { formatDistanceToNow } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
const binIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userMapIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('users'); // Default to users instead of overview
  const [users, setUsers] = useState([]);
  const [bins, setBins] = useState([]);
  const [exchangeItems, setExchangeItems] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingExchange, setLoadingExchange] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedUserId, setExpandedUserId] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/users', config);
      setUsers(res.data);
    } catch (err) {
      setMessage({ text: 'Failed to fetch users', type: 'error' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBins = async () => {
    try {
      const { data } = await api.get('/bins');
      setBins(data);
    } catch (err) {
      console.error('Failed to fetch bins');
    }
  };

  const fetchExchangeItems = async () => {
    setLoadingExchange(true);
    try {
      const { data } = await api.get('/exchange');
      setExchangeItems(data);
    } catch (err) {
      setMessage({ text: 'Failed to fetch exchange items', type: 'error' });
    } finally {
      setLoadingExchange(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'map') {
      fetchUsers();
      fetchBins();
    } else if (activeTab === 'exchange') {
      fetchExchangeItems();
    }
  }, [activeTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setMessage({ text: 'User role updated successfully!', type: 'success' });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to update role', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleAcceptExchangeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/exchange/${itemId}/accept`, {}, config);
      setMessage({ text: 'Item marked as accepted!', type: 'success' });
      setExchangeItems(exchangeItems.map(item => item._id === itemId ? { ...item, status: 'Accepted' } : item));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to accept item', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to safely parse user location
  const parseUserLocation = (addressStr) => {
    if (!addressStr) return null;
    const match = addressStr.match(/\[(.*?)\]/);
    if (match && match[1]) {
      const coords = match[1].split(',').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return [coords[0], coords[1]];
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-[#3f4d67] text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#353c48]">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center p-1">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider">KuPPA Admin</span>
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center space-x-3">
          <div className="h-10 w-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{user?.name}</p>
            <p className="text-xs text-brand-lightGreen">Administrator</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <p className="px-6 text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Navigation</p>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-brand-green text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Users className="h-4 w-4 mr-3" /> User Management
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'map' ? 'bg-brand-green text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <MapIcon className="h-4 w-4 mr-3" /> Master Logistics Map
            </button>
            <button 
              onClick={() => setActiveTab('exchange')}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'exchange' ? 'bg-brand-green text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Leaf className="h-4 w-4 mr-3" /> Organic Exchange
            </button>
            
            <p className="px-6 text-[10px] font-bold text-white/40 uppercase tracking-wider mt-6 mb-2">System</p>
            
            <button 
              className="w-full flex items-center px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Activity className="h-4 w-4 mr-3" /> Analytics & Reports
            </button>
            <button 
              className="w-full flex items-center px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <UserCog className="h-4 w-4 mr-3" /> System Settings
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-brand-green transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition-all w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-brand-green transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={handleLogout}>
              <span className="text-sm font-medium text-gray-600 group-hover:text-red-500 transition-colors">Logout</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f7fa]">
          
          {/* Breadcrumb / Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === 'users' ? 'User Management' : activeTab === 'map' ? 'Master Logistics Map' : 'Organic Exchange Platform'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Dashboard / {activeTab === 'users' ? 'Users' : activeTab === 'map' ? 'Map' : 'Exchange'}</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-lg font-bold text-gray-800">System Users</h3>
                <button className="bg-brand-green hover:bg-brand-darkBlue text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
                  + Add User
                </button>
              </div>
              
              <div className="overflow-x-auto">
                {loadingUsers ? (
                  <div className="p-12 text-center text-gray-500 font-medium">Loading users...</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">User / Contact</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-center">Wallet (₹)</th>
                        <th className="p-4 text-center">Disposals (kg)</th>
                        <th className="p-4 text-center">Eco Points</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.filter(u => u.role !== 'Admin').map((u) => (
                        <React.Fragment key={u._id}>
                          <tr 
                            className={`transition-colors cursor-pointer ${expandedUserId === u._id ? 'bg-brand-lightGreen/10' : 'hover:bg-gray-50'}`}
                            onClick={() => setExpandedUserId(expandedUserId === u._id ? null : u._id)}
                          >
                            <td className="p-4 pl-6">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                u.role === 'Staff' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 text-center font-black text-brand-darkBlue text-sm">₹{u.walletBalance}</td>
                            <td className="p-4 text-center font-bold text-gray-700 text-sm">{u.totalDisposals}</td>
                            <td className="p-4 text-center">
                              <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded font-bold text-xs flex items-center justify-center w-fit mx-auto">
                                <Leaf className="h-3 w-3 mr-1 text-brand-green" /> {u.ecoPoints}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="block w-full pl-3 pr-8 py-1.5 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green rounded bg-white shadow-sm"
                              >
                                <option value="User">User</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                          
                          {/* Deep Dive Panel */}
                          {expandedUserId === u._id && (
                            <tr>
                              <td colSpan="6" className="p-0 border-b border-gray-200">
                                <div className="bg-[#3f4d67] p-6 shadow-inner text-white">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* User Info & RFID */}
                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                      <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Hardware Integration</h4>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium">RFID Card Status</span>
                                        <span className="bg-[#1de9b6]/20 text-[#1de9b6] text-xs px-2 py-1 rounded font-bold flex items-center border border-[#1de9b6]/30">
                                          <Check className="h-3 w-3 mr-1" /> Active
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Card Hex ID</span>
                                        <span className="font-mono text-xs text-white/70 bg-black/20 px-2 py-1 rounded border border-white/5">{u._id.substring(0, 12).toUpperCase()}</span>
                                      </div>
                                    </div>

                                    {/* Transaction Ledger */}
                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 col-span-1 md:col-span-2">
                                      <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Activity Ledger</h4>
                                      <div className="space-y-3">
                                        {u.transactions?.map((tx, idx) => (
                                          <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                            <div>
                                              <p className="font-semibold text-white">{tx.desc}</p>
                                              <p className="text-xs text-white/40 mt-0.5">{tx.date}</p>
                                            </div>
                                            <span className={`font-black ${tx.type === 'recharge' ? 'text-[#1de9b6]' : tx.type === 'booking' ? 'text-blue-400' : 'text-red-400'}`}>
                                              {tx.type === 'booking' ? '---' : tx.type === 'recharge' ? '+' : '-'}
                                              {tx.type !== 'booking' && `₹${tx.amount}`}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mt-5 pt-4 border-t border-white/10 flex justify-end space-x-3">
                                        <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded text-xs transition-colors border border-red-500/20">
                                          - Debit Wallet
                                        </button>
                                        <button className="bg-[#1de9b6]/10 hover:bg-[#1de9b6]/20 text-[#1de9b6] font-bold px-4 py-2 rounded text-xs transition-colors border border-[#1de9b6]/20">
                                          + Credit Wallet
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in flex flex-col h-[600px]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <MapIcon className="h-5 w-5 text-brand-green mr-2" /> Live Logistics Map
                </h3>
                <div className="flex space-x-3">
                  <div className="flex items-center space-x-2 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    <span className="font-semibold text-gray-700">{bins.length} Active Bins</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                    <span className="font-semibold text-gray-700">{users.filter(u=>parseUserLocation(u.address)).length} User Facilities</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-grow w-full relative z-0">
                <MapContainer 
                  center={[10.8505, 76.2711]} 
                  zoom={7} 
                  scrollWheelZoom={true} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Render Smart Bins */}
                  {bins.map(bin => (
                    <Marker 
                      key={bin._id} 
                      position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
                      icon={binIcon}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-bold text-gray-900 mb-1">{bin.name}</h3>
                          <p className="text-xs text-gray-500 mb-2 font-medium">Smart Bin • {bin.district}</p>
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-bold text-gray-700">Fill Level: <span className={bin.fillLevel > 90 ? 'text-red-500' : 'text-brand-green'}>{bin.fillLevel}%</span></p>
                            <p className="text-xs font-medium text-gray-500 mt-1">Battery: {bin.batteryLevel}%</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Render Registered Users/Facilities */}
                  {users.map(u => {
                    const loc = parseUserLocation(u.address);
                    if (loc) {
                      return (
                        <Marker key={u._id} position={loc} icon={userMapIcon}>
                          <Popup>
                            <div className="p-1">
                              <h3 className="font-bold text-brand-darkBlue mb-1">{u.name}</h3>
                              <p className="text-xs font-medium text-gray-500 capitalize">{u.role} Account</p>
                              <p className="text-xs text-gray-400 mt-1">{u.phone}</p>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </div>
            </div>
          )}

          {/* EXCHANGE TAB */}
          {activeTab === 'exchange' && (
            <div className="space-y-6 fade-in">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Listings</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{exchangeItems.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-brand-green" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Available Resources</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{exchangeItems.filter(i => i.type === 'Available').length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Requested Resources</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{exchangeItems.filter(i => i.type === 'Requested').length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <Search className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Main Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <Leaf className="h-5 w-5 text-brand-green mr-2" /> Organic Resource Listings
                  </h3>
                  <button className="text-sm font-semibold text-brand-green bg-brand-green/10 px-4 py-2 rounded-lg hover:bg-brand-green/20 transition-colors">
                    Export Data
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  {loadingExchange ? (
                    <div className="p-12 text-center">
                      <div className="inline-block animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mb-4"></div>
                      <p className="text-gray-500 font-medium">Loading items...</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b-2 border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="p-5 pl-6">Listing Details</th>
                          <th className="p-5 text-center">Amount (₹)</th>
                          <th className="p-5 text-center">Status/Type</th>
                          <th className="p-5">Posted By</th>
                          <th className="p-5 text-center">Date</th>
                          <th className="p-5 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {exchangeItems.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="p-5 pl-6">
                              <p className="font-extrabold text-gray-900 text-sm group-hover:text-brand-green transition-colors">{item.title}</p>
                              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                {item.category}
                              </span>
                              <p className="text-xs text-gray-500 mt-1.5 truncate max-w-xs">{item.description}</p>
                            </td>
                            <td className="p-5 text-center">
                              {item.amount > 0 ? (
                                <span className="font-bold text-gray-700">₹{item.amount}</span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="p-5 text-center">
                              {item.status === 'Accepted' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border bg-gray-100 text-gray-600 border-gray-200 shadow-sm">
                                  COMPLETED
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${item.type === 'Available' ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full mr-2 ${item.type === 'Available' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                  {item.type}
                                </span>
                              )}
                            </td>
                            <td className="p-5">
                              <div className="flex items-center space-x-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-darkBlue to-brand-green flex items-center justify-center text-white text-xs font-bold shadow-md">
                                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                  <span className="block text-sm font-bold text-gray-800">{item.user?.name || 'Unknown User'}</span>
                                  <span className="block text-[10px] text-gray-400 font-medium">Verified Member</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-center text-sm font-medium text-gray-500">
                              {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : 'N/A'}
                            </td>
                            <td className="p-5 pr-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {item.status !== 'Accepted' && (
                                  <button 
                                    onClick={() => handleAcceptExchangeItem(item._id)}
                                    className="text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors" 
                                    title="Accept Listing"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                <button className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete Listing">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {!loadingExchange && exchangeItems.length === 0 && (
                    <div className="p-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <Leaf className="h-8 w-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Listings Yet</h3>
                      <p className="text-sm text-gray-500">The community hasn't posted any organic resources.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
