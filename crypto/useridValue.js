document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Kalau belum login, langsung redirect ke halaman login
    window.location.href = "/login";
    return;
  }

  // Set value input dengan id=useridValue
  const userIdInput = document.getElementById("useridValue");
  if (userIdInput) {
    userIdInput.value = userId;
  }

  // Set value input dengan id=useridValue2
  const userIdInput2 = document.getElementById("useridValue2");
  if (userIdInput2) {
    userIdInput2.value = userId;
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
