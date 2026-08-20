<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: public, max-age=600");
$date = isset($_GET["date"]) ? $_GET["date"] : "";
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
  http_response_code(400);
  echo '{"error":"bad date"}';
  exit;
}
$lat = "30.4390911";
$lng = "-84.3011454";
$url = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date={$date}&end_date={$date}";
function tt_fetch($url) {
  if (function_exists("curl_init")) {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 8,
      CURLOPT_USERAGENT => "TailgateTribe/1.0",
    ));
    $out = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($out !== false && $code >= 200 && $code < 300) return $out;
  }
  $ctx = stream_context_create(array("http" => array("timeout" => 8, "header" => "User-Agent: TailgateTribe/1.0\r\n")));
  $out = @file_get_contents($url, false, $ctx);
  return $out !== false ? $out : null;
}
$body = tt_fetch($url);
if ($body === null) {
  http_response_code(502);
  echo '{"error":"forecast unavailable"}';
  exit;
}
echo $body;
