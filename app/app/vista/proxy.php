<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Obtener el valor de "door" desde la solicitud POST
$door = isset($_POST['door']) ? $_POST['door'] : 1; // Valor por defecto: 1

// Construir la URL dinámica
$url = "https://80fvghrxpa.execute-api.us-east-2.amazonaws.com/molinete/ingresos?door=" . urlencode($door);

// Obtener datos de la API
$response = file_get_contents($url);

// Devolver la respuesta al frontend
echo $response;
?>
