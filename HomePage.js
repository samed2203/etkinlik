import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Emoji wrapper component
const AccessibleEmoji = ({ emoji, label }) => (
  <span role="img" aria-label={label}>
    {emoji}
  </span>
);

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("user");
      navigate('/auth');
    } catch (error) {
      console.error('Çıkış hatası:', error.message);
      alert('Çıkış yapılamadı');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      backgroundColor: '#fff',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
        Hoşgeldiniz!
      </h1>
      
      {/* Yorum satırı düzeltildi */}
      <p style={{ marginBottom: '2rem' }}>
        Ana sayfaya gitmek için butona basın
      </p>

      <button 
        onClick={() => navigate('/main')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        <AccessibleEmoji emoji="🎪" label="Etkinlikler" /> Etkinlikleri Göster
      </button>

      <button 
        onClick={handleLogout}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default HomePage;