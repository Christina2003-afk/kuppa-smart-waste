import React, { useState, useEffect } from 'react';
import { Wifi, Lock, Activity, Bell, Shield, Scale, ChevronRight, Unlock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureCard = ({ icon, title, description, gradientFrom, gradientTo }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative group bg-white rounded-[2rem] p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
    <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}></div>
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{description}</p>
    </div>
  </motion.div>
);

const SmartBin = () => {
  const [simState, setSimState] = useState('locked'); // locked, unlocked, filling, scanning
  const [fillLevel, setFillLevel] = useState(25);
  const [weight, setWeight] = useState(1.2);

  const triggerSimulation = () => {
    if (fillLevel >= 100) return;
    
    setSimState('scanning');
    
    setTimeout(() => {
      setSimState('unlocked');
      
      setTimeout(() => {
        setSimState('filling');
        setFillLevel(prev => Math.min(100, prev + 15));
        setWeight(prev => Number((prev + 0.8).toFixed(1)));
        
        setTimeout(() => {
          setSimState('locked');
        }, 1500);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-24 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 via-green-50/50 to-transparent -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-green-200/40 to-blue-200/40 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-80 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="bg-gradient-to-r from-blue-600 to-brand-green text-white font-extrabold px-5 py-2.5 rounded-full text-sm tracking-widest uppercase mb-8 inline-block shadow-lg">
            Next-Gen Hardware
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-teal-500 to-blue-600">IoT Smart Bin</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience the future of hygiene waste disposal with our intelligent, secure, and self-monitoring bin technology.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 relative z-10">
          <FeatureCard 
            icon={<Shield className="h-8 w-8" />}
            gradientFrom="from-blue-600" gradientTo="to-cyan-400"
            title="RFID Authentication"
            description="Bank-grade secure access ensures only authorized users can open the bin, completely preventing misuse and contamination."
          />
          <FeatureCard 
            icon={<Lock className="h-8 w-8" />}
            gradientFrom="from-emerald-500" gradientTo="to-teal-400"
            title="Auto Lock/Unlock"
            description="Touchless motorized lids that automatically open upon authentication and lock securely in place after disposal."
          />
          <FeatureCard 
            icon={<Scale className="h-8 w-8" />}
            gradientFrom="from-purple-600" gradientTo="to-pink-500"
            title="Weight Measurement"
            description="Highly sensitive built-in load cells track the exact weight of disposed hygiene waste for accurate environmental reporting."
          />
          <FeatureCard 
            icon={<Activity className="h-8 w-8" />}
            gradientFrom="from-orange-500" gradientTo="to-amber-400"
            title="Fill Level Radar"
            description="Ultrasonic radar sensors continuously map the bin's internal capacity to dynamically optimize collection routes."
          />
          <FeatureCard 
            icon={<Bell className="h-8 w-8" />}
            gradientFrom="from-rose-500" gradientTo="to-red-400"
            title="Predictive Alerts"
            description="AI-driven notifications warn administrators and collectors exactly when a bin will reach full capacity."
          />
          <FeatureCard 
            icon={<Wifi className="h-8 w-8" />}
            gradientFrom="from-indigo-600" gradientTo="to-blue-500"
            title="5G IoT Connectivity"
            description="Always-on cloud syncing provides millisecond-accurate real-time analytics and predictive maintenance."
          />
        </div>

        {/* Interactive Simulator Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-2 shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-gray-900 rounded-[2rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

            {/* Left Content */}
            <div className="flex-1 relative z-10 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-400 font-mono text-sm uppercase tracking-widest">Live Interactive Demo</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">Try the Virtual Bin Simulator</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Click the button below to simulate exactly how our IoT bins process a waste drop-off in real-time. Watch the sensors update instantly.
              </p>
              
              <button 
                onClick={triggerSimulation}
                disabled={simState !== 'locked' || fillLevel >= 100}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  fillLevel >= 100 
                    ? 'bg-red-500 text-white cursor-not-allowed' 
                    : simState === 'locked' 
                      ? 'bg-brand-green hover:bg-brand-lightGreen hover:scale-105 hover:shadow-[0_0_30px_rgba(76,175,80,0.5)] text-white' 
                      : 'bg-gray-700 text-gray-300 cursor-wait'
                }`}
              >
                {fillLevel >= 100 ? (
                  <><span>Bin Full - Needs Pickup</span></>
                ) : simState === 'locked' ? (
                  <><span>Simulate RFID Drop-off</span><ChevronRight className="h-5 w-5" /></>
                ) : simState === 'scanning' ? (
                  <><span>Scanning RFID Card...</span></>
                ) : simState === 'unlocked' ? (
                  <><span>Lid Opened - Drop Waste</span></>
                ) : (
                  <><span>Processing Weight & Fill...</span></>
                )}
              </button>
            </div>

            {/* Right Dashboard / Digital Twin */}
            <div className="w-full lg:w-[450px] bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl relative z-10">
              
              <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300 font-mono font-bold">BIN_ID: #KUP-8842</span>
                </div>
                <div className="bg-gray-900 px-3 py-1 rounded-lg border border-gray-700 flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${simState === 'unlocked' || simState === 'filling' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <span className="text-xs text-white font-mono">{simState.toUpperCase()}</span>
                </div>
              </div>

              {/* Status Graphic */}
              <div className="h-48 bg-gray-900 rounded-2xl mb-8 border border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {simState === 'locked' && (
                    <motion.div key="locked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-gray-600 flex flex-col items-center">
                      <Lock className="h-16 w-16 mb-2" />
                      <span className="font-mono text-sm">SECURELY LOCKED</span>
                    </motion.div>
                  )}
                  {simState === 'scanning' && (
                    <motion.div key="scanning" className="text-blue-500 flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="font-mono text-sm animate-pulse">AUTHENTICATING...</span>
                    </motion.div>
                  )}
                  {simState === 'unlocked' && (
                    <motion.div key="unlocked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-brand-green flex flex-col items-center">
                      <Unlock className="h-16 w-16 mb-2 animate-bounce" />
                      <span className="font-mono text-sm">LID OPEN - AWAITING WASTE</span>
                    </motion.div>
                  )}
                  {simState === 'filling' && (
                    <motion.div key="filling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-orange-500 flex flex-col items-center">
                      <Trash2 className="h-16 w-16 mb-2 animate-pulse" />
                      <span className="font-mono text-sm">PROCESSING DISPOSAL...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Telemetry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <span className="text-xs text-gray-500 font-mono block mb-1">TOTAL WEIGHT</span>
                  <div className="flex items-end space-x-1">
                    <span className="text-3xl font-bold text-white transition-all">{weight}</span>
                    <span className="text-gray-400 mb-1">kg</span>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 relative overflow-hidden">
                  <span className="text-xs text-gray-500 font-mono block mb-1 relative z-10">FILL CAPACITY</span>
                  <div className="flex items-end space-x-1 relative z-10">
                    <span className={`text-3xl font-bold transition-all ${fillLevel > 90 ? 'text-red-500' : 'text-brand-green'}`}>{fillLevel}</span>
                    <span className="text-gray-400 mb-1">%</span>
                  </div>
                  {/* Fill progress background */}
                  <div className="absolute bottom-0 left-0 w-full bg-gray-800 h-full -z-0 rounded-xl overflow-hidden">
                    <div 
                      className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ${fillLevel > 90 ? 'bg-red-500/20' : 'bg-brand-green/20'}`} 
                      style={{ height: `${fillLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SmartBin;
