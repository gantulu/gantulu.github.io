<?php

$api_key   = 'ee2e86319b09b26558aa4d20f75418d921b77c76'; // API KEY Anda
$id_device = '12345'; // ID DEVICE yang di SCAN (Sebagai pengirim)
$url   = 'https://api.watsap.id/send-message'; // URL API
$no_hp = '081234567890'; // No.HP yang dikirim (No.HP Penerima)
$pesan = '😁 Halo Terimakasih 🙏'; // Pesan yang dikirim

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
curl_setopt($curl, CURLOPT_TIMEOUT, 0); // batas waktu response
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_POST, 1);

$data_post = [
   'id_device' => $id_device,
   'api-key' => $api_key,
   'no_hp'   => $no_hp,
   'pesan'   => $pesan
];
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data_post));
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($curl);
curl_close($curl);
echo $response;

?>
