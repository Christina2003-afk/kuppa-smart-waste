import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Cpu, Recycle, ShieldCheck, Map, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, type: "spring" }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] relative overflow-hidden group cursor-default"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand-lightGreen/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-[#1b4332] rounded-2xl flex items-center justify-center text-brand-lightGreen mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#f8fafc] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-[120%] z-0 origin-top">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBlue via-brand-darkBlue/60 to-transparent z-0 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/20 z-0"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 flex flex-col items-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <Sparkles className="h-4 w-4 text-[#ffc107]" />
            <span className="text-sm font-bold tracking-widest uppercase text-white">Welcome to the future</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[6rem] font-serif font-black tracking-tight mb-6 leading-tight text-white drop-shadow-2xl"
          >
            Eco-friendly Solutions for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc107] to-yellow-200">a Sustainable Future.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-light tracking-wide drop-shadow-md max-w-3xl"
          >
            Empowering communities with smart tech to transform hygiene waste management forever.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center"
          >
            <Link to="/about" className="bg-white text-brand-darkBlue hover:bg-gray-100 hover:scale-105 px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] min-w-[180px] text-center">
              Learn More
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white/50 hover:bg-white/10 hover:border-white text-white hover:scale-105 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center space-x-2 min-w-[180px] backdrop-blur-md">
              <span>Book Now</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </motion.div>

          {/* Floating Action Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5, type: "spring" }}
            className="mt-12 mb-10"
          >
            <Link to="/smart-bin" className="relative group bg-gradient-to-r from-[#e65100] to-[#ff7b00] text-white px-8 py-5 rounded-full font-black text-lg transition-all shadow-[0_10px_40px_rgba(230,81,0,0.4)] flex items-center space-x-3 transform hover:scale-110 border border-white/20">
              <div className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Recycle className="h-7 w-7 relative z-10 animate-spin-slow" />
              <span className="relative z-10 tracking-wide">HOW TO DISPOSE DIAPER WASTE?</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Wavy bottom border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,121.22,201.5,114.24,242.15,110.25,282.16,91.44,321.39,56.44Z" className="fill-[#f8fafc]"></path>
          </svg>
        </div>
      </section>

      {/* About Section Snippet with Parallax Imagery */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
                Redefining Waste <br/>Management with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-blue-500">Intelligence</span>
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed mb-10 font-light">
                KUPPA solves the growing problem of improper hygiene waste disposal. Using IoT-enabled smart bins, we optimize collection routes and ensure safe, sanitized processing while rewarding sustainable actions.
              </p>
              <Link to="/about" className="group text-brand-darkBlue font-bold text-lg inline-flex items-center space-x-3 hover:text-brand-green transition-colors bg-white px-6 py-3 rounded-full shadow-md border border-gray-100 hover:shadow-lg">
                <span>Discover our mission</span>
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-lightGreen to-blue-400 rounded-[3rem] transform rotate-3 opacity-30 blur-lg"></div>
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sustainable Environment" className="relative rounded-[3rem] shadow-2xl object-cover h-[500px] w-full border-4 border-white" />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl flex items-center space-x-4 border border-gray-100"
              >
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Impact</p>
                  <p className="text-2xl font-black text-gray-900">100% Green</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[#1b4332] transform -skew-y-2 z-0 origin-top-left"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-white mb-6">Platform Features</h2>
            <div className="h-1 w-24 bg-brand-lightGreen mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-xl font-light">Integrated, intelligent solutions for a cleaner community.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0.1}
              icon={<Cpu className="h-8 w-8" />}
              title="IoT Smart Bins"
              description="Real-time fill level monitoring, automated locks, and sensor-based insights for incredibly optimized collection."
            />
            <FeatureCard 
              delay={0.3}
              icon={<Recycle className="h-8 w-8" />}
              title="Organic Exchange"
              description="A digital community marketplace to share and request reusable organic materials like compost and coffee grounds."
            />
            <FeatureCard 
              delay={0.5}
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Secure & Safe"
              description="RFID and app authentication ensures that only authorized users can dispose of sensitive hygiene waste safely."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-white mt-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lightGreen/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-gradient-to-br from-[#1b4332] to-brand-green p-16 md:p-24 rounded-[4rem] shadow-2xl relative overflow-hidden"
          >
            {/* Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 drop-shadow-lg">Join the Green Revolution</h2>
              <p className="text-brand-earth text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Whether you are disposing of hygiene waste safely or participating in the organic exchange, your daily actions shape our future.
              </p>
              <Link to="/locate-bin" className="group bg-white text-[#1b4332] px-10 py-5 rounded-full font-black text-xl inline-flex items-center space-x-3 hover:bg-brand-lightGreen transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105">
                <Map className="h-6 w-6 group-hover:animate-bounce" />
                <span>Find a Smart Bin Near You</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
