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
 
 if (isset($_POST)) {
	// switch audio output
	if (isset($_POST['ao'])) {
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg', 'action' => 'switchao', 'args' => $_POST['ao'] ));
	}
	// reset MPD configuration
	if (isset($_POST['reset'])) {
		$mpdconfdefault = cfgdb_read('',$dbh,'mpdconfdefault');
		foreach($mpdconfdefault as $element) {
			cfgdb_update('cfg_mpd',$dbh,$element['param'],$element['value_default']);
		}
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg' ));
	}
	// update MPD configuration
	if (isset($_POST['conf'])) {
		// foreach ($_POST['conf'] as $key => $value) {
			// $redis->hSet('mpdconf',$key,$value);
		// }
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg', 'args' => $_POST['conf'] ));
	}
	// manual MPD configuration
	if (isset($_POST['mpdconf'])) {
		$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'mpdcfg', 'args' => $_POST['mpdconf'] ));
	}
	
 }
 
waitSyWrk($redis,$jobID);

// check integrity of /etc/network/interfaces
if(!hashCFG('check_mpd',$redis)) {
$template->mpdconf = file_get_contents('/etc/mpd.conf');
// set manual config template
$template->content = "mpd_manual";
} else {

$template->conf = $redis->hgetall('mpdconf');
$acards = $redis->hgetall('acards');
// $acards_details = $redis->hgetall('acards_details');
// $i = 0;
foreach ($acards as $card => $data) {
$audio_cards[] = json_decode($data);
	// if ($details = $redis->hget('acards_details',$card)) {
		// $details = json_decode($details);
		// $audio_cards->{$i}->extlabel = $details->extlabel;
	// }
// $i++;
}
$template->acards = $audio_cards;
// $template->acards_details = $audio_cards_details;
$template->ao = $redis->get('ao');

}
?>