    const saldoDisplay = document.getElementById("saldoDisplay");
    const showpresent = document.getElementById("showpresent");
    const countdownEl = document.getElementById("countdown");
    const userId = document.getElementById("useridValue3").value;

    let saldo = 0, minincome = 0, maxincome = 0, startDate, endDate;
    let growth = 0, mgrowth = 0, decrease = 0;
    let chart, data = [];
    let counter = 0;

    function formatRupiah(angka) {
      return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    async function fetchInitialData() {
      try {
        const res = await fetch(
          `https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items/${userId}/live`,
          { headers: { Authorization: 'Bearer a7def046547dc8deac583832c1985c6430bd7b74efc630d80597b707d7be0352' } }
        );
        const json = await res.json();
        const f = json.fieldData;

        saldo = f.saldo;
        minincome = f.minincome;
        maxincome = f.maxincome;
        startDate = new Date(f.date);
        endDate = new Date(f.dateend);

        growth = minincome / 10800;
        mgrowth = maxincome / 10800;
        decrease = -(growth / 2);

        initChart();
        saldoDisplay.textContent = formatRupiah(Math.round(saldo));

        setInterval(updateSaldo, 1000);
        setInterval(updateCountdown, 1000);

      } catch (err) {
        console.error("Gagal fetch data awal:", err);
      }
    }

    function initChart() {
      const ctx = document.getElementById("myChart").getContext("2d");
      let labels = Array.from({length: 30}, (_, i) => i+1);
      data = Array.from({length: 30}, () => saldo);

      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Pergerakan Saldo",
            data: data,
            borderColor: "rgba(76,175,80,1)",
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            backgroundColor: "rgba(76,175,80,0.15)"
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: {color:'#555'} },
            y: { beginAtZero: false, ticks: {color:'#555'} }
          }
        }
      });
    }

    async function updateAPI(saldoNow) {
      const options = {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer a7def046547dc8deac583832c1985c6430bd7b74efc630d80597b707d7be0352'
        },
        body: JSON.stringify({
          isArchived: false,
          isDraft: false,
          fieldData: {
            saldo: Math.round(saldoNow),
            date: startDate,
            dateend: endDate,
            minincome: minincome,
            maxincome: maxincome
          }
        })
      };
      try {
        const res = await fetch(
          `https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items/${userId}/live`,
          options
        );
        console.log("API Updated:", await res.json());
      } catch (err) {
        console.error("API Error:", err);
      }
    }

    function updateSaldo() {
      const now = new Date();
      if (now >= endDate) return;

      let oldSaldo = saldo;

      if (Math.random() < 0.85) {
        const inc = growth + Math.random() * (mgrowth - growth);
        saldo += inc;
      } else {
        saldo += decrease;
      }

      saldoDisplay.textContent = formatRupiah(Math.round(saldo));

      let diff = saldo - oldSaldo;
      let percent = (diff / oldSaldo) * 100;

      if (diff > 0) {
        showpresent.style.color = "green";
        showpresent.textContent = `+${formatRupiah(Math.round(diff))} (${percent.toFixed(2)}%)`;
      } else if (diff < 0) {
        showpresent.style.color = "red";
        showpresent.textContent = `${formatRupiah(Math.round(diff))} (${percent.toFixed(2)}%)`;
      } else {
        showpresent.style.color = "#555";
        showpresent.textContent = "0 (0%)";
      }

      showpresent.classList.remove("active");
      void showpresent.offsetWidth;
      showpresent.classList.add("active");

      data.shift();
      data.push(saldo);

      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);
      chart.options.scales.y.min = minVal * 0.98; 
      chart.options.scales.y.max = maxVal * 1.02;

      chart.update();

      counter++;
      if (counter % 30 === 0) {
        updateAPI(saldo);
      }
    }

    function updateCountdown() {
      const now = new Date();
      const distance = endDate - now;

      if (distance <= 0) {
        countdownEl.textContent = "Waktu habis!";
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownEl.textContent = 
        `Sisa waktu: ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    }

    fetchInitialData();