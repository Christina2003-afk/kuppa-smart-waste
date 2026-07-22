import React from 'react';
import { Target, Users, Zap, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative py-32 text-center px-4 overflow-hidden shadow-inner">
        {/* Deep eco-friendly gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] z-0"></div>
        {/* Subtle texture overlay for a unique premium look */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">About KUPPA</h1>
          <p className="text-xl text-[#d8f3dc] max-w-2xl mx-auto font-medium tracking-wide drop-shadow-md">
            Pioneering sustainable hygiene waste management through AI, IoT, and community collaboration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* The Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Improper disposal of hygiene waste, such as used diapers and sanitary products, poses severe environmental and health risks in apartments, hospitals, daycare centres, and communities. Traditional waste management systems are ill-equipped to handle this specific challenge safely.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-10">The KUPPA Solution</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We provide an end-to-end platform utilizing IoT-enabled smart bins for secure collection, and AI-driven optimization for efficient routing. Beyond waste, we empower communities to reuse organic resources, creating a true circular economy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Recycling" className="rounded-2xl shadow-md h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nature" className="rounded-2xl shadow-md h-48 w-full object-cover mt-8" />
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Target className="h-10 w-10 text-brand-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-600">Turning waste into worth by enabling organic reuse and preventing hazardous landfill contamination.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Zap className="h-10 w-10 text-brand-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">Leveraging state-of-the-art IoT sensors and AI prediction models for proactive waste management.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <Users className="h-10 w-10 text-brand-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-600">Fostering localized networks where individuals and businesses can share and exchange organic resources.</p>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="bg-brand-green text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-6">Platform Highlights</h2>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-brand-lightGreen" />
                <span className="text-lg">Smart diaper waste collection</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-brand-lightGreen" />
                <span className="text-lg">IoT enabled automatic bins</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-brand-lightGreen" />
                <span className="text-lg">AI based route optimization</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-brand-lightGreen" />
                <span className="text-lg">Sustainable community management</span>
              </li>
            </ul>
          </div>
          <div className="md:w-5/12">
            <div className="glass p-8 rounded-2xl border border-white/20 shadow-xl text-center">
              <h3 className="text-4xl font-extrabold mb-2 text-white">100%</h3>
              <p className="text-brand-earth font-medium">Commitment to a greener, cleaner future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
