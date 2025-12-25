import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import Home from './pages/Home';
import Login from './Login';
import Signup from './SignUp';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import AdminRoute from './AdminRoute';
import Navigation from './Navigation';
import CheckoutForm from './CheckoutForm';
import UserProfile from './UserProfile';

const App = () => {
  const [users, setUsers] = useState({});
  const [repairs, setRepairs] = useState([]);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    if (userRole === 'admin') {
      const usersUnsubscribe = onSnapshot(query(collection(db, 'users')), (snapshot) => {
        const usersData = {};
        snapshot.forEach(doc => usersData[doc.id] = { id: doc.id, ...doc.data() });
        setUsers(usersData);
      }, err => console.error("Failed to fetch users:", err));

      const repairsUnsubscribe = onSnapshot(query(collection(db, 'repairs')), (snapshot) => {
        const repairsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRepairs(repairsData);
      }, err => console.error("Failed to fetch repairs:", err));

      return () => {
        usersUnsubscribe();
        repairsUnsubscribe();
      };
    }
  }, [userRole]);

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard repairs={repairs} />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard users={users} repairs={repairs} setUsers={setUsers} /></AdminRoute>} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/user/:userId" element={<AdminRoute><UserProfile users={Object.values(users)} repairs={repairs} /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
