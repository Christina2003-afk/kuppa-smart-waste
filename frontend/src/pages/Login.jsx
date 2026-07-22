import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, googleLogin, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.role === 'Admin') {
        navigate('/admin');
      } else if (res.role === 'Staff') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Environment" 
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b4332]/80 to-brand-darkBlue/90 mix-blend-multiply z-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-20"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-xl"
          >
            <Leaf className="h-8 w-8 text-[#ffc107]" />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
            Welcome Back
          </h2>
          <p className="text-base text-gray-200 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#ffc107] hover:text-white transition-colors inline-flex items-center space-x-1 group underline decoration-[#ffc107]/50 underline-offset-4">
              <span>Sign up for free</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-[2rem] border border-white/20 relative overflow-hidden group">
          {/* Animated top gradient line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-[#ffc107] to-brand-green bg-[length:200%_auto] animate-gradient"></div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {(error || localError) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700 font-medium">{error || localError}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white"
                  placeholder="hello@kuppa.eco"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-brand-green hover:text-brand-darkBlue transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-green transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center space-x-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand-green hover:bg-[#235e26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all transform hover:-translate-y-1 ${isSubmitting ? 'opacity-75 cursor-not-allowed transform-none' : ''}`}
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center transform transition-transform hover:scale-105">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await googleLogin(credentialResponse.credential);
                      if (res.role === 'Admin') {
                        navigate('/admin');
                      } else if (res.role === 'Staff') {
                        navigate('/staff');
                      } else {
                        navigate('/');
                      }
                    } catch (err) {
                      setLocalError('Google Sign-In failed');
                    }
                  }}
                  onError={() => {
                    setLocalError('Google Sign-In Failed');
                  }}
                  shape="pill"
                  theme="outline"
                  size="large"
                />
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
