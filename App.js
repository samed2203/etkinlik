import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from './supabaseClient';
import AuthPage from "./AuthPage";
import LoginPage from "./LoginPage";
import PasswordChangePage from "./PasswordChangePage";
import HomePage from "./HomePage";
import MainPage from "./MainPage"; // Artık tüm etkinlik işlevleri burada

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        if (profile.is_approved) {
          if (profile.must_change_password || profile.first_login) {
            setIsAuthenticated(false);
            setRequiresPasswordChange(true);
          } else {
            setIsAuthenticated(true);
            setRequiresPasswordChange(false);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        } else {
          setIsAuthenticated(false);
          setRequiresPasswordChange(false);
        }
      }
    } else {
      setIsAuthenticated(false);
      setRequiresPasswordChange(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setRequiresPasswordChange(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/change-password" 
          element={requiresPasswordChange ? <PasswordChangePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/main" 
          element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />} 
        />
        {/* EventsPage route'unu kaldırdık çünkü artık MainPage içinde */}
      </Routes>
    </Router>
  );
}

export default App;