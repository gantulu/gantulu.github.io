const img1Input = document.getElementById('img1');
const uploadBtn = document.getElementById('upload-btn');

uploadBtn.addEventListener('click', () => {
  const file = img1Input.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('img1', file);

    fetch('https://qlpav7.buildship.run/file-uploadsf', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  } else {
    console.error('Tidak ada file yang dipilih');
  }
});
