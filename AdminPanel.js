import React, { useState, useEffect } from 'react';

const AdminPanel = ({ events, onCategoryChange, announcement, setAnnouncement }) => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (events.length > 0) {
      setSelectedEventId(events[0].id);
      setSelectedCategory(events[0].category);
    }
  }, [events]);

  const handleSave = () => {
    if (!selectedEventId || !selectedCategory) return;
    onCategoryChange(selectedEventId, selectedCategory);
    alert('Kategori güncellendi');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Admin Paneli</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Etkinlik seç: </label>
        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            const evt = events.find(ev => ev.id === e.target.value);
            if (evt) setSelectedCategory(evt.category);
          }}
        >
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Kategori seç: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Kategori seç</option>
          <option value="futbol">Futbol</option>
          <option value="teknoloji">Teknoloji</option>
          <option value="müzik">Müzik</option>
          <option value="doğa">Doğa</option>
          <option value="sanat">Sanat</option>
          <option value="yemek">Yemek</option>
          <option value="diğer">Diğer</option>
        </select>
      </div>

      <button onClick={handleSave}>Kaydet</button>

      <hr style={{ margin: '30px 0' }} />

      <div>
        <h2>Duyuru Yönetimi</h2>
        <textarea
          rows={4}
          style={{ width: '100%' }}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Buraya duyuru metnini yaz..."
        />
      </div>
    </div>
  );
};

export default AdminPanel;
