  async function fetchTopCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=volume_desc&per_page=12&page=1&sparkline=false');
      const coins = await response.json();

      const container = document.getElementById('crypto-list');
      container.innerHTML = '';

      coins.forEach((coin, index) => {
        const item = document.createElement('div');
        item.className = 'crypto-item';
        setTimeout(() => item.classList.add('show'), index * 100); // animasi delay

        item.innerHTML = `
          <div class="crypto-left">
            <img src="${coin.image}" alt="${coin.name}" class="crypto-logo">
            <div>
              <div class="crypto-name">${coin.symbol.toUpperCase()} - ${coin.name}</div>
            </div>
          </div>
          <div class="crypto-price">
            <div>Rp ${coin.current_price.toLocaleString('id-ID')}</div>
            <div class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
              ${coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        `;

        container.appendChild(item);
      });

    } catch (error) {
      console.error('Gagal ambil data:', error);
      document.getElementById('crypto-list').innerHTML = '<p>Gagal memuat data.</p>';
    }
  }

  fetchTopCoins();
