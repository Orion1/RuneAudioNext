<?php
/*
 * Copyright (C) 2013-2014 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013-2014 - Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013-2014 - Carmelo San Giovanni (aka Um3ggh1U) & Simone De Gregori (aka Orion)
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
 *  file: mpd-config_ctl.php
 *  version: 1.3
 *
 */
 
 $dbh = cfgdb_connect($db);
 
 if (isset($_POST)) {
	// reset MPD configuration
	if (isset($_POST['reset'])) {
		$mpdconfdefault = cfgdb_read('',$dbh,'mpdconfdefault');
		foreach($mpdconfdefault as $element) {
			cfgdb_update('cfg_mpd',$dbh,$element['param'],$element['value_default']);
		}
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg' ));
		unset($_POST); // ??
	}
	// update MPD configuration
	if (isset($_POST['conf'])) {
		foreach ($_POST['conf'] as $key => $value) {
			cfgdb_update('cfg_mpd',$dbh,$key,$value);
		}
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg' ));
	}
	// manual MPD configuration
	if (isset($_POST['mpdconf'])) {
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg', 'args' => $_POST['mpdconf'] ));
	}
 }
 
waitSyWrk($redis,$jobID);

// check integrity of /etc/network/interfaces
if(hashCFG('check_mpd',$redis)) {
$template->mpdconf = file_get_contents('/etc/mpd.conf');
// set manual config template
$template->content = "mpd_manual";
} else {

$mpdconf = cfgdb_read('',$dbh,'mpdconf');
// prepare array
$_mpd = array (
						'port' => '',
						'log_level' => '',
						'gapless_mp3_playback' => '',
						'auto_update' => '',
						'auto_update_depth' => '',
						'zeroconf_enabled' => '',
						'zeroconf_name' => '',
						'audio_output_format' => '',
						'mixer_type' => '',
						'audio_buffer_size' => '',
						'buffer_before_play' => '',
						'dsd_usb' => '',
						'volume_normalization' => ''
					);
//debug($mpdconf);							
// parse output for template $template->conf
foreach ($mpdconf as $key => $value) {
	foreach ($_mpd as $key2 => $value2) {
		if ($value['param'] == $key2) {
		$template->conf[$key2] = $value['value_player'];	
		}
	}
}

}

// close DB connection
$dbh = null;


// check actual active output interface
//$active_ao = _parseOutputsResponse(getMpdOutputs($mpd),1);
// $active_ao = $_SESSION['ao'];
// $_audioout = '';
// if (wrk_checkStrSysfile('/proc/asound/cards','USB-Audio')) {
// $_audioout .= "<option value=\"0\" ".(($active_ao == 0) ? "selected" : "").">USB Audio</option>\n";
// }
// if (($_SESSION['hwplatformid'] == '01' OR $_SESSION['hwplatformid'] == '04') && wrk_checkStrSysfile('/proc/asound/card1/pcm0p/info','bcm2835')) {
// $_audioout .= "<option value=\"2\" ".(($active_ao == 2) ? "selected" : "").">Analog Out</option>\n";
// $_audioout .= "<option value=\"3\" ".(($active_ao == 3) ? "selected" : "").">HDMI</option>\n";
// } 
// $_audioout .= "<option value=\"1\" ".(($active_ao == 1) ? "selected" : "").">Null (test output)</option>";

// wait for worker output if $_SESSION['w_active'] = 1

?>