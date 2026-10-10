dakotaa.md\


\<html lang="id">\<head>\<meta charset="utf-8">\<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
\<title>Beranda - Nusantara Cargo\</title>
\<link rel="icon" href="/uploads/media/favicon.png?v=1789967850">\<link rel="stylesheet" href="/assets/style.css">\<script src="chrome-extension://daiklcgdelcbcmjepemiklfglodmofbm/static/js/workers.min.js">\</script>\</head>\<body>
\<div class="topbar">\<div class="container">\<span>☎ Customer Service 24 Jam\</span>\<span>\<a href="/tracking.php">⌕ Cek Resi\</a>　\<a href="/ongkir.php">▣ Cek Ongkir\</a>　\<a href="/admin/login.php">♙ Login\</a>\</span>\</div>\</div>
\<header>\<div class="container nav">
\<a class="brand" href="/" aria-label="Nusantara Cargo">\<img src="/uploads/media/logo.png?v=1789967850" alt="Nusantara Cargo">\</a>
\<button class="toggle">☰\</button>
\<nav>\<a href="/">Beranda\</a>\<a href="/layanan.php">Layanan\</a>\<a href="/tracking.php">Cek Resi\</a>\<a href="/ongkir.php">Cek Ongkir\</a>\<a href="/lokasi.php">Lokasi\</a>\<a href="/berita.php">Berita\</a>\<a href="/tentang.php">Tentang Kami\</a>\<a href="/kontak.php">Kontak\</a>\</nav>
\<a class="wa" target="\_blank" href="[https://wa.me/6285285397865](https://wa.me/6285285397865)">◉ WhatsApp\<br>\<strong>+62 85285397865\</strong>\</a>
\</div>\</header>\<main>\<section class="hero hero-image" aria-label="Nusantara Cargo">
&#x20;   \<img src="/uploads/media/banner_home.png?v=1789967850" alt="Nusantara Cargo" loading="eager" decoding="async">
\</section>
\<section class="tools container">\<div class="tool redbox">\<h3>Cek Resi\</h3>\<form action="/tracking.php">\<div>\<input name="resi" placeholder="No. Resi" required="">\<button>LACAK\</button>\</div>\</form>\</div>\<div class="tool graybox">\<h3>Cek Ongkos Kirim\</h3>\<form action="/ongkir.php">\<div class="four">\<input name="asal" placeholder="Kota Asal" required="">\<input name="tujuan" placeholder="Kota Tujuan" required="">\<input name="berat" type="number" value="1" min="1" placeholder="Kg">\<button>Cari\</button>\</div>\</form>\</div>\<div class="tool redbox">\<h3>Lokasi\</h3>\<a class="loc" href="/lokasi.php">TEMUKAN LOKASI\</a>\</div>\</section>
\<section class="services container">\<small>‹ LAYANAN CARGO TERBAIK DI INDONESIA ›\</small>\<h2>Kami menyediakan pengiriman cargo\<br>sesuai kebutuhan Anda\</h2>\<div class="cards">\<article>🚚\<h3>Cargo Darat\</h3>\<p>Efisien untuk pengiriman antarkota dan antarwilayah.\</p>\</article>\<article>✈️\<h3>Cargo Udara\</h3>\<p>Pilihan cepat untuk barang yang membutuhkan waktu singkat.\</p>\</article>\<article>🚢\<h3>Cargo Laut\</h3>\<p>Solusi ekonomis untuk barang berat dan volume besar.\</p>\</article>\</div>\</section>
\<section class="numbers">\<div class="container nums">\<div>\<b>01\</b>\<h3>Jangkauan Luas\</h3>\<p>Pengiriman ke berbagai wilayah Indonesia.\</p>\</div>\<div>\<b>02\</b>\<h3>Tracking\</h3>\<p>Status paket mudah dipantau.\</p>\</div>\<div>\<b>03\</b>\<h3>Harga Kompetitif\</h3>\<p>Tarif transparan dan terukur.\</p>\</div>\</div>\</section>
\</main>

\<style>
/\* =========================================================
&#x20;  NUSANTARA CARGO — FOOTER V2
&#x20;  Desktop: 4 kolom sejajar, mengikuti desain sampel.
&#x20;  Mobile: kolom turun secara responsif tanpa overflow horizontal.
&#x20;  \========================================================= \*/
.site-footer{
&#x20;   position\:relative;
&#x20;   isolation\:isolate;
&#x20;   overflow\:hidden;
&#x20;   width:100%;
&#x20;   margin:0;
&#x20;   padding:42px 0 0;
&#x20;   color:#fff;
&#x20;   background:#061b3f;
}

.site-footer::before{
&#x20;   content:"";
&#x20;   position\:absolute;
&#x20;   inset:0;
&#x20;   z-index:-2;
&#x20;   background-image\:url('/uploads/media/footer-background.png?v=1789967850');
&#x20;   background-position\:center center;
&#x20;   background-size\:cover;
&#x20;   background-repeat\:no-repeat;
}

/\* Overlay dibuat cukup gelap supaya teks putih tetap terbaca,
&#x20;  tetapi gambar kapal/truk/pesawat masih terlihat seperti sampel. \*/
.site-footer::after{
&#x20;   content:"";
&#x20;   position\:absolute;
&#x20;   inset:0;
&#x20;   z-index:-1;
&#x20;   background\:linear-gradient(
&#x20;       90deg,
&#x20;       rgba(2,18,48,.88) 0%,
&#x20;       rgba(3,24,55,.82) 48%,
&#x20;       rgba(2,17,42,.70) 100%
&#x20;   );
&#x20;   pointer-events\:none;
}

.site-footer .footer-inner{
&#x20;   width\:min(1390px,92%);
&#x20;   margin:0 auto;
}

/\* KUNCI PERBAIKAN: 4 kolom tetap pada desktop.
&#x20;  Sebelumnya hanya ada 3 kolom sehingga kolom Hubungi Kami
&#x20;  jatuh ke baris kedua. \*/
.site-footer .footer-grid{
&#x20;   display\:grid;
&#x20;   grid-template-columns:1.20fr 1fr 1fr 1.22fr;
&#x20;   align-items\:start;
&#x20;   min-width:0;
}

.site-footer .footer-brand,
.site-footer .footer-column{
&#x20;   min-width:0;
}

.site-footer .footer-brand{
&#x20;   padding:4px 42px 0 0;
}

.site-footer .footer-column{
&#x20;   min-height:245px;
&#x20;   padding:4px 34px 0;
&#x20;   border-left:1px solid rgba(255,255,255,.28);
}

.site-footer .footer-column\:last-child{
&#x20;   padding-right:0;
}

.site-footer .footer-logo{
&#x20;   display\:block;
&#x20;   width:290px;
&#x20;   max-width:100%;
&#x20;   height\:auto;
&#x20;   max-height:112px;
&#x20;   object-fit\:contain;
&#x20;   object-position\:left center;
&#x20;   margin:0;
}

.site-footer .footer-heading{
&#x20;   margin:0 0 17px;
&#x20;   color:#fff;
&#x20;   font-size:21px;
&#x20;   line-height:1.2;
&#x20;   font-weight:800;
&#x20;   text-transform\:uppercase;
&#x20;   letter-spacing:.15px;
}

.site-footer .footer-heading::after{
&#x20;   content:"";
&#x20;   display\:block;
&#x20;   width:38px;
&#x20;   height:3px;
&#x20;   margin-top:10px;
&#x20;   background:#e90013;
&#x20;   border-radius:3px;
}

.site-footer .footer-links{
&#x20;   display\:flex;
&#x20;   flex-direction\:column;
&#x20;   gap:10px;
}

.site-footer .footer-links a,
.site-footer .footer-contact p{
&#x20;   margin:0;
&#x20;   color\:rgba(255,255,255,.94);
&#x20;   font-size:15px;
&#x20;   line-height:1.45;
&#x20;   text-decoration\:none;
}

.site-footer .footer-links a{
&#x20;   display\:flex;
&#x20;   align-items\:center;
&#x20;   min-width:0;
&#x20;   transition\:color .2s ease,transform .2s ease;
}

.site-footer .footer-links a\:hover{
&#x20;   color:#fff;
&#x20;   transform\:translateX(3px);
}

.site-footer .footer-links a span,
.site-footer .footer-contact .contact-icon{
&#x20;   flex:0 0 27px;
&#x20;   width:27px;
&#x20;   color:#ed0015;
&#x20;   font-weight:800;
}

.site-footer .footer-links a span{
&#x20;   font-size:17px;
}

.site-footer .footer-contact{
&#x20;   display\:flex;
&#x20;   flex-direction\:column;
&#x20;   gap:12px;
}

.site-footer .footer-contact p{
&#x20;   display\:flex;
&#x20;   align-items\:flex-start;
}

.site-footer .footer-contact .contact-icon{
&#x20;   font-size:17px;
&#x20;   line-height:1.35;
}

.site-footer .footer-contact p > span\:last-child{
&#x20;   overflow-wrap\:anywhere;
}

.site-footer .footer-bottom{
&#x20;   margin-top:24px;
&#x20;   min-height:58px;
&#x20;   border-top:1px solid rgba(255,255,255,.28);
&#x20;   display\:flex;
&#x20;   align-items\:center;
&#x20;   justify-content\:flex-start;
&#x20;   color\:rgba(255,255,255,.88);
&#x20;   font-size:13px;
}

.site-footer .footer-bottom strong{
&#x20;   color:#fff;
}

@media (max-width:1100px){
&#x20;   .site-footer .footer-inner{width\:min(94%,1390px)}
&#x20;   .site-footer .footer-grid{
&#x20;       grid-template-columns:1.1fr 1fr 1fr 1.15fr;
&#x20;   }
&#x20;   .site-footer .footer-brand{padding-right:26px}
&#x20;   .site-footer .footer-column{padding-left:24px;padding-right:20px}
&#x20;   .site-footer .footer-logo{width:250px}
&#x20;   .site-footer .footer-heading{font-size:19px}
&#x20;   .site-footer .footer-links a,
&#x20;   .site-footer .footer-contact p{font-size:14px}
}

@media (max-width:820px){
&#x20;   .site-footer{padding-top:34px}
&#x20;   .site-footer .footer-grid{
&#x20;       grid-template-columns:1fr 1fr;
&#x20;       row-gap:28px;
&#x20;   }
&#x20;   .site-footer .footer-brand{
&#x20;       grid-column:1 / -1;
&#x20;       padding:0 0 6px;
&#x20;   }
&#x20;   .site-footer .footer-column{
&#x20;       min-height:0;
&#x20;   }
&#x20;   .site-footer .footer-logo{width:245px}
}

@media (max-width:560px){
&#x20;   .site-footer{padding:30px 0 0}
&#x20;   .site-footer .footer-inner{width\:calc(100% - 32px)}
&#x20;   .site-footer .footer-grid{
&#x20;       grid-template-columns:1fr;
&#x20;       row-gap:0;
&#x20;   }
&#x20;   .site-footer .footer-brand{
&#x20;       grid-column\:auto;
&#x20;       padding:0 0 25px;
&#x20;   }
&#x20;   .site-footer .footer-column{
&#x20;       padding:22px 0 0;
&#x20;       min-height:0;
&#x20;       border-left:0;
&#x20;       border-top:1px solid rgba(255,255,255,.18);
&#x20;   }
&#x20;   .site-footer .footer-column\:last-child{
&#x20;       padding-right:0;
&#x20;   }
&#x20;   .site-footer .footer-logo{
&#x20;       width:225px;
&#x20;       max-height:92px;
&#x20;   }
&#x20;   .site-footer .footer-heading{
&#x20;       font-size:18px;
&#x20;       margin-bottom:14px;
&#x20;   }
&#x20;   .site-footer .footer-links{gap:8px}
&#x20;   .site-footer .footer-links a,
&#x20;   .site-footer .footer-contact p{font-size:14px}
&#x20;   .site-footer .footer-bottom{
&#x20;       margin-top:24px;
&#x20;       min-height:0;
&#x20;       padding:15px 0 18px;
&#x20;       line-height:1.5;
&#x20;   }
}
\</style>

\<footer class="site-footer" aria-label="Footer Nusantara Cargo">
&#x20;   \<div class="footer-inner">
&#x20;       \<div class="footer-grid">

```
        <!-- KOLOM 1: LOGO -->
        <div class="footer-brand">
                                <img class="footer-logo" src="/uploads/media/logo_horizontal_light.png?v=1789967850" alt="Nusantara Cargo" loading="lazy" onerror="this.onerror=null;this.src='/uploads/media/logo-horizontal-light.png';">
                        </div>

        <!-- KOLOM 2: LAYANAN -->
        <div class="footer-column">
            <h4 class="footer-heading">Layanan Kami</h4>
            <nav class="footer-links" aria-label="Layanan Kami">
                <a href="/layanan.php"><span>▣</span> Cargo Darat</a>
                <a href="/layanan.php"><span>✈</span> Cargo Udara</a>
                <a href="/layanan.php"><span>▰</span> Cargo Laut</a>
                <a href="/layanan.php"><span>◆</span> Packing</a>
                <a href="/layanan.php"><span>⌂</span> Gudang</a>
                <a href="/layanan.php"><span>⬟</span> Asuransi</a>
            </nav>
        </div>

        <!-- KOLOM 3: INFORMASI -->
        <div class="footer-column">
            <h4 class="footer-heading">Informasi</h4>
            <nav class="footer-links" aria-label="Informasi">
                <a href="/tentang.php"><span>›</span> Tentang Kami</a>
                <a href="/layanan.php"><span>›</span> Layanan</a>
                <a href="/tracking.php"><span>›</span> Cek Resi</a>
                <a href="/ongkir.php"><span>›</span> Cek Ongkir</a>
                <a href="/lokasi.php"><span>›</span> Lokasi</a>
                <a href="/berita.php"><span>›</span> Berita</a>
                <a href="/kontak.php"><span>›</span> Kontak Kami</a>
            </nav>
        </div>

        <!-- KOLOM 4: HUBUNGI KAMI -->
        <div class="footer-column footer-contact-column">
            <h4 class="footer-heading">Hubungi Kami</h4>
            <div class="footer-contact">
                <p><span class="contact-icon">☎</span><span></span></p>
                <p><span class="contact-icon">◔</span><span>+62 85285397865</span></p>
                <p><span class="contact-icon">✉</span><span>Support@Nusantara-cargo.com</span></p>
                <p><span class="contact-icon">⌖</span><span>ITC ROXY MAS, Komplek Ruko No.11 Blok C3, RW.8, Cideng, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10150</span></p>
            </div>
        </div>

    </div>

    <div class="footer-bottom">
        <div>© 2026 Nusantara Cargo. All Rights Reserved.</div>
    </div>
</div>
```

\</footer>

\<!-- NUSANTARA CARGO — LIVE CHAT -->

\<style>
.nc-chat-launcher{position\:fixed;right:22px;bottom:22px;z-index:99990;border:0;border-radius:999px;background:#d71920;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.22);padding:12px 18px;font-weight:800;cursor\:pointer;display\:flex;align-items\:center;gap:9px}
.nc-chat-dot{width:9px;height:9px;background:#35d07f;border-radius:50%;box-shadow:0 0 0 4px rgba(53,208,127,.18);display\:inline-block}
.nc-chat-panel{position\:fixed;right:22px;bottom:82px;width:360px;max-width\:calc(100vw - 28px);height:500px;z-index:99991;background:#fff;border-radius:18px;box-shadow:0 20px 55px rgba(10,30,55,.25);overflow\:hidden;display\:none;border:1px solid #e5e9ef}
.nc-chat-panel.open{display\:flex;flex-direction\:column}
.nc-chat-head{background\:linear-gradient(135deg,#0b1d38,#173b69);color:#fff;padding:15px 16px;display\:flex;justify-content\:space-between;align-items\:center}
.nc-chat-head strong{display\:block;font-size:15px}.nc-chat-head small{display\:block;opacity:.78;margin-top:3px}
.nc-chat-close{border:0;background\:transparent;color:#fff;font-size:22px;cursor\:pointer}
.nc-chat-messages{flex:1;overflow\:auto;padding:14px;background:#f5f7fa}
.nc-chat-bubble{max-width:82%;padding:9px 12px;border-radius:13px;margin:7px 0;font-size:13px;line-height:1.45;word-break\:break-word}
.nc-chat-bubble.customer{margin-left\:auto;background:#d71920;color:#fff}.nc-chat-bubble.admin{margin-right\:auto;background:#fff;border:1px solid #e0e6ed;color:#24344a}
.nc-chat-bubble small{display\:block;opacity:.6;font-size:9px;margin-top:4px}
.nc-chat-form{border-top:1px solid #e8edf2;padding:10px;background:#fff}
.nc-chat-fields{display\:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:7px}
.nc-chat-form input,.nc-chat-form textarea{width:100%;box-sizing\:border-box;border:1px solid #d9e0e8;border-radius:9px;padding:9px;font\:inherit;font-size:12px}
.nc-chat-form textarea{resize\:none;height:54px}
.nc-chat-send{width:100%;margin-top:7px;border:0;border-radius:9px;background:#d71920;color:#fff;padding:10px;font-weight:800;cursor\:pointer}
.nc-chat-note{font-size:10px;color:#8793a3;margin-top:5px;text-align\:center}
@media(max-width:560px){.nc-chat-launcher{right:14px;bottom:14px}.nc-chat-panel{right:14px;bottom:70px;width\:calc(100vw - 28px);height\:min(70vh,520px)}}
\</style>

\<button type="button" class="nc-chat-launcher" id="nc-chat-launcher" aria-label="Buka Live Chat">
&#x20;   \<span class="nc-chat-dot">\</span> Live Chat
\</button>

\<div class="nc-chat-panel" id="nc-chat-panel" aria-live="polite">
&#x20;   \<div class="nc-chat-head">
&#x20;       \<div>
&#x20;           \<strong>Nusantara Cargo\</strong>
&#x20;           \<small>\<span class="nc-chat-dot" style="margin-right:5px">\</span> Customer Service Online\</small>
&#x20;       \</div>
&#x20;       \<button type="button" class="nc-chat-close" id="nc-chat-close">×\</button>
&#x20;   \</div>

```
<div class="nc-chat-messages" id="nc-chat-messages">
    <div style="text-align:center;color:#7d899a;font-size:12px;padding:28px 15px">
        Halo 👋<br>Silakan kirim pesan kepada Customer Service kami.
    </div>
</div>

<form class="nc-chat-form" id="nc-chat-form">
    <div class="nc-chat-fields">
        <input id="nc-chat-name" placeholder="Nama" maxlength="120" required="">
        <input id="nc-chat-phone" placeholder="No. WhatsApp" maxlength="50">
    </div>
    <textarea id="nc-chat-message" placeholder="Tulis pesan..." maxlength="3000" required=""></textarea>
    <button class="nc-chat-send" type="submit">Kirim Pesan</button>
    <div class="nc-chat-note">Pesan akan diterima oleh Customer Service.</div>
</form>
```

\</div>

\<script>
(function(){
&#x20;   var api='/chat_api.php';
&#x20;   var panel=document.getElementById('nc-chat-panel');
&#x20;   var launcher=document.getElementById('nc-chat-launcher');
&#x20;   var close=document.getElementById('nc-chat-close');
&#x20;   var box=document.getElementById('nc-chat-messages');
&#x20;   var form=document.getElementById('nc-chat-form');
&#x20;   var nameInput=document.getElementById('nc-chat-name');
&#x20;   var phoneInput=document.getElementById('nc-chat-phone');
&#x20;   var msgInput=document.getElementById('nc-chat-message');
&#x20;   var timer=null;

&#x20;   function loadChat(){
&#x20;       fetch(api+'?action=customer_messages',{cache:'no-store'})
&#x20;       .then(function(r){return r.json();})
&#x20;       .then(function(d){
&#x20;           if(!d.ok)return;
&#x20;           if(d.conversation){
&#x20;               nameInput.value=d.conversation.customer_name||nameInput.value;
&#x20;               phoneInput.value=d.conversation.customer_phone||phoneInput.value;
&#x20;           }

&#x20;           box.innerHTML='';
&#x20;           if(!d.messages || !d.messages.length){
&#x20;               box.innerHTML='\<div style="text-align\:center;color:#7d899a;font-size:12px;padding:28px 15px">Halo 👋\<br>Silakan kirim pesan kepada Customer Service kami.\</div>';
&#x20;               return;
&#x20;           }

&#x20;           d.messages.forEach(function(m){
&#x20;               var b=document.createElement('div');
&#x20;               b.className='nc-chat-bubble '+m.sender_type;

&#x20;               var text=document.createElement('div');
&#x20;               text.textContent=m.message;
&#x20;               b.appendChild(text);

&#x20;               var sm=document.createElement('small');
&#x20;               sm.textContent=m.created_at;
&#x20;               b.appendChild(sm);

&#x20;               box.appendChild(b);
&#x20;           });
&#x20;           box.scrollTop=box.scrollHeight;
&#x20;       })
&#x20;       .catch(function(){});
&#x20;   }

&#x20;   launcher.onclick=function(){
&#x20;       panel.classList.add('open');
&#x20;       loadChat();
&#x20;       if(!timer)timer=setInterval(loadChat,3000);
&#x20;   };

&#x20;   close.onclick=function(){
&#x20;       panel.classList.remove('open');
&#x20;   };

&#x20;   form.onsubmit=function(e){
&#x20;       e.preventDefault();

&#x20;       var name=nameInput.value.trim();
&#x20;       var phone=phoneInput.value.trim();
&#x20;       var message=msgInput.value.trim();

&#x20;       if(!name || !message)return;

&#x20;       var fd=new FormData();
&#x20;       fd.append('action','customer_send');
&#x20;       fd.append('name',name);
&#x20;       fd.append('phone',phone);
&#x20;       fd.append('message',message);

&#x20;       var btn=form.querySelector('.nc-chat-send');
&#x20;       btn.disabled=true;

&#x20;       fetch(api,{method:'POST',body\:fd})
&#x20;       .then(function(r){return r.json();})
&#x20;       .then(function(d){
&#x20;           btn.disabled=false;
&#x20;           if(d.ok){
&#x20;               msgInput.value='';
&#x20;               loadChat();
&#x20;           }else{
&#x20;               alert(d.error||'Pesan gagal dikirim.');
&#x20;           }
&#x20;       })
&#x20;       .catch(function(){
&#x20;           btn.disabled=false;
&#x20;           alert('Koneksi ke Live Chat gagal.');
&#x20;       });
&#x20;   };
})();
\</script>

\<script>
var t=document.querySelector('.toggle');
if(t)t.onclick=function(){
&#x20;   var nav=document.querySelector('nav');
&#x20;   if(nav) nav.classList.toggle('open');
};
\</script>

\<script type="module" src="[https://static.cloudflareinsights.com/beacon.min.js/v4bc70e2c01a94c73b74392e4234840661791215815920](https://static.cloudflareinsights.com/beacon.min.js/v4bc70e2c01a94c73b74392e4234840661791215815920)" integrity="sha512-L0ha0OXavK/8okipN9F8BtP84dg9DUhPERbBXzwI6dgTA55d2+yweo3pn5CSFYs45/r8md2+xvUPtTdvTNRfjA==" data-cf-beacon="{&quot;version&quot;:&quot;2024.11.0&quot;,&quot;token&quot;:&quot;0df0602774184dd99f7aa3478b61f40d&quot;,&quot;r&quot;:1,&quot;spa&quot;:2}" crossorigin="anonymous">\</script>

\</body>\</html>