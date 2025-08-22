    const rupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    });

    const ctx = document.getElementById("saldoChart").getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(96, 165, 250, 0.5)");
    gradient.addColorStop(1, "rgba(96, 165, 250, 0)");

    const saldoChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Saldo Update",
          data: [],
          borderColor: "#60a5fa",
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#9ca3af" }
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              color: "#9ca3af",
              callback: function(value) {
                return rupiah.format(value);
              }
            }
          }
        }
      }
    });

    let time = 0;
    let firstValue = null;
    let saldoInterval, countdownInterval;

    function updateRandomSaldo() {
      const minincome = parseInt(document.getElementById("minincome").value);
      const maxincome = parseInt(document.getElementById("maxincome").value);

      const randomValue = Math.floor(Math.random() * (maxincome - minincome + 1)) + minincome;
      document.getElementById("saldoUpdate").value = rupiah.format(randomValue);

      if (firstValue === null) firstValue = randomValue;

      saldoChart.data.labels.push(time + "s");
      saldoChart.data.datasets[0].data.push(randomValue);
      time++;

      if (saldoChart.data.labels.length > 30) {
        saldoChart.data.labels.shift();
        saldoChart.data.datasets[0].data.shift();
      }

      saldoChart.update();

      const percentChange = ((randomValue - firstValue) / firstValue) * 100;
      const percentElem = document.getElementById("percentChange");

      percentElem.textContent = (percentChange >= 0 ? "+" : "") + percentChange.toFixed(2) + "%";
      percentElem.style.color = percentChange >= 0 ? "#22c55e" : "#ef4444";
    }

    function updateCountdown() {
      const dateendStr = document.getElementById("dateendValue").value;
      const endTime = new Date(dateendStr).getTime();
      const now = new Date().getTime();
      let diff = endTime - now;

      if (diff <= 0) {
        document.getElementById("dateend").value = "Selesai";
        clearInterval(saldoInterval);
        clearInterval(countdownInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById("dateend").value =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
    }

    saldoInterval = setInterval(updateRandomSaldo, 1000);
    countdownInterval = setInterval(updateCountdown, 1000);

    updateRandomSaldo();
    updateCountdown();
