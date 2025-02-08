<?php
$app_name   = $_POST[“app”];
$sender     = $_POST[“sender”];
$message    = $_POST[“message”];
$phone      = $_POST["phone"];
$group_name = $_POST["group_name"];

//Permintaan tubuh
{
“app”: “Name of the incoming message app”,
“sender”: “A person’s name or number who is sending you the message”,
“message”: “Incoming message”
}
//tubuh respon
{
  "reply" : Balas pesan dari server
}

$response = array("reply" => "Hello $sender, we received your message $message.");
echo json_encode($response);
?>
