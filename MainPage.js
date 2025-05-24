import React, { useEffect, useState } from 'react';
import axios from 'axios';
import weatherData from './weatherData.json'; 
const API_KEY = 'B5MZ4RBXDUIJXPHI42T2';
const ORGANIZATION_ID = '2777943393741';

const determineCategory = (name) => {
  const text = name.toLowerCase();

  if (/(teknolojik|yazılım|kodlama|programlama|ai|yapay zeka|robotik|veri)/.test(text)) return 'teknoloji';
  if (/(futbol|maç|lig|stadyum|gol|fifa)/.test(text)) return 'futbol';
  if (/(müzik|konser|şarkı|gitar|piyano|orkestra|dj|albüm)/.test(text)) return 'müzik';
  if (/(doğa|kamp|şelale|yürüyüş|ağaç|dağ|gezi|tabiat)/.test(text)) return 'doğa';
  if (/(sanat|resim|sergi|heykel|galeri|müze|tablo)/.test(text)) return 'sanat';
  if (/(yemek|gurme|şarap|restoran|mutfak|tarif)/.test(text)) return 'yemek';

  return 'diğer';
};

const categoryColors = {
  futbol: '#e74c3c',
  teknoloji: '#3498db',
  müzik: '#9b59b6',
  doğa: '#2ecc71',
  sanat: '#e67e22',
  yemek: '#f1c40f',
  diğer: '#95a5a6',
};

const getWeatherStatus = (eventDate, weatherData) => {
  const dateStr = eventDate.toISOString().split('T')[0];
  const weather = weatherData.find(w => w.date === dateStr);
  
  if (!weather) return null;
  
  return {
    suitable: !weather.rain && weather.wind < 20,
    temperature: weather.temperature,
    condition: weather.condition,
    rain: weather.rain,
    wind: weather.wind
  };
};

const WeatherAlert = ({ weather }) => {
  if (!weather) return null;
  
  return (
    <div style={{ 
      marginTop: '5px',
      padding: '5px',
      backgroundColor: weather.suitable ? '#e8f5e9' : '#ffebee',
      borderRadius: '4px',
      borderLeft: `3px solid ${weather.suitable ? '#4caf50' : '#f44336'}`
    }}>
      {weather.suitable ? (
        <span style={{ color: '#2e7d32' }}>✅ Bu etkinlik için hava durumu uygun: {weather.condition}, {weather.temperature}°C, Rüzgar: {weather.wind} km/s</span>
      ) : (
        <span style={{ color: '#c62828' }}>⚠️ Bu etkinlik hava koşulları nedeniyle iptal olabilir: {weather.condition}, {weather.temperature}°C, Rüzgar: {weather.wind} km/s, {weather.rain ? 'Yağmur bekleniyor' : ''}</span>
      )}
    </div>
  );
};

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCategory, setShowCategory] = useState(false);
  const [showByDate, setShowByDate] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `https://www.eventbriteapi.com/v3/organizations/${ORGANIZATION_ID}/events/`,
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );

        const evts = res.data.events.map(evt => ({
          id: evt.id,
          name: evt.name.text,
          date: new Date(evt.start.local),
          url: evt.url,
          category: determineCategory(evt.name.text),
        }));

        setEvents(evts);
      } catch (err) {
        setError('Etkinlikler alınamadı.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Etkinlikler yükleniyor...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  // Kategorilere göre grupla
  const categories = [...new Set(events.map(e => e.category))];

  // Tarihe göre sıralanmış liste
  const eventsByDate = [...events].sort((a, b) => a.date - b.date);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>⭐ Etkinlik Listesi</h1>

      {/* Toggle başlıkları */}
      <h2
        style={{ cursor: 'pointer', color: '#3498db', userSelect: 'none' }}
        onClick={() => {
          setShowCategory(!showCategory);
          if (showByDate) setShowByDate(false);
        }}
      >
        ⭐ Sizin İçin Öneriler {showCategory ? '▲' : '▼'}
      </h2>

      {showCategory && (
        <>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: 30 }}>
              <h3 style={{ color: categoryColors[cat], textTransform: 'capitalize' }}>
                🏷️ {cat} ({events.filter(e => e.category === cat).length})
              </h3>
              <ul>
                {events
                  .filter(e => e.category === cat)
                  .map(e => {
                    const weather = getWeatherStatus(e.date, weatherData);
                    return (
                      <li key={e.id} style={{ marginBottom: 8 }}>
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontWeight: 'bold', color: '#333' }}
                        >
                          {e.name}
                        </a>{' '}
                        <br />
                        {e.date.toLocaleDateString('tr-TR')}
                        <br />
                        <a href={e.url} target="_blank" rel="noopener noreferrer">
                          Detaylar
                        </a>
                        <WeatherAlert weather={weather} />
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </>
      )}

      <h2
        style={{ cursor: 'pointer', color: '#3498db', userSelect: 'none' }}
        onClick={() => {
          setShowByDate(!showByDate);
          if (showCategory) setShowCategory(false);
        }}
      >
        📅 Tarihe Göre Sıralama {showByDate ? '▲' : '▼'}
      </h2>

      {showByDate && (
        <ul style={{ marginTop: 10 }}>
          {eventsByDate.map(e => {
            const weather = getWeatherStatus(e.date, weatherData);
            return (
              <li key={e.id} style={{ marginBottom: 12 }}>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 'bold', color: '#333' }}
                >
                  {e.name}
                </a>{' '}
                <br />
                {e.date.toLocaleDateString('tr-TR')}
                <br />
                <a href={e.url} target="_blank" rel="noopener noreferrer">
                  Detaylar
                </a>
                <WeatherAlert weather={weather} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MainPage;