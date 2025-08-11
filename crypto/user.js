    // Ambil data user dari localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || !storedUser.id) {
      // Jika tidak ada data user atau id, redirect ke login
      window.location.href = '/login';
    } else {
      // Tampilkan ID di span dan input
      document.getElementById('userId').textContent = storedUser.id;
      document.getElementById('idValue').value = storedUser.id;
    }

    // Logout button klik handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
