
  document.getElementById("toggleDark").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  async function getData() {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=idr&include_24hr_change=true";
    let res = await fetch(url);
    return await res.json();
  }

  let latestPrice = { btc: null, eth: null, doge: null };

  async function updateFromAPI() {
    let data = await getData();
    latestPrice.btc = data.bitcoin.idr;
    latestPrice.eth = data.ethereum.idr;
    latestPrice.doge = data.dogecoin.idr;
    document.getElementById("btc-price").textContent = "Rp " + latestPrice.btc.toLocaleString("id-ID");
    document.getElementById("eth-price").textContent = "Rp " + latestPrice.eth.toLocaleString("id-ID");
    document.getElementById("doge-price").textContent = "Rp " + latestPrice.doge.toLocaleString("id-ID");
    updateChange("btc-change", data.bitcoin.idr_24h_change);
    updateChange("eth-change", data.ethereum.idr_24h_change);
    updateChange("doge-change", data.dogecoin.idr_24h_change);
    updatePortfolio();
  }

  function updateChange(elId, change) {
    let el = document.getElementById(elId);
    let formatted = change.toFixed(2) + "% (24h)";
    if (change >= 0) {
      el.textContent = "📈 " + formatted;
      el.className = "text-green-500";
    } else {
      el.textContent = "📉 " + formatted;
      el.className = "text-red-500";
    }
  }

  function updatePortfolio() {
    let btcHold = parseFloat(document.getElementById("btc-hold").value) || 0;
    let ethHold = parseFloat(document.getElementById("eth-hold").value) || 0;
    let dogeHold = parseFloat(document.getElementById("doge-hold").value) || 0;
    let total = (btcHold * latestPrice.btc) + (ethHold * latestPrice.eth) + (dogeHold * latestPrice.doge);
    document.getElementById("portfolio").textContent = "Rp " + total.toLocaleString("id-ID");
  }

  const ctx = document.getElementById("btcChart").getContext("2d");
  let btcChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "BTC Price (IDR)",
        data: [],
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.3)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#ddd" } } },
      scales: {
        x: { ticks: { color: "#aaa" } },
        y: { ticks: { color: "#aaa" } }
      }
    }
  });

  function dummyUpdate() {
    if (latestPrice.btc) {
      latestPrice.btc += (Math.random() - 0.5) * 1000000; 
      latestPrice.eth += (Math.random() - 0.5) * 50000;
      latestPrice.doge += (Math.random() - 0.5) * 5;
      document.getElementById("btc-price").textContent = "Rp " + Math.round(latestPrice.btc).toLocaleString("id-ID");
      document.getElementById("eth-price").textContent = "Rp " + Math.round(latestPrice.eth).toLocaleString("id-ID");
      document.getElementById("doge-price").textContent = "Rp " + Math.round(latestPrice.doge).toLocaleString("id-ID");
      updatePortfolio();
      let now = new Date().toLocaleTimeString();
      btcChart.data.labels.push(now);
      btcChart.data.datasets[0].data.push(latestPrice.btc);
      if (btcChart.data.labels.length > 20) {
        btcChart.data.labels.shift();
        btcChart.data.datasets[0].data.shift();
      }
      btcChart.update();
    }
  }

  setInterval(updateFromAPI, 10000);
  setInterval(dummyUpdate, 1000);
  updateFromAPI();