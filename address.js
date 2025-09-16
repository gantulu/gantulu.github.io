const baseAPI = "https://alamat.thecloudalert.com/api";

// Fungsi ambil provinsi
async function loadProvinsi() {
  const res = await fetch(`${baseAPI}/provinsi/get/`);
  const data = await res.json();
  const select = document.getElementById('pilih-provinsi');
  data.result.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.text;
    select.appendChild(option);
  });
}

// Fungsi ambil kabupaten
async function loadKabupaten(provId) {
  const res = await fetch(`${baseAPI}/kabkota/get/?d_provinsi_id=${provId}`);
  const data = await res.json();
  const select = document.getElementById('pilih-kabupaten');
  select.innerHTML = '<option value="">--Pilih Kabupaten--</option>';
  data.result.forEach(k => {
    const option = document.createElement('option');
    option.value = k.id;
    option.textContent = k.text;
    select.appendChild(option);
  });
}

// Fungsi ambil kecamatan
async function loadKecamatan(kabId) {
  const res = await fetch(`${baseAPI}/kecamatan/get/?d_kabkota_id=${kabId}`);
  const data = await res.json();
  const select = document.getElementById('pilih-kecamatan');
  select.innerHTML = '<option value="">--Pilih Kecamatan--</option>';
  data.result.forEach(kec => {
    const option = document.createElement('option');
    option.value = kec.id;
    option.textContent = kec.text;
    select.appendChild(option);
  });
}

// Fungsi ambil kelurahan
async function loadKelurahan(kecId) {
  const res = await fetch(`${baseAPI}/kelurahan/get/?d_kecamatan_id=${kecId}`);
  const data = await res.json();
  const select = document.getElementById('pilih-kelurahan');
  select.innerHTML = '<option value="">--Pilih Kelurahan--</option>';
  data.result.forEach(kel => {
    const option = document.createElement('option');
    option.value = kel.text;
    option.textContent = kel.text;
    select.appendChild(option);
  });
}

// Fungsi ambil kode pos
async function loadKodepos(kabId, kecId) {
  const res = await fetch(`${baseAPI}/kodepos/get/?d_kabkota_id=${kabId}&d_kecamatan_id=${kecId}`);
  const data = await res.json();
  if (data.result.length > 0) {
    // Ambil kode pos pertama
    document.getElementById('kodepos').value = data.result[0].text;
  } else {
    document.getElementById('kodepos').value = '';
  }
}

// Event listener
document.getElementById('pilih-provinsi').addEventListener('change', function() {
  const provId = this.value;
  document.getElementById('provinsi').value = this.options[this.selectedIndex].text;
  loadKabupaten(provId);

  // Reset level bawah
  document.getElementById('kabupaten').value = '';
  document.getElementById('kecamatan').value = '';
  document.getElementById('kelurahan').value = '';
  document.getElementById('kodepos').value = '';
  document.getElementById('pilih-kecamatan').innerHTML = '<option value="">--Pilih Kecamatan--</option>';
  document.getElementById('pilih-kelurahan').innerHTML = '<option value="">--Pilih Kelurahan--</option>';
});

document.getElementById('pilih-kabupaten').addEventListener('change', function() {
  const kabId = this.value;
  document.getElementById('kabupaten').value = this.options[this.selectedIndex].text;
  loadKecamatan(kabId);

  // Reset level bawah
  document.getElementById('kecamatan').value = '';
  document.getElementById('kelurahan').value = '';
  document.getElementById('kodepos').value = '';
  document.getElementById('pilih-kelurahan').innerHTML = '<option value="">--Pilih Kelurahan--</option>';
});

document.getElementById('pilih-kecamatan').addEventListener('change', function() {
  const kecId = this.value;
  const kabId = document.getElementById('pilih-kabupaten').value;
  document.getElementById('kecamatan').value = this.options[this.selectedIndex].text;
  loadKelurahan(kecId);
  loadKodepos(kabId, kecId);

  document.getElementById('kelurahan').value = '';
});

document.getElementById('pilih-kelurahan').addEventListener('change', function() {
  document.getElementById('kelurahan').value = this.value;
  // Kode pos tetap otomatis dari loadKodepos()
});

// Load provinsi saat halaman dibuka
loadProvinsi();
