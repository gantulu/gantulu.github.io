
const accessToken = "aff75d8cc39d3ca17aff0eca2cf40a2b99a47a9f58b543b55011b54dd52371b1"; // ← Ganti dengan Webflow API v2 Token
const collectionId = "68753222d5f2c7c5c8ce00be"; // ← Ganti dengan Collection ID
const fieldName = "foto1"; // ← Ganti dengan nama field gambar di Webflow

document.getElementById("foto1").addEventListener("change", async function () {
  const file = this.files[0];
  const itemId = document.getElementById("itemID").value;
  if (!file || !itemId) return alert("Lengkapi Item ID dan pilih file!");

  try {
    // 1. Upload file ke Webflow Assets
    const fd = new FormData();
    fd.append("file", file);

    const uploadRes = await fetch("https://api.webflow.com/v2/assets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: fd
    });

    const uploadData = await uploadRes.json();
    const assetId = uploadData?.data?.id;
    if (!assetId) throw new Error("Gagal upload asset");

    // 2. PATCH CMS item dengan assetId
    const patchRes = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isArchived: false,
        isDraft: false,
        fieldData: {
          [fieldName]: { assetId: assetId }
        }
      })
    });

    const patchData = await patchRes.json();
    if (patchRes.ok) {
      alert("Berhasil upload dan update gambar!");
    } else {
      console.error(patchData);
      alert("Gagal update CMS item");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi error saat upload");
  }
});
