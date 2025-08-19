document.getElementById('profileForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // cegah reload page

  const userId = localStorage.getItem('userId'); 
  if (!userId) return alert('User ID tidak ditemukan di localStorage');

  const fieldData = {
    email: document.getElementById('p-email').value,
    name: document.getElementById('p-name').value,
    nomorrekening: document.getElementById('p-nomorrekening').value || null,
    bank: document.getElementById('p-bank').value,
    namarekening: document.getElementById('p-namarekening').value,
    whatsapp: document.getElementById('p-whatsapp').value || null,
    pass: document.getElementById('p-pass').value
  };

  try {
    const response = await fetch(`https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items/${userId}/live`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer a7def046547dc8deac583832c1985c6430bd7b74efc630d80597b707d7be0352',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isArchived: false,
        isDraft: false,
        fieldData
      })
    });

    const result = await response.json();
    console.log(result);
    alert('Data berhasil diupdate!');
  } catch (err) {
    console.error(err);
    alert('Gagal update data!');
  }
});
