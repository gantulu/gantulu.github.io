    document.getElementById("planChoise").addEventListener("change", function() {
        document.getElementById("planChoiseBronze").style.display = "none";
        document.getElementById("planChoiseSilver").style.display = "none";
        document.getElementById("planChoiseGold").style.display = "none";

        if (this.value === "Bronze") {
            document.getElementById("planChoiseBronze").style.display = "block";
        } else if (this.value === "Silver") {
            document.getElementById("planChoiseSilver").style.display = "block";
        } else if (this.value === "Gold") {
            document.getElementById("planChoiseGold").style.display = "block";
        }
    });

    document.querySelectorAll('input[name="jumlahDepositPilih"]').forEach(radio => {
        radio.addEventListener("change", function() {
            document.getElementById("jumlahDeposit").value = this.value;
        });
    });

    document.getElementById("depositForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const userName = document.getElementById("userName").value.trim();
        const name = document.getElementById("name").value.trim();
        const whatsapp = document.getElementById("whatsapp").value.trim();
        const planChoise = document.getElementById("planChoise").value.trim();
        const jumlahDeposit = document.getElementById("jumlahDeposit").value.trim();
        const durasi = document.getElementById("durasi").value.trim();
        const bank = document.getElementById("bank").value.trim();
        const nomorVa = document.getElementById("nomorVa").value.trim();

        const pesan = 
`Informasi deposit
Nama : ${name}
User Name : ${userName}
WhatsApp : ${whatsapp}

Plan yang dipilih : ${planChoise}
Jumlah Deposit : ${jumlahDeposit}
Durasi : ${durasi}

Tujuan transfer : ${bank} ${nomorVa}`;

        document.getElementById("message").value = pesan;

        fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
                "Authorization": "7h8nvVE7zZsNk9GxYMHn"
            },
            body: new URLSearchParams({
                target: "6282311155579",
                message: pesan,
                countryCode: "62"
            })
        })
        .then(res => res.json())
        .then(response => {
            document.getElementById("result").textContent = JSON.stringify(response, null, 2);
        })
        .catch(err => {
            document.getElementById("result").textContent = "Error: " + err;
        });
    });
