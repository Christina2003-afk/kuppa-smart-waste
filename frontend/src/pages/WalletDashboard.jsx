import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, History, CreditCard, Leaf, CheckCircle, Zap, QrCode, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

const WalletDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  
  const [balance, setBalance] = useState(user?.walletBalance || 0);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [isFlipped, setIsFlipped] = useState(false);
  const [transactions, setTransactions] = useState(user?.transactions || []);
  
  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setBalance(user.walletBalance || 0);
      setTransactions(user.transactions || []);
    }
  }, [user]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#059669', '#34d399']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#059669', '#34d399']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    setIsRecharging(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await api.post(`/users/${user._id}/transaction`, {
        type: 'recharge',
        amount: parseInt(rechargeAmount),
        desc: 'Recharge via UPI'
      }, config);
      
      setBalance(res.data.walletBalance);
      setTransactions(res.data.transactions);
      
      // Update AuthContext user object so it reflects globally
      setUser(prev => ({
        ...prev,
        walletBalance: res.data.walletBalance,
        transactions: res.data.transactions
      }));

      triggerConfetti();
    } catch (err) {
      console.error('Recharge failed', err);
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      alert(`Recharge failed: ${errorMsg}`);
    } finally {
      setIsRecharging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 perspective-1000">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-brand-darkBlue tracking-tight">KuPPA Wallet</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your funds and track your eco-impact.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Virtual Card & Quick Recharge */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 3D Virtual RFID Card */}
            <div 
              className="relative w-full h-56 cursor-pointer group perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front of Card */}
                <div className="absolute w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-gradient-to-br from-brand-darkBlue via-[#0a2342] to-brand-green backface-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-lightGreen/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">KuPPA Access Card</p>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded font-bold backdrop-blur-sm">ACTIVE</span>
                      </div>
                    </div>
                    <img src="/logo.png" alt="KUPPA Logo" className="h-10 w-10 opacity-90 drop-shadow-md brightness-0 invert" />
                  </div>

                  <div className="relative z-10">
                    <p className="font-mono text-white/80 text-sm tracking-widest mb-1">
                      {user?._id?.substring(0, 4).toUpperCase()} {user?._id?.substring(4, 8).toUpperCase()} {user?._id?.substring(8, 12).toUpperCase()} {user?._id?.substring(12, 16).toUpperCase()}
                    </p>
                    <h2 className="text-xl font-bold text-white tracking-wide">{user?.name?.toUpperCase() || 'USER NAME'}</h2>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100 backface-hidden rotate-y-180 border border-gray-300 flex flex-col">
                  {/* Magnetic Strip */}
                  <div className="w-full h-12 bg-gray-800 mt-6"></div>
                  
                  <div className="p-4 flex-grow flex items-center justify-between">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                      <QrCode className="h-16 w-16 text-gray-900" />
                      <span className="text-[8px] font-mono mt-1 text-gray-500">{user?._id?.substring(0, 10)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-600 mb-1">Customer Support</p>
                      <p className="text-sm font-bold text-gray-900 flex items-center justify-end"><Phone className="h-3 w-3 mr-1" /> 1800-KUPPA-HELP</p>
                      <p className="text-[10px] text-gray-500 mt-4 leading-tight w-32">This card is property of KuPPA. If found, please return to any smart bin facility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Balance & Recharge Card with Slider */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm flex items-center">
                  <Wallet className="h-4 w-4 mr-2" /> Current Balance
                </h3>
              </div>
              <div className="flex items-end space-x-2 mb-6">
                <span className="text-4xl font-black text-gray-900 transition-all duration-1000 ease-out">₹{balance}</span>
              </div>

              <form onSubmit={handleRecharge}>
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Drag to Recharge</label>
                    <span className="text-lg font-black text-brand-green">₹{rechargeAmount}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="100" 
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>₹100</span>
                    <span>₹2000</span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isRecharging}
                  className="w-full bg-brand-green hover:bg-brand-darkBlue text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center transform hover:-translate-y-1"
                >
                  {isRecharging ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-1" /> Add ₹{rechargeAmount} instantly
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Eco Impact Widget */}
            <div className="bg-gradient-to-br from-green-50 to-brand-lightGreen/10 rounded-2xl shadow-sm border border-brand-green/20 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border border-brand-green/20">
                <Leaf className="h-8 w-8 text-brand-green" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">Your Eco-Impact</h3>
              <p className="text-gray-600 text-sm mb-4">By safely disposing of hygiene waste, you have prevented significant soil and water contamination.</p>
              <div className="bg-white px-4 py-2 rounded-lg font-black text-brand-green shadow-sm w-full border border-green-100">
                15.2 kg CO₂ Saved
              </div>
            </div>

          </div>

          {/* Right Column: Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center text-lg">
                  <History className="h-5 w-5 mr-2 text-brand-green" /> Transaction Ledger
                </h3>
                <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">Real-time</span>
              </div>
              
              <div className="p-2">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No transactions yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group rounded-xl m-2">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${tx.type === 'recharge' ? 'bg-green-100' : 'bg-red-50'}`}>
                            {tx.type === 'recharge' ? (
                              <ArrowDownRight className="h-6 w-6 text-green-600" />
                            ) : (
                              <ArrowUpRight className="h-6 w-6 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-brand-darkBlue transition-colors">{tx.description}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span className="flex items-center text-green-600 font-medium">
                                <CheckCircle className="h-3 w-3 mr-1" /> {tx.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-lg ${tx.type === 'recharge' ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.type === 'recharge' ? '+' : '-'}₹{tx.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
