const fileInput = document.getElementById('img1');

fileInput.addEventListener('change', (e) => {
  const file = fileInput.files[0];
  console.log(file);
});
