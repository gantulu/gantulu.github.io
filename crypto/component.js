let chart;
let lastFetchedPrices = {};
let priceHistory = { BTC: [], ETH: [], USDT: [] };
let labels = [];
let incomeTotal = 0;
let minIncome = 0, maxIncome = 0;
let currentSaldo = 0;
let currentIncome = 0;
let activeCoin = "BTC";
let dateStart = null, dateEnd = null;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed: " + res.status);
  return await res.json();
}

async function getUser() {
  const userId = document.getElementById("useridValue3").value;
  const userData = await fetchJson(
    `https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items/${userId}`
  );
  const user = userData.fieldData;
  minIncome = user.minincome || 0;
  maxIncome = user.maxincome || 0;
  dateStart = new Date(user.date);
  dateEnd = new Date(user.dateend);
  document.getElementById("dateStart").textContent = dateStart.toLocaleString("id-ID");
  updateIncomeRandom();
}

async function fetchRealPrices() {
  try {
    const priceData = await fetchJson(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd"
    );
    lastFetchedPrices = {
      BTC: priceData.bitcoin.usd,
      ETH: priceData.ethereum.usd,
      USDT: priceData.tether.usd
    };
  } catch (err) {
    console.error("Error fetch CoinGecko:", err);
  }
}

function animateNumber(elementId, from, to, duration = 800, prefix = "Rp ") {
  const el = document.getElementById(elementId);
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = from + (to - from) * progress;
    el.textContent = prefix + Math.floor(value).toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function updateIncomeRandom() {
  const newIncome = Math.floor(Math.random() * (maxIncome - minIncome + 1)) + minIncome;
  animateNumber("incomeTotal", currentIncome, newIncome);
  currentIncome = newIncome;
  incomeTotal = newIncome;
}

function updateSimulatedPrices() {
  const fluctuation = (val) => val * (1 + (Math.random() - 0.5) / 50);
  const BTC = fluctuation(lastFetchedPrices.BTC || 0);
  const ETH = fluctuation(lastFetchedPrices.ETH || 0);
  const USDT = fluctuation(lastFetchedPrices.USDT || 1);
  labels.push("");
  if (labels.length > 15) labels.shift();
  priceHistory.BTC.push(BTC);
  priceHistory.ETH.push(ETH);
  priceHistory.USDT.push(USDT);
  if (priceHistory.BTC.length > 15) priceHistory.BTC.shift();
  if (priceHistory.ETH.length > 15) priceHistory.ETH.shift();
  if (priceHistory.USDT.length > 15) priceHistory.USDT.shift();
  const saldoManual = parseInt(document.getElementById("saldo").value) || 0;
  const saldoDynamic = (incomeTotal + saldoManual + BTC + ETH + USDT) * 15000;
  animateNumber("saldoTotal", currentSaldo, saldoDynamic);
  currentSaldo = saldoDynamic;
  renderUI({ BTC, ETH, USDT });
}

function renderUI(latest) {
  const ctx = document.getElementById("cryptoChart").getContext("2d");
  const dataset = {
    label: activeCoin,
    data: priceHistory[activeCoin],
    borderColor: activeCoin === "BTC" ? "#F7931A" : activeCoin === "ETH" ? "#627EEA" : "#26A17B",
    tension: 0.4
  };
  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: { labels, datasets: [dataset] },
      options: {
        responsive: true,
        animation: { duration: 800, easing: "easeInOutCubic" },
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { display: false }, grid: { display: false } },
          y: { ticks: { color: "white" }, grid: { color: "#333" } }
        }
      }
    });
  } else {
    chart.data.datasets = [dataset];
    chart.update();
  }
  const cryptoList = document.getElementById("cryptoList");
  cryptoList.innerHTML = `
    <div onclick="setActive('BTC')" class="tab ${activeCoin==='BTC'?'active':''}">
      <span>BTC</span><span>$${latest.BTC.toFixed(2)}</span>
    </div>
    <div onclick="setActive('ETH')" class="tab ${activeCoin==='ETH'?'active':''}">
      <span>ETH</span><span>$${latest.ETH.toFixed(2)}</span>
    </div>
    <div onclick="setActive('USDT')" class="tab ${activeCoin==='USDT'?'active':''}">
      <span>USDT</span><span>$${latest.USDT.toFixed(2)}</span>
    </div>
  `;
}

function setActive(coin) {
  activeCoin = coin;
  renderUI({
    BTC: priceHistory.BTC.at(-1) || 0,
    ETH: priceHistory.ETH.at(-1) || 0,
    USDT: priceHistory.USDT.at(-1) || 0
  });
}

function updateCountdown() {
  if (!dateEnd || !dateStart) return;
  const now = new Date();
  const diff = dateEnd - now;
  if (diff <= 0) {
    document.getElementById("countdown").textContent = "Selesai";
    document.getElementById("progressBar").style.width = "100%";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById("countdown").textContent =
    `${days}h ${hours}j ${minutes}m ${seconds}d`;
  const total = dateEnd - dateStart;
  const elapsed = now - dateStart;
  const progress = Math.min((elapsed / total) * 100, 100);
  document.getElementById("progressBar").style.width = progress + "%";
}

(async () => {
  await getUser();
  await fetchRealPrices();
  setInterval(fetchRealPrices, 5000);
  setInterval(updateSimulatedPrices, 1000);
  setInterval(updateIncomeRandom, 1000);
  setInterval(updateCountdown, 1000);
})();
