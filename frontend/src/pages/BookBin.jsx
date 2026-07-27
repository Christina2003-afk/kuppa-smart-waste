import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clock, Wallet, CheckCircle, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';
import api from '../services/api';

const BookBin = () => {
  const { binId } = useParams();
  const [searchParams] = useSearchParams();
  const timeParam = parseInt(searchParams.get('time')) || 10;
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bin, setBin] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeParam * 60);
  const [walletBalance, setWalletBalance] = useState(500); // Mock starting balance
  
  const [disposalState, setDisposalState] = useState('waiting'); // 'waiting', 'weighing', 'completed', 'expired'
  const [disposalData, setDisposalData] = useState(null);

  useEffect(() => {
    const fetchBin = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/bins', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const selectedBin = data.find(b => b._id === binId);
        if (selectedBin) setBin(selectedBin);
      } catch (err) {
        console.error('Failed to fetch bin details');
      }
    };
    fetchBin();
  }, [binId]);

  useEffect(() => {
    if (disposalState !== 'waiting') return;
    
    if (timeLeft <= 0) {
      setDisposalState('expired');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, disposalState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSimulateDisposal = () => {
    setDisposalState('weighing');
    
    // Simulate Load Cell weighing for 2 seconds
    setTimeout(() => {
      const weightKg = (Math.random() * 3 + 0.5).toFixed(2); // Random weight between 0.5 and 3.5 kg
      const cost = Math.round(weightKg * 20); // 20 KuPPA Coins per kg
      
      setDisposalData({ weight: weightKg, cost: cost });
      setWalletBalance(prev => prev - cost);
      setDisposalState('completed');
    }, 2500);
  };

  if (!bin) return <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center"><div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-brand-darkBlue mb-2">Active Drop-off Session</h1>
          <p className="text-gray-500 font-medium">{bin.name}</p>
        </div>

        {/* Wallet Dashboard */}
        <div className="bg-brand-darkBlue text-white rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-white/70 text-sm font-semibold mb-1 uppercase tracking-wider">KuPPA Wallet</p>
              <div className="flex items-center space-x-2">
                <Wallet className="h-6 w-6 text-brand-lightGreen" />
                <span className="text-3xl font-black">₹{walletBalance}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm font-semibold mb-1">User ID</p>
              <p className="font-mono text-sm bg-white/10 px-2 py-1 rounded">{user?._id?.substring(18, 24).toUpperCase() || 'USR001'}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          
          {disposalState === 'waiting' && (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-gray-100 stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="none"></circle>
                  <circle 
                    className="text-brand-green stroke-current transition-all duration-1000 ease-linear" 
                    strokeWidth="6" strokeLinecap="round" cx="50" cy="50" r="44" fill="none"
                    strokeDasharray="276" strokeDashoffset={276 - (276 * timeLeft) / (timeParam * 60)}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className="h-6 w-6 text-brand-green mb-1" />
                  <span className="text-2xl font-black text-gray-800">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Slot Reserved</h2>
              <p className="text-gray-500 mb-6 text-sm font-medium">Please arrive at the bin before the timer expires. Tap your physical RFID card to unlock the lid.</p>
              
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-left">
                <ShieldCheck className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-900 mb-1">Hardware Instructions</p>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4">
                    <li>Tap your KuPPA RFID card on the scanner.</li>
                    <li>Wait for the beep and green light.</li>
                    <li>Drop the tightly sealed waste bag inside.</li>
                    <li>Close the lid. The load cell will measure the weight.</li>
                  </ol>
                </div>
              </div>

              <button 
                onClick={handleSimulateDisposal}
                className="mt-8 w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>🧪 Simulate RFID Tap & Drop</span>
              </button>
            </div>
          )}

          {disposalState === 'weighing' && (
            <div className="p-12 text-center flex flex-col items-center justify-center bg-gray-50">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center animate-pulse">
                  <Scale className="h-10 w-10 text-brand-green" />
                </div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Measuring Load...</h2>
              <p className="text-gray-500 text-sm font-medium">The internal load cell is calculating the weight of your disposal.</p>
            </div>
          )}

          {disposalState === 'completed' && (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Disposal Successful!</h2>
              <p className="text-green-600 font-bold text-sm mb-6">Thank you for disposing responsibly.</p>
              
              <div className="w-full bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-brand-lightGreen"></div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Digital Receipt</h3>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 font-medium">Measured Weight</span>
                  <span className="font-bold text-gray-900">{disposalData.weight} kg</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Rate per kg</span>
                  <span className="font-bold text-gray-900">₹20</span>
                </div>
                
                <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">Total Deducted</span>
                  <span className="text-lg font-black text-red-500">-₹{disposalData.cost}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/locate-bin')}
                className="w-full py-3 bg-brand-green hover:bg-brand-darkBlue text-white font-bold rounded-xl shadow-md transition-all"
              >
                Back to Map
              </button>
            </div>
          )}

          {disposalState === 'expired' && (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Slot Expired</h2>
              <p className="text-gray-600 text-sm font-medium mb-8">You did not tap your RFID card in the given time. This slot has been released for other users.</p>
              <button 
                onClick={() => navigate('/locate-bin')}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
              >
                Back to Map
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookBin;
