  // Ambil data user dari localStorage
  const userDataJSON = localStorage.getItem('userData');
  if (!userDataJSON) {
    // Kalau tidak ada data user, redirect ke login
    window.location.href = 'login.html';
  } else {
    const userData = JSON.parse(userDataJSON);
    document.getElementById('welcome').textContent = `Selamat datang, ${userData.name || 'User'}!`;

    // Tampilkan data lengkap user (fieldData)
    document.getElementById('userDataDisplay').textContent = JSON.stringify(userData, null, 2);
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
  });
