import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserIcon, EnvelopeIcon, LockClosedIcon, WrenchScrewdriverIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters long.';
    } else if (fullName.trim().length > 100) {
      newErrors.fullName = 'Full Name cannot be more than 100 characters.';
    } else if (!/^[a-zA-Z\s]*$/.test(fullName)) {
      newErrors.fullName = 'Full Name must only contain letters and spaces.';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/.test(email)) {
      newErrors.email = 'Email address is invalid. It must be lowercase and end with .com';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/(?=.*[0-9])/.test(password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    }
    
    return newErrors;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signup successful!');
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        role: 'user'
      });
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Email address is already in use.' });
      } else {
        setErrors({ form: 'Incorrect user ID/password' });
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
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div className="mb-4">
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4"/>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {errors.form && <p className="text-red-500 text-sm text-center mb-4">{errors.form}</p>}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50 text-base md:text-lg">SIGN UP</button>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account? {' '}
              <Link to="/login" className="font-medium text-purple-400 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
