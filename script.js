const token = "Bearer aff75d8cc39d3ca17aff0eca2cf40a2b99a47a9f58b543b55011b54dd52371b1";
const collectionId = "68753222d5f2c7c5c8ce00be";

document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const itemId = document.getElementById("itemID").value;
  if (!itemId) return alert("Item ID harus diisi.");

  const files = {
    foto1: document.getElementById("foto1").files[0],
    foto2: document.getElementById("foto2").files[0],
    foto3: document.getElementById("foto3").files[0]
  };

  const uploadedAssets = {};

  for (const [field, file] of Object.entries(files)) {
    if (!file) continue;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.webflow.com/v2/assets/upload", {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData
    });

    const json = await res.json();
    if (!json?.data?.id) {
      alert(`Gagal upload ${field}`);
      return;
    }

    uploadedAssets[field] = { assetId: json.data.id };
  }

  // Update item di Webflow
  const patchRes = await fetch(
    `https://api.webflow.com/v2/collections/${collectionId}/items/${itemId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: uploadedAssets })
    }
  );

  const patchJson = await patchRes.json();
  if (patchJson?.data?.id) {
    alert("Berhasil update gambar ke CMS Webflow!");
  } else {
    console.error(patchJson);
    alert("Gagal update item CMS.");
  }
});
