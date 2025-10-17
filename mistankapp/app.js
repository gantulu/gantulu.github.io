const AIRTABLE_API_KEY = 'pat31RGUy1ua2FIoz.a26bfd4976c3d7b869474c47bc44cdd31c58f71590817a3d6b80aca13e5b89cf';
const AIRTABLE_BASE_ID = 'appLTvB7Hey4An0z0';
const AIRTABLE_TABLE_NAME = 'table1';

const container = document.getElementById('list-container');

let latestRecordId = null;

async function fetchData() {
  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  });

  const data = await response.json();
  renderData(data.records);

  // Cek apakah ada data baru
  if (data.records.length > 0) {
    const newId = data.records[0].id;
    if (latestRecordId && newId !== latestRecordId) {
      showNotification('Data baru tersedia di Airtable!');
    }
    latestRecordId = newId;
  }
}

function renderData(records) {
  container.innerHTML = '';
  records.forEach(record => {
    const { usr, pss, otentikasi } = record.fields;
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div><strong>USR:</strong> ${usr} <button onclick="copyToClipboard('${usr}')">Copy</button></div>
      <div><strong>PSS:</strong> ${pss} <button onclick="copyToClipboard('${pss}')">Copy</button></div>
      <div><strong>Otentikasi:</strong> ${otentikasi} <button onclick="copyToClipboard('${otentikasi}')">Copy</button></div>
    `;

    container.appendChild(card);
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Disalin ke clipboard: " + text);
  });
}

function showNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification('🔔 Notifikasi', {
      body: message
    });
  }
}

if ('Notification' in window) {
  Notification.requestPermission();
}

// Refresh data tiap 10 detik
setInterval(fetchData, 10000);
fetchData();

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service worker terdaftar');
  });
}
