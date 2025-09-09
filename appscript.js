  const scriptURL = "https://script.google.com/macros/s/AKfycbxisiitUmSZfII7GAUG_qbw7HRvPSQdOSLBKR9DPg0Gg7G4-rX4V5UQCX1gT78oZGE/exec"; // ganti dengan URL Apps Script Web App

  function generateOrderID() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${y}${m}${d}-${rand}`;
  }

  document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    // generate orderID otomatis
    data.orderID = generateOrderID();

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        alert("Order berhasil! ID: " + res.orderID);
      } else {
        alert("Error: " + res.message);
      }
    })
    .catch(err => alert("Gagal kirim order: " + err.message));
  });
