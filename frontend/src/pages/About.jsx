import React, { useRef } from 'react';
import { Target, Users, Zap, CheckCircle2, ArrowRight, ShieldCheck, Activity, Leaf, Cpu, Globe, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. BRIGHT & AIRY HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100">
        
        {/* Abstract Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-10 md:left-1/4 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></motion.div>
          <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 right-10 md:right-1/4 w-48 h-48 bg-brand-lightGreen/20 rounded-full blur-3xl opacity-60"></motion.div>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }} className="inline-flex items-center space-x-2 bg-white px-5 py-2 rounded-full mb-8 shadow-sm border border-gray-100 text-brand-green font-bold uppercase tracking-widest text-sm">
            <Globe className="h-4 w-4" />
            <span>Our Vision</span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Building a <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">Smarter Earth.</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            KuPPA isn't just about managing waste; it's about redefining how communities interact with their environment through pure intelligence and automation.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="animate-bounce mt-10">
            <ArrowDown className="h-8 w-8 text-gray-400 mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE JOURNEY TIMELINE */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">The Journey of Waste</h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">See how we intercept the traditional crisis and turn it into a sustainable loop.</p>
        </div>

        <div className="relative border-l-4 border-gray-200 ml-4 md:ml-1/2 md:translate-x-[50%] left-0 space-y-24">
          
          {/* Timeline Node 1: The Crisis */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring" }} className="relative flex items-center md:justify-end md:w-full w-[90%] -left-4 md:-left-[100%] pr-0 md:pr-12">
            <div className="hidden md:block w-1/2"></div>
            <div className="absolute top-1/2 -mt-4 -left-[22px] md:right-[-22px] md:left-auto w-10 h-10 rounded-full bg-red-100 border-4 border-white flex items-center justify-center z-10 shadow-md">
              <Activity className="h-5 w-5 text-red-500" />
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 ml-12 md:ml-0 w-full max-w-lg relative group">
              <div className="absolute inset-0 bg-red-500/5 rounded-3xl transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mr-3">Phase 1</span> The Blind Crisis</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Traditional bins overflow with hazardous hygiene waste. Authorities have no visibility, leading to delayed collections, spreading diseases, and wasted fuel from inefficient truck routing.</p>
              </div>
            </div>
          </motion.div>

          {/* Timeline Node 2: Smart Interception */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring", delay: 0.2 }} className="relative flex items-center md:justify-start w-[90%] md:w-full -left-4 md:left-0 pl-0 md:pl-12">
            <div className="absolute top-1/2 -mt-4 -left-[22px] w-10 h-10 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10 shadow-md">
              <Cpu className="h-5 w-5 text-blue-500" />
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 ml-12 md:ml-0 w-full max-w-lg relative group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-3">Phase 2</span> AI & IoT Integration</h3>
                <p className="text-gray-600 leading-relaxed text-lg">KuPPA Smart Bins are deployed. They securely lock to prevent unauthorized dumping and use advanced ultrasonic sensors to send real-time fill-level data directly to our AI routing engine.</p>
              </div>
            </div>
          </motion.div>

          {/* Timeline Node 3: The Circular Solution */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring", delay: 0.4 }} className="relative flex items-center md:justify-end md:w-full w-[90%] -left-4 md:-left-[100%] pr-0 md:pr-12">
            <div className="absolute top-1/2 -mt-4 -left-[22px] md:right-[-22px] md:left-auto w-10 h-10 rounded-full bg-brand-lightGreen/30 border-4 border-white flex items-center justify-center z-10 shadow-md">
              <Leaf className="h-5 w-5 text-brand-green" />
            </div>
            <div className="bg-brand-green text-white p-8 rounded-3xl shadow-2xl ml-12 md:ml-0 w-full max-w-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center"><span className="bg-brand-lightGreen text-brand-darkBlue px-3 py-1 rounded-full text-sm mr-3">Phase 3</span> A Circular Economy</h3>
                <p className="text-brand-earth leading-relaxed text-lg">Waste is collected exactly when needed, saving massive carbon emissions. Meanwhile, clean organic waste is exchanged freely between community members through our app.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. THE BENTO BOX GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Our DNA</h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">The principles that drive every single line of code we write.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Large Hero Bento - Sustainability */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-2 md:row-span-2 bg-emerald-50 rounded-[2rem] p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-0 group-hover:opacity-20 bg-cover bg-center transition-opacity duration-700 mix-blend-multiply"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="bg-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                <Target className="h-8 w-8 text-emerald-700" />
              </div>
              <div className="mt-12">
                <h3 className="text-4xl font-black text-emerald-900 mb-4">Sustainability First.</h3>
                <p className="text-emerald-800 text-xl font-light leading-relaxed">We believe that turning waste into worth is the only path forward. Every feature we build is designed to prevent hazardous landfill contamination and foster green reuse.</p>
              </div>
            </div>
          </motion.div>

          {/* Medium Horizontal Bento - Innovation */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-2 md:row-span-1 bg-blue-50 rounded-[2rem] p-8 relative overflow-hidden group flex items-center justify-between">
            <div className="z-10 w-2/3">
              <div className="bg-blue-200 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4">
                <Zap className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Relentless Innovation</h3>
              <p className="text-blue-800 text-lg font-light">Leveraging state-of-the-art IoT sensors and AI prediction models.</p>
            </div>
            <div className="w-1/3 flex justify-end">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                <Cpu className="h-10 w-10 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Small Square Bento 1 - Community */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="md:col-span-1 md:row-span-1 bg-orange-50 rounded-[2rem] p-8 flex flex-col items-center text-center justify-center group">
            <div className="bg-orange-200 w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">
              <Users className="h-6 w-6 text-orange-700" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 mb-2">Community</h3>
            <p className="text-orange-800 text-sm font-light">Localized sharing networks.</p>
          </motion.div>

          {/* Small Square Bento 2 - Metric */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-[2rem] p-8 flex flex-col items-center text-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <h3 className="text-6xl font-black text-brand-lightGreen mb-2 relative z-10">100<span className="text-2xl text-white">%</span></h3>
            <p className="text-gray-300 font-medium relative z-10">Commitment</p>
          </motion.div>

        </div>
      </section>

      {/* 4. ALTERNATING DARK THEME CTA */}
      <section className="mt-20 bg-[#1b4332] py-32 px-4 relative overflow-hidden rounded-t-[4rem]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-lightGreen/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Ready to join us?</h2>
            <p className="text-2xl text-gray-400 font-light mb-12">
              Be a part of the platform that is changing the fabric of hygiene waste management.
            </p>
            <button className="bg-white text-[#1b4332] font-black text-xl px-12 py-6 rounded-full hover:scale-105 hover:bg-brand-lightGreen hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] transition-all duration-300">
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
