import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Cpu, Recycle, ShieldCheck, Map } from 'lucide-react';
import { FeatureCard } from '../components/Cards';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Local background video */}
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability (matches the green tint from screenshot) */}
        <div className="absolute inset-0 bg-brand-green/40 mix-blend-multiply z-0"></div>
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 fade-in flex flex-col items-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif font-bold tracking-tight mb-6 leading-tight text-[#ffc107] drop-shadow-xl">
            Eco-friendly Solutions for <br />
            a Sustainable Future.
          </h1>
          <p className="text-lg md:text-xl text-white mb-10 leading-relaxed font-medium tracking-wide drop-shadow-md">
            The Future Looks Clean
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/about" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg min-w-[160px]">
              Learn More
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white/80 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all flex items-center justify-center space-x-2 shadow-lg min-w-[160px] backdrop-blur-sm">
              <span>Book Now</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {/* Floating Orange Button matching screenshot */}
          <div className="mt-16 sm:mt-24 mb-10">
            <Link to="/smart-bin" className="bg-[#e65100] hover:bg-[#ff6600] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl flex items-center space-x-3 transform hover:scale-105 border border-white/10">
              <Recycle className="h-6 w-6" />
              <span>HOW TO DISPOSE DIAPER WASTE?</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Redefining Waste Management with <span className="text-brand-green">Intelligence</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                KUPPA solves the growing problem of improper hygiene waste disposal. Using IoT-enabled smart bins, we optimize collection routes and ensure safe, sanitized processing.
              </p>
              <Link to="/about" className="text-brand-darkBlue font-semibold inline-flex items-center space-x-2 hover:text-brand-green transition-colors">
                <span>Learn more about our mission</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-lightGreen rounded-3xl transform rotate-3 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sustainable Environment" className="relative rounded-3xl shadow-xl object-cover h-[400px] w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Integrated solutions for a cleaner, greener community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="h-8 w-8" />}
              title="IoT Smart Bins"
              description="Real-time fill level monitoring, automated locks, and sensor-based insights for optimized collection."
            />
            <FeatureCard 
              icon={<Recycle className="h-8 w-8" />}
              title="Organic Exchange"
              description="A community marketplace to share and request reusable organic materials like compost and coffee grounds."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Secure & Safe"
              description="RFID authentication ensures that only authorized users can dispose of sensitive hygiene waste safely."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-green">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Green Revolution Today</h2>
          <p className="text-brand-earth text-lg mb-8">
            Whether you are disposing of hygiene waste safely or participating in the organic exchange, your actions matter.
          </p>
          <Link to="/locate" className="bg-white text-brand-green px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center space-x-2 hover:bg-gray-50 transition-colors shadow-lg">
            <Map className="h-5 w-5" />
            <span>Find a Smart Bin Near You</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
