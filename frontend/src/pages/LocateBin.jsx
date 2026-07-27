import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Battery, AlertTriangle, Lock, Truck, Trash2, User, Coins, Package } from 'lucide-react';
import api from '../services/api';

// Icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const binIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
};

const LocateBin = () => {
  const { user } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBin, setActiveBin] = useState(null);
  const [bookingBinId, setBookingBinId] = useState(null);

  const [publicLocation, setPublicLocation] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [liveActivity, setLiveActivity] = useState(null);

  const activeLocation = userLocation || publicLocation;

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsScanning(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPublicLocation([position.coords.latitude, position.coords.longitude]);
        setIsScanning(false);
      },
      (error) => {
        alert("Unable to retrieve your location");
        setIsScanning(false);
      }
    );
  };

  useEffect(() => {
    // Parse user location from string: "District - [10.1, 76.1]"
    if (user && user.address) {
      const match = user.address.match(/\[(.*?)\]/);
      if (match && match[1]) {
        const coords = match[1].split(',').map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          setUserLocation([coords[0], coords[1]]);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    // Simulated Live Activity Feed
    const activities = [
      "📍 2.4kg of organic waste safely composted in Adoor.",
      "⚡ Smart Bin #42 in Kochi just came online.",
      "♻️ User user_992 earned 50 EcoPoints!",
      "📍 1.2kg hygiene waste secured in Pathanamthitta.",
      "🔋 Bin #12 battery swapped and fully charged.",
      "🌟 A new user just joined the KuPPA network!"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLiveActivity(activities[i]);
      i = (i + 1) % activities.length;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/bins', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let processedBins = data;
        if (activeLocation) {
          processedBins = data.map(bin => {
            const binLat = bin.location.coordinates[1];
            const binLng = bin.location.coordinates[0];
            const distance = calculateDistance(activeLocation[0], activeLocation[1], binLat, binLng);
            
            const timeHours = distance / 40;
            const timeMins = Math.round(timeHours * 60);
            
            return {
              ...bin,
              distanceKm: distance,
              timeMins: timeMins
            };
          }).sort((a, b) => a.distanceKm - b.distanceKm);
        }
        
        setBins(processedBins);
      } catch (error) {
        console.error('Error fetching bins', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, [user, activeLocation]);

  return (
    <div className="min-h-[90vh] bg-[#f8fafc]">
      {(!user || !userLocation) && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 text-center">
          <p className="text-blue-800 text-sm font-medium">
            {!user 
              ? "👋 Welcome! Sign in or register to unlock distance calculation and book drop-off slots." 
              : "⚠️ Please update your profile with your facility location to see distance to nearest bins."}
          </p>
        </div>
      )}
      <div className="flex flex-col lg:flex-row h-full min-h-[90vh]">
        
        {/* Sidebar / List View */}
        <div className={`w-full ${!user ? 'lg:w-full' : 'lg:w-1/3'} bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10`}>
          <div className="p-6 border-b border-gray-100 bg-brand-green text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-brand-lightGreen" />
                <span>Locate Smart Bins</span>
              </h1>
              <p className="text-gray-100 text-sm max-w-2xl">Find the nearest KuPPA smart bins for safe disposal of hygiene and organic waste.</p>
            </div>
            
            {/* Animated Truck Section (Only for logged out users) */}
            {!user && (
              <div className="mt-6 bg-brand-darkBlue/40 rounded-xl p-4 overflow-hidden relative h-32 border border-white/10 shadow-inner">
                <style>
                  {`
                    @keyframes drive-in {
                      0% { transform: translateX(-150px); }
                      40% { transform: translateX(calc(50% - 20px)); }
                      60% { transform: translateX(calc(50% - 20px)); }
                      100% { transform: translateX(calc(100vw)); }
                    }
                    @keyframes load-waste {
                      0% { transform: translateY(0) scale(1); opacity: 1; }
                      45% { transform: translateY(0) scale(1); opacity: 1; }
                      50% { transform: translateY(-30px) scale(0.5); opacity: 0; }
                      100% { transform: translateY(-30px) scale(0.5); opacity: 0; }
                    }
                    @keyframes truck-bounce {
                      0%, 100% { padding-top: 0px; }
                      50% { padding-top: 2px; }
                    }
                  `}
                </style>
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-xs font-bold text-brand-lightGreen uppercase tracking-widest bg-brand-darkBlue/50 px-2 py-1 rounded">Our staff in action</span>
                </div>

                <div className="absolute bottom-4 left-0 w-full h-1 bg-white/20 rounded-full border-b border-white/5 border-dashed"></div>
                
                <div className="absolute bottom-4 w-full flex items-end">
                  {/* The Waste Package */}
                  <div className="absolute left-1/2 bottom-0 ml-10 text-white animate-[load-waste_4s_infinite_ease-in-out]">
                    <div className="bg-brand-lightGreen/80 p-2 rounded-md shadow-md border border-brand-green/50">
                      <Package className="h-5 w-5 text-brand-darkBlue drop-shadow-md" />
                    </div>
                  </div>
                  
                  {/* The Truck */}
                  <div className="absolute left-0 bottom-0 text-white animate-[drive-in_4s_infinite_ease-in-out]">
                    <div className="animate-[truck-bounce_0.2s_infinite_ease-in-out] relative">
                      <Truck className="h-12 w-12 text-white drop-shadow-lg" fill="currentColor" />
                      <div className="absolute top-2 right-1 h-3 w-4 bg-brand-green rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 overflow-y-auto flex-grow h-[600px] lg:h-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full"><div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div></div>
            ) : bins.length === 0 ? (
              <div className="text-center p-8 text-gray-500 font-medium">No bins found in your area yet.</div>
            ) : (
              <div className={!user ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-8" : "space-y-4"}>
                {bins.map((bin, index) => (
                  <div 
                    key={bin._id} 
                    onClick={() => setActiveBin(bin)}
                    className={`bg-white rounded-[1.5rem] p-5 border border-gray-100 hover:border-brand-green/50 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group ${!user ? 'transform hover:-translate-y-2' : ''}`}
                  >
                    {/* Decorative gradient blob */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-lightGreen/10 rounded-full blur-2xl group-hover:bg-brand-green/20 transition-colors"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-green transition-colors">{bin.name}</h3>
                            {bin.distanceKm !== undefined && (
                              <span className="bg-green-50 text-brand-green text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                                {bin.distanceKm.toFixed(1)} km
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 font-medium">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{bin.district} District</span>
                          </div>
                          
                          <div className="flex space-x-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            {bin.timeMins !== undefined && (
                              <div className="flex items-center space-x-1.5 text-sm font-bold">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-700">{bin.timeMins < 1 ? '< 1 min' : `${bin.timeMins} min`}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1.5 text-sm font-bold">
                              <Battery className={`h-4 w-4 ${bin.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                              <span className="text-gray-700">{bin.batteryLevel}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Animated Bin Illustration */}
                        <div className="hidden sm:flex flex-shrink-0 justify-center items-center h-24 w-24 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-inner p-1 relative border border-green-100">
                          <img 
                            src="/bin-illustration.jpg" 
                            alt="Smart Bin" 
                            className="w-full h-full object-cover rounded-xl animate-bounce mix-blend-multiply transition-transform hover:scale-110"
                            style={{ animationDuration: '3s' }}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-5">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Live Capacity</span>
                          <span className={`text-sm font-black ${bin.fillLevel > 90 ? 'text-red-500' : 'text-brand-darkBlue'}`}>{bin.fillLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${bin.fillLevel > 90 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-brand-green to-brand-lightGreen'}`} style={{ width: `${bin.fillLevel}%` }}></div>
                        </div>
                      </div>

                      {/* Guest Overlay Message */}
                      {!user && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <p className="text-xs text-center text-gray-500 font-medium flex items-center justify-center space-x-1">
                            <Lock className="h-3.5 w-3.5 text-orange-400" />
                            <span>Sign in to unlock booking</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        {user && (
          <div className="w-full lg:w-2/3 h-[500px] lg:h-auto relative z-0 border-t lg:border-t-0 border-gray-200">
          
          {/* Live Activity Feed Overlay */}
          <div className="absolute top-4 left-4 z-[400] max-w-sm">
            <div className={`bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-white/10 transition-all duration-500 transform ${liveActivity ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-300">Live Network Activity:</span>
              </div>
              <p className="mt-1 text-green-300 animate-fade-in-up">{liveActivity}</p>
            </div>
          </div>

          {/* Radar Scanner Button (Only show if not logged in or no location) */}
          {!user && !publicLocation && (
            <div className="absolute bottom-6 right-6 z-[400]">
              <button 
                onClick={handleLocateMe}
                disabled={isScanning}
                className="bg-brand-darkBlue hover:bg-black text-white px-5 py-4 rounded-full shadow-2xl font-bold flex items-center space-x-3 transition-transform transform hover:scale-105"
              >
                {isScanning ? (
                  <>
                    <div className="relative flex h-5 w-5 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                    </div>
                    <span>Scanning Area...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-5 w-5 text-brand-lightGreen" />
                    <span>Find Bins Near Me</span>
                  </>
                )}
              </button>
            </div>
          )}

          <MapContainer 
            center={activeLocation || [10.8505, 76.2711]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={activeBin ? [activeBin.location.coordinates[1], activeBin.location.coordinates[0]] : activeLocation} />
            {activeLocation && (
              <>
                <Marker position={activeLocation} icon={userIcon}>
                  <Popup>
                    <div className="font-bold text-center text-sm text-brand-darkBlue">{user ? 'Your Facility Location' : 'Your Scanned Location'}</div>
                  </Popup>
                </Marker>
                
                {/* Radar Radius Circle */}
                {publicLocation && (
                   <div className="animate-ping"></div> // handled via CSS if needed, but we can just use Marker
                )}
              </>
            )}
            
            {bins.map(bin => (
              <Marker 
                key={bin._id} 
                position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
                icon={binIcon}
              >
                <Popup>
                  <div className="p-0 min-w-[240px] overflow-hidden rounded-xl border-0 shadow-2xl bg-white">
                    {/* Animated Bin Graphic */}
                    <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-end justify-center overflow-hidden pb-4 pt-6">
                      
                      {/* The Bin Body */}
                      <div className="relative w-20 h-32 border-x-4 border-b-4 border-gray-400/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] bg-white/40 backdrop-blur-sm overflow-hidden z-10 flex flex-col justify-end" style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                        
                        {/* Bin Lid (Hovering slightly open) */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-500 rounded-t-lg shadow-md z-20 origin-left -rotate-6"></div>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-600 rounded-t-md z-20 origin-left -rotate-6"></div>

                        {/* The Fill Liquid/Waste */}
                        <div 
                          className={`w-full relative transition-all duration-1000 ease-in-out ${bin.fillLevel > 90 ? 'bg-red-500' : 'bg-brand-green'}`}
                          style={{ height: `${bin.fillLevel}%` }}
                        >
                          {/* Animated Wave Effect on top of the liquid */}
                          <div className="absolute top-0 left-0 right-0 h-4 -mt-2 opacity-50 bg-white/40 rounded-[100%] animate-pulse"></div>
                          
                          {/* Floating 'Diaper/Waste' bubbles for visual interest */}
                          {bin.fillLevel > 10 && (
                            <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          )}
                          {bin.fillLevel > 40 && (
                            <div className="absolute bottom-8 right-2 w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }}></div>
                          )}
                          {bin.fillLevel > 70 && (
                            <div className="absolute bottom-16 left-4 w-5 h-5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-black shadow-sm z-20 border border-gray-100">
                        <span className={bin.fillLevel > 90 ? 'text-red-600' : 'text-brand-darkBlue'}>{bin.fillLevel}% Full</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white">
                      <h3 className="font-extrabold text-brand-darkBlue mb-1 leading-tight">{bin.name}</h3>
                      {bin.distanceKm !== undefined && (
                        <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center justify-between">
                          <span>{bin.distanceKm.toFixed(1)} km away</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> {bin.timeMins} min</span>
                        </p>
                      )}
                      
                      {bin.fillLevel > 90 ? (
                        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg text-xs font-medium border border-red-100 mb-3">
                          <span className="font-bold flex items-center space-x-1 mb-1"><span>⚠️</span> <span>Bin is Full</span></span>
                          <span className="opacity-90 leading-tight block">Please locate an alternative bin.</span>
                        </div>
                      ) : (
                        <div className="bg-brand-lightGreen/20 text-brand-darkBlue p-2.5 rounded-lg text-xs font-medium border border-brand-green/20 mb-3">
                          <span className="font-bold flex items-center space-x-1 mb-1"><span>✅</span> <span>Available</span></span>
                          <span className="opacity-90 leading-tight block">Ready to accept hygiene waste.</span>
                        </div>
                      )}

                      {bookingBinId === bin._id ? (
                        <div className="w-full mt-2 animate-fade-in-up">
                          <p className="text-xs font-bold text-gray-700 mb-2 text-center">Select your arrival time:</p>
                          <div className="grid grid-cols-4 gap-1 mb-2">
                            {[5, 10, 15, 20].map(time => (
                              <button 
                                key={time}
                                onClick={() => window.location.href = `/book-bin/${bin._id}?time=${time}`}
                                className="py-1.5 bg-brand-green/10 hover:bg-brand-green hover:text-white text-brand-darkBlue text-xs font-bold rounded transition-colors"
                              >
                                {time}m
                              </button>
                            ))}
                          </div>
                          <button onClick={() => setBookingBinId(null)} className="w-full py-1 text-xs text-gray-500 hover:text-gray-800 font-medium">Cancel</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => user ? setBookingBinId(bin._id) : window.location.href='/login'}
                          className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md flex items-center justify-center space-x-2 ${bin.fillLevel > 90 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-brand-green hover:bg-brand-darkBlue hover:shadow-lg transform hover:-translate-y-0.5'}`}
                          disabled={bin.fillLevel > 90}
                        >
                          <span className="text-lg">📱</span>
                          <span>{user ? 'Book Drop-off Slot' : 'Login to Book Slot'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        )}

      </div>
    </div>
  );
};

export default LocateBin;
