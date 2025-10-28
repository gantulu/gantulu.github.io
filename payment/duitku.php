<?php
header('Content-Type: application/json');

// Ambil data JSON dari frontend
$input = json_decode(file_get_contents("php://input"), true);

$nama = $input['nama'];
$email = $input['email'];
$phone = $input['phone'];
$amount = $input['amount'];

// ===== Konfigurasi Duitku =====
$merchantCode = "DS25718"; // Ganti kode merchant
$merchantKey  = "b7f7175c17faeaf0d956de5d927c12ea"; // Ganti merchant key
$duitkuUrl    = "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry"; // Sandbox dulu, ganti production saat live

// Buat merchantOrderId unik
$merchantOrderId = "INV-" . time();

// Buat signature MD5
$signature = md5($merchantCode . $merchantOrderId . $amount . $merchantKey);

// Data transaksi
$data = [
    "merchantCode"    => $merchantCode,
    "merchantOrderId" => $merchantOrderId,
    "paymentAmount"   => (int)$amount,
    "productDetails"  => "Pembayaran ".$nama,
    "email"           => $email,
    "phoneNumber"     => $phone,
    "paymentMethod"   => "VC", // VC = Virtual Account
    "signature"       => $signature,
    "returnUrl"       => "https://websitekamu.com/return",
    "callbackUrl"     => "https://websitekamu.com/callback",
    "customerVaName"  => $nama
];

// Kirim request ke API Duitku
$ch = curl_init($duitkuUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

// Kembalikan response ke frontend
echo $response;
