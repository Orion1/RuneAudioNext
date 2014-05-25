#!/usr/bin/php
<?php
// common include
ini_set('display_errors', '1');
ini_set('error_reporting', -1);
ini_set('error_log','/var/log/runeaudio/ui_notify.log');

// ---- functions -----
// push UI update to NGiNX channel
function ui_render($channel,$data) {
curlPost('http://127.0.0.1/pub?id='.$channel,$data);
}

function curlPost($url,$data,$proxy = null) {
$ch = curl_init($url);
if (isset($proxy)) {
$proxy['user'] === '' || curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxy['user'].':'.$proxy['pass']);
curl_setopt($ch, CURLOPT_PROXY, $proxy['host']);
//runelog('cURL proxy HOST: ',$proxy['host']);
//runelog('cURL proxy USER: ',$proxy['user']);
//runelog('cURL proxy PASS: ',$proxy['pass']);
}
 curl_setopt($ch, CURLOPT_TIMEOUT, 2);
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
 curl_setopt($ch, CURLOPT_HEADER, 0);  // DO NOT RETURN HTTP HEADERS
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // RETURN THE CONTENTS OF THE CALL
 $response = curl_exec($ch);
 curl_close($ch);
return $response;
}
// ---- functions -----

if (isset($argv[2])) {
// Connect to Redis backend
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
	if (!($redis->sIsMember('w_lock', $argv[2]))) {
			usleep(800000);
	} else {
		do {
			usleep(600000);
		} while ($redis->sIsMember('w_lock', $argv[2]));
	}
	$redis->close();
} else {
usleep(650000);
}

ui_render('notify', $argv[1]);
