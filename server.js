const express = require('express');
const axios = require('axios');
const app = express();


const PRIVATE_TOKEN = 'B5MZ4RBXDUIJXPHI42T2'; 
let ORGANIZATION_ID = null;


async function initialize() {
  try {
    const orgResponse = await axios.get(
      'https://www.eventbriteapi.com/v3/users/me/organizations/',
      { 
        headers: { 
          Authorization: `Bearer ${PRIVATE_TOKEN}` 
        } 
      }
    );
    ORGANIZATION_ID = orgResponse.data.organizations[0].id;
    console.log('✅ Organizasyon ID Alındı:', ORGANIZATION_ID);
  } catch (error) {
    console.error('❌ Hata:', error.response?.data || error.message);
    process.exit(1);
  }
}


app.get('/events', async (req, res) => {
  if (!ORGANIZATION_ID) {
    return res.status(500).json({ error: 'Organizasyon ID tanımlı değil' });
  }

  try {
    const response = await axios.get(
      `https://www.eventbriteapi.com/v3/organizations/${ORGANIZATION_ID}/events/`,
      {
        headers: { 
          Authorization: `Bearer ${PRIVATE_TOKEN}` 
        },
        params: { 
          expand: 'venue,ticket_availability',
          status: 'live'
        }
      }
    );

    const events = response.data.events.map(event => ({
      id: event.id,
      name: event.name.text,
      date: new Date(event.start.local).toLocaleString('tr-TR'),
      location: event.venue?.address?.city || 'Online',
      tickets: event.ticket_availability?.minimum_ticket_price?.display || 'Ücretsiz'
    }));

    res.json({ success: true, events });
  } catch (error) {
    console.error('API Hatası:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Etkinlikler alınamadı',
      detay: error.response?.data?.error_description 
    });
  }
});

initialize().then(() => {
  app.listen(8080, () => {
    console.log(`
    🚀 Sunucu çalışıyor! 
    Test için: http://localhost:8080/events
    `);
  });
});