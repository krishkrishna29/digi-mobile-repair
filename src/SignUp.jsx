import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserIcon, EnvelopeIcon, LockClosedIcon, WrenchScrewdriverIcon, EyeIcon, EyeSlashIcon, UserGroupIcon, PhoneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validate = () => {
    if (!fullName.trim()) {
      toast.error('Full Name is required.');
      return false;
    } else if (fullName.trim().length < 3) {
      toast.error('Full Name must be at least 3 characters long.');
      return false;
    } else if (fullName.trim().length > 100) {
      toast.error('Full Name cannot be more than 100 characters.');
      return false;
    } else if (!/^[a-zA-Z\s]*$/.test(fullName)) {
      toast.error('Full Name must only contain letters and spaces.');
      return false;
    }

    if (!email) {
      toast.error('Email is required.');
      return false;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/.test(email)) {
      toast.error('Email address is invalid. It must be lowercase and end with .com');
      return false;
    }
    
    if (!phoneNumber) {
      toast.error('Phone number is required.');
      return false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
        toast.error('Phone number must be 10 digits.');
        return false;
    }

    if (!password) {
      toast.error('Password is required.');
      return false;
    } else if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
      return false;
    } else if (!/(?=.*[0-9])/.test(password)) {
      toast.error('Password must contain at least one number.');
      return false;
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      toast.error('Password must contain at least one special character (!@#$%^&*).');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signup successful!');
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        phoneNumber,
        role: role // Use the state for role
      });
      
      // Redirect based on role
      if (role === 'delivery') {
        navigate('/delivery');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email address is already in use.');
      } else {
        toast.error('Incorrect user ID/password');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center text-white"
      style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20240424/pngtree-top-view-of-a-technician-repairing-a-smartphone-image_15665833.jpg)' }}
    >
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

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-black bg-opacity-60 shadow-2xl">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-70 p-8 rounded-lg">
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-600 rounded-full p-3 md:p-4 mb-4">
              <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">Sign up</h3>
          </div>
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
                <div className="relative">
                    <UserIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4" />
                    <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" />
                </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4"/>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4"/>
                <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" />
              </div>
            </div>
            <div className="mb-4">
                <div className="relative">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4"/>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                </div>
            </div>

            {/* Role Selection - Hidden by default for backward compatibility */}
            <div className="mb-4 hidden">
                <div className="relative">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4" />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)} 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg"
                    >
                      <option value="user">User</option>
                      <option value="delivery">Delivery Partner</option>
                      <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50 text-base md:text-lg">SIGN UP</button>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account? { ' '}
              <Link to="/login" className="font-medium text-purple-400 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}