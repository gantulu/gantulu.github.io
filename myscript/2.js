  const userDetailsDiv = document.getElementById("userDetails");
  const logoutBtn = document.getElementById("logoutBtn");

  function renderUserData() {
    const userDataStr = localStorage.getItem("userData");

    if (!userDataStr) {
      userDetailsDiv.innerHTML = `<p>Anda belum login. <a href="login.html" class="login-link">Klik di sini untuk login</a></p>`;
      logoutBtn.style.display = "none";
      return;
    }

    const userData = JSON.parse(userDataStr);

    userDetailsDiv.innerHTML = `
      <p><strong>UserID:</strong> ${userData.userID}</p>
      <p><strong>Nama:</strong> ${userData.name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>WhatsApp:</strong> ${userData.whatsapp}</p>
      <p><strong>Bank:</strong> ${userData.bank}</p>
      <p><strong>Nomor Rekening:</strong> ${userData.nomorRekening}</p>
      <p><strong>Saldo Utama:</strong> ${userData.saldoUtama}</p>
      <p><strong>Saldo Trading:</strong> ${userData.saldoTrading}</p>
      <p><strong>Plan:</strong> ${userData.plan}</p>
      <p><strong>Durasi:</strong> ${userData.durasi}</p>
    `;

    logoutBtn.style.display = "block";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userID");
    window.location.href = "login.html";
  });

  renderUserData();
