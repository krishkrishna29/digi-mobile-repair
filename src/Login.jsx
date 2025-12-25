import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import { EnvelopeIcon, LockClosedIcon, WrenchScrewdriverIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successfully!');
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Incorrect user ID/password');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center text-white"
      style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20240424/pngtree-top-view-of-a-technician-repairing-a-smartphone-image_15665833.jpg)' }}
    >
      {/* Left side with illustration and hero text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-black bg-opacity-50 relative shadow-2xl">
        <div className="text-center p-6 md:p-10 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leave Your Smartphone Problems To Us</h1>
          <p className="text-lg md:text-xl text-gray-200">Fast, reliable, and affordable smartphone repair services.</p>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center">
          <WrenchScrewdriverIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-400 mr-2" />
          <span className="font-semibold text-lg md:text-xl">DIGI Mobile Repair</span>
        </div>
      </div>

      {/* Right side with the form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-black bg-opacity-60 shadow-2xl">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-70 p-8 rounded-lg">
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-600 rounded-full p-3 md:p-4 mb-4">
              <EnvelopeIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">Login</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6 relative">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4" />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6 relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50 text-base md:text-lg">LOGIN</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? {' '}
            <Link to="/signup" className="font-medium text-purple-400 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
