    // Ambil data user dari localStorage
    const userDataRaw = localStorage.getItem('userData');
    const userNameEl = document.getElementById('userName');
    const userInfoEl = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!userDataRaw) {
      // Jika data user tidak ada, redirect ke login
      window.location.href = '/member'; 
    } else {
      const userData = JSON.parse(userDataRaw);

      userNameEl.textContent = userData.name || 'User';

      // Buat elemen untuk menampilkan info user
      const infoHtml = `
        ${userData.image ? `<img src="${userData.image}" alt="Foto ${userData.name}">` : ''}
        <div class="field"><label>Slug:</label> ${userData.slug || '-'}</div>
        <div class="field"><label>Email:</label> ${userData.email || '-'}</div>
        <div class="field"><label>Plan:</label> ${userData.plan || '-'}</div>
        <div class="field"><label>Saldo Utama:</label> ${userData.saldoUtama !== null && userData.saldoUtama !== undefined ? userData.saldoUtama : '-'}</div>
        <div class="field"><label>Bank:</label> ${userData.bank || '-'}</div>
        <div class="field"><label>No Rekening:</label> ${userData.nomorrekening || '-'}</div>
        <div class="field"><label>Nama Rekening:</label> ${userData.namarekening || '-'}</div>
        <div class="field"><label>Whatsapp:</label> ${userData.whatsapp || '-'}</div>
      `;
      userInfoEl.innerHTML = infoHtml;
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userData');
      window.location.href = '/member';
    });
