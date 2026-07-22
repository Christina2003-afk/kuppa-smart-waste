import React from 'react';
import { Wifi, Lock, Activity, Bell, Shield, Scale } from 'lucide-react';
import { FeatureCard } from '../components/Cards';

const SmartBin = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IoT-Enabled Smart Bins</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of hygiene waste disposal with our intelligent, secure, and connected bin technology.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <FeatureCard 
            icon={<Shield className="h-8 w-8" />}
            title="RFID Authentication"
            description="Secure access ensures only registered and authorized users can open the bin, preventing misuse."
          />
          <FeatureCard 
            icon={<Lock className="h-8 w-8" />}
            title="Auto Lock/Unlock"
            description="Motorized lids that automatically open upon authentication and lock securely after disposal."
          />
          <FeatureCard 
            icon={<Scale className="h-8 w-8" />}
            title="Weight Measurement"
            description="Built-in load cells track the exact weight of disposed hygiene waste for accurate reporting."
          />
          <FeatureCard 
            icon={<Activity className="h-8 w-8" />}
            title="Fill Level Monitoring"
            description="Ultrasonic sensors continuously monitor bin capacity to optimize collection schedules."
          />
          <FeatureCard 
            icon={<Bell className="h-8 w-8" />}
            title="Real-Time Alerts"
            description="Instant notifications to administration and collectors when a bin is nearing full capacity."
          />
          <FeatureCard 
            icon={<Wifi className="h-8 w-8" />}
            title="IoT Connectivity"
            description="Constant cloud syncing provides real-time analytics and predictive maintenance alerts."
          />
        </div>

        {/* Visual / Animation Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-2xl overflow-hidden bg-brand-darkBlue flex items-center justify-center">
              {/* Abstract representation of a smart bin */}
              <div className="relative w-40 h-56 bg-gray-800 rounded-b-xl rounded-t-sm border-4 border-gray-700 shadow-2xl flex flex-col items-center justify-end pb-4">
                <div className="absolute top-0 w-full h-8 bg-brand-lightGreen rounded-t-sm opacity-80 animate-pulse"></div>
                <div className="w-16 h-2 bg-brand-green rounded-full mb-2"></div>
                <div className="w-24 h-2 bg-gray-600 rounded-full mb-8"></div>
                <Wifi className="h-8 w-8 text-blue-400 mb-2 animate-bounce" />
                <div className="text-xs text-white font-mono">100% ONLINE</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Designed for Safety and Hygiene</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                By integrating IoT technology, KUPPA smart bins eliminate the risks associated with overflowing hazardous waste. Our airtight, automatically sealed containers prevent odors and contamination, ensuring a safe environment for your community.
              </p>
              <button className="bg-brand-darkBlue hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Technical Specs
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartBin;
