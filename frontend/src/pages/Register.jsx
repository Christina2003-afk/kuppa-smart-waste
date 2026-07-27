import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import LocationPickerMap from '../components/LocationPickerMap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '', // Stores the map string
    password: '',
    confirmPassword: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, googleLogin, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let err = '';
    switch (name) {
      case 'name':
        if (value && !/^[A-Za-z\s]+$/.test(value)) {
          err = 'Name must contain only letters and spaces';
        }
        break;
      case 'phone':
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          err = 'Phone number must be 10 digits and start with 6, 7, 8, or 9';
        } else if (value && /^(\d)\1{9}$/.test(value)) {
          err = 'Phone number cannot be all identical digits';
        }
        break;
      case 'email':
        if (value && !value.endsWith('@gmail.com')) {
          err = 'Email must be a @gmail.com address';
        }
        break;
      case 'password':
        // At least 8 chars, 1 uppercase, 1 number, 1 special character
        if (value && !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value)) {
          err = 'Password must be at least 8 chars, with 1 uppercase, 1 number, and 1 special char';
        }
        break;
      default:
        break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const err = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleLocationSelect = useCallback((locationStr) => {
    setFormData(prev => ({ ...prev, address: locationStr }));
    setFieldErrors(prev => ({ ...prev, address: locationStr ? '' : 'Please select a location on the map' }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Validate all fields before submission
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'address') {
        const err = validateField(key, formData[key]);
        if (err) errors[key] = err;
      }
    });

    if (!formData.address) {
      errors.address = 'Please select a location on the map';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      navigate('/');
    } catch (err) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-white flex overflow-hidden">
      <div className="hidden md:flex md:w-5/12 relative bg-[#1b4332] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Sustainable Environment" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBlue via-transparent to-transparent z-10 opacity-80"></div>
        
        <div className="relative z-20 p-12 text-white max-w-lg">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/30">
              <Leaf className="h-5 w-5 text-[#ffc107]" />
              <span className="text-sm font-semibold tracking-wider uppercase">Join The Green Revolution</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
              Transforming <span className="text-[#ffc107]">Waste</span> into <br/><span className="text-brand-lightGreen">Worth</span>.
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed font-light">
              Become part of a smart, community-driven network that safely manages hygiene waste and shares valuable organic resources.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full md:w-7/12 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-20 bg-[#f8fafc] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-green hover:text-brand-darkBlue transition-colors inline-flex items-center space-x-1">
                <span>Sign in</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>

          <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-[2rem] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green to-[#ffc107]"></div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {(error || localError) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-700 font-medium">{error || localError}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white ${fieldErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-green'}`} placeholder="John Doe" />
                  </div>
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white ${fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-green'}`} placeholder="you@gmail.com" />
                  </div>
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white ${fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-green'}`} placeholder="10-digit number" />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.phone}</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2 border-b border-gray-200 pb-2">
                  <Leaf className="h-4 w-4 text-brand-green" />
                  <span>Service Location (Kerala Only)</span>
                </h3>
                <LocationPickerMap onLocationSelect={handleLocationSelect} />
                {fieldErrors.address && <p className="mt-2 text-xs text-red-500 font-medium">{fieldErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white ${fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-green'}`} placeholder="••••••••" />
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-500 font-medium leading-tight">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white focus:bg-white" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center space-x-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand-green hover:bg-[#235e26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-75 cursor-not-allowed transform-none' : ''}`}
                >
                  <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
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
                  />
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
