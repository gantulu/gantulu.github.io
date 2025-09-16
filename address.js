const baseAPI = "https://alamat.thecloudalert.com/api";

// Elemen
const prov = document.getElementById("provinsi");
const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const kel = document.getElementById("kelurahan");
const kodeposInput = document.getElementById("kodepos");

// Load provinsi
fetch(`${baseAPI}/provinsi/get/`)
  .then(r => r.json())
  .then(json => {
    if (json.status === 200) {
      json.result.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.text;
        prov.appendChild(opt);
      });
    }
  });

// Saat provinsi dipilih → load kabupaten/kota
prov.addEventListener("change", () => {
  kab.innerHTML = `<option value="">-- Pilih Kabupaten/Kota --</option>`;
  kec.innerHTML = `<option value="">-- Pilih Kecamatan --</option>`;
  kel.innerHTML = `<option value="">-- Pilih Kelurahan / Desa --</option>`;
  kodeposInput.value = "";

  if (!prov.value) return;

  fetch(`${baseAPI}/kabkota/get/?d_provinsi_id=${prov.value}`)
    .then(r => r.json())
    .then(json => {
      if (json.status === 200) {
        json.result.forEach(kabObj => {
          const opt = document.createElement("option");
          opt.value = kabObj.id;
          opt.textContent = kabObj.text;
          kab.appendChild(opt);
        });
      }
    });
});

// Saat kabupaten dipilih → load kecamatan
kab.addEventListener("change", () => {
  kec.innerHTML = `<option value="">-- Pilih Kecamatan --</option>`;
  kel.innerHTML = `<option value="">-- Pilih Kelurahan / Desa --</option>`;
  kodeposInput.value = "";

  if (!kab.value) return;

  fetch(`${baseAPI}/kecamatan/get/?d_kabkota_id=${kab.value}`)
    .then(r => r.json())
    .then(json => {
      if (json.status === 200) {
        json.result.forEach(kecObj => {
          const opt = document.createElement("option");
          opt.value = kecObj.id;
          opt.textContent = kecObj.text;
          kec.appendChild(opt);
        });
      }
    });
});

// Saat kecamatan dipilih → load kelurahan/desa
kec.addEventListener("change", () => {
  kel.innerHTML = `<option value="">-- Pilih Kelurahan / Desa --</option>`;
  kodeposInput.value = "";

  if (!kec.value) return;

  fetch(`${baseAPI}/kelurahan/get/?d_kecamatan_id=${kec.value}`)
    .then(r => r.json())
    .then(json => {
      if (json.status === 200) {
        json.result.forEach(kelObj => {
          const opt = document.createElement("option");
          opt.value = kelObj.id;
          opt.textContent = kelObj.text;
          kel.appendChild(opt);
        });
      }
    });
});

// Saat kelurahan/desa dipilih → load kodepos
kel.addEventListener("change", () => {
  kodeposInput.value = "";

  if (!kel.value || !kab.value) return;

  // Menggunakan endpoint kodepos berdasarkan kub/kota + kecamatan
  fetch(`${baseAPI}/kodepos/get/?d_kabkota_id=${kab.value}&d_kecamatan_id=${kec.value}`)
    .then(r => r.json())
    .then(json => {
      if (json.status === 200 && json.result.length > 0) {
        // Bisa ada beberapa kodepos, ambil yang pertama
        kodeposInput.value = json.result[0].text;
      } else {
        kodeposInput.value = "Kode pos tidak ditemukan";
      }
    });
});
