import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, History, CreditCard, Leaf, CheckCircle, Zap, QrCode, Phone, Clock, AlertCircle, X, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const WalletDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  
  const [balance, setBalance] = useState(user?.walletBalance || 0);
  const [isRecharging, setIsRecharging] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [isFlipped, setIsFlipped] = useState(false);
  const [transactions, setTransactions] = useState(user?.transactions || []);
  const [rfidStatus, setRfidStatus] = useState(user?.rfidStatus || 'Not Requested');
  
  // Script loading state for Razorpay
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setBalance(user.walletBalance || 0);
      setTransactions(user.transactions || []);
      setRfidStatus(user.rfidStatus || 'Not Requested');
    }
  }, [user]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#2e7d32', '#4caf50', '#81c784'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2e7d32', '#4caf50', '#81c784'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleRequestRFID = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await api.post('/users/request-rfid', {}, config);
      setRfidStatus(res.data.rfidStatus);
      setUser(prev => ({ ...prev, rfidStatus: res.data.rfidStatus }));
      alert('RFID Request submitted successfully! Please wait for Admin approval.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleRazorpayRecharge = async (e) => {
    e.preventDefault();
    if (!isRazorpayLoaded) return alert("Payment gateway is still loading. Please wait a moment.");
    
    setIsRecharging(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const orderRes = await api.post('/wallet/create-order', { amount: parseInt(rechargeAmount) }, config);
      const orderData = orderRes.data;

      const options = {
        key: orderData.key_id, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "KuPPA Wallet",
        description: "Wallet Top-up",
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/wallet/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: parseInt(rechargeAmount)
            }, config);

            setBalance(verifyRes.data.walletBalance);
            setTransactions(verifyRes.data.transactions);
            setUser(prev => ({
              ...prev,
              walletBalance: verifyRes.data.walletBalance,
              transactions: verifyRes.data.transactions
            }));
            
            triggerConfetti();
          } catch (verifyErr) {
            alert(verifyErr.response?.data?.message || 'Payment Verification Failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        },
        theme: {
          color: "#2e7d32"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed! " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error('Recharge init failed', err);
      alert(err.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setIsRecharging(false);
    }
  };

  // --- MOCK RAZORPAY MODAL COMPONENT ---
  const handleMockPaymentSuccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const verifyRes = await api.post('/wallet/verify-payment', {
        razorpay_order_id: mockPaymentData.id,
        razorpay_payment_id: "pay_mock_" + Math.floor(Math.random() * 10000000),
        razorpay_signature: "mock_signature_skipped",
        amount: mockPaymentData.amount
      }, config);

      setBalance(verifyRes.data.walletBalance);
      setTransactions(verifyRes.data.transactions);
      setUser(prev => ({
        ...prev,
        walletBalance: verifyRes.data.walletBalance,
        transactions: verifyRes.data.transactions
      }));
      
      setMockPaymentData(null);
      triggerConfetti();
    } catch (err) {
      alert("Mock Payment Verification Failed");
      setMockPaymentData(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // --- RENDERING DIFFERENT STATES BASED ON RFID STATUS ---

  if (!user) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-brand-green">Loading...</div>;

  if (rfidStatus === 'Not Requested' || rfidStatus === 'Rejected') {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">KuPPA Experience</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">Request your premium physical KuPPA Smart Card to access our network of Smart Bins and unlock your Digital Wallet.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Information & Benefits */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-brand-green rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <CreditCard className="h-12 w-12 text-brand-green mb-6 relative z-10" />
                <h2 className="text-2xl font-bold mb-6 relative z-10">Exclusive Benefits</h2>
                
                <ul className="space-y-6 relative z-10">
                  <motion.li whileHover={{ x: 5 }} className="flex items-start">
                    <div className="bg-brand-green/20 p-2 rounded-xl mr-4 mt-1 backdrop-blur-sm"><Zap className="h-6 w-6 text-brand-green" /></div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Smart Bin Access</h4>
                      <p className="text-sm text-gray-300 mt-1">Tap your card at any physical KuPPA bin for instant, secure access.</p>
                    </div>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} className="flex items-start">
                    <div className="bg-brand-green/20 p-2 rounded-xl mr-4 mt-1 backdrop-blur-sm"><Wallet className="h-6 w-6 text-brand-green" /></div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Digital Wallet</h4>
                      <p className="text-sm text-gray-300 mt-1">Unlock your Razorpay-powered digital wallet for seamless marketplace transactions.</p>
                    </div>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }} className="flex items-start">
                    <div className="bg-brand-green/20 p-2 rounded-xl mr-4 mt-1 backdrop-blur-sm"><Leaf className="h-6 w-6 text-brand-green" /></div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Track Eco-Impact</h4>
                      <p className="text-sm text-gray-300 mt-1">Automatically log your disposals and earn Eco-Points for rewards.</p>
                    </div>
                  </motion.li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column: User Details & Request Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden flex flex-col"
            >
              <div className="border-b border-gray-100/50 p-8 bg-gray-50/30">
                <h3 className="text-2xl font-bold text-gray-900">Confirm Details</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Verify your shipping information before requesting.</p>
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-5 mb-8">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</span>
                      <span className="font-bold text-gray-800 text-lg">{user.name}</span>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Role</span>
                      <span className="font-bold text-brand-green text-lg">{user.role}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex items-center hover:bg-gray-50 transition-colors">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-4 text-brand-green"><Phone className="h-5 w-5" /></div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registered Phone</span>
                      <span className="font-bold text-gray-800 text-lg">{user.phone}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</span>
                    <p className="font-semibold text-gray-800 leading-relaxed text-base">{user.address}</p>
                    <div className="mt-3 inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                      <AlertCircle className="h-3 w-3 mr-1.5" /> Will be dispatched here
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRequestRFID}>
                  <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(46, 125, 50, 0.4), 0 10px 10px -5px rgba(46, 125, 50, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-gradient-to-r from-brand-green to-emerald-600 text-white font-black text-lg py-5 rounded-2xl shadow-lg shadow-brand-green/30 transition-all flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" /> Request Smart Card Now
                  </motion.button>
                  <p className="text-center text-xs text-gray-400 mt-4 font-medium">By requesting, you agree to the KuPPA hardware terms.</p>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (rfidStatus === 'Pending Approval') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[100px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/50 relative z-10"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 border-4 border-amber-100 shadow-inner"
          >
            <Clock className="h-10 w-10 text-amber-500" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Under Review</h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">Your premium RFID Card request has been received and is waiting for Admin approval. We will notify you once dispatched.</p>
          <div className="bg-brand-green/5 text-brand-green p-5 rounded-2xl text-sm flex items-start text-left border border-brand-green/20 shadow-sm">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="font-medium">Your Wallet and Ecosystem features will unlock automatically as soon as your card is approved.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- APPROVED STATE: WALLET UNLOCKED ---
  return (
    <div className="min-h-screen bg-[#f4f7fc] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-600 tracking-tight pb-1">KuPPA Wallet</h1>
            <p className="text-gray-500 font-medium mt-1 text-lg">Manage your digital funds and track your eco-impact.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Virtual Card & Quick Recharge */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* 3D Virtual RFID Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-full h-60 cursor-pointer group perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div 
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
                className="w-full h-full transform-style-3d shadow-2xl rounded-3xl"
              >
                {/* Front of Card */}
                <div className="absolute w-full h-full rounded-3xl p-7 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-brand-green backface-hidden ring-1 ring-white/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green/30 rounded-full blur-3xl -ml-10 -mb-10"></div>
                  
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>

                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">KuPPA Smart Access</p>
                      <div className="flex items-center space-x-2">
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <Zap className="h-4 w-4 text-yellow-400" />
                        </motion.div>
                        <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-md font-black tracking-wider border border-white/10 backdrop-blur-md">ACTIVE</span>
                      </div>
                    </div>
                    <img src="/logo.png" alt="KUPPA Logo" className="h-12 w-12 opacity-100 drop-shadow-lg brightness-0 invert" />
                  </div>

                  <div className="relative z-10">
                    <p className="font-mono text-white/90 text-sm tracking-[0.3em] mb-2 drop-shadow-md">
                      {user?.rfidNumber ? user.rfidNumber.match(/.{1,4}/g).join(' ') : 'XXXX XXXX XXXX'}
                    </p>
                    <h2 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">{user?.name || 'USER NAME'}</h2>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 backface-hidden border border-gray-300 flex flex-col rotate-y-180 shadow-inner">
                  {/* Magnetic Strip */}
                  <div className="w-full h-14 bg-gray-800 mt-6 shadow-sm"></div>
                  
                  <div className="p-6 flex-grow flex items-center justify-between">
                    <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 flex flex-col items-center">
                      <QrCode className="h-16 w-16 text-gray-900" />
                      <span className="text-[9px] font-mono mt-2 text-gray-500 font-bold">{user?.rfidNumber}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Support</p>
                      <p className="text-sm font-black text-brand-green flex items-center justify-end"><Phone className="h-4 w-4 mr-1" /> 1800-KUPPA</p>
                      <p className="text-[9px] text-gray-500 mt-4 leading-relaxed w-36 font-medium">Property of KuPPA Eco-Systems. If found, please return to any smart bin facility.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Live Balance & Recharge Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-gray-500 font-black uppercase tracking-widest text-xs flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-brand-green" /> Digital Balance
                </h3>
              </div>
              <div className="flex items-end space-x-2 mb-8 relative z-10">
                <span className="text-5xl font-black text-gray-900 tracking-tight">₹{balance}</span>
              </div>

              <form onSubmit={handleRazorpayRecharge} className="relative z-10">
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top-up Amount</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-green font-black text-xl transition-colors">₹</span>
                    <input 
                      type="number" 
                      min="1" 
                      step="1"
                      required
                      value={rechargeAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setRechargeAmount(val);
                        } else if (e.target.value === '') {
                          setRechargeAmount('');
                        }
                      }}
                      className="w-full h-16 pl-12 pr-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent focus:bg-white font-black text-2xl text-gray-900 transition-all shadow-inner"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(46, 125, 50, 0.4), 0 10px 10px -5px rgba(46, 125, 50, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isRecharging || !rechargeAmount || rechargeAmount <= 0}
                  className="w-full bg-gradient-to-r from-brand-green to-emerald-600 disabled:opacity-50 text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-brand-green/30 transition-all flex items-center justify-center text-lg"
                >
                  {isRecharging ? (
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>Recharge Wallet</>
                  )}
                </motion.button>
              </form>
            </motion.div>
            
            {/* Eco Impact Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-brand-green to-emerald-700 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/20"
              >
                <Leaf className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="font-black text-2xl mb-2">Your Eco-Impact</h3>
              <p className="text-green-50 text-sm mb-6 font-medium leading-relaxed">By safely disposing of organic waste, you have prevented significant soil and water contamination.</p>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-black text-white shadow-inner w-full border border-white/30 text-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 mr-2" /> {user?.ecoPoints || 0} Eco Points
              </div>
            </motion.div>

          </div>

          {/* Right Column: Transaction History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-gray-100/50 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-black text-gray-900 flex items-center text-2xl">
                  <History className="h-7 w-7 mr-3 text-brand-green" /> Transaction Ledger
                </h3>
                <span className="text-xs font-black text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full border border-brand-green/20">Live</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {transactions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <History className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Transactions Yet</h3>
                    <p className="text-gray-500 font-medium">Your wallet activity will appear here once you make a recharge or earn from exchanges.</p>
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {transactions.map((tx, index) => (
                      <motion.div 
                        key={index} 
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="p-5 bg-white border border-gray-100 transition-all flex items-center justify-between group rounded-2xl shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${tx.type === 'recharge' ? 'bg-brand-green/10' : tx.type === 'exchange_earning' ? 'bg-emerald-100' : 'bg-red-50'}`}>
                            {tx.type === 'recharge' ? (
                              <ArrowDownRight className="h-7 w-7 text-brand-green" />
                            ) : tx.type === 'exchange_earning' ? (
                              <ArrowDownRight className="h-7 w-7 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="h-7 w-7 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg group-hover:text-brand-green transition-colors">{tx.desc}</p>
                            <div className="flex items-center text-xs font-bold text-gray-500 mt-1.5 space-x-3">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-md">{tx.date}</span>
                              <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle className="h-3 w-3 mr-1" /> Success
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-black block ${tx.type === 'recharge' ? 'text-brand-green' : tx.type === 'exchange_earning' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {tx.type === 'recharge' || tx.type === 'exchange_earning' ? '+' : '-'}₹{tx.amount}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* MOCK RAZORPAY MODAL */}
      <AnimatePresence>
        {mockPaymentData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
            >
              {/* Modal Header */}
              <div className="bg-brand-green p-6 text-white flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl leading-tight">Secure Checkout</h3>
                    <p className="text-green-100 text-xs font-bold mt-1 uppercase tracking-widest">Test Mode (Mock)</p>
                  </div>
                </div>
                <button onClick={() => setMockPaymentData(null)} className="text-green-200 hover:text-white transition-colors bg-black/10 p-2 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-8">
                <div className="text-center mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-black mb-2">Amount to Pay</p>
                  <div className="text-5xl font-black text-gray-900 flex justify-center items-start">
                    <span className="text-2xl mt-2 mr-1 text-brand-green">₹</span>{mockPaymentData.amount}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Select Payment Method</p>
                  
                  <div className="border-2 border-brand-green bg-brand-green/5 p-4 rounded-2xl flex items-center cursor-pointer relative overflow-hidden group hover:bg-brand-green/10 transition-colors shadow-sm">
                    <div className="h-12 w-12 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center mr-4">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-lg">UPI ID / QR</h4>
                      <p className="text-xs font-bold text-gray-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                    <div className="h-6 w-6 rounded-full border-4 border-brand-green bg-white shadow-inner"></div>
                  </div>

                  <div className="border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl flex items-center opacity-60 cursor-not-allowed">
                    <div className="h-12 w-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-500 text-lg">Credit / Debit Card</h4>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 mb-8 flex items-start shadow-sm">
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-amber-600" />
                  <p className="font-medium leading-relaxed">This is a <b>Test Environment</b>. No real money will be deducted from your account during this transaction.</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMockPaymentSuccess}
                  className="w-full bg-brand-green hover:bg-[#205823] text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-green/30 transition-all flex items-center justify-center text-xl"
                >
                  Pay ₹{mockPaymentData.amount} Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WalletDashboard;
