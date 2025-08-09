      // Tab logic
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    tabLoginBtn.onclick = () => {
      loginTab.style.display = 'block'; registerTab.style.display = 'none';
      tabLoginBtn.classList.add('active'); tabRegisterBtn.classList.remove('active');
    };
    tabRegisterBtn.onclick = () => {
      loginTab.style.display = 'none'; registerTab.style.display = 'block';
      tabRegisterBtn.classList.add('active'); tabLoginBtn.classList.remove('active');
    };

    // API config
    const apiUrl = 'https://api.apico.dev/v1/OEKmRt/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/values/Sheet1';
    const apiHeaders = {
      Authorization: 'Bearer 9aed1af912ad0243c06f8a73173efb7ea0cf57be8d9c5ddb414dfaa433b86963'
    };

    // LOGIN LOGIC
    document.getElementById('loginForm').onsubmit = async function(e) {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value.trim();
      const errorBox = document.getElementById('loginError');
      errorBox.textContent = '';
      if(!user || !pass) { errorBox.textContent = 'Isi semua field!'; return; }
      try {
        const res = await fetch(apiUrl, { method: 'GET', headers: apiHeaders });
        const data = await res.json();
        const users = data.values.slice(1); // Remove header row
        const found = users.find(u =>
          (u[0] === user || u[3].toLowerCase() === user.toLowerCase()) && u[2] === pass
        );
        if(found) {
          errorBox.style.color = '#388e3c';
          errorBox.textContent = 'Login berhasil! Selamat datang, ' + found[1];

          // Simpan userData ke localStorage
          const userData = {
            userID: found[0],
            name: found[1],
            pass: found[2],        // Simpan password hanya untuk testing, sebaiknya jangan di produksi!
            email: found[3],
            whatsapp: found[4],
            image: found[5],
            bank: found[6],
            namaRekening: found[7],
            nomorRekening: found[8],
            saldoUtama: found[9],
            saldoTrading: found[10],
            withdraw: found[11],
            plan: found[12],
            durasi: found[13]
          };
          localStorage.setItem('userData', JSON.stringify(userData));

          // Redirect ke index.html setelah login berhasil (delay sebentar agar pesan terlihat)
          setTimeout(() => {
            window.location.href = "/index";
          }, 900);
        } else {
          errorBox.style.color = '#d32f2f';
          errorBox.textContent = 'UserID/email atau password salah!';
        }
      } catch (err) {
        errorBox.style.color = '#d32f2f';
        errorBox.textContent = 'Gagal koneksi ke server!';
      }
    };

    // REGISTER LOGIC (simulasi)
    document.getElementById('registerForm').onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const whatsapp = document.getElementById('regWhatsapp').value.trim();
      const pass = document.getElementById('regPass').value.trim();
      const errorBox = document.getElementById('registerError');
      const successBox = document.getElementById('registerSuccess');
      errorBox.textContent = ''; successBox.textContent = '';

      // Validasi sederhana
      if(!name || !email || !whatsapp || !pass) { 
        errorBox.textContent = 'Isi semua kolom!';
        return;
      }
      if(!/^[\w\.\-]+@[\w\.\-]+\.\w{2,}$/.test(email)) {
        errorBox.textContent = 'Email tidak valid!';
        return;
      }
      if(whatsapp.length < 10) {
        errorBox.textContent = 'Nomor Whatsapp minimal 10 digit!';
        return;
      }
      try {
        // Cek email/user sudah ada?
        const res = await fetch(apiUrl, { method: 'GET', headers: apiHeaders });
        const data = await res.json();
        const users = data.values.slice(1);
        const exist = users.find(u => u[3].toLowerCase() === email.toLowerCase() || u[1].toLowerCase() === name.toLowerCase());
        if(exist) {
          errorBox.textContent = 'Email/Nama sudah terdaftar!';
          return;
        }

        // Simulasi userID unik (max userID+1)
        let lastUID = 0;
        users.forEach(u => { 
          if(/^user\d+$/.test(u[0])) {
            const n = parseInt(u[0].substring(4));
            if(n > lastUID) lastUID = n;
          }
        });
        const newUserID = 'user' + (lastUID+1);
        
        // Simulasi POST (ubah ke POST jika endpoint sudah ada)
        /*
        await fetch(apiUrl, {
          method: 'POST',
          headers: { ...apiHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [ [newUserID, name, pass, email, whatsapp] ] })
        });
        */
        successBox.textContent = 'Register berhasil! Silakan login.';
        setTimeout(() => { tabLoginBtn.click(); }, 1500);
      } catch (err) {
        errorBox.textContent = 'Gagal koneksi ke server!';
      }
    };
