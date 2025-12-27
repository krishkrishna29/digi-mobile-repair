import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { WrenchScrewdriverIcon, Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const NavLink = ({ to, children, onClick, isMobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`font-medium tracking-wide transition-colors duration-200 ${
        isActive ? 'text-purple-400' : 'text-gray-100 hover:text-purple-300'
      } ${isMobile ? 'block py-3 text-lg' : 'px-4 py-2 text-sm uppercase'}`}
    >
      {children}
    </Link>
  );
};

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] =useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasActivePromotions, setHasActivePromotions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    const promosQuery = query(collection(db, 'promotions'));
    const promosUnsubscribe = onSnapshot(promosQuery, (snapshot) => {
      const activePromos = snapshot.docs.some(d => {
        const promo = d.data();
        return !promo.expiryDate || promo.expiryDate.toDate() > new Date();
      });
      setHasActivePromotions(activePromos);
    });

    return () => {
      authUnsubscribe();
      promosUnsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setIsOpen(false);
      navigate('/login');
    });
  };

  const closeMobileMenu = () => setIsOpen(false);

  const mainNavLinks = [
    { to: '/', text: 'Home' },
    { to: '/about', text: 'About Us' },
    { to: '/promotions', text: 'Promotions', icon: hasActivePromotions && <SparklesIcon className="inline-block w-4 h-4 ml-1 text-yellow-400 animate-pulse" /> },
  ];

  const userNavLinks = user ? [
    { to: '/dashboard', text: 'Dashboard' },
    ...(isAdmin ? [{ to: '/admin', text: 'Admin' }] : []),
  ] : [];

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-[1000]">
      {/* Top Contact Bar */}
      <div className="bg-gray-800 bg-opacity-50 px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center text-xs text-gray-300">
          <div className="flex-wrap flex items-center gap-x-6 gap-y-1">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-purple-400" />
              <span>+91-8888888888</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-purple-400" />
              <span>wellsupport@email.com</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <WrenchScrewdriverIcon className="h-8 w-8 text-purple-400" />
          <span className="hidden sm:block text-lg font-bold whitespace-nowrap">DIGI Mobile Repair</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-2">
          {mainNavLinks.map(link => <NavLink key={link.to} to={link.to}>{link.text}{link.icon}</NavLink>)}
          {userNavLinks.map(link => <NavLink key={link.to} to={link.to}>{link.text}</NavLink>)}
        </nav>
        
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <button onClick={handleSignOut} className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-purple-300 py-2 px-4">Login</Link>
              <Link to="/signup" className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[-1] bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      ></div>
      
      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-xl z-[999] transform transition-transform lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
            <nav className="flex-grow">
              {[...mainNavLinks, ...userNavLinks].map(link => (
                <NavLink key={link.to} to={link.to} onClick={closeMobileMenu} isMobile>{link.text}{link.icon}</NavLink>
              ))}
            </nav>

            <div className="border-t border-gray-700 pt-4">
              {user ? (
                <button onClick={handleSignOut} className="w-full text-left font-medium bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition-colors">Sign Out</button>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={closeMobileMenu} className="block w-full text-center font-medium border border-purple-500 text-purple-300 hover:bg-purple-500/10 py-3 px-4 rounded-md transition-colors">Login</Link>
                  <Link to="/signup" onClick={closeMobileMenu} className="block w-full text-center font-medium bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition-colors">Sign Up</Link>
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
