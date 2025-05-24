const axios = require('axios');

// API Konfigürasyonu
const API_CONFIG = {
  BASE_URL: 'https://www.eventbriteapi.com/v3',
  TOKEN: 'http://localhost:8080/events', // Private tokenınız
  ORGANIZATION_ID: '1366460081889' // Organizasyon ID
};

/**
 * Tüm etkinlikleri çeker
 * @returns {Promise<Array>} 
 */
async function getEvents() {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/organizations/${API_CONFIG.ORGANIZATION_ID}/events/`,
      {
        headers: { 
          Authorization: `Bearer ${API_CONFIG.TOKEN}`,
          'Accept': 'application/json'
        },
        params: {
          expand: 'venue,ticket_availability',
          status: 'live',
          order_by: 'start_asc'
        }
      }
    );

    return response.data.events.map(event => ({
      id: event.id,
      name: event.name.text,
      description: event.description?.text || '',
      start: new Date(event.start.utc),
      end: new Date(event.end.utc),
      location: event.venue?.name || 'Online',
      city: event.venue?.address?.city || 'Online',
      url: event.url,
      image: event.logo?.url || null,
      price: event.ticket_availability?.minimum_ticket_price?.display || 'Ücretsiz',
      capacity: event.capacity || 'Belirtilmemiş'
    }));

  } catch (error) {
    console.error('API Hatası:', {
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error('Etkinlikler alınamadı');
  }
}

module.exports = { getEvents };