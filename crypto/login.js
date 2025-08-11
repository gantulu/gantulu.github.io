// login.js
const apiUrl = 'https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items';
const token = 'Bearer c943edcbd9bf6040525b7615d63ed3a121496c41aa9c3737bd61470ec4932147';

async function handleLogin(event) {
  event.preventDefault();

  // Pastikan form input di Webflow ada dengan ID ini:
  const userInputEl = document.getElementById('userInput');
  const passInputEl = document.getElementById('passInput');

  if (!userInputEl || !passInputEl) {
    alert('Form input tidak ditemukan. Pastikan input dengan ID userInput dan passInput ada.');
    return;
  }

  const userInput = userInputEl.value.trim().toLowerCase();
  const passInput = passInputEl.value;

  if (!userInput || !passInput) {
    alert('Masukkan slug/email dan password.');
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { Authorization: token }
    });

    if (!res.ok) throw new Error('Gagal mengambil data user');

    const data = await res.json();

    const user = data.items.find(u =>
      (u.fieldData.slug === userInput || u.fieldData.email === userInput) &&
      u.fieldData.pass === passInput
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        slug: user.fieldData.slug,
        email: user.fieldData.email,
        name: user.fieldData.name
      }));
      alert('Login berhasil!');
      window.location.href = `/user/${user.fieldData.slug}`;
    } else {
      alert('Slug/Email atau password salah.');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Pasang event listener saat DOM siap dan form ditemukan
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  } else {
    console.warn('Form login dengan ID "loginForm" tidak ditemukan.');
  }
});
