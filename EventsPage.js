import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventsPage = () => {
  const navigate = useNavigate();
  const API_KEY = 'B5MZ4RBXDUIJXPHI42T2';
  const ORGANIZATION_ID = '2777943393741';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Geliştirilmiş kategorilendirme fonksiyonu
  const determineCategory = (name, description = '') => {
    const text = `${name} ${description}`.toLowerCase();
    
    // Önce daha spesifik eşleşmeleri kontrol et
    if (/teknoloji|yazılım|kodlama|programlama|ai|yapay zeka|robotik|veri/i.test(text) && 
        !/futbol|müzik|doğa/.test(text)) {
      return 'teknoloji';
    }
    if (/futbol|maç|lig|stadyum|futbolcu|pas|gol|fifa/i.test(text) && 
        !/teknoloji|müzik|doğa/.test(text)) {
      return 'futbol';
    }
    if (/müzik|konser|şarkı|davul|gitar|piyano|orkestra|bando|dj|albüm/i.test(text) && 
        !/teknoloji|futbol|doğa/.test(text)) {
      return 'müzik';
    }
    if (/doğa|kamp|şelale|yürüyüş|ağaç|hiking|trekking|dağ|gezi|tabiat/i.test(text) && 
        !/teknoloji|futbol|müzik/.test(text)) {
      return 'doğa';
    }
    if (/sanat|resim|sergi|heykel|galeri|müze|tablo/i.test(text)) {
      return 'sanat';
    }
    if (/yemek|gurme|şarap|tatlı|restoran|yemek|mutfak|tarif/i.test(text)) {
      return 'yemek';
    }
    
    return 'diğer';
  };

  // Etkinlikleri çek
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://www.eventbriteapi.com/v3/organizations/${ORGANIZATION_ID}/events/`,
          {
            headers: { Authorization: `Bearer ${API_KEY}` }
          }
        );

        const categorizedEvents = response.data.events.map(event => {
          const category = determineCategory(event.name.text, event.description?.text);
          console.log(`Event: ${event.name.text} | Category: ${category}`); // Debug için
          
          return {
            id: event.id,
            name: event.name.text,
            description: event.description?.text || '',
            category: category,
            date: new Date(event.start.local),
            location: event.venue?.address?.city || 'Online',
            url: event.url
          };
        });

        setEvents(categorizedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Kategorilere göre filtreleme
  const categories = [...new Set(events.map(event => event.category))];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h3>Etkinlikler yükleniyor...</h3>
    </div>
  );

  if (error) return (
    <div style={{ color: 'red', textAlign: 'center' }}>
      <h3>Hata oluştu: {error}</h3>
      <button onClick={() => window.location.reload()}>Tekrar Dene</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', padding: '10px 20px' }}
      >
        &larr; Geri Dön
      </button>

      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        🎉 Tüm Etkinlikler
      </h1>

      {/* Kategori filtreleme */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px' }}
        >
          Tümü
        </button>
        {categories.map(category => (
          <button
            key={category}
            style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px' }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Etkinlik listesi */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {events.map(event => (
          <div key={event.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div style={{ 
              backgroundColor: getCategoryColor(event.category),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '8px',
              fontSize: '12px'
            }}>
              {event.category.toUpperCase()}
            </div>
            <h3 style={{ marginTop: 0, color: '#3498db' }}>{event.name}</h3>
            <p style={{ color: '#7f8c8d' }}>
              📅 {event.date.toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p style={{ color: '#2c3e50' }}>
              📍 {event.location}
            </p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#2ecc71',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                textDecoration: 'none',
                marginTop: '15px'
              }}
            >
              Bilet Al 🎟️
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Kategoriye göre renk belirleme
const getCategoryColor = (category) => {
  switch(category) {
    case 'futbol': return '#e74c3c';
    case 'teknoloji': return '#3498db';
    case 'müzik': return '#9b59b6';
    case 'doğa': return '#2ecc71';
    case 'sanat': return '#e67e22';
    case 'yemek': return '#f1c40f';
    default: return '#95a5a6';
  }
};

export default EventsPage;