document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Kalau belum login, langsung redirect ke halaman login
    window.location.href = "/login";
    return;
  }

  // Isi input useridValue1 sampai useridValue5
  for (let i = 1; i <= 5; i++) {
    const input = document.getElementById(`useridValue${i}`);
    if (input) {
      input.value = userId;
    }
  }

  // Logout button (cek dulu apakah ada di halaman)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      window.location.href = "/login";
    });
  }
});
