import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import NewRepairRequest from './NewRepairRequest';
import Login from './Login';
import SignUp from './SignUp';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Payment from './Payment';
import Home from './pages/Home';
import Navigation from './Navigation';
import Services from './pages/Services';
import About from './pages/About';
import Footer from './components/Footer';
import UserProfile from './UserProfile';

function App() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup', '/services', '/about'].includes(location.pathname);

  const [users, setUsers] = useState({});
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersData = {};
        snapshot.forEach(doc => {
            usersData[doc.id] = { uid: doc.id, ...doc.data() };
        });
        setUsers(usersData);
    });

    const unsubscribeRepairs = onSnapshot(collection(db, 'repairs'), (snapshot) => {
      const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRepairs(repairsData);
    });

    return () => {
        unsubscribeUsers();
        unsubscribeRepairs();
    };
  }, []);

  const renderContent = () => (
    <main className="flex-grow">
      <Routes>
        {/* Routes with the main navigation bar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/new-repair-request" element={<PrivateRoute><NewRepairRequest /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard users={users} repairs={repairs} setUsers={setUsers} /></AdminRoute>} />
        <Route path="/user/:userId" element={<AdminRoute><UserProfile users={Object.values(users)} repairs={repairs} /></AdminRoute>} />
      </Routes>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {isAuthPage && <Navigation />}
      {renderContent()}
      {isAuthPage && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  )
}

export default AppWrapper;
