const scriptURL = "https://script.google.com/macros/s/AKfycbxisiitUmSZfII7GAUG_qbw7HRvPSQdOSLBKR9DPg0Gg7G4-rX4V5UQCX1gT78oZGE/exec"; // ganti dengan URL Apps Script Web App

// Generate Order ID unik
function generateOrderID() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}

// Isi form otomatis dari localStorage
const checkoutData = JSON.parse(localStorage.getItem('cart_checkout'));
if (checkoutData) {
  Object.keys(checkoutData).forEach(key => {
    const value = checkoutData[key] || '';

    // isi ke input jika id cocok
    const inputEl = document.getElementById(key);
    if (inputEl) {
      inputEl.value = value;
    }

    // tampilkan gambar kalau ada elemen <img id="image_link_image">
    const imgEl = document.getElementById(key + '_image');
    if (imgEl && typeof value === 'string') {
      imgEl.src = value;
    }
  });
}

// Submit form ke Google Sheet
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  // Tambahkan orderID
  data.orderID = generateOrderID();

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "success") {
      alert("Order berhasil! ID: " + res.orderID);
      localStorage.removeItem("cart_checkout"); // kosongkan cart setelah order sukses
    } else {
      alert("Error: " + res.message);
    }
  })
  .catch(err => alert("Gagal kirim order: " + err.message));
});
