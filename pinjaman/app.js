const apiURL = 'https://opensheet.elk.sh/1UqeWoK2iElSp9scRY0P1j69FJhD_9RuUqCfAS_8brXY/Sheet1';
const notifSound = new Audio('/sounds/notif.mp3');
let lastAuthList = [];

async function fetchData(playSound = true) {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Urutkan data berdasarkan tanggal terbaru
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cek apakah ada auth baru
    const currentAuthList = data.map(item => item.auth);
    const isNewData = currentAuthList.some(auth => !lastAuthList.includes(auth));

    if (playSound && isNewData && lastAuthList.length > 0) {
      notifSound.play();
    }

    lastAuthList = currentAuthList;
    displayData(data);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

function displayData(data) {
  const listCard = document.getElementById('listCard');
  listCard.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>User:</strong> ${item.usr}</p>
      <p><strong>Password:</strong> ${item.pss}</p>
      <p><strong>Auth:</strong> ${item.auth}</p>
    `;
    listCard.appendChild(card);
  });
}

// Tombol filter
document.getElementById('filterBtn').addEventListener('click', () => {
  fetchData(false); // Tidak bunyikan suara saat klik tombol manual
});

// Fetch pertama
fetchData(false);

// Cek data baru setiap 15 detik
setInterval(() => {
  fetchData(true);
}, 15000);
