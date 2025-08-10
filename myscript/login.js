    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const userInput = document.getElementById('userInput').value.trim().toLowerCase();
      const password = document.getElementById('password').value;

      if (!userInput || !password) {
        errorMsg.textContent = 'Harap isi slug/email dan password.';
        errorMsg.style.display = 'block';
        return;
      }

      try {
        const response = await fetch('https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        const data = await response.json();

        const user = data.items.find(item => {
          const fd = item.fieldData;
          return (fd.slug.toLowerCase() === userInput || (fd.email && fd.email.toLowerCase() === userInput))
                 && fd.pass === password;
        });

        if (user) {
          // Simpan id dan fieldData sekaligus
          const userToStore = {
            id: user.id,
            ...user.fieldData
          };
          localStorage.setItem('userData', JSON.stringify(userToStore));
          window.location.href = '/';
        } else {
          errorMsg.textContent = 'Slug/email atau password salah.';
          errorMsg.style.display = 'block';
        }
      } catch (err) {
        errorMsg.textContent = 'Terjadi kesalahan: ' + err.message;
        errorMsg.style.display = 'block';
      }
    });
