import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import axios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcı ilgi alanlarını çek
  useEffect(() => {
    const fetchUserInterests = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('interests')
          .eq('id', user.id)
          .single();
        setUserInterests(data?.interests || []);
      }
    };
    fetchUserInterests();
  }, []);

  // Etkinlikleri çek
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'https://www.eventbriteapi.com/v3/organizations/2765630633551/events/',
          {
            headers: { Authorization: 'Bearer VKTAGDZQDLUFXYSZ4LZ5' }
          }
        );
        
        setEvents(response.data.events.map(event => ({
          id: event.id,
          name: event.name.text,
          description: event.description?.text || '',
          category: determineCategory(event.name.text, event.description?.text),
          date: new Date(event.start.local),
          location: event.venue?.address?.city || 'Online',
          url: event.url
        })));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Etkinlik kategorisini belirleme
  const determineCategory = (name, description) => {
    const text = `${name} ${description}`.toLowerCase();
    if (/futbol|spor|maç|futbolcu|stadyum/i.test(text)) return 'futbol';
    if (/teknoloji|yazılım|kod|programlama|ai/i.test(text)) return 'teknoloji';
    if (/doğa|kamp|şelale|yürüyüş|ağaç/i.test(text)) return 'doğa';
    if (/müzik|konser|şarkı|davul|gitar/i.test(text)) return 'müzik';
    return 'diğer';
  };

  // İlgi alanına göre öneriler
  const getRecommendedEvents = () => {
    if (userInterests.length === 0) return events.slice(0, 3);
    
    return events.filter(event => 
      userInterests.some(interest => 
        event.category === interest.toLowerCase()
      )
    ).slice(0, 4);
  };

  // Kategoriye göre filtreleme
  const filterByCategory = (category) => {
    return events.filter(event => event.category === category).slice(0, 3);
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Önerilen Etkinlikler */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">⭐ Sizin İçin Öneriler</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {getRecommendedEvents().map(event => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md">
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.date.toLocaleDateString('tr-TR')}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">Detaylar</a>
            </div>
          ))}
        </div>
      </section>

      {/* Kategorilere Göre Etkinlikler */}
      <section>
        <h2 className="text-xl font-bold mb-4">🏷️ Kategoriler</h2>
        <div className="space-y-6">
          {['futbol', 'teknoloji', 'doğa', 'müzik'].map(category => (
            <div key={category}>
              <h3 className="font-semibold capitalize mb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filterByCategory(category).map(event => (
                  <div key={event.id} className="border p-3 rounded">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs">{event.location}</p>
                    <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs">Detaylar</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage; // ← BU SATIRI EKLEDİM