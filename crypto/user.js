    const slugFromUrl = window.location.pathname.split('/').filter(Boolean)[1];
    const storedSlug = localStorage.getItem('slug');
    const storedId = localStorage.getItem('id');

    // Isi semua input id="userID"
    document.querySelectorAll('#userID').forEach(el => {
      if (storedId) el.value = storedId;
    });

    // Cek login
    if (!storedId || !storedSlug || storedSlug !== slugFromUrl) {
      window.location.href = '/login.html';
    } else {
      fetch('https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items')
        .then(res => res.json())
        .then(data => {
          const user = data.items.find(item => item.id === storedId);
          if (!user) {
            alert('User tidak ditemukan, silakan login ulang.');
            localStorage.clear();
            window.location.href = '/login';
            return;
          }

          const fd = user.fieldData;

          // Isi field
          document.getElementById('field-id').textContent = user.id;
          document.getElementById('field-name').textContent = fd.name ?? '-';
          document.getElementById('field-email').textContent = fd.email ?? '-';
          document.getElementById('field-slug').textContent = fd.slug ?? '-';
          document.getElementById('field-plan').textContent = fd.plan ?? '-';
          document.getElementById('field-saldo').textContent = fd.saldoutama ?? '-';
          document.getElementById('field-rekening').textContent = fd.nomorrekening ?? '-';
          document.getElementById('field-namarekening').textContent = fd.namarekening ?? '-';
          document.getElementById('field-bank').textContent = fd.bank ?? '-';
          document.getElementById('field-wa').textContent = fd.whatsapp ?? '-';

          if (fd.image) {
            document.getElementById('field-image').innerHTML = `<img src="${fd.image}" alt="User Image" width="150">`;
          }
        })
        .catch(err => {
          console.error(err);
          alert('Gagal memuat data user.');
        });
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/login';
    });
