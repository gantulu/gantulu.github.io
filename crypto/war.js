    const API_URL = "https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items";
    const TOKEN = "a7def046547dc8deac583832c1985c6430bd7b74efc630d80597b707d7be0352";

    // Data awal
    let saldo = 500000;
    let minincome = 6500000;
    let maxincome = 7000000;
    let date = new Date().toISOString();  
    let dateend = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(); // 3 jam ke depan

    // Ambil userId dari localStorage
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      document.getElementById("status").innerText = "userId tidak ditemukan di localStorage";
      throw new Error("userId missing in localStorage");
    }

    function formatRupiah(num) {
      return "Rp" + Math.floor(num).toLocaleString("id-ID");
    }

    function updateCountdownAndProgress() {
      const now = new Date().getTime();
      const start = new Date(date).getTime();
      const end = new Date(dateend).getTime();
      let diff = end - now;

      if (diff <= 0) {
        document.getElementById("countdown").innerText = "Sesi sudah berakhir";
        document.getElementById("progressBar").style.width = "100%";
        document.getElementById("progressBar").innerText = "100%";
        return false;
      }

      let hours = Math.floor(diff / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById("countdown").innerText =
        `Hitung mundur: ${hours}j ${minutes}m ${seconds}d`;

      // Progress %
      let total = end - start;
      let progress = ((now - start) / total) * 100;
      if (progress > 100) progress = 100;

      document.getElementById("progressBar").style.width = progress.toFixed(2) + "%";
      document.getElementById("progressBar").innerText = progress.toFixed(1) + "%";

      return true;
    }

    async function updateSaldo() {
      if (!updateCountdownAndProgress()) return; // stop kalau sesi habis

      // Random naik/turun
      let naikPerDetik = Math.random() * ((maxincome / 10800) - (minincome / 10800)) + (minincome / 10800);
      let turun = -(minincome / 2);

      // 70% kemungkinan naik, 30% turun
      let change = Math.random() < 0.7 ? naikPerDetik : turun;
      saldo += change;
      if (saldo < 0) saldo = 0;

      document.getElementById("saldoShow").innerText = formatRupiah(saldo);

      try {
        let res = await fetch(`${API_URL}/${userId}/live`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
          },
          body: JSON.stringify({
            saldo: Math.floor(saldo),
            date,
            dateend,
            minincome,
            maxincome
          })
        });

        let data = await res.json();
        document.getElementById("status").innerText = `Update saldo berhasil`;
        console.log("Updated:", data);
      } catch (err) {
        console.error("Error:", err);
        document.getElementById("status").innerText = "Gagal update API";
      }
    }

    // Jalankan tiap detik
    setInterval(updateSaldo, 1000);
