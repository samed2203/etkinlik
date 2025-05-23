import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
 


function PasswordChangePage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Şifrelerin eşleştiğini kontrol et
    if (newPassword !== confirmPassword) {
      setError('Şifreler uyuşmuyor!');
      setLoading(false);
      return;
    }

    // Şifre uzunluğu kontrolü
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      // 1. Önce mevcut oturumu kontrol et
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      // 2. Şifreyi güncelle
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // 3. Profil bilgilerini güncelle
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          must_change_password: false,
          first_login: false 
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 4. LocalStorage'ı güncelle
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // handleSubmit fonksiyonunda localStorage güncelleme kısmını değiştirin
      localStorage.setItem("user", JSON.stringify({
      ...profile,
      must_change_password: false,  // mustChangePassword yerine must_change_password
      first_login: false
    }));

      setSuccess('Şifreniz başarıyla güncellendi! Anasayfaya yönlendiriliyorsunuz...');
      
      // 3 saniye sonra yönlendir
      setTimeout(() => {
        navigate('/home');
      }, 3000);

    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      setError(error.message || 'Şifre değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Şifre Değiştirme</h2>
      
      {error && (
        <div style={{
          color: 'white',
          backgroundColor: '#ff4444',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          color: 'white',
          backgroundColor: '#00C851',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Yeni Şifre (en az 6 karakter):
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Yeni Şifreyi Tekrar Girin:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {loading ? 'İşleniyor...' : 'Şifreyi Değiştir'}
        </button>
      </form>
    </div>
  );
}

export default PasswordChangePage;