import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
       
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;
        navigate('/home');
      } else {
        
        if (password.length < 6) {
          throw new Error('Şifre en az 6 karakter olmalıdır');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (authError) throw authError;

        await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            full_name: fullName,
            email: email,
            is_approved: false,
            first_login: true,
            must_change_password: true
          }]);

       
        localStorage.setItem("user", JSON.stringify({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          is_approved: false,
          first_login: true,
          must_change_password: true
        }));

        alert('Kayıt başarılı! Yönetici onayından sonra giriş yapabilirsiniz.');
        setIsLogin(true); 
      }
    } catch (error) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      backgroundColor: '#fff'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#2c3e50'
      }}>
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
      </h1>

      {error && (
        <div style={{
          color: '#e74c3c',
          backgroundColor: '#fadbd8',
          padding: '0.75rem',
          borderRadius: '5px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {!isLogin && (
          <div>
            <label htmlFor="fullName" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Tam Adınız:
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            E-posta:
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Şifre:
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={isLogin ? undefined : 6}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          />
          {!isLogin && (
            <small style={{
              display: 'block',
              marginTop: '0.25rem',
              color: '#7f8c8d'
            }}>
              
            </small>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            background: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background 0.3s',
            marginTop: '0.5rem'
          }}
        >
          {loading ? (
            <span>İşleniyor...</span>
          ) : isLogin ? (
            'Giriş Yap'
          ) : (
            'Kayıt Ol'
          )}
        </button>
      </form>

      <p
        onClick={handleFormSwitch}
        style={{
          cursor: 'pointer',
          color: '#3498db',
          textAlign: 'center',
          marginTop: '1.5rem',
          fontWeight: '500'
        }}
      >
        {isLogin ? (
          <span>Hesabınız yok mu? <u>Kayıt Olun</u></span>
        ) : (
          <span>Zaten hesabınız var mı? <u>Giriş Yapın</u></span>
        )}
      </p>
    </div>
  );
};

export default AuthPage;
