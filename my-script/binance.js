  async function fetchPrices() {
    const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "SOLUSDT"];
    try {
      const response = await fetch("https://api.binance.com/api/v3/ticker/price");
      const data = await response.json();
      symbols.forEach((symbol) => {
        const coin = data.find((item) => item.symbol === symbol);
        if (coin) {
          document.getElementById(symbol).textContent = "$" + parseFloat(coin.price).toLocaleString();
        }
      });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }
  }
  fetchPrices(); // initial call
  setInterval(fetchPrices, 5000); // update every 5 seconds
