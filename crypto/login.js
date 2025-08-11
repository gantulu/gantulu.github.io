    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const res = await fetch('https://api.apico.dev/v1/ox3cG1/collections/689820f71092605423fc2136/items');
        const data = await res.json();

        const user = data.items.find(item => 
          item.fieldData.email === email && item.fieldData.password === password
        );

        if (!user) {
          alert('Email atau password salah!');
          return;
        }

        localStorage.setItem('id', user.id);
        localStorage.setItem('slug', user.fieldData.slug);

        window.location.href = `/user/${user.fieldData.slug}`;
      } catch (err) {
        console.error(err);
        alert('Gagal login. Silakan coba lagi.');
      }
    });
