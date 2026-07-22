import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Activity, UserCog, Check, X, Map as MapIcon, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import axios from 'axios';

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
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'map'
  const [users, setUsers] = useState([]);
  const [bins, setBins] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setMessage({ text: 'Failed to fetch users', type: 'error' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBins = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/bins', config);
      setBins(res.data);
    } catch (err) {
      console.error('Failed to fetch bins');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'map') {
      fetchUsers();
      fetchBins();
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
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Control Center</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2 text-brand-darkBlue">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">You have full administrative access to the KuPPA platform.</p>
          </div>
          {activeTab !== 'overview' && (
            <button 
              onClick={() => setActiveTab('overview')}
              className="text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Back to Overview</span>
            </button>
          )}
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
            <div 
              onClick={() => setActiveTab('users')}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-brand-green/30 transition-all transform hover:-translate-y-1"
            >
              <Users className="h-10 w-10 text-brand-green mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">Manage Users & Staff</h3>
            </div>
            <div 
              onClick={() => setActiveTab('map')}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-brand-green/30 transition-all transform hover:-translate-y-1"
            >
              <MapIcon className="h-10 w-10 text-brand-green mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">Smart Bins Master Map</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
              <Activity className="h-10 w-10 text-brand-green mb-3" />
              <h3 className="font-semibold text-lg text-gray-800">System Analytics</h3>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <UserCog className="h-6 w-6 text-brand-green" />
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="p-12 text-center text-gray-500 font-medium">Loading users...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.filter(u => u.role !== 'Admin').map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-gray-900">{u.name}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4 text-gray-600">{u.phone}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'Staff' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          {u.email !== user.email ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green rounded-lg bg-white"
                            >
                              <option value="User">User</option>
                              <option value="Staff">Staff</option>
                              <option value="Admin">Admin</option>
                            </select>
                          ) : (
                            <span className="text-xs font-medium text-gray-400 italic">Current User</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden fade-in flex flex-col h-[700px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-darkBlue text-white">
              <div className="flex items-center space-x-2">
                <MapIcon className="h-6 w-6 text-brand-lightGreen" />
                <h3 className="text-xl font-bold">Master Logistics Map</h3>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  <span className="font-semibold">{bins.length} Active Bins</span>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                  <span className="font-semibold">{users.filter(u=>parseUserLocation(u.address)).length} User Facilities</span>
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

      </div>
    </div>
  );
};

export default AdminDashboard;
