// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
     
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      
      if (!profile.is_approved) {
        await supabase.auth.signOut();
        throw new Error('Hesabınız henüz yönetici tarafından onaylanmadı.');
      }

      
      if (profile?.must_change_password === true || profile?.first_login === true) {
        navigate('/change-password');
      } else {
        navigate('/home');
      }

    } catch (error) {
      setError(error.message || 'Geçersiz e-posta veya şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#333'
      }}>
        Giriş Yap
      </h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
      }}>
        <div>
          <label htmlFor="email" style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontWeight: '500'
          }}>
            E-posta:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="password" style={{ 
            display: 'block', 
            marginBottom: '5px',
            fontWeight: '500'
          }}>
            Şifre:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '12px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
      }}>
        <p style={{ color: '#666' }}>
          Hesabınız yok mu?{' '}
          <a 
            href="/auth" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate('/auth');
            }}
          >
            Kayıt Olun
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;