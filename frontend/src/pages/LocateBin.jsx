import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Battery, AlertTriangle } from 'lucide-react';
import axios from 'axios';

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
    const fetchBins = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/bins', config);
        
        // Calculate distance and time for each bin if we have user location
        let processedBins = data;
        if (userLocation) {
          processedBins = data.map(bin => {
            const binLat = bin.location.coordinates[1];
            const binLng = bin.location.coordinates[0];
            const distance = calculateDistance(userLocation[0], userLocation[1], binLat, binLng);
            
            // Assume 40 km/h average driving speed
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

    if (userLocation !== null) {
      fetchBins();
    } else if (user && user.address) {
       // wait for location to parse
    } else {
       // if user has no address, still fetch bins
       fetchBins();
    }
  }, [user, userLocation]);

  if (!userLocation && !loading) {
    return (
      <div className="min-h-[90vh] bg-[#f8fafc] flex flex-col items-center justify-center p-8">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Location Not Set</h2>
        <p className="text-gray-600 mb-6">Please update your profile with a valid map location to use this feature.</p>
        <button onClick={() => window.location.href='/dashboard'} className="px-6 py-3 bg-brand-green text-white font-bold rounded-xl shadow-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#f8fafc]">
      <div className="flex flex-col lg:flex-row h-full min-h-[90vh]">
        
        {/* Sidebar / List View */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
          <div className="p-6 border-b border-gray-100 bg-brand-darkBlue text-white">
            <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-brand-lightGreen" />
              <span>Locate Smart Bins</span>
            </h1>
            <p className="text-gray-300 text-sm">Find the nearest KuPPA smart bins for safe disposal of hygiene and organic waste.</p>
          </div>
          
          <div className="p-4 overflow-y-auto flex-grow h-[600px] lg:h-auto">
            {loading ? (
              <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full"></div></div>
            ) : bins.length === 0 ? (
              <div className="text-center p-8 text-gray-500 font-medium">No bins found in your area yet.</div>
            ) : (
              <div className="space-y-4">
                {bins.slice(0, 10).map((bin) => (
                  <div 
                    key={bin._id} 
                    onClick={() => setActiveBin(bin)}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-brand-green hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{bin.name}</h3>
                      {bin.distanceKm !== undefined && (
                        <span className="bg-green-100 text-brand-green text-xs font-bold px-2.5 py-1 rounded-full">
                          {bin.distanceKm.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3 font-medium">{bin.district} District</p>
                    
                    <div className="flex space-x-4">
                      {bin.timeMins !== undefined && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 font-bold">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{bin.timeMins < 1 ? '< 1 min drive' : `${bin.timeMins} min drive`}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-gray-600 font-bold">
                        <Battery className={`h-4 w-4 ${bin.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                        <span>{bin.batteryLevel}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Current Fill Level</span>
                      <span className={`text-sm font-bold ${bin.fillLevel > 90 ? 'text-red-500' : 'text-orange-500'}`}>{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${bin.fillLevel > 90 ? 'bg-red-500' : 'bg-brand-green'}`} style={{ width: `${bin.fillLevel}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="w-full lg:w-2/3 h-[500px] lg:h-auto relative z-0 border-t lg:border-t-0 border-gray-200">
          <MapContainer 
            center={userLocation || [10.8505, 76.2711]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={activeBin ? [activeBin.location.coordinates[1], activeBin.location.coordinates[0]] : userLocation} />
            {userLocation && (
              <>
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    <div className="font-bold text-center text-sm text-brand-darkBlue">Your Facility Location</div>
                  </Popup>
                </Marker>
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

                      <button 
                        onClick={() => {
                          alert(`BOOKING INSTRUCTIONS FOR ${bin.name.toUpperCase()}:\n\n1. Use your KuPPA RFID Card to unlock the lid.\n2. Ensure diapers/waste are tightly sealed in compostable bags.\n3. Do not overfill the drop-off chute.\n\nYour slot has been reserved for the next 30 minutes!`);
                        }}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md flex items-center justify-center space-x-2 ${bin.fillLevel > 90 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-brand-green hover:bg-brand-darkBlue hover:shadow-lg transform hover:-translate-y-0.5'}`}
                        disabled={bin.fillLevel > 90}
                      >
                        <span className="text-lg">📱</span>
                        <span>Book Drop-off Slot</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default LocateBin;
