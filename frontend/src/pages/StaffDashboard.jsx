import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Map, Calendar, MessageSquare, Settings, LogOut, 
  Trash2, TrendingUp, CheckCircle, Clock, MapPin, Search, Bell, Download, Filter,
  IndianRupee, Briefcase, FileText, Navigation, AlertTriangle, Camera, Upload,
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2,
  Send, Mic, ShieldAlert, Wrench, Radio, CreditCard, ScanLine, RotateCcw, Shirt, Package, Sparkles, X, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import confetti from 'canvas-confetti';

// Icons for Map
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const binIconHealthy = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const binIconWarning = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const binIconCritical = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Static mock data for charts without backend counterparts
const weeklyData = [
  { name: 'Mon', volume: 400 },
  { name: 'Tue', volume: 300 },
  { name: 'Wed', volume: 550 },
  { name: 'Thu', volume: 450 },
  { name: 'Fri', volume: 600 },
  { name: 'Sat', volume: 350 },
  { name: 'Sun', volume: 200 },
];

const PIE_COLORS = ['#2d6a4f', '#ffc107', '#ef4444'];

const BonusCard = () => {
  const [scratched, setScratched] = useState(false);
  // Small bonus amount: Random between ₹20 and ₹80
  const [bonus] = useState(Math.floor(Math.random() * 61) + 20); 

  const handleScratch = () => {
    if (!scratched) {
      setScratched(true);
      // Trigger confetti popper
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d6a4f', '#ffc107', '#10b981', '#ffffff']
      });
    }
  };

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-100 group" onClick={handleScratch}>
      {/* Background (Revealed content) */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={scratched ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }} transition={{ delay: 0.3, type: "spring" }}>
          <h3 className="text-xl font-black text-brand-green mb-2">🎉 Target Hit!</h3>
          <p className="text-5xl font-black text-emerald-600">+₹{bonus}</p>
          <p className="text-xs text-emerald-800/60 font-bold uppercase mt-4">Added to this month's payout</p>
        </motion.div>
      </div>

      {/* Overlay (Scratch surface) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 flex flex-col items-center justify-center z-10"
        animate={scratched ? { opacity: 0, scale: 1.5, filter: 'blur(10px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ pointerEvents: scratched ? 'none' : 'auto' }}
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <IndianRupee className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-white font-black text-2xl tracking-widest uppercase shadow-black/50 drop-shadow-md">Click to Scratch</h3>
        <p className="text-gray-100 text-sm font-bold mt-1 shadow-black/50 drop-shadow-md">Weekly Performance Reward</p>
      </motion.div>
    </div>
  );
};

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeUniform, setActiveUniform] = useState(0);
  const [isRouteOptimized, setIsRouteOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportForm, setReportForm] = useState({
    binId: '',
    issueCategory: 'Sensor Failure',
    description: ''
  });
  const [photo, setPhoto] = useState(null);
  const fileInputRef = React.useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [leaveForm, setLeaveForm] = useState({
    type: 'Sick Leave',
    dateStr: '',
    reason: ''
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  const [directAssignments, setDirectAssignments] = useState([]);
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [proofPhotos, setProofPhotos] = useState({});
  const [completingAssignmentId, setCompletingAssignmentId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/staff-ops/assignments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter to only assignments where staffId matches current user
        const myAssignments = data.filter(a => a.staffId?._id === user._id || a.staffId === user._id);
        setDirectAssignments(myAssignments);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const handleCompleteAssignment = async (id) => {
    setCompletingAssignmentId(id);
    try {
      const token = localStorage.getItem('token');
      let proofPhotoUrl = null;

      if (proofPhotos[id]) {
        const formData = new FormData();
        formData.append('file', proofPhotos[id]);
        const uploadRes = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          proofPhotoUrl = uploadData.url;
        }
      }

      await fetch(`http://localhost:5001/api/staff-ops/assignments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ routeStatus: 'Completed', completedStops: 1, proofPhotoUrl })
      });
      fetchAssignments(); // Refresh
      
      // Cleanup state
      const newPhotos = { ...proofPhotos };
      delete newPhotos[id];
      setProofPhotos(newPhotos);
    } catch (err) {
      console.error("Error completing assignment:", err);
    } finally {
      setCompletingAssignmentId(null);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.dateStr) return;
    setLeaveSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/staff-ops/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leaveForm)
      });
      if (res.ok) {
        setLeaveSuccess(true);
        setLeaveForm({ type: 'Sick Leave', dateStr: '', reason: '' });
        setTimeout(() => setLeaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.binId || !reportForm.description) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      let photoUrl = null;
      if (photo) {
        const formData = new FormData();
        formData.append('file', photo);
        const uploadRes = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.url;
        }
      }

      const bin = activeRoutes.find(b => b.id === reportForm.binId);
      await fetch('http://localhost:5001/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...reportForm,
          binLocationName: bin ? bin.location : 'Unknown Location',
          photoUrl
        })
      });
      setReportForm({ ...reportForm, description: '' });
      setPhoto(null);
      fetchReports();
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    const fetchBins = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/bins', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        // Map DB bins to the format needed by the table
        const formattedBins = data.map((bin, index) => ({
          id: bin._id,
          location: bin.name,
          binId: `B-${(index + 1).toString().padStart(3, '0')}`,
          fill: bin.fillLevel,
          distance: `${(Math.random() * 10).toFixed(1)} km`, // Mocked distance since we don't have live driver GPS
          priority: bin.fillLevel > 90 ? 'High' : bin.fillLevel > 70 ? 'Medium' : 'Low',
          coordinates: bin.location && bin.location.coordinates ? [bin.location.coordinates[1], bin.location.coordinates[0]] : null // [lat, lng]
        })).sort((a, b) => b.fill - a.fill); // Sort by highest fill level

        setActiveRoutes(formattedBins);
        if (formattedBins.length > 0) {
          setReportForm(prev => ({ ...prev, binId: formattedBins[0].id }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bins:", err);
        setLoading(false);
      }
    };
    fetchBins();
    fetchReports();
    fetchAssignments();
  }, []);

  // Calculate dynamic stats from DB
  const healthyCount = activeRoutes.filter(b => b.fill <= 70).length;
  const warningCount = activeRoutes.filter(b => b.fill > 70 && b.fill <= 90).length;
  const criticalCount = activeRoutes.filter(b => b.fill > 90).length;
  
  const binStatusData = [
    { name: 'Healthy', value: healthyCount },
    { name: 'Warning', value: warningCount },
    { name: 'Critical', value: criticalCount },
  ];

  const pendingPickups = warningCount + criticalCount;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Completed Tasks', icon: CheckCircle },
    { name: 'Smart Bins', icon: Map },
    { name: 'AI Optimizer', icon: Sparkles },
    { name: 'Reports', icon: FileText },
    { name: 'Calendar', icon: Calendar },
    { name: 'Salary & Payroll', icon: IndianRupee },
    { name: 'Messages', icon: MessageSquare },
    { name: 'My Gear', icon: Shirt },
    { name: 'Access Card', icon: CreditCard },
  ];

  const handleNavigate = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const optimizeRoute = () => {
    setIsOptimizing(true);

    const calculateRoute = (startLoc) => {
      setUserLocation(startLoc);
      setTimeout(() => {
        const getDistance = (coord1, coord2) => {
          if (!coord1 || !coord2) return Infinity;
          const [lat1, lon1] = coord1;
          const [lat2, lon2] = coord2;
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };

        const needsPickup = activeRoutes.filter(b => b.fill > 50);
        const skipPickup = activeRoutes.filter(b => b.fill <= 50);
        
        let optimized = [];
        let currentLoc = startLoc;
        
        let unvisited = [...needsPickup];
        while(unvisited.length > 0) {
          let closestIdx = 0;
          let minDistance = Infinity;
          for (let i = 0; i < unvisited.length; i++) {
            const dist = getDistance(currentLoc, unvisited[i].coordinates);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = i;
            }
          }
          optimized.push(unvisited[closestIdx]);
          currentLoc = unvisited[closestIdx].coordinates;
          unvisited.splice(closestIdx, 1);
        }
        
        setActiveRoutes([...optimized, ...skipPickup]);
        setIsRouteOptimized(true);
        setIsOptimizing(false);
      }, 1500);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          calculateRoute([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation failed, using default base.", error);
          calculateRoute([10.0261, 76.3082]); // Default base depot
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      calculateRoute([10.0261, 76.3082]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans">
      
      {/* Sidebar - KuPPA Green Theme */}
      <aside className="w-64 bg-[#1b4332] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/20 overflow-hidden border-2 border-brand-green">
            <img src="/logo.png" alt="KUPPA Logo" className="h-full w-full object-cover scale-[1.35] object-center" />
          </div>
          <h2 className="text-xl font-black tracking-widest text-emerald-100">KUPPA</h2>
          <p className="text-xs text-brand-lightGreen font-bold uppercase tracking-widest mt-1">Staff Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                activeMenu === item.name 
                ? 'bg-white text-brand-green shadow-lg shadow-black/10' 
                : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeMenu === item.name ? 'text-brand-green' : ''}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/10 hover:text-white transition-colors font-bold">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors font-bold">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Hello {user?.name || 'Staff'}!</h1>
            <p className="text-gray-500 font-medium text-sm">Welcome back, have a safe shift today.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bins, routes..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition-all w-64"
              />
            </div>
            <button className="relative p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="h-8 w-8 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="text-sm font-bold text-gray-700">{user?.name || 'Driver'} <span className="text-xs text-gray-400 font-normal block">Waste Collector</span></span>
            </div>
          </div>
        </header>

        {/* Global Assignment Alert */}
        {directAssignments.filter(a => a.routeStatus !== 'Completed').length > 0 && (
          <div className="mb-6 bg-red-600 text-white rounded-2xl shadow-lg border-2 border-red-400 p-6 animate-pulse relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500 rounded-full blur-2xl opacity-50"></div>
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-1">URGENT: DISPATCH RECEIVED</h3>
                  <p className="text-red-100 font-medium text-sm">
                    Admin has manually assigned you {directAssignments.filter(a => a.routeStatus !== 'Completed').length} urgent route(s).
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowUrgentModal(true)}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:bg-red-50 hover:scale-105 transition-all"
              >
                View & Complete Task
              </button>
            </div>
          </div>
        )}

        {/* URGENT TASK MODAL */}
        {showUrgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
              <div className="bg-red-600 p-6 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-black tracking-widest uppercase">Urgent Dispatches</h3>
                </div>
                <button 
                  onClick={() => setShowUrgentModal(false)}
                  className="bg-red-500/50 hover:bg-red-500 rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50 space-y-4">
                {directAssignments.filter(a => a.routeStatus !== 'Completed').map(assign => (
                  <div key={assign._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Priority Assignment</span>
                        <h4 className="text-lg font-black text-gray-900 leading-tight">{assign.zone}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-1">Assigned on: {new Date(assign.assignedDate || Date.now()).toLocaleString()}</p>
                      </div>
                      <div className="bg-amber-100 text-amber-700 p-2 rounded-xl flex items-center justify-center">
                        <MapPin className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-xl mb-4 text-sm font-medium text-gray-600 border border-gray-100 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-400" /> Admin requested immediate clearance for this location.
                    </div>

                    {/* Proof Upload Area */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Upload Proof (Optional)</label>
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-6 h-6 mb-1 text-gray-400" />
                          <p className="text-xs font-medium text-gray-500 text-center px-4">
                            {proofPhotos[assign._id] ? proofPhotos[assign._id].name : "Tap to upload photo of empty bin"}
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files[0]) {
                            setProofPhotos(prev => ({ ...prev, [assign._id]: e.target.files[0] }));
                          }
                        }} />
                      </label>
                    </div>

                    <div className="flex space-x-3 mt-2">
                      <button 
                        onClick={() => {
                          setShowUrgentModal(false);
                          setActiveMenu('Smart Bins');
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Find on Map
                      </button>
                      <button 
                        onClick={async () => {
                          await handleCompleteAssignment(assign._id);
                          if (directAssignments.filter(a => a.routeStatus !== 'Completed').length <= 1) {
                            setShowUrgentModal(false);
                          }
                        }}
                        disabled={completingAssignmentId === assign._id}
                        className="flex-1 bg-brand-green hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center shadow-md disabled:opacity-70"
                      >
                        {completingAssignmentId === assign._id ? (
                          <span className="flex items-center"><RotateCcw className="w-4 h-4 mr-1.5 animate-spin" /> Completing...</span>
                        ) : (
                          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Completed</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'Smart Bins' ? (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
            {/* Left: Interactive Map */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">Live Route Map</h3>
                <p className="text-xs text-gray-500 font-medium">All assigned smart bins plotted by location.</p>
              </div>
              <div className="flex-1 relative z-0">
                <MapContainer center={[10.0261, 76.3082]} zoom={8} className="h-full w-full">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {activeRoutes.map((route) => {
                    if (!route.coordinates) return null;
                    const icon = route.priority === 'High' ? binIconCritical : route.priority === 'Medium' ? binIconWarning : binIconHealthy;
                    return (
                      <Marker key={route.id} position={route.coordinates} icon={icon}>
                        <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                          <div className="p-2 w-48 text-center">
                            <h4 className="font-bold text-gray-900 mb-1">{route.location}</h4>
                            <p className="text-xs text-gray-500 mb-2">ID: {route.binId}</p>
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <span className={`font-black text-lg ${route.fill > 90 ? 'text-red-500' : route.fill > 70 ? 'text-amber-500' : 'text-brand-green'}`}>{route.fill}%</span>
                              <span className="text-xs font-bold text-gray-400 uppercase">Fill</span>
                            </div>
                            <button 
                              onClick={() => handleNavigate(route.coordinates[0], route.coordinates[1])}
                              className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                              <Navigation className="w-3 h-3 mr-1" /> Navigate
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            {/* Right: Route Task List */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-white z-10 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">Your Task List</h3>
                </div>
                <p className="text-xs text-gray-500 font-medium">Standard priority collection route.</p>
              </div>
              <div className="overflow-y-auto p-4 space-y-4 bg-gray-50 flex-1 relative">
                {activeRoutes.map((route) => (
                  <div key={route.id} className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{route.location}</h4>
                        <p className="text-xs text-gray-500">{route.distance} away</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        route.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                        route.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {route.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 flex-1">
                        <div className={`h-1.5 rounded-full ${route.fill > 90 ? 'bg-red-500' : route.fill > 70 ? 'bg-amber-500' : 'bg-brand-green'}`} style={{ width: `${route.fill}%` }}></div>
                      </div>
                      <span className={`font-bold text-xs ${route.fill > 90 ? 'text-red-500' : route.fill > 70 ? 'text-amber-500' : 'text-brand-green'}`}>{route.fill}%</span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => route.coordinates && handleNavigate(route.coordinates[0], route.coordinates[1])}
                        className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                        <Navigation className="w-3 h-3 mr-1" /> Go
                      </button>
                      <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200 font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Collected
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeMenu === 'AI Optimizer' ? (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
            {/* Left: Interactive Map */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-white z-10 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-emerald-500" /> KuPP-AI Engine</h3>
                  <p className="text-xs text-gray-500 font-medium">Smart dynamic routing based on fill level and location.</p>
                </div>
              </div>
              <div className="flex-1 relative z-0">
                <MapContainer center={[10.0261, 76.3082]} zoom={8} className="h-full w-full">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {activeRoutes.map((route) => {
                    if (!route.coordinates) return null;
                    const icon = route.priority === 'High' ? binIconCritical : route.priority === 'Medium' ? binIconWarning : binIconHealthy;
                    return (
                      <Marker key={route.id} position={route.coordinates} icon={icon}>
                        <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                          <div className="p-2 w-48 text-center">
                            <h4 className="font-bold text-gray-900 mb-1">{route.location}</h4>
                            <p className="text-xs text-gray-500 mb-2">ID: {route.binId}</p>
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <span className={`font-black text-lg ${route.fill > 90 ? 'text-red-500' : route.fill > 70 ? 'text-amber-500' : 'text-brand-green'}`}>{route.fill}%</span>
                              <span className="text-xs font-bold text-gray-400 uppercase">Fill</span>
                            </div>
                            <button 
                              onClick={() => handleNavigate(route.coordinates[0], route.coordinates[1])}
                              className="w-full bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                              <Navigation className="w-3 h-3 mr-1" /> Navigate
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  {isRouteOptimized && userLocation && (
                    <Marker position={userLocation} icon={driverIcon}>
                      <Popup className="rounded-xl border-0 font-bold text-center">
                        📍 Your Current Location
                      </Popup>
                    </Marker>
                  )}
                  {isRouteOptimized && (
                    <Polyline 
                      positions={userLocation ? [userLocation, ...activeRoutes.filter(r => r.fill > 50 && r.coordinates).map(r => r.coordinates)] : activeRoutes.filter(r => r.fill > 50 && r.coordinates).map(r => r.coordinates)} 
                      pathOptions={{ color: '#10b981', weight: 4, opacity: 0.7, dashArray: '10, 10' }} 
                    />
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Right: Route Task List */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-white z-10 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Optimized List & Tasks</h3>
                  {isRouteOptimized && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded border border-emerald-200 flex items-center"><Sparkles className="w-3 h-3 mr-1" /> AI Route Set</span>}
                </div>

                {/* Direct Assignments Widget */}
                {directAssignments.filter(a => a.routeStatus !== 'Completed').length > 0 && (
                  <div className="mb-6 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center"><Route className="w-3 h-3 mr-1 text-red-500"/> Direct Dispatches</h4>
                    {directAssignments.filter(a => a.routeStatus !== 'Completed').map(assign => (
                      <div key={assign._id} className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">Urgent Task</span>
                            <p className="text-sm font-bold text-gray-900 leading-tight">{assign.zone}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCompleteAssignment(assign._id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark as Completed
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">Standard Route</h4>
                
                {!isRouteOptimized ? (
                  <button 
                    onClick={optimizeRoute}
                    disabled={isOptimizing}
                    className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-xl border border-gray-800 flex items-center justify-center disabled:opacity-70"
                  >
                    {isOptimizing ? (
                      <span className="flex items-center"><RotateCcw className="w-4 h-4 mr-2 animate-spin" /> Calculating AI Path...</span>
                    ) : (
                      <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-emerald-400" /> Optimize Route with KuPP-AI</span>
                    )}
                  </button>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">Follow this sequence for the fastest collection.</p>
                )}
              </div>
              <div className="overflow-y-auto p-4 space-y-4 bg-gray-50 flex-1 relative">
                {isOptimizing && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"></div>
                )}
                {activeRoutes.map((route, index) => (
                  <div key={route.id} className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${route.fill <= 50 ? 'opacity-50 grayscale' : 'border-gray-100'}`}>
                    
                    {isRouteOptimized && route.fill > 50 && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500"></div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {isRouteOptimized && route.fill > 50 && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">Stop {index + 1}</span>
                        )}
                        <h4 className="font-bold text-gray-900 text-sm">{route.location}</h4>
                        <p className="text-xs text-gray-500">{route.distance} away</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        route.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                        route.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {route.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 flex-1">
                        <div className={`h-1.5 rounded-full ${route.fill > 90 ? 'bg-red-500' : route.fill > 70 ? 'bg-amber-500' : 'bg-brand-green'}`} style={{ width: `${route.fill}%` }}></div>
                      </div>
                      <span className={`font-bold text-xs ${route.fill > 90 ? 'text-red-500' : route.fill > 70 ? 'text-amber-500' : 'text-brand-green'}`}>{route.fill}%</span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => route.coordinates && handleNavigate(route.coordinates[0], route.coordinates[1])}
                        className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                        <Navigation className="w-3 h-3 mr-1" /> Go
                      </button>
                      <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-brand-green border border-emerald-200 font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Collected
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeMenu === 'Completed Tasks' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-brand-green" /> 
                Task History
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Review your completed route assignments and submitted proofs.</p>
            </div>
            
            <div className="p-8 bg-gray-50/20">
              {directAssignments.filter(a => a.routeStatus === 'Completed').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No completed tasks yet.</h3>
                  <p className="text-gray-500 font-medium">Any urgent dispatches you complete will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {directAssignments.filter(a => a.routeStatus === 'Completed').map(task => (
                    <div key={task._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                      {task.proofPhotoUrl ? (
                        <div className="h-48 w-full overflow-hidden relative bg-gray-100">
                          <img 
                            src={`http://localhost:5001${task.proofPhotoUrl}`} 
                            alt="Proof of clearance" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-brand-green text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Proof
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 w-full bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center justify-center border-b border-gray-100">
                          <CheckCircle className="h-8 w-8 text-emerald-300 mb-2" />
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Completed</span>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-black text-gray-900 leading-tight">{task.zone}</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm font-medium text-gray-500">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            Completed: {new Date(task.updatedAt || task.assignedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm font-medium text-gray-500">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(task.updatedAt || task.assignedDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeMenu === 'Salary & Payroll' ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Salary Header */}
            <div className="bg-gradient-to-br from-[#1b4332] to-[#081c15] rounded-3xl p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center border border-emerald-900/50">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 mb-6 md:mb-0">
                <p className="text-emerald-300/80 font-bold uppercase tracking-widest text-sm mb-2">Base Monthly Salary</p>
                <h2 className="text-6xl font-black tracking-tighter flex items-center">
                  <span className="text-4xl mr-2 font-bold text-emerald-400">₹</span>15,000
                </h2>
                <p className="text-sm font-medium text-emerald-200/80 mt-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-emerald-400"/> Guaranteed Fixed Payout
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px] relative z-10">
                <p className="text-xs font-bold text-emerald-200 uppercase mb-1">Total With Bonuses</p>
                <h3 className="text-3xl font-black text-white">₹16,450</h3>
                <p className="text-xs text-green-300 font-bold mt-2 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1"/> +9.6% from last month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scratch Card Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Bonus Reward</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">You've completed 100% of your routes this week! Claim your digital scratch card below.</p>
                <BonusCard />
              </div>

              {/* Recent Payouts */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800">Recent Payouts</h3>
                  <p className="text-xs text-gray-500 font-medium">History of your past salary deposits.</p>
                </div>
                <div className="p-2 flex-1">
                  {[
                    { month: 'July 2026', base: 15000, bonus: 1200, status: 'Paid', date: 'Aug 1, 2026' },
                    { month: 'June 2026', base: 15000, bonus: 850, status: 'Paid', date: 'Jul 1, 2026' },
                    { month: 'May 2026', base: 15000, bonus: 1500, status: 'Paid', date: 'Jun 1, 2026' },
                  ].map((payout, i) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-brand-green" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{payout.month}</p>
                          <p className="text-xs text-gray-500 font-medium">{payout.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-800">₹{(payout.base + payout.bonus).toLocaleString()}</p>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {payout.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeMenu === 'Reports' ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Reports Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900">Field Reports & Performance</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Submit issues and track your monthly impact.</p>
              </div>
              <button className="bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm flex items-center">
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </button>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-brand-darkBlue to-[#1b4332] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-emerald-100/80 font-bold text-sm mb-1">Total Weight Collected</p>
                <h3 className="text-3xl font-black tracking-tight">1,240 <span className="text-xl text-emerald-300">kg</span></h3>
                <p className="text-xs font-bold text-emerald-200 mt-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> Top 10% this month</p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-emerald-100 font-bold text-sm mb-1">Optimal Route Adherence</p>
                <h3 className="text-3xl font-black tracking-tight">94%</h3>
                <p className="text-xs font-bold text-emerald-100 mt-2 flex items-center"><Navigation className="h-3 w-3 mr-1"/> Excellent fuel efficiency</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <p className="text-gray-500 font-bold text-sm mb-1">Total Issues Resolved</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">12</h3>
                <p className="text-xs font-bold text-green-500 mt-2 flex items-center"><CheckCircle className="h-3 w-3 mr-1"/> By Maintenance Team</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submit Issue Form */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-red-50 rounded-lg text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Submit an Issue</h3>
                </div>
                
                <form className="space-y-4 flex-1" onSubmit={handleReportSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Bin Location</label>
                    <select 
                      value={reportForm.binId}
                      onChange={(e) => setReportForm({...reportForm, binId: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium">
                      {activeRoutes.map(route => (
                        <option key={route.id} value={route.id}>{route.location} ({route.binId})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Issue Category</label>
                    <select 
                      value={reportForm.issueCategory}
                      onChange={(e) => setReportForm({...reportForm, issueCategory: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium">
                      <option value="Sensor Failure">Sensor Failure</option>
                      <option value="Physical Damage">Physical Damage</option>
                      <option value="Road Blocked / Inaccessible">Road Blocked / Inaccessible</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Description</label>
                    <textarea 
                      rows="3" 
                      value={reportForm.description}
                      onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium resize-none"
                      placeholder="Describe the problem here..."
                      required
                    ></textarea>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={(e) => setPhoto(e.target.files[0])}
                      accept="image/*"
                    />
                    <Camera className={`w-6 h-6 mx-auto mb-2 transition-colors ${photo ? 'text-brand-green' : 'text-gray-400 group-hover:text-brand-green'}`} />
                    <p className="text-xs font-bold text-gray-500">
                      {photo ? photo.name : "Tap to upload photo evidence"}
                    </p>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center disabled:opacity-70">
                    <Upload className="w-4 h-4 mr-2" /> {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </form>
              </div>

              {/* Past Reports Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-white">
                  <h3 className="text-lg font-bold text-gray-800">Past Reports History</h3>
                  <p className="text-xs text-gray-500 font-medium">Status of your previously submitted issues.</p>
                </div>
                <div className="overflow-x-auto flex-1 p-2">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Issue Type</th>
                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.length === 0 ? (
                        <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 font-medium">No reports submitted yet.</td></tr>
                      ) : (
                        reports.map((report) => (
                          <tr key={report._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-4 font-bold text-gray-700">{report.binLocationName}</td>
                            <td className="px-4 py-4">{report.issueCategory}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                report.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-100' :
                                report.status === 'Investigating' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : activeMenu === 'Calendar' ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Calendar Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900">Schedule & Calendar</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">View your assigned shifts, routes, and manage time off.</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><ChevronLeft className="w-5 h-5"/></button>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 text-sm flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-brand-green" /> August 2026
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>

            {/* Weekly Schedule Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { day: 'Mon', date: '03', active: true, shift: 'Morning Shift', time: '06:00 AM - 02:00 PM' },
                { day: 'Tue', date: '04', active: false, shift: 'Morning Shift', time: '06:00 AM - 02:00 PM' },
                { day: 'Wed', date: '05', active: false, shift: 'Evening Shift', time: '02:00 PM - 10:00 PM' },
                { day: 'Thu', date: '06', active: false, shift: 'Off Day', time: '-' },
                { day: 'Fri', date: '07', active: false, shift: 'Morning Shift', time: '06:00 AM - 02:00 PM' }
              ].map((d, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${d.active ? 'bg-brand-green border-emerald-600 shadow-md text-white scale-105' : 'bg-white border-gray-100 shadow-sm text-gray-800 hover:border-brand-green/30 cursor-pointer'}`}>
                  <p className={`text-xs font-bold uppercase mb-1 ${d.active ? 'text-emerald-100' : 'text-gray-400'}`}>{d.day}</p>
                  <h3 className="text-3xl font-black tracking-tighter mb-3">{d.date}</h3>
                  <div className={`text-xs font-bold px-2 py-1 inline-block rounded-md mb-2 ${d.active ? 'bg-white/20 text-white' : d.shift === 'Off Day' ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-brand-green'}`}>
                    {d.shift}
                  </div>
                  <p className={`text-[10px] font-bold flex items-center ${d.active ? 'text-emerald-50' : 'text-gray-500'}`}>
                    {d.time !== '-' && <Clock className="w-3 h-3 mr-1" />} {d.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              {/* Request Time Off */}
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" /> Request Time Off
                </h3>
                <form className="space-y-4 flex-1" onSubmit={handleLeaveSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Leave Type</label>
                    <select 
                      value={leaveForm.type}
                      onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium"
                    >
                      <option>Sick Leave</option>
                      <option>Vacation</option>
                      <option>Personal Emergency</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Date</label>
                    <input 
                      type="date" 
                      value={leaveForm.dateStr}
                      onChange={(e) => setLeaveForm({...leaveForm, dateStr: e.target.value})}
                      required
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Reason</label>
                    <textarea 
                      rows="2" 
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green p-3 font-medium resize-none" 
                      placeholder="Brief explanation..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={leaveSubmitting}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:bg-gray-400"
                  >
                    {leaveSubmitting ? 'Submitting...' : leaveSuccess ? 'Success!' : 'Submit Request'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">Recent Requests</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">July 18, 2026</p>
                      <p className="text-xs text-gray-500">Sick Leave</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeMenu === 'Messages' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Announcements & Updates</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Important messages from administration.</p>
              </div>
              <Bell className="w-6 h-6 text-brand-green" />
            </div>

            <div className="space-y-4">
              {[
                { 
                  title: 'Holiday Schedule Notice', 
                  date: 'Today, 08:00 AM', 
                  type: 'Announcement', 
                  content: 'Please be advised that collection routes will run on a modified schedule this Friday due to the public holiday. Check your Calendar tab for updated route assignments.',
                  icon: <CalendarIcon className="w-5 h-5 text-blue-500" />,
                  bgColor: 'bg-blue-50',
                  borderColor: 'border-blue-100'
                },
                { 
                  title: 'Road Closure on Main St.', 
                  date: 'Yesterday, 04:30 PM', 
                  type: 'Alert', 
                  content: 'Main Street will be closed for construction between 4th and 8th Ave until further notice. Please use alternate routes to reach bins B-020 through B-025.',
                  icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                  bgColor: 'bg-amber-50',
                  borderColor: 'border-amber-100'
                },
                { 
                  title: 'New Safety Protocols', 
                  date: 'Aug 01, 2026', 
                  type: 'Policy', 
                  content: 'All staff must wear high-visibility vests at all times when operating near the new commercial sector bins. Safety first!',
                  icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
                  bgColor: 'bg-emerald-50',
                  borderColor: 'border-emerald-100'
                }
              ].map((msg, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${msg.bgColor} ${msg.borderColor}`}>
                    {msg.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{msg.title}</h3>
                      <span className="text-xs font-bold text-gray-400">{msg.date}</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-3 border ${msg.bgColor} ${msg.borderColor}`}>
                      {msg.type}
                    </span>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeMenu === 'Access Card' ? (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center">
                <ScanLine className="w-8 h-8 mr-3 text-brand-green" /> Digital Access Card
              </h2>
              <p className="text-gray-500 font-medium mt-2 max-w-md mx-auto">
                Tap your digital card to view the back. Use this QR code if your physical RFID card is unavailable.
              </p>
            </div>

            {/* 3D Container */}
            <div 
              className="relative w-96 h-[500px] cursor-pointer group" 
              style={{ perspective: '1000px' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full relative preserve-3d shadow-2xl rounded-3xl"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] rounded-3xl p-8 flex flex-col justify-between text-white border-2 border-white/10 overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-150%]"></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black tracking-widest text-emerald-300 text-lg">KUPPA</h3>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Staff Access</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-4">
                    <div className="w-32 h-32 bg-white rounded-2xl mb-4 border-4 border-emerald-500/50 shadow-lg overflow-hidden p-1">
                      <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-4xl font-black text-gray-400">
                        {user ? user.name.charAt(0) : 'W'}
                      </div>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{user ? user.name : 'Willian John'}</h2>
                    <p className="text-sm font-bold text-emerald-400 bg-emerald-900/50 px-3 py-1 rounded-full mt-2 border border-emerald-500/30">
                      Waste Collector
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Employee ID</p>
                        <p className="text-sm font-mono tracking-widest font-bold">KPA-2026-948</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">RFID Tag</p>
                        <p className="text-sm font-mono tracking-widest font-bold text-emerald-300">A8B9-44F2</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 flex flex-col justify-between text-gray-900 border-2 border-gray-200 shadow-inner"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="w-full h-12 bg-gray-900 absolute top-8 left-0"></div>
                  
                  <div className="mt-20">
                    <h4 className="font-black text-lg text-gray-900 mb-2">Instructions</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      This card is the property of KuPPA Management. It must be carried at all times during your shift. 
                      Tap the physical RFID card or scan this digital QR code at any smart bin to unlock and record your collection.
                    </p>
                  </div>

                  <div className="flex justify-center my-6">
                    <div className="bg-white p-2 border-2 border-gray-100 rounded-xl shadow-sm">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KPA-2026-948`} alt="QR Code" className="w-32 h-32 opacity-90" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Emergency Support</p>
                    <p className="text-sm font-black text-brand-green">1-800-KUPPA-HELP</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <button className="mt-8 flex items-center text-gray-500 hover:text-brand-green font-bold text-sm transition-colors" onClick={() => setIsFlipped(!isFlipped)}>
              <RotateCcw className="w-4 h-4 mr-2" /> Tap card to flip
            </button>
          </div>
        ) : activeMenu === 'My Gear' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900">My Gear & Uniforms</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Manage your assigned equipment and request replacements.</p>
              </div>
              <Shirt className="w-8 h-8 text-brand-green" />
            </div>

            {/* 3D Visual Model Card */}
            <div className="bg-gradient-to-r from-gray-900 to-[#081c15] rounded-3xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between text-white shadow-lg overflow-hidden relative">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              
              <div className="z-10 mb-8 sm:mb-0 sm:mr-8 flex-1 max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-widest uppercase rounded-full border border-emerald-500/30 mb-4">Official Uniforms</span>
                
                {activeUniform === 0 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key="0">
                    <h3 className="text-4xl font-black mb-4">Short-Sleeve Jersey</h3>
                    <p className="text-base text-gray-400 font-medium leading-relaxed">
                      Our premium moisture-wicking safety jersey. Designed for maximum visibility and comfort during hot summer shifts.
                    </p>
                  </motion.div>
                )}
                {activeUniform === 1 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key="1">
                    <h3 className="text-4xl font-black mb-4">Long-Sleeve Shirt</h3>
                    <p className="text-base text-gray-400 font-medium leading-relaxed">
                      Full arm protection with high-visibility reflective bands. Ideal for cooler weather and handling rough materials.
                    </p>
                  </motion.div>
                )}
                {activeUniform === 2 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key="2">
                    <h3 className="text-4xl font-black mb-4">Heavy Winter Jacket</h3>
                    <p className="text-base text-gray-400 font-medium leading-relaxed">
                      Thermal insulated, waterproof winter jacket with maximum reflective striping to keep you safe and warm in harsh conditions.
                    </p>
                  </motion.div>
                )}

                <div className="flex space-x-3 mt-8">
                  <button onClick={() => setActiveUniform(0)} className={`h-3 rounded-full transition-all ${activeUniform === 0 ? 'bg-emerald-400 w-8' : 'bg-white/20 w-3 hover:bg-white/40'}`}></button>
                  <button onClick={() => setActiveUniform(1)} className={`h-3 rounded-full transition-all ${activeUniform === 1 ? 'bg-emerald-400 w-8' : 'bg-white/20 w-3 hover:bg-white/40'}`}></button>
                  <button onClick={() => setActiveUniform(2)} className={`h-3 rounded-full transition-all ${activeUniform === 2 ? 'bg-emerald-400 w-8' : 'bg-white/20 w-3 hover:bg-white/40'}`}></button>
                </div>
              </div>
              
              <div className="z-10 w-64 h-64 sm:w-80 sm:h-80 bg-white/5 rounded-3xl border border-white/10 p-3 shadow-2xl backdrop-blur-sm flex-shrink-0 relative">
                <img 
                  src={activeUniform === 0 ? "/kuppa_short.jpg" : activeUniform === 1 ? "/kuppa_long.jpg" : "/kuppa_jacket.jpg"} 
                  alt="KuPPA Uniform Model" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-brand-darkBlue to-[#112a20] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-emerald-100/80 font-bold text-sm mb-1">Total Assigned Bins</p>
                <h3 className="text-4xl font-black tracking-tight">{activeRoutes.length}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Trash2 className="h-6 w-6" /></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#ffc107] to-amber-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-amber-100 font-bold text-sm mb-1">Pending Pickups</p>
                <h3 className="text-4xl font-black tracking-tight">{pendingPickups}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Clock className="h-6 w-6" /></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-green to-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-emerald-100 font-bold text-sm mb-1">Completed Today</p>
                <h3 className="text-4xl font-black tracking-tight">24</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><CheckCircle className="h-6 w-6" /></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-bold text-sm mb-1">Estimated Earnings</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹1,250<span className="text-sm text-gray-400 font-medium">.00</span></h3>
                <p className="text-xs font-bold text-green-500 mt-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> +15% this week</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-100"><IndianRupee className="h-6 w-6 text-brand-green" /></div>
            </div>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Bar Chart - Collection Volume */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Weekly Collection Volume (kg)</h3>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-green focus:border-brand-green block p-2 font-medium">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="volume" fill="#2d6a4f" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Route Overview & Next Bin */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Route Overview</h3>
              
              <div className="relative pt-1 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-gray-500">Progress</span>
                  <span className="text-sm font-black text-brand-green">57%</span>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                  <div style={{ width: "57%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-brand-green mr-1.5"></span> Collected (24)</div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span> Pending (18)</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase mb-1">Est. Distance</p>
                  <p className="text-xl font-black text-gray-800">12.5 <span className="text-sm text-gray-500">km</span></p>
                </div>
                <div className="text-center border-l border-gray-100">
                  <p className="text-gray-400 text-xs font-bold uppercase mb-1">Est. Time</p>
                  <p className="text-xl font-black text-gray-800">3h 45m</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-brand-darkBlue rounded-2xl p-6 shadow-lg text-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Next Priority Pickup</h3>
                <span className="animate-pulse flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <h4 className="text-xl font-black mb-1">Central Park Entrance</h4>
              <p className="text-sm text-gray-400 font-medium mb-4 flex items-center"><MapPin className="h-4 w-4 mr-1 text-brand-green"/> 1.2 km away</p>
              <button className="w-full bg-white text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Map className="h-4 w-4 mr-2" /> View on Map
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bin Status Donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Network Status</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">Live health of all assigned smart bins.</p>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={binStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {binStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-2">
                <span className="text-3xl font-black text-gray-800">{activeRoutes.length}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Total Bins</span>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-xs font-bold">
              <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f] mr-1.5"></span> Healthy</div>
              <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#ffc107] mr-1.5"></span> Warning</div>
              <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] mr-1.5"></span> Critical</div>
            </div>
          </div>

          {/* Active Routes Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Active Route Listing</h3>
                <p className="text-xs text-gray-500 font-medium">Prioritized by fill level and distance.</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="flex items-center space-x-1.5 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors text-sm font-bold">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Location</th>
                    <th className="px-6 py-4">Bin ID</th>
                    <th className="px-6 py-4">Fill Level</th>
                    <th className="px-6 py-4">Distance</th>
                    <th className="px-6 py-4 rounded-tr-lg">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-brand-lightGreen/10 flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span>{route.location}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{route.binId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${route.fill > 90 ? 'bg-red-500' : route.fill > 70 ? 'bg-amber-500' : 'bg-brand-green'}`} style={{ width: `${route.fill}%` }}></div>
                          </div>
                          <span className={`font-bold ${route.fill > 90 ? 'text-red-500' : route.fill > 70 ? 'text-amber-500' : 'text-brand-green'}`}>{route.fill}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{route.distance}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          route.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                          route.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {route.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
