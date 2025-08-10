    const coins = ["BTC", "ETH", "BNB", "XRP", "ADA", "DOGE", "SOL", "LTC", "MATIC"];
    const grid = document.getElementById("cryptoGrid");
    const balanceEl = document.getElementById("balance");

    // Format angka ke Rupiah dengan titik ribuan
    function formatRupiah(angka) {
      return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Buat elemen grid sekali saja
    coins.forEach(coin => {
      let div = document.createElement("div");
      div.className = "bg-gray-800 p-3 rounded-lg text-center text-white";
      div.innerHTML = `
        <div class="text-sm">${coin} / USD</div>
        <div class="price text-lg font-semibold">0%</div>
      `;
      grid.appendChild(div);
    });

    function updatePrices() {
      // Update saldo acak dari Rp 6.585.000 s/d Rp 8.540.005
      let saldo = Math.floor(Math.random() * (8540005 - 6585000 + 1)) + 6585000;
      balanceEl.textContent = `Rp ${formatRupiah(saldo)}`;

      // Update harga crypto
      const items = document.querySelectorAll("#cryptoGrid .price");
      items.forEach(item => {
        let change = (Math.random() * 100 - 7).toFixed(2); // -7% sampai +93%
        item.textContent = `${change >= 0 ? '+' : ''}${change}%`;
        item.className = `price text-lg font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`;
      });
    }

    // Update setiap detik
    setInterval(updatePrices, 1000);
    updatePrices();
