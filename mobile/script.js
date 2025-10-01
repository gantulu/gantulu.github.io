document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMEN DOM ---
    const pages = document.querySelectorAll('.page');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const logoutBtn = document.getElementById('logout-btn');

    // Link untuk pindah form login/daftar
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    // --- FUNGSI UTAMA ---

    /**
     * Menampilkan halaman tertentu dan menyembunyikan yang lain.
     * @param {string} pageId - ID dari halaman yang akan ditampilkan.
     */
    function showPage(pageId) {
        pages.forEach(page => page.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');

        // Update status navigasi aktif
        navItems.forEach(item => {
            item.classList.remove('text-cyan-600');
            item.classList.add('text-gray-500');
            if (item.dataset.page === pageId) {
                item.classList.remove('text-gray-500');
                item.classList.add('text-cyan-600');
            }
        });
    }

    /**
     * Mengisi data pengguna ke dalam elemen-elemen di halaman.
     * @param {object} user - Objek data pengguna.
     */
    function populateUserData(user) {
        // Beranda
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-saldo').textContent = parseInt(user.saldo).toLocaleString('id-ID');
        document.getElementById('invest-status').textContent = user.status.toUpperCase();
        document.getElementById('invest-status').className = `px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'run' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        
        const runTime = JSON.parse(user.runTime);
        const stopTime = JSON.parse(user.stopTime);
        document.getElementById('run-time').textContent = `${runTime.date} ${runTime.time}`;
        document.getElementById('stop-time').textContent = `${stopTime.date} ${stopTime.time}`;
        
        document.getElementById('income-minute').textContent = parseInt(user['income-minute']).toLocaleString('id-ID');
        document.getElementById('income-daily').textContent = parseInt(user.income).toLocaleString('id-ID');

        // Profil
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-username').textContent = user.userID;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-whatsapp').textContent = user.whatsapp;

        const rekeningInfo = JSON.parse(user['informasi-rekening']);
        document.getElementById('profile-bank').textContent = rekeningInfo.bank;
        document.getElementById('profile-acc-number').textContent = rekeningInfo['acc-number'];
        document.getElementById('profile-acc-name').textContent = rekeningInfo['acc-name'];
    }

    /**
     * Memeriksa status login saat aplikasi dimuat.
     */
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            populateUserData(user);
            showPage('beranda-page');
            bottomNav.classList.remove('hidden');
        } else {
            showPage('login-page');
            bottomNav.classList.add('hidden');
        }
    }

    // --- EVENT HANDLER ---

    // Proses Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://opensheet.elk.sh/1ktylmM8WtIUMUro8gkTjnmIKzkOLnOveXTll-HsK9IE/user');
            if (!response.ok) throw new Error('Gagal mengambil data pengguna');
            
            const users = await response.json();
            const foundUser = users.find(u => u.userID === username && u.pass === password);

            if (foundUser) {
                alert('Login berhasil!');
                localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
                populateUserData(foundUser);
                showPage('beranda-page');
                bottomNav.classList.remove('hidden');
                loginForm.reset();
            } else {
                alert('Username atau password salah.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan. Coba lagi nanti.');
        }
    });

    // Proses Daftar (Hanya simulasi UI)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Fitur pendaftaran saat ini tidak tersedia. Silakan hubungi admin untuk membuat akun baru.');
    });

    // Navigasi Bawah
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.dataset.page;
            showPage(targetPage);
        });
    });

    // Tombol Logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('loggedInUser');
            alert('Anda telah keluar.');
            checkLoginStatus(); // Kembali ke halaman login
        }
    });

    // Toggle antara Form Login dan Daftar
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    });

    // --- INISIALISASI ---
    checkLoginStatus();

});
