function kirimPesan() {

    var nama = document.getElementById('nama');
    var email = document.getElementById('email');
    var pesan = document.getElementById('pesan');

    var gabungan = 'Nama%3A%0A' + nama.value + '%0AEmail%3A%0A' + email.value + '%0APesan%3A%0A' + pesan.value;

    var token = 'T6612145611:AAF79G-4c8rvwGIFYYeWAEC0jOfsrAnHy5I'; // Ganti dengan token bot yang kamu buat
    var grup = '4582629793'; // Ganti dengan chat id dari bot yang kamu buat

    $.ajax({
        url: `https://api.telegram.org/bot${token}/sendMessage?chat_id=${grup}&text=${gabungan}&parse_mode=html`,
        method: `POST`,
    })
}