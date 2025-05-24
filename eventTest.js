// eventTest.js
const axios = require('axios');

// API bilgilerini direkt kod içinde tanımla (ödev için)
const API_KEY = 'VKTAGDZQDLUFXYSZ4LZ5';
const ORG_ID = '1366460081889';

async function testEventbrite() {
  try {
    console.log("⏳ Eventbrite API'sine bağlanıyor...");
    
    // 1. Organizasyon bilgilerini çek
    const orgResponse = await axios.get(
      `https://www.eventbriteapi.com/v3/organizations/${ORG_ID}/`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    console.log("🏢 Organizasyon Adı:", orgResponse.data.name);

    // 2. Etkinlikleri listele
    const eventsResponse = await axios.get(
      `https://www.eventbriteapi.com/v3/organizations/${ORG_ID}/events/`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    
    // 3. Basit bir etkinlik listesi göster
    console.log("\n🎉 Etkinlik Listesi:");
    eventsResponse.data.events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name.text} (${event.start.local})`);
    });

  } catch (error) {
    console.error("❌ Hata:", error.response?.data || error.message);
  }
}

// Testi başlat
testEventbrite();