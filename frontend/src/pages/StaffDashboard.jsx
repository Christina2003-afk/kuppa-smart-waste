import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Truck, Map, CheckCircle, MapPin, Battery, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('routes'); // routes, map, completed

  // Dummy Data for Bins
  const [activeBins, setActiveBins] = useState([
    { id: 1, location: 'Central Park North Entrance', fillLevel: 95, battery: 42, timeSinceLastCollection: '2 days' },
    { id: 2, location: 'Downtown Metro Station', fillLevel: 100, battery: 15, timeSinceLastCollection: '3 days' },
    { id: 3, location: 'City Library Campus', fillLevel: 88, battery: 76, timeSinceLastCollection: '1 day' },
  ]);

  const [completedBins, setCompletedBins] = useState([
    { id: 4, location: 'University Main Gate', collectedAt: '09:15 AM' },
    { id: 5, location: 'Riverside Walkway', collectedAt: '10:30 AM' },
  ]);

  const handleCollect = (bin) => {
    // Remove from active
    setActiveBins(activeBins.filter(b => b.id !== bin.id));
    // Add to completed with timestamp
    setCompletedBins([{ ...bin, collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...completedBins]);
  };

  return (
    <div className="min-h-[90vh] bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 drop-shadow-sm">Waste Collector Dashboard</h1>
        
        <div className="bg-white rounded-[2rem] shadow-sm p-8 mb-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-[#ffc107] to-brand-green bg-[length:200%_auto] animate-gradient"></div>
          <h2 className="text-2xl font-bold mb-2 text-brand-darkBlue">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600 font-medium text-lg">You have <span className="text-red-500 font-bold">{activeBins.length} critical bins</span> assigned for collection today.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('routes')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${activeTab === 'routes' ? 'bg-brand-green text-white shadow-md transform -translate-y-0.5' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            <Truck className="h-5 w-5" />
            <span>Active Routes</span>
            {activeBins.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{activeBins.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${activeTab === 'map' ? 'bg-brand-green text-white shadow-md transform -translate-y-0.5' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            <Map className="h-5 w-5" />
            <span>Live Map</span>
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all ${activeTab === 'completed' ? 'bg-brand-green text-white shadow-md transform -translate-y-0.5' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Completed ({completedBins.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          
          {/* ACTIVE ROUTES */}
          {activeTab === 'routes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {activeBins.map(bin => (
                  <motion.div 
                    key={bin.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2 text-brand-darkBlue font-bold text-lg leading-tight">
                          <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <h3>{bin.location}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex justify-between text-sm mb-1 font-medium text-gray-600">
                            <span>Fill Level</span>
                            <span className={bin.fillLevel >= 90 ? 'text-red-600 font-bold' : 'text-orange-500 font-bold'}>{bin.fillLevel}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${bin.fillLevel >= 90 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${bin.fillLevel}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-1.5">
                            <Battery className={`h-4 w-4 ${bin.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                            <span className="font-medium">{bin.battery}% Power</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{bin.timeSinceLastCollection}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCollect(bin)}
                        className="w-full py-3.5 bg-brand-green hover:bg-[#235e26] text-white rounded-xl font-bold flex justify-center items-center space-x-2 transition-all transform active:scale-95"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Mark as Collected</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {activeBins.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800">All caught up!</h3>
                  <p className="text-gray-500 mt-2 font-medium">You have no pending route assignments.</p>
                </div>
              )}
            </div>
          )}

          {/* MAP PLACEHOLDER */}
          {activeTab === 'map' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 relative h-[600px] flex items-center justify-center overflow-hidden"
            >
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="text-center relative z-10 p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl max-w-md">
                <Map className="h-16 w-16 text-brand-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Map Interface</h3>
                <p className="text-gray-600 mb-6">This section will be integrated with Google Maps to show optimized, turn-by-turn routing to active IoT smart bins.</p>
                <div className="inline-flex items-center space-x-2 text-sm font-bold text-[#ffc107] bg-[#ffc107]/10 px-4 py-2 rounded-full border border-[#ffc107]/20">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Pending IoT Integration</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPLETED PICKUPS */}
          {activeTab === 'completed' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-brand-green" />
                  <span>Today's Log</span>
                </h3>
                <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">{completedBins.length} Total</span>
              </div>
              <ul className="divide-y divide-gray-100">
                <AnimatePresence>
                  {completedBins.map(bin => (
                    <motion.li 
                      key={bin.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{bin.location}</p>
                          <p className="text-sm font-medium text-gray-500">Collected at {bin.collectedAt}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold border border-gray-200">Emptied</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {completedBins.length === 0 && (
                  <li className="p-12 text-center text-gray-500 font-medium">No bins collected yet today.</li>
                )}
              </ul>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
