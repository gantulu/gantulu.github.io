  const apiUrl = 'https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items';

  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const identifier = document.getElementById('identifier').value.trim().toLowerCase();
    const pass = document.getElementById('pass').value;

    if (!identifier || !pass) {
      showMessage('Mohon isi semua kolom.', 'red');
      return;
    }

    try {
      const response = await fetch(apiUrl, { method: 'GET' });
      if (!response.ok) throw new Error('Gagal mengambil data user');
      const data = await response.json();

      // Cari user yang slug atau email sama dan pass sama
      const user = data.items.find(item => {
        const field = item.fieldData;
        const slugLower = (field.slug || '').toLowerCase();
        const emailLower = (field.email || '').toLowerCase();
        const passField = field.pass || '';
        return (slugLower === identifier || emailLower === identifier) && passField === pass;
      });

      if (user) {
        showMessage('Login berhasil! Mengarahkan ke halaman utama...', 'green');

        // Simpan data user lengkap ke localStorage
        localStorage.setItem('userData', JSON.stringify(user.fieldData));

        // Tunggu 1 detik lalu redirect ke index.html
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showMessage('Login gagal: slug/email atau password salah.', 'red');
      }
    } catch (err) {
      showMessage('Terjadi kesalahan: ' + err.message, 'red');
    }
  });

  function showMessage(msg, color) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.style.color = color;
  }
