<?php
/*
 * Copyright (C) 2013-2014 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013-2014 - Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013-2014 - Simone De Gregori (aka Orion) & Carmelo San Giovanni (aka Um3ggh1U)
 *
 * RuneAudio website and logo
 * copyright (C) 2013-2014 - ACX webdesign (Andrea Coiutti)
 *
 * This Program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3, or (at your option)
 * any later version.
 *
 * This Program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with RuneAudio; see the file COPYING.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.txt>.
 *
 *  file: command/index.php
 *  version: 1.3
 *  coder: Simone De Gregori
 *
 */

// common include
include($_SERVER['HOME'].'/app/config/config.php');
// -- REWORK NEEDED --
if (isset($_GET['cmd']) && $_GET['cmd'] != '') {
        if ( !$mpd ) {
        echo 'Error Connecting to MPD daemon ';
        } else {
            if ($_GET['cmd'] == 'enableao' && isset($_GET['ao'])) {
                $outputs = _parseOutputsResponse(getMpdOutputs($mpd));
                $cmdstr .= "pause \n";
                $i = 0;
                foreach ($outputs as $output) {
                    if ($redis->get('hwplatformid') == '01' OR $redis->get('hwplatformid') == '03') {
                        if ($i == 2 &&  ($_GET['ao'] == 2 OR $_GET['ao'] == 3)) {
                            $cmdstr .= "enableoutput 2\n";
                        } else if ($i == $_GET['ao']) {
                            $cmdstr = "enableoutput ".$_GET['ao']."\n";
                        } else {
                            $cmdstr .= "disableoutput ".$i."\n";
                        }
                    }
                $i++;
                }
                $cmdstr .= "play \n";
                // disable all MPD outputs
                // debug
                runelog('MPD command (0):',$cmdstr);
                sendMpdCommand($mpd,$cmdstr);
                // Audio Output: raspberrypi
                if ($redis->get('hwplatformid') == '01') {
                    // AnalogJack
                    if ($_GET['ao'] == 2) {
                    $aosock = openMpdSocket('127.0.0.1', 13501);
                    } else if ($_GET['ao'] == 3) {
                    // HDMI
                    $aosock = openMpdSocket('127.0.0.1', 13502);
                    $cmdstr = 'enableoutput 2';
                    }
                    usleep(300000);
                    sendMpdCommand($aosock,"\n");
                    runelog('selected Rpi jack/hdmi internal switch:',$_GET['ao']);
                    fclose($aosock);
                }
            // enable selected MPD output
            // debug
            runelog('MPD command (1):',$cmdstr);
            sendMpdCommand($mpd,$cmdstr);
            // debug
            runelog('selected output interface:',$_GET['ao']);
            playerSession('write',$db,'ao',$_GET['ao']);
            } else if (($redis->get('hwplatformid') == '01') && ($redis->get('ao') == 2 OR $redis->get('ao') == 3) && ($_GET['cmd'] == 'next' OR $_GET['cmd'] == 'previous' OR preg_match('/play/', $_GET['cmd']) OR preg_match('/seek/', $_GET['cmd']))) {
                // debug
                runelog('MPD command (2):','pause');
                sendMpdCommand($mpd,"pause");
                // debug
                if ($redis->get('state') == 'stop' && preg_match('/play/', $_GET['cmd'])) {
                runelog('MPD command (3):','play');
                sendMpdCommand($mpd,"play");
                }
                    // seek command fix
                    if (preg_match('/seek/', $_GET['cmd'])) {
                        runelog('--- [command/index.php] >>> OPEN MPD SOCKET --- (-1) ---','');
                        $mpd2 = openMpdSocket(DAEMONIP, 6600);
                        // debug
                        runelog('MPD command (4):',$_GET['cmd']);
                        sendMpdCommand($mpd2,$_GET['cmd']);
                        // debug
                        runelog('--- [command/index.php] --- CLOSE MPD SOCKET <<< (-1) ---','');
                        closeMpdSocket($mpd2);
                        $cmdstr = 'play';
                    } else {
                        $cmdstr = $_GET['cmd'];
                    }
                // close MPD socket and wait for 0.5 sec
                // debug
                runelog('--- [command/index.php] --- CLOSE MPD SOCKET <<< (0) ---','');
                closeMpdSocket($mpd);
                usleep(500000);
                // debug
                runelog('--- [command/index.php] >>> OPEN MPD SOCKET --- (0) ---','');
                $mpd = openMpdSocket(DAEMONIP, 6600);
                usleep(100000);
                // debug
                runelog('MPD command (5):',$cmdstr);
                sendMpdCommand($mpd,$cmdstr);
            } else {
                // debug
                runelog('MPD command (6):',$_GET['cmd']);
                if ($_GET['cmd'] === 'renderui') {
					ui_update($redis,$mpd);
                } else if ($_GET['cmd'] === 'wifiscan') {
					wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'wificfg', 'action' => 'scan' ));
					echo 'wlan scan queued';
					die;
				} else {
					sendMpdCommand($mpd,$_GET['cmd']);
				}
            }
        // debug
        runelog('--- [command/index.php] --- CLOSE MPD SOCKET <<< (1) ---','');
		$response = readMpdResponse($mpd);
        closeMpdSocket($mpd);
				echo $response;
		}
} else {
echo 'MPD COMMAND INTERFACE<br>';
echo 'INTERNAL USE ONLY<br>';
echo 'hosted on runeaudio.local:82';
}
