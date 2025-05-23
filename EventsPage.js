import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const navigate = useNavigate();
  const API_KEY = 'HT5YAFYXICPQFNZ4HG';
  const ORGANIZATION_IDS = [ // Sabit değer olduğu için useEffect dependency'ye eklenmesine gerek yok
    '1366460081889', '1366469289429', 
    '1366475939319', '1366461666629'
  ];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (orgId) => { // useCallback ile optimize
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?token=${API_KEY}`
      );
      const data = await response.json();
      return data.events?.map(event => ({
        id: event.id,
        name: event.name.text,
        date: new Date(event.start.local),
        location: event.venue?.address?.city || 'Belirtilmemiş',
        url: event.url
      })) || [];
    } catch (err) {
      console.error(`${orgId} hatası:`, err);
      return [];
    }
  }, [API_KEY]); // API_KEY dependency olarak eklendi

  useEffect(() => {
    const loadAllEvents = async () => {
      try {
        const allEvents = await Promise.all(
          ORGANIZATION_IDS.map(fetchEvents)
        );
        setEvents(allEvents.flat());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAllEvents();
  }, [fetchEvents]); // fetchEvents dependency olarak eklendi

  // Emoji erişilebilirliği için wrapper component
  const AccessibleEmoji = ({ emoji, label }) => (
    <span role="img" aria-label={label}>
      {emoji}
    </span>
  );

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
        <AccessibleEmoji emoji="🎉" label="Parti" /> Tüm Etkinlikler
      </h1>

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
            <h3 style={{ marginTop: 0, color: '#3498db' }}>{event.name}</h3>
            <p style={{ color: '#7f8c8d' }}>
              <AccessibleEmoji emoji="📅" label="Takvim" />
              {event.date.toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p style={{ color: '#2c3e50' }}>
              <AccessibleEmoji emoji="📍" label="Konum" />
              {event.location}
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
              Bilet Al <AccessibleEmoji emoji="🎟️" label="Bilet" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;