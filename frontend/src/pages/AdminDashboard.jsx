import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Activity, UserCog, Check, X, Map as MapIcon, Navigation, Leaf, Search, Bell, Menu, ChevronDown, CreditCard, TrendingUp, DollarSign, Filter, MoreVertical, LogOut, LayoutDashboard, Clock, Briefcase, CalendarRange, AlertTriangle, Route, UserCheck, ShieldAlert, IndianRupee, Ghost, Sparkles, Thermometer, Droplets } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { formatDistanceToNow, format } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

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
  
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [bins, setBins] = useState([]);
  const [exchangeItems, setExchangeItems] = useState([]);
  const [rfidRequests, setRfidRequests] = useState([]);
  
  // Field Staff & Ops State
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingExchange, setLoadingExchange] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedUserId, setExpandedUserId] = useState(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);

  // AI Prediction State
  const [aiPrediction, setAiPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [aiParams, setAiParams] = useState({
    temperature: 27,
    humidity: 65,
    hourOfDay: 9,
    isWeekend: false,
    previousFillLevel: 40
  });

  // Assign Route state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pendingDispatchBin, setPendingDispatchBin] = useState(null);
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState('');

  const fullBinsCount = bins.filter(b => b.fillLevel >= 80 || b.status === 'Full').length;
  const criticalOverflowCount = bins.filter(b => b.fillLevel >= 100).length;

  // Fetch Data Functions
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
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
      showMessage('Failed to fetch exchange items', 'error');
    } finally {
      setLoadingExchange(false);
    }
  };

  const fetchRFIDRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/users/rfid-requests', config);
      setRfidRequests(res.data);
    } catch (err) {
      showMessage('Failed to fetch RFID requests', 'error');
    }
  };

  const fetchStaffOps = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [assignRes, leavesRes, reportsRes, payrollRes] = await Promise.all([
        api.get('/staff-ops/assignments', config),
        api.get('/staff-ops/leaves', config),
        api.get('/staff-ops/reports', config),
        api.get('/staff-ops/payroll', config)
      ]);
      
      setAssignments(assignRes.data);
      setLeaveRequests(leavesRes.data);
      setReportedIssues(reportsRes.data);
      setPayrollData(payrollRes.data);
    } catch (err) {
      console.error('Failed to fetch staff ops data', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBins();
    fetchExchangeItems();
    fetchRFIDRequests();
    fetchStaffOps();
  }, []);

  // Global Alert Audio Effect for Overflowing Bins (>= 100%)
  useEffect(() => {
    const criticalBins = bins.filter(b => b.fillLevel >= 100);
    
    if (criticalBins.length > 0) {
      // Use browser's Text-to-Speech API for the instruction
      const speakAlert = () => {
        if ('speechSynthesis' in window) {
          // Get the names of the critical bins
          const binNames = criticalBins.map(b => b.name).join(' and ');
          
          const msg = new SpeechSynthesisUtterance(`Alert. The bin at ${binNames} is full. Please take the waste immediately.`);
          msg.rate = 0.9;
          msg.pitch = 1.2;
          window.speechSynthesis.speak(msg);
        }
      };
      
      // Delay slightly to ensure user interaction has occurred
      setTimeout(speakAlert, 2000);
    }
  }, [bins]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      showMessage('User role updated successfully!', 'success');
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      showMessage('Failed to update role', 'error');
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/exchange/${itemId}/status`, { status: newStatus }, config);
      showMessage(`Item marked as ${newStatus}!`, 'success');
      setExchangeItems(exchangeItems.map(item => item._id === itemId ? { ...item, status: newStatus } : item));
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update item status', 'error');
    }
  };

  const handleApproveRFID = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.post(`/users/approve-rfid/${userId}`, {}, config);
      showMessage(`RFID Approved! Card: ${res.data.rfidNumber}`, 'success');
      setRfidRequests(rfidRequests.filter(req => req._id !== userId));
    } catch (err) {
      showMessage('Failed to approve RFID', 'error');
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/staff-ops/leaves/${id}`, { status }, config);
      showMessage(`Leave ${status}`, 'success');
      fetchStaffOps(); // Refresh
    } catch (err) {
      showMessage('Failed to update leave', 'error');
    }
  };

  const handleResolveIssue = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/staff-ops/reports/${id}/resolve`, {}, config);
      showMessage('Issue resolved', 'success');
      fetchStaffOps(); // Refresh
    } catch (err) {
      showMessage('Failed to resolve issue', 'error');
    }
  };

  const handleProcessPayroll = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/staff-ops/payroll/${id}/pay`, {}, config);
      showMessage('Payment processed successfully!', 'success');
      setPayrollData(payrollData.map(p => p._id === id ? { ...p, status: 'Paid', paidAt: new Date().toISOString() } : p));
    } catch (err) {
      showMessage('Failed to process payment.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateAssignment = async () => {
    if (!selectedStaffForAssign || !pendingDispatchBin) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.post('/staff-ops/assignments', {
        staffId: selectedStaffForAssign,
        zone: `Clear Bin: ${pendingDispatchBin.name}`,
        totalStops: 1
      }, config);
      
      showMessage(`Task assigned to staff successfully!`, 'success');
      setShowAssignModal(false);
      setPendingDispatchBin(null);
      setSelectedStaffForAssign('');
      fetchStaffOps(); // refresh assignments list
    } catch (err) {
      showMessage('Failed to assign task.', 'error');
    }
  };

  const runAiPrediction = async () => {
    setPredicting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await api.post('/ai/predict', aiParams, config);
      
      // Simulate network delay for "AI thinking" effect
      setTimeout(() => {
        setAiPrediction(data);
        setPredicting(false);
      }, 1500);
    } catch (err) {
      showMessage('Failed to run AI prediction', 'error');
      setPredicting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Staff': return 'bg-blue-100 text-blue-700';
      case 'User': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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

  // Derived Analytics Data
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole && u.role !== 'Admin';
    });
  }, [users, searchTerm, roleFilter]);

  const totalRevenue = useMemo(() => exchangeItems.reduce((acc, item) => acc + (item.platformCommission || 0), 0), [exchangeItems]);
  const totalDisposals = useMemo(() => users.reduce((acc, u) => acc + (u.totalDisposals || 0), 0), [users]);

  // Mock Chart Data derived from users
  const chartData = [
    { name: 'Mon', users: 12, exchanges: 4, revenue: 120 },
    { name: 'Tue', users: 19, exchanges: 8, revenue: 210 },
    { name: 'Wed', users: 15, exchanges: 12, revenue: 350 },
    { name: 'Thu', users: 22, exchanges: 7, revenue: 190 },
    { name: 'Fri', users: 30, exchanges: 15, revenue: 420 },
    { name: 'Sat', users: 35, exchanges: 20, revenue: 580 },
    { name: 'Sun', users: users.length || 40, exchanges: exchangeItems.length || 25, revenue: totalRevenue || 650 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fc] font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-[#0f172a] text-gray-300 flex flex-col shadow-2xl z-20 transition-all duration-300">
        <div className="h-20 flex items-center px-6 border-b border-gray-800 bg-[#0f172a]">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 bg-gradient-to-br from-brand-green to-emerald-600 rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-brand-green/20">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain filter brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide leading-none">KuPPA</h1>
              <p className="text-[10px] text-brand-green font-bold tracking-widest uppercase mt-1">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <p className="px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Dashboards</p>
          
          <nav className="space-y-1 px-3">
            <NavItem 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Overview" 
            />
            <NavItem 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={<Users className="h-5 w-5" />} 
              label="User Management" 
            />
            <NavItem 
              active={activeTab === 'map'} 
              onClick={() => setActiveTab('map')} 
              icon={<MapIcon className="h-5 w-5" />} 
              label="Logistics Map" 
            />
            <NavItem 
              active={activeTab === 'exchange'} 
              onClick={() => setActiveTab('exchange')} 
              icon={<Leaf className="h-5 w-5" />} 
              label="Organic Exchange" 
            />
            <NavItem 
              active={activeTab === 'full-bins'} 
              onClick={() => setActiveTab('full-bins')} 
              icon={<Trash2 className="h-5 w-5" />} 
              label="Full Bins" 
              badge={fullBinsCount}
              isAlert={true}
            />
            <NavItem 
              active={activeTab === 'unused-bins'} 
              onClick={() => setActiveTab('unused-bins')} 
              icon={<Ghost className="h-5 w-5" />} 
              label="Unused Bins" 
              badge={bins.filter(b => b.fillLevel <= 10).length || 0}
            />
            
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-3">Intelligence</p>
            <NavItem 
              active={activeTab === 'ai-forecast'} 
              onClick={() => setActiveTab('ai-forecast')} 
              icon={<Sparkles className="h-5 w-5" />} 
              label="AI Fill Forecast" 
            />

            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-3">Operations</p><NavItem 
              active={activeTab === 'rfid'} 
              onClick={() => setActiveTab('rfid')} 
              icon={<CreditCard className="h-5 w-5" />} 
              label="RFID Requests" 
              badge={rfidRequests.length}
            />
            <NavItem 
              active={activeTab === 'staff-ops'} 
              onClick={() => setActiveTab('staff-ops')} 
              icon={<Route className="h-5 w-5" />} 
              label="Route Assignments" 
            />
            <NavItem 
              active={activeTab === 'leave-requests'} 
              onClick={() => setActiveTab('leave-requests')} 
              icon={<UserCheck className="h-5 w-5" />} 
              label="Leave Requests" 
              badge={leaveRequests.filter(l => l.status === 'Pending').length || 0}
            />
            <NavItem 
              active={activeTab === 'bin-issues'} 
              onClick={() => setActiveTab('bin-issues')} 
              icon={<ShieldAlert className="h-5 w-5" />} 
              label="Bin Issues" 
              badge={reportedIssues.filter(i => i.status === 'Open').length || 0}
            />
            <NavItem 
              active={activeTab === 'payroll'} 
              onClick={() => setActiveTab('payroll')} 
              icon={<IndianRupee className="h-5 w-5" />} 
              label="Salary & Payroll" 
              badge={payrollData.filter(p => p.status === 'Pending').length || 0}
            />
            
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-3">System</p>
            
            <NavItem 
              icon={<Activity className="h-5 w-5" />} 
              label="Analytics & Reports" 
            />
            <NavItem 
              icon={<UserCog className="h-5 w-5" />} 
              label="System Settings" 
            />
          </nav>
        </div>
        
        {/* User Profile Mini */}
        <div className="p-4 border-t border-gray-800 bg-[#0f172a]/80">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors" onClick={() => navigate('/wallet')}>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-gradient-to-tr from-brand-darkBlue to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-gray-800">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-white truncate w-28">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
              </div>
            </div>
            <LogOut className="h-4 w-4 text-gray-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); handleLogout(); }} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center">
            <h2 className="text-2xl font-black text-gray-800 capitalize tracking-tight">
              {activeTab === 'rfid' ? 'RFID Requests' : activeTab.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-brand-green transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-11 pr-4 py-2.5 bg-gray-100/50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all w-72 font-medium text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <button 
              className="relative p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-full transition-all"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {rfidRequests.length > 0 ? rfidRequests.length : 1}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute top-20 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h4 className="font-bold text-gray-800">Notifications</h4>
                  <button className="text-xs text-brand-green font-semibold">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {rfidRequests.slice(0,3).map(req => (
                    <div key={req._id} className="p-4 border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer flex gap-3">
                      <div className="mt-1"><div className="h-2 w-2 rounded-full bg-brand-green"></div></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">New RFID Request from {req.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(req.createdAt), {addSuffix: true})}</p>
                      </div>
                    </div>
                  ))}
                  {rfidRequests.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* CRITICAL GLOBAL ALERT */}
        {fullBinsCount > 0 && (
          <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between animate-pulse cursor-pointer shadow-md z-10" onClick={() => setActiveTab('full-bins')}>
            <div className="flex items-center font-bold">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>SLA ALERT: {fullBinsCount} bin{fullBinsCount > 1 ? 's are' : ' is'} critically full or overflowing! Immediate dispatch required.</span>
            </div>
            <button className="text-xs font-black uppercase tracking-widest bg-white text-red-600 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors">
              View Bins
            </button>
          </div>
        )}

        {/* ALERTS */}
        {message.text && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
            <div className={`px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-xl backdrop-blur-md border ${message.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-600' : 'bg-red-500/90 text-white border-red-600'}`}>
              {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <span className="font-bold text-sm tracking-wide">{message.text}</span>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Users" 
                  value={users.length} 
                  trend="+12%" 
                  icon={<Users className="h-6 w-6 text-indigo-600" />} 
                  color="bg-indigo-50" 
                />
                <StatCard 
                  title="Platform Revenue" 
                  value={`₹${totalRevenue.toFixed(0)}`} 
                  trend="+8.5%" 
                  icon={<DollarSign className="h-6 w-6 text-emerald-600" />} 
                  color="bg-emerald-50" 
                />
                <StatCard 
                  title="Waste Processed" 
                  value={`${totalDisposals} kg`} 
                  trend="+24%" 
                  icon={<Trash2 className="h-6 w-6 text-brand-green" />} 
                  color="bg-brand-lightGreen/20" 
                />
                <StatCard 
                  title="Active Listings" 
                  value={exchangeItems.filter(i=>i.status==='Pending' || i.status==='Open').length} 
                  trend="New" 
                  icon={<Leaf className="h-6 w-6 text-amber-600" />} 
                  color="bg-amber-50" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Platform Activity Overview</h3>
                      <p className="text-xs text-gray-500 font-medium">User growth vs Exchange volume</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green/20">
                      <option>Last 7 Days</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <RechartsTooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                          cursor={{stroke: '#f3f4f6', strokeWidth: 2}}
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                        <Line type="monotone" dataKey="users" name="Active Users" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="exchanges" name="Exchanges" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                    {/* Mock Activity Feed based on real data length */}
                    <ActivityItem 
                      icon={<Users className="h-4 w-4 text-indigo-600" />} 
                      color="bg-indigo-50"
                      title="New users registered"
                      desc={`${users.length} users joined recently`}
                      time="Just now"
                    />
                    <ActivityItem 
                      icon={<Leaf className="h-4 w-4 text-emerald-600" />} 
                      color="bg-emerald-50"
                      title="New Exchange Listing"
                      desc={exchangeItems[0]?.title || "Organic Compost Pack"}
                      time="2 hours ago"
                    />
                    <ActivityItem 
                      icon={<CreditCard className="h-4 w-4 text-amber-600" />} 
                      color="bg-amber-50"
                      title="RFID Request Pending"
                      desc={`${rfidRequests.length} requests await approval`}
                      time="5 hours ago"
                    />
                    <ActivityItem 
                      icon={<DollarSign className="h-4 w-4 text-brand-green" />} 
                      color="bg-brand-lightGreen/20"
                      title="Wallet Top-up"
                      desc="₹500 added by John Doe"
                      time="1 day ago"
                    />
                  </div>
                  <button className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold rounded-xl transition-colors">
                    View All Logs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-full">
              
              {/* Header & Filters */}
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green w-64 transition-all font-medium"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/20 cursor-pointer"
                    >
                      <option value="All">All Roles</option>
                      <option value="User">Standard User</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>
                
                <button className="bg-brand-darkBlue hover:bg-[#0f172a] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center">
                  <Users className="h-4 w-4 mr-2" /> Add New User
                </button>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto flex-1">
                {loadingUsers ? (
                  <div className="p-20 text-center flex flex-col items-center justify-center">
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading user database...</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr className="text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                        <th className="p-4 pl-8">User Profile</th>
                        <th className="p-4">Access Level</th>
                        <th className="p-4 text-center">Wallet Balance</th>
                        <th className="p-4 text-center">Engagement</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 pr-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-medium">No users found matching your criteria.</td></tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <React.Fragment key={u._id}>
                            <tr 
                              className={`transition-all duration-200 cursor-pointer ${expandedUserId === u._id ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                              onClick={() => setExpandedUserId(expandedUserId === u._id ? null : u._id)}
                            >
                              <td className="p-4 pl-8">
                                <div className="flex items-center space-x-4">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                                    u.role === 'Staff' ? 'bg-indigo-500' : 'bg-brand-green'
                                  }`}>
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-black ${
                                  u.role === 'Staff' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 text-center font-black text-brand-darkBlue text-sm">
                                ₹{u.walletBalance?.toFixed(2) || '0.00'}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="font-bold text-gray-800 text-sm">{u.totalDisposals || 0} kg</span>
                                  <span className="text-[10px] text-brand-green font-bold flex items-center mt-0.5">
                                    <Leaf className="h-3 w-3 mr-0.5" /> {u.ecoPoints || 0} pts
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                  <span>Active</span>
                                </span>
                              </td>
                              <td className="p-4 pr-8 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end space-x-3">
                                  <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    className="block pl-3 pr-8 py-1.5 text-[11px] font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green rounded-lg bg-white shadow-sm cursor-pointer"
                                  >
                                    <option value="User">Set User</option>
                                    <option value="Staff">Set Staff</option>
                                  </select>
                                  <button className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-md hover:bg-gray-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            {/* Deep Dive Panel (Expandable) */}
                            {expandedUserId === u._id && (
                              <tr className="bg-gray-50/50">
                                <td colSpan="6" className="p-6 border-b border-gray-100">
                                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-8 animate-fade-in-up">
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
                                      <div className="space-y-3">
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                          <span className="text-sm font-medium text-gray-500">Phone</span>
                                          <span className="text-sm font-bold text-gray-800">{u.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                          <span className="text-sm font-medium text-gray-500">Address</span>
                                          <span className="text-sm font-bold text-gray-800 text-right max-w-[200px] truncate">{u.address || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between pt-1">
                                          <span className="text-sm font-medium text-gray-500">RFID Status</span>
                                          <span className="text-sm font-bold text-brand-green">{u.rfidStatus || 'Not Requested'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-px bg-gray-100"></div>
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                                      <div className="grid grid-cols-2 gap-3">
                                        <button className="flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold py-2 rounded-xl text-sm transition-colors">
                                          <DollarSign className="h-4 w-4" /> <span>Credit Funds</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold py-2 rounded-xl text-sm transition-colors">
                                          <Activity className="h-4 w-4" /> <span>Suspend</span>
                                        </button>
                                        <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2 rounded-xl text-sm transition-colors col-span-2">
                                          <Clock className="h-4 w-4" /> <span>View Full Transaction History</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* RFID REQUESTS TAB */}
          {activeTab === 'rfid' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in min-h-[500px]">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-xl font-black text-gray-900">RFID Card Provisioning</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Review and approve physical smart card requests.</p>
                </div>
                <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-sm font-black border border-amber-200 shadow-sm">
                  {rfidRequests.length} Pending Approvals
                </div>
              </div>
              
              {rfidRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                  <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <CreditCard className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">You're all caught up!</h3>
                  <p className="text-gray-500 font-medium">There are no pending RFID card requests at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-gray-50/50">
                  {rfidRequests.map((req) => (
                    <div key={req._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                      
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-green to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                          {req.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-lg leading-tight">{req.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{req.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                          <span className="text-sm font-bold text-gray-800">{req.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Delivery</span>
                          <span className="text-xs font-bold text-gray-700 text-right max-w-[150px]">{req.address || 'Address missing'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</span>
                          <span className="text-xs font-bold text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleApproveRFID(req._id)}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center group-hover:bg-brand-green group-hover:shadow-brand-green/30"
                      >
                        <CreditCard className="h-4 w-4 mr-2" /> Approve & Generate ID
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ROUTE ASSIGNMENTS TAB */}
          {activeTab === 'staff-ops' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-green to-brand-darkBlue p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Briefcase className="h-20 w-20" /></div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-green-100 mb-1">Active Field Staff</h4>
                  <p className="text-4xl font-black">{assignments.length}</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Daily Assignments */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 flex items-center"><Route className="h-5 w-5 mr-2 text-brand-green"/> Daily Route Assignments</h3>
                    <button onClick={() => {setPendingDispatchBin({name: 'General Route'}); setShowAssignModal(true);}} className="text-xs font-bold text-brand-green bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 hover:bg-brand-green hover:text-white transition-colors">Assign New</button>
                  </div>

                  {/* ASSIGNMENT MODAL / INLINE FORM */}
                  {showAssignModal && pendingDispatchBin && (
                    <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-brand-green mb-6 animate-fade-in-down">
                      <h4 className="font-black text-gray-900 mb-2">Assign Task to Staff</h4>
                      <p className="text-sm font-bold text-brand-green bg-green-50 px-3 py-2 rounded-lg border border-green-100 mb-4">
                        Task: Clear {pendingDispatchBin.name}
                      </p>
                      <div className="flex flex-col md:flex-row gap-3">
                        <select 
                          className="flex-1 bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-green"
                          value={selectedStaffForAssign}
                          onChange={(e) => setSelectedStaffForAssign(e.target.value)}
                        >
                          <option value="">Select Field Staff...</option>
                          {users.filter(u => u.role === 'Staff').map(staff => (
                            <option key={staff._id} value={staff._id}>{staff.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={handleCreateAssignment}
                          disabled={!selectedStaffForAssign}
                          className="bg-brand-green hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50"
                        >
                          Confirm Dispatch
                        </button>
                        <button 
                          onClick={() => { setShowAssignModal(false); setPendingDispatchBin(null); }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map(assign => (
                      <div key={assign._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center font-black text-xl">
                            {assign.staffId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{assign.staffId?.name || 'Unknown'}</p>
                            <p className="text-xs font-bold text-gray-500 max-w-[150px] truncate">{assign.zone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-right">
                          {assign.routeStatus === 'Completed' && assign.proofPhotoUrl && (
                            <div className="hidden sm:block h-10 w-10 rounded-lg overflow-hidden border-2 border-green-100 cursor-pointer group-hover:scale-110 transition-transform">
                              <img src={`http://localhost:5001${assign.proofPhotoUrl}`} className="w-full h-full object-cover" title="View Proof" />
                            </div>
                          )}
                          <div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${assign.routeStatus === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' : assign.routeStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                              {assign.routeStatus === 'Starting' ? 'Urgent Task' : assign.routeStatus}
                            </span>
                            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">{new Date(assign.assignedDate || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEAVE REQUESTS TAB */}
          {activeTab === 'leave-requests' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              {/* Leave Requests */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 h-full">
                <h3 className="text-lg font-black text-gray-900 flex items-center mb-6"><UserCheck className="h-5 w-5 mr-2 text-purple-500"/> Leave Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {leaveRequests.map(leave => (
                        <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-gray-900 flex items-center">{leave.staffId?.name || 'Unknown'} <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{leave.staffId?.role || 'Staff'}</span></p>
                              <p className="text-sm font-medium text-purple-600 mt-1">{leave.type}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${leave.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : leave.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                              {leave.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mb-4 flex items-center"><CalendarRange className="h-3 w-3 mr-1"/> {leave.dateStr}</p>
                          
                          {leave.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleUpdateLeaveStatus(leave._id, 'Approved')}
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold py-2 rounded-lg border border-green-200 transition-colors"
                              >Approve</button>
                              <button 
                                onClick={() => handleUpdateLeaveStatus(leave._id, 'Denied')}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg border border-red-200 transition-colors"
                              >Deny</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
            </div>
          )}

          {/* BIN ISSUES TAB */}
          {activeTab === 'bin-issues' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 h-full">
                <h3 className="text-lg font-black text-gray-900 flex items-center mb-6"><ShieldAlert className="h-5 w-5 mr-2 text-amber-500"/> Field Issues Reported</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportedIssues.map(issue => (
                    <div key={issue._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                      {issue.issueCategory === 'Physical Damage' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                      {issue.issueCategory === 'Sensor Failure' && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>}
                      
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{issue.binId?.name || 'Bin'}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${issue.status === 'Open' || issue.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          {issue.status}
                        </span>
                      </div>
                      
                      <div className="pl-2">
                        <h4 className="font-bold text-gray-900 text-base">{issue.issueCategory}: {issue.description}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1 flex items-center"><MapIcon className="h-3 w-3 mr-1"/> {issue.binLocationName}</p>
                        
                        <div className="mt-4 flex justify-between items-end border-t border-gray-50 pt-3">
                          <p className="text-[10px] text-gray-400 font-bold">Reported by: <span className="text-gray-700">{issue.reportedBy?.name || 'System'}</span></p>
                          {(issue.status === 'Open' || issue.status === 'Pending') && (
                            <button 
                              onClick={() => handleResolveIssue(issue._id)}
                              className="text-xs font-bold text-white bg-brand-darkBlue hover:bg-black px-3 py-1.5 rounded transition-colors shadow-sm"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAYROLL TAB */}
          {activeTab === 'payroll' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-darkBlue to-indigo-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><IndianRupee className="h-20 w-20" /></div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">Total Payroll (Month)</h4>
                  <p className="text-4xl font-black">₹{payrollData.reduce((acc, curr) => acc + curr.netPay, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-gray-400"><TrendingUp className="h-20 w-20" /></div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Bonuses Awarded</h4>
                  <p className="text-4xl font-black text-brand-green">₹{payrollData.reduce((acc, curr) => acc + curr.performanceBonus, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-gray-400"><Clock className="h-20 w-20" /></div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Pending Payments</h4>
                  <p className="text-4xl font-black text-amber-500">{payrollData.filter(p => p.status === 'Pending').length}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-[400px]">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-indigo-500"/> Salary Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="staffId.name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                    <RechartsTooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="baseSalary" name="Base Salary" stackId="a" fill="#1e293b" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="performanceBonus" name="Bonus" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-black text-gray-900">Staff Payroll Data</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Staff Name</th>
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Base Salary</th>
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Bonus</th>
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Deductions</th>
                        <th className="p-5 text-xs font-black text-gray-900 uppercase tracking-widest">Net Pay</th>
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payrollData.map(payroll => (
                        <tr key={payroll._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-black">
                                {payroll.staffId?.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="block text-sm font-bold text-gray-700">{payroll.staffId?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-5 text-sm font-medium text-gray-600">₹{payroll.baseSalary.toLocaleString()}</td>
                          <td className="p-5 text-sm font-medium text-brand-green">+₹{payroll.performanceBonus.toLocaleString()}</td>
                          <td className="p-5 text-sm font-medium text-red-500">-₹{payroll.deductions.toLocaleString()}</td>
                          <td className="p-5 text-sm font-black text-gray-900">₹{payroll.netPay.toLocaleString()}</td>
                          <td className="p-5">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${payroll.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {payroll.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            {payroll.status === 'Pending' ? (
                              <button 
                                onClick={() => handleProcessPayroll(payroll._id)}
                                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                              >
                                Pay Now
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-gray-400">Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* FULL BINS TAB */}
          {activeTab === 'full-bins' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 h-full">
                <h3 className="text-lg font-black text-gray-900 flex items-center mb-6"><Trash2 className="h-5 w-5 mr-2 text-red-500"/> Full & Critical Bins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bins.filter(b => b.fillLevel >= 80 || b.status === 'Full').length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 font-bold">No full bins right now.</div>
                  ) : (
                    bins.filter(b => b.fillLevel >= 80 || b.status === 'Full')
                        .sort((a, b) => b.fillLevel - a.fillLevel)
                        .map(bin => (
                      <div key={bin._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${bin.fillLevel >= 90 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4 pl-3">
                          <div>
                            <h4 className="font-black text-gray-900 text-lg mb-1">{bin.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bin.district}</p>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${bin.fillLevel >= 90 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {bin.fillLevel}% Full
                          </span>
                        </div>
                        
                        <div className="pl-3 space-y-3 mt-4">
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            <Activity className="h-4 w-4 mr-2 text-gray-400"/> Status: <span className="ml-1 text-gray-900 font-bold">{bin.status}</span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400"/> Last Emptied: <span className="ml-1 text-gray-900">{bin.lastEmptied ? formatDistanceToNow(new Date(bin.lastEmptied), {addSuffix: true}) : 'Unknown'}</span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            <AlertTriangle className="h-4 w-4 mr-2 text-gray-400"/> Issues: <span className="ml-1 text-gray-900">{bin.issues?.length || 0}</span>
                          </div>
                          
                          <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start">
                            <Bell className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-black text-red-700 uppercase tracking-wide mb-0.5">SLA Alert</p>
                              <p className="text-xs text-red-600 font-medium">Must dispatch staff within <span className="font-bold">5 hours</span> to avoid overflow.</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pl-3 flex gap-2">
                          <button 
                            onClick={() => setActiveTab('map')}
                            className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center border border-gray-200"
                          >
                            <MapIcon className="h-4 w-4 mr-1.5"/> View Map
                          </button>
                          <button 
                            className="flex-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center shadow-sm"
                            onClick={() => {
                              setPendingDispatchBin(bin);
                              setActiveTab('staff-ops');
                              setShowAssignModal(true);
                            }}
                          >
                            <Route className="h-4 w-4 mr-1.5"/> Dispatch Staff
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* UNUSED BINS TAB */}
          {activeTab === 'unused-bins' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col gap-8 h-full overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 h-full">
                <div className="flex flex-col mb-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center"><Ghost className="h-5 w-5 mr-2 text-indigo-500"/> Underutilized Bins</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Bins with very low fill levels (≤ 10%). Helps identify poor locations that might not be valuable.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bins.filter(b => b.fillLevel <= 10).length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 font-bold">No unused bins found.</div>
                  ) : (
                    bins.filter(b => b.fillLevel <= 10).map(bin => (
                      <div key={bin._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                        
                        <div className="flex justify-between items-start mb-4 pl-3">
                          <div>
                            <h4 className="font-black text-gray-900 text-lg mb-1">{bin.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bin.district}</p>
                          </div>
                          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                            {bin.fillLevel}% Full
                          </span>
                        </div>
                        
                        <div className="pl-3 space-y-3 mt-4">
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            <Activity className="h-4 w-4 mr-2 text-gray-400"/> Status: <span className="ml-1 text-gray-900 font-bold">{bin.status}</span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400"/> Last Emptied: <span className="ml-1 text-gray-900">{bin.lastEmptied ? formatDistanceToNow(new Date(bin.lastEmptied), {addSuffix: true}) : 'Unknown'}</span>
                          </div>
                        </div>

                        <div className="mt-6 pl-3 flex gap-2">
                          <button 
                            onClick={() => setActiveTab('map')}
                            className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center border border-gray-200"
                          >
                            <MapIcon className="h-4 w-4 mr-1.5"/> View
                          </button>
                          <button 
                            className="flex-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center border border-amber-200"
                          >
                            <Route className="h-4 w-4 mr-1.5"/> Relocate
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI FORECAST TAB */}
          {activeTab === 'ai-forecast' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in p-8 flex flex-col h-full overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 flex items-center"><Sparkles className="h-6 w-6 mr-3 text-indigo-500"/> AI Fill Level Forecaster</h3>
                <p className="text-gray-500 mt-2 font-medium">Using Machine Learning trained on Kaggle IoT datasets to predict how fast a bin will fill based on environmental factors.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Inputs */}
                <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Environmental Simulation</h4>
                  
                  <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center"><Thermometer className="h-4 w-4 mr-2 text-red-500"/> Temperature (°C)</span>
                      <span>{aiParams.temperature}°C</span>
                    </label>
                    <input 
                      type="range" min="0" max="50" 
                      value={aiParams.temperature} 
                      onChange={(e) => setAiParams({...aiParams, temperature: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center"><Droplets className="h-4 w-4 mr-2 text-blue-500"/> Humidity (%)</span>
                      <span>{aiParams.humidity}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      value={aiParams.humidity} 
                      onChange={(e) => setAiParams({...aiParams, humidity: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-2 text-gray-500"/> Hour of Day</span>
                      <span>{aiParams.hourOfDay}:00</span>
                    </label>
                    <input 
                      type="range" min="0" max="23" 
                      value={aiParams.hourOfDay} 
                      onChange={(e) => setAiParams({...aiParams, hourOfDay: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center"><Activity className="h-4 w-4 mr-2 text-green-500"/> Previous Fill Level (%)</span>
                      <span>{aiParams.previousFillLevel}%</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" 
                      value={aiParams.previousFillLevel} 
                      onChange={(e) => setAiParams({...aiParams, previousFillLevel: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-sm font-bold text-gray-700 flex items-center"><CalendarRange className="h-4 w-4 mr-2 text-purple-500"/> Is Weekend?</span>
                    <button 
                      onClick={() => setAiParams({...aiParams, isWeekend: !aiParams.isWeekend})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiParams.isWeekend ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiParams.isWeekend ? 'translate-x-6' : 'translate-x-1'}`}/>
                    </button>
                  </div>

                  <button 
                    onClick={runAiPrediction}
                    disabled={predicting}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
                  >
                    {predicting ? (
                      <span className="flex items-center animate-pulse"><Sparkles className="h-5 w-5 mr-2 animate-spin"/> Processing AI Weights...</span>
                    ) : (
                      <span className="flex items-center"><Sparkles className="h-5 w-5 mr-2"/> Generate AI Forecast</span>
                    )}
                  </button>
                </div>

                {/* Animated Output */}
                <div className="flex flex-col items-center justify-center bg-indigo-50/50 rounded-3xl border border-indigo-100 p-8 relative overflow-hidden">
                  
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                  <div className="relative w-48 h-64 border-4 border-gray-300 rounded-b-3xl rounded-t-lg bg-white overflow-hidden shadow-2xl flex flex-col justify-end">
                    {/* Bin lid */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-gray-400 border-b-4 border-gray-500 z-10"></div>
                    
                    {/* Animated Fill Level */}
                    <div 
                      className={`w-full transition-all duration-1000 ease-in-out relative flex items-center justify-center overflow-hidden
                        ${!aiPrediction ? 'bg-gray-100' : 
                          aiPrediction.predictedFillLevel >= 80 ? 'bg-red-500' : 
                          aiPrediction.predictedFillLevel >= 50 ? 'bg-amber-500' : 'bg-brand-green'
                        }`}
                      style={{ height: `${aiPrediction ? aiPrediction.predictedFillLevel : 10}%` }}
                    >
                      {/* Trash texture overlay */}
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
                      
                      {aiPrediction && (
                        <span className="text-white font-black text-3xl z-10 drop-shadow-md">
                          {aiPrediction.predictedFillLevel}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Model Output</h4>
                    {predicting ? (
                      <div className="h-16 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : aiPrediction ? (
                      <div>
                        <p className="text-3xl font-black text-gray-900">{aiPrediction.predictedFillLevel}%</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Confidence: <span className="text-indigo-600 font-bold">{Math.round(aiPrediction.confidence * 100)}%</span></p>
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center">
                        <p className="text-gray-400 font-bold text-sm">Awaiting simulation parameters...</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-[700px]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 relative">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <MapIcon className="h-6 w-6 text-indigo-600 mr-3" /> Logistics Network
                </h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2 text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-brand-green animate-pulse"></span>
                    <span className="font-bold text-gray-700">{bins.length} Smart Bins</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
                    <span className="font-bold text-gray-700">{users.filter(u=>parseUserLocation(u.address)).length} User Nodes</span>
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
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  
                  {bins.map(bin => (
                    <Marker 
                      key={bin._id} 
                      position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
                      icon={binIcon}
                    >
                      <Popup className="rounded-xl">
                        <div className="p-2 text-center">
                          <h3 className="font-black text-gray-900 mb-1 text-base">{bin.name}</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">{bin.district}</p>
                          <div className="grid grid-cols-2 gap-2 text-left">
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-400">Fill Level</span>
                              <span className={`text-sm font-black ${bin.fillLevel > 90 ? 'text-red-500' : 'text-brand-green'}`}>{bin.fillLevel}%</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <span className="block text-[10px] font-bold text-gray-400">Battery</span>
                              <span className="text-sm font-black text-indigo-600">{bin.batteryLevel}%</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {users.map(u => {
                    const loc = parseUserLocation(u.address);
                    if (loc) {
                      return (
                        <Marker key={u._id} position={loc} icon={userMapIcon}>
                          <Popup>
                            <div className="p-2 text-center">
                              <h3 className="font-black text-gray-900 mb-1">{u.name}</h3>
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider mb-2">{u.role}</span>
                              <p className="text-xs font-bold text-gray-500">{u.phone}</p>
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
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center">
                      <Leaf className="h-6 w-6 text-brand-green mr-3" /> Marketplace Moderation
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Review and manage organic resource listings.</p>
                  </div>
                  <button className="text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                    Export CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  {loadingExchange ? (
                    <div className="p-20 text-center">
                      <div className="inline-block animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mb-4"></div>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50">
                        <tr className="text-[11px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                          <th className="p-5 pl-8">Listing Item</th>
                          <th className="p-5 text-center">Value (₹)</th>
                          <th className="p-5 text-center">Status</th>
                          <th className="p-5">Vendor</th>
                          <th className="p-5 text-center">Date Listed</th>
                          <th className="p-5 pr-8 text-right">Moderation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {exchangeItems.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-5 pl-8">
                              <p className="font-black text-gray-900 text-sm">{item.title}</p>
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-5 text-center">
                              {item.amount > 0 ? (
                                <span className="font-black text-brand-darkBlue bg-blue-50 px-3 py-1 rounded-lg">₹{item.amount}</span>
                              ) : (
                                <span className="font-bold text-brand-green bg-green-50 px-3 py-1 rounded-lg">Free</span>
                              )}
                            </td>
                            <td className="p-5 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${
                                item.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                item.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <span className="block text-sm font-bold text-gray-700">{item.user?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="p-5 text-center text-xs font-bold text-gray-500">
                              {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'N/A'}
                            </td>
                            <td className="p-5 pr-8 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {(item.status === 'Pending' || item.status === 'Open') && (
                                  <>
                                    <button 
                                      onClick={() => handleStatusChange(item._id, 'Approved')}
                                      className="text-emerald-700 bg-emerald-100 px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors" 
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleStatusChange(item._id, 'Rejected')}
                                      className="text-red-700 bg-red-100 px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors" 
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {exchangeItems.length === 0 && !loadingExchange && (
                          <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-medium">No exchange listings found.</td></tr>
                        )}
                      </tbody>
                    </table>
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

// Subcomponents
const NavItem = ({ active, onClick, icon, label, badge, isAlert }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 mb-2 rounded-2xl transition-all duration-300 group
      ${active 
        ? 'bg-brand-green shadow-md shadow-brand-green/20' 
        : 'hover:bg-white/5'}`}
  >
    <div className="flex items-center">
      <div className={`mr-3 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className={`font-bold tracking-wide text-[13px] ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
        {label}
      </span>
    </div>
    {badge > 0 && (
      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${active ? 'bg-white text-brand-green' : isAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-green text-white'}`}>
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-shadow cursor-default">
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
      <div className="mt-2 flex items-center text-xs font-bold">
        <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded mr-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> {trend}</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    </div>
    <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ icon, color, title, desc, time }) => (
  <div className="flex gap-4">
    <div className={`mt-0.5 h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;
