<?php 
/*
 * Copyright (C) 2013 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013 - Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013 - Carmelo San Giovanni (aka Um3ggh1U) & Simone De Gregori (aka Orion)
 *
 * RuneAudio website and logo
 * copyright (C) 2013 - ACX webdesign (Andrea Coiutti)
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
 *  file: app/settings_ctl.php
 *  version: 1.3
 *
 */

// handle POST
if (isset($_POST)) {
/*
	if (isset($_POST['syscmd'])){
		switch ($_POST['syscmd']) {

		case 'reboot':
		// invoke worker
		wrk_control('exec','reboot');
		break;
			
		case 'poweroff':
		// invoke worker
		wrk_control('exec','poweroff');
		break;

		case 'mpdrestart':
		// invoke worker
		wrk_control('exec','mpdrestart');
		break;
		
		// case 'backup':
			// if ($_SESSION['w_lock'] != 1 && $_SESSION['w_queue'] == '') {
				// $_SESSION['w_jobID'] = wrk_jobID();
				// $_SESSION['w_queue'] = 'backup';
				// $_SESSION['w_active'] = 1;
				////wait worker response loop
					// while (1) {
					// sleep(2);
					// session_start();
						// if ( isset($_SESSION[$_SESSION['w_jobID']]) ) {
						////set UI notify
						// $_SESSION['notify']['title'] = 'BACKUP';
						// $_SESSION['notify']['msg'] = 'backup complete.';
						// pushFile($_SESSION[$_SESSION['w_jobID']]);
						// unset($_SESSION[$_SESSION['w_jobID']]);
						// break;
						// }
					// session_write_close();
					// }
				// } else {
				// session_start();
				// $_SESSION['notify']['title'] = 'Job Failed';
				// $_SESSION['notify']['msg'] = 'background worker is busy.';
				// }
		// break;
	
		case 'totalbackup':
			
		break;
			
		case 'restore':
			
		break;
		}

	}

	// ----------------------------------------------------------
*/
	if (isset($_POST['features'])) {

			if ($_POST['features']['airplay'] == 1) {
				// create worker job (start shairport)
				$redis->get('airplay') == 1 || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'airplay', 'action' => 'start' ));
			} else {
				// create worker job (stop shairport)
				$redis->get('airplay') == 0 || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'airplay', 'action' => 'stop' ));
			}

			if ($_POST['features']['udevil'] == 1) {
				// create worker job (start udevil)
				$redis->get('udevil') == 1 || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'udevil', 'action' => 'start' ));
			} else {
				// create worker job (stop udevil)
				$redis->get('udevil') == 0 || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'udevil', 'action' => 'stop' ));
			}	

			if ($_POST['features']['coverart'] == 1 ) {
				$redis->get('coverart') == 1 || $redis->set('coverart', 1);
			} else {
				$redis->get('coverart') == 0 || $redis->set('coverart', 0);
			}

			if ($_POST['features']['scrobbling_lastfm'] == 1) {
				// create worker job (start shairport)
				$redis->get('scrobbling_lastfm') == 1 && $_POST['lastfm']['user'] != $redis->hGet('lastfm','user') && $_POST['lastfm']['pass'] != $redis->hGet('lastfm','pass') || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'scrobbling_lastfm', 'action' => 'start', 'args' => $_POST['features']['lastfm']));
			} else {
				// create worker job (stop shairport)
				$redis->get('scrobbling_lastfm') == 0 || $jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'scrobbling_lastfm', 'action' => 'stop' ));
			}
			
	}
	// ------------------------------

			if (isset($_POST['hostname'])) {
				if (empty($_POST['hostname']) && $_POST['hostname'] != $redis->get('hostname')) {	
				$args = 'runeaudio';
				} else {
				$args = $_POST['hostname'];
				}
				// create worker job (change hostname)
				$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'hostname', 'args' => $args ));
			} 

			if (isset($_POST['ntpserver']) && $_POST['ntpserver'] != $redis->get('ntpserver')) {
				if (empty($_POST['ntpserver'])) {	
				$args = 'ntp.inrim.it';
				} else {
				$args = $_POST['ntpserver'];
				}
				// create worker job (change ntpserver)
				$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'ntpserver', 'args' => $args ));
			} 
			
			if (isset($_POST['cmediafix'][1])){
				$redis->get('cmediafix') == 1 || $redis->set('cmediafix', 1);
			} else {
				$redis->get('cmediafix') == 0 || $redis->set('cmediafix', 0);
			}
			
			if (isset($_POST['orionprofile']) && $_POST['orionprofile'] != $redis->get('orionprofile')){
				// setup worker queue (set optimization profile)
				$args = $_POST['orionprofile']." ".$redis->get('hwplatformid');
				// invoke worker
				$jobID = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'orionprofile', 'args' => $args ));
			}
			
}
waitSyWrk($redis,$jobID);
$template->hostname = $redis->get('hostname');
$template->ntpserver = $redis->get('ntpserver');
$template->airplay = $redis->get('airplay');
$template->udevil = $redis->get('udevil');
$template->coverart = $redis->get('coverart');
$template->scrobbling_lastfm = $redis->get('scrobbling_lastfm');
$template->lastfm = getLastFMauth($redis);
$template->cmediafix = $redis->get('cmediafix');
?>