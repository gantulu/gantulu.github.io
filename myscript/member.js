    const apiUrl = 'https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items';

    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.textContent = '';

      const userInput = document.getElementById('userInput').value.trim().toLowerCase();
      const passInput = document.getElementById('passInput').value;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Gagal mengambil data pengguna.');

        const data = await response.json();

        // Cari user berdasarkan slug atau email
        const user = data.items.find(item => {
          const fd = item.fieldData;
          return (fd.slug && fd.slug.toLowerCase() === userInput) || (fd.email && fd.email.toLowerCase() === userInput);
        });

        if (!user) {
          errorMsg.textContent = 'User tidak ditemukan.';
          return;
        }

        // Cek password
        if (user.fieldData.pass !== passInput) {
          errorMsg.textContent = 'Password salah.';
          return;
        }

        // Login berhasil: simpan id dan fieldData
        const userData = {
          id: user.id,
          ...user.fieldData
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect ke halaman utama
        window.location.href = '/';
      } catch (error) {
        errorMsg.textContent = 'Terjadi kesalahan: ' + error.message;
      }
    });
