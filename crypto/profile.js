import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://blhvtvwgundbnoioxflw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaHZ0dndndW5kYm5vaW94Zmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMzY0MjksImV4cCI6MjA2OTcxMjQyOX0.MY6c8n1w5Ol9KZRyipBKSzoczw6HZW3Gd1TUsDcNAIA';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fileInput = document.getElementById('getimageurl');
const urlInput = document.getElementById('imageurl');
const userIdInput = document.getElementById('useridValue1');

fileInput.addEventListener('change', async () => {
  if (!fileInput.files.length) {
    urlInput.value = '';
    return;
  }

  const file = fileInput.files[0];
  const fileName = `${Date.now()}_${file.name}`;

  // Upload file to Supabase
  const { data, error } = await supabase.storage.from('profile-image').upload(fileName, file);
  if (error) {
    console.error(error);
    alert('Upload gagal!');
    urlInput.value = '';
    return;
  }

  // Get public URL
  const { data: publicData, error: urlError } = supabase.storage.from('profile-image').getPublicUrl(fileName);
  if (urlError) {
    console.error(urlError);
    alert('Gagal mendapatkan URL');
    urlInput.value = '';
    return;
  }

  const publicUrl = publicData.publicUrl;
  urlInput.value = publicUrl;

  // Automatically PATCH to Apico
  const userId = userIdInput.value.trim();
  if (!userId) return alert('User ID tidak ditemukan');

  const patchUrl = `https://api.apico.dev/v1/tfHpYQ/collections/689e1ae27ac7d1569bff9886/items/${userId}/live`;
  const bodyData = {
    isArchived: false,
    isDraft: false,
    fieldData: { imageurl: publicUrl }
  };

  fetch(patchUrl, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer a7def046547dc8deac583832c1985c6430bd7b74efc630d80597b707d7be0352',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
  .then(res => res.json())
  .then(res => console.log('PATCH response:', res))
  .catch(err => console.error('Error:', err));
});
