<script>
document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const file = form.img1.files[0];

  // Konversi file ke Base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const base64Image = file ? await getBase64(file) : null;

  const jsonData = {
    name: form.name.value,
    color: form.color.value,
    storage: form.storage.value,
    harga: form.harga.value,
    deskripsi: form.deskripsi.value,
    pengirim: form.pengirim.value,
    kota: form.kota.value,
    link: form.link.value,
    image: base64Image
  };

  console.log('Data yang dikirim:', jsonData);

  // Kirim ke BuildShip webhook
  try {
    const response = await fetch('https://qlpav7.buildship.run/file-uploadsf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });

    if (response.ok) {
      alert('Berhasil mengirim data!');
    } else {
      alert('Gagal mengirim data!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi error saat mengirim!');
  }
});
</script>
