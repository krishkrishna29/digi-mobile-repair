import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { WrenchScrewdriverIcon, Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-white hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider ${isActive ? 'text-purple-300' : ''}`}>
      {children}
    </Link>
  );
};

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsOpen(false);
      navigate('/login');
    });
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/" className="text-xl font-bold">DIGI Mobile Repair And Services - Ballari</Link>
      {user && (
        <>
          <NavLink to="/dashboard" onClick={closeMobileMenu}>Dashboard</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={closeMobileMenu}>Admin</NavLink>}
        </>
      )}
    </>
  );

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-[1000]">
      {/* Top Bar */}
      <div className="bg-gray-800 bg-opacity-50 px-6 py-2">
        <div className="flex justify-between items-center text-xs text-gray-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-blue-400" />
              <span>+91-8888888888</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-blue-400" />
              <span>wellsupport@email.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedin /></a>
            <a href="#" className="hover:text-white"><FaYoutube /></a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <WrenchScrewdriverIcon className="h-8 w-8 mr-3 text-blue-400" />
          <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMobileMenu}>About Us</NavLink>
          
        </div>
        <nav className="hidden md:flex items-center">
          {navLinks}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
        {user ? (
            <button onClick={handleSignOut} className="text-white hover:text-blue-300 px-4 py-2 rounded-md text-sm font-medium">Sign Out</button>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-white hover:text-purple-300 py-2 px-4">Login</Link>
            <Link to="/signup" className="text-sm font-medium text-white hover:text-purple-300 py-2 px-4">Sign Up</Link>
          </>
        )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 md:hidden">
            <div className="flex flex-col items-start p-4">
                {navLinks}
                <div className="border-t border-gray-800 w-full mt-4 pt-4">
                {user ? (
                    <button onClick={handleSignOut} className="text-white hover:text-gray-300 w-full text-left px-3 py-2 rounded-md text-sm font-medium">Sign Out</button>
                ) : (
                  <div className="flex flex-col items-start">
                    <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
                    <NavLink to="/signup" onClick={closeMobileMenu}>Sign Up</NavLink>
                  </div>
                )}
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;