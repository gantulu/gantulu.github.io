document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const fileInput = document.getElementById("img1");
  const file = fileInput.files[0];

  if (!file) {
    alert("Pilih file gambar terlebih dahulu!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const dataUrl = event.target.result;

    // Preview gambar
    const preview = document.getElementById("preview");
    preview.src = dataUrl;
    preview.style.display = "block";

    // Tampilkan data URL (base64)
    document.getElementById("output").value = dataUrl;
  };

  reader.readAsDataURL(file);
});
