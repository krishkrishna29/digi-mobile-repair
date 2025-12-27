
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext.jsx";

import Navigation from "./Navigation";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import NewRepairRequest from "./NewRepairRequest";
import Confirmation from "./Confirmation"; // Import the new Confirmation component
import OTPVerification from "./OTPVerification";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Login from "./Login";
import Signup from "./SignUp";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import SalesRevenue from "./SalesRevenue";
import CheckoutForm from "./CheckoutForm";
import Payment from "./Payment";
import PromotionsPage from "./PromotionsPage";

const App = () => {
  const [users, setUsers] = useState({});
  const [repairs, setRepairs] = useState([]);
  const { userProfile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.role === "admin") {
      const usersUnsubscribe = onSnapshot(
        query(collection(db, "users")),
        (snapshot) => {
          const usersData = {};
          snapshot.forEach((doc) => {
            usersData[doc.id] = { id: doc.id, ...doc.data() };
          });
          setUsers(usersData);
        }
      );

      const repairsUnsubscribe = onSnapshot(
        query(collection(db, "repairs")),
        (snapshot) => {
          setRepairs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      );

      return () => {
        usersUnsubscribe();
        repairsUnsubscribe();
      };
    }
  }, [userProfile]);

  useEffect(() => {
    if (!loading) {
      if (userProfile) {
        if (userProfile.role === 'admin') {
          if (location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/admin', { replace: true });
          }
        } else {
          if (location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/dashboard', { replace: true });
          }
        }
      } else {
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [userProfile, loading, location.pathname, navigate]);

  const showNavPaths = ["/", "/about", "/services", "/login", "/signup", "/promotions"];
  const shouldShowNav = showNavPaths.includes(location.pathname);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <>
      {shouldShowNav && <Navigation />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/promotions" element={<PromotionsPage />} />

        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />
        
        <Route
          path="/new-repair-request"
          element={
            <UserRoute>
              <NewRepairRequest />
            </UserRoute>
          }
        />

        <Route
          path="/confirmation"
          element={
            <UserRoute>
              <Confirmation />
            </UserRoute>
          }
        />

        <Route
          path="/otp-verification"
          element={
            <UserRoute>
              <OTPVerification />
            </UserRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard
                users={users}
                repairs={repairs}
                setUsers={setUsers}
              />
            </AdminRoute>
          }
        />

        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/payment/:repairId" element={<Payment />} />

        {/* MUST BE LAST */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
