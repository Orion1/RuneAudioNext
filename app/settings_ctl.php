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

// get lastfm auth ENV settings
$template->lastfm = getLastFMauth($db);
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

	if (isset($_POST['orionprofile']) && $_POST['orionprofile'] != $_SESSION['orionprofile']){
		// save new value on SQLite datastore
		playerSession('write',$db,'orionprofile',$_POST['orionprofile']);
		// setup worker queue (set optimization profile)
		$data['args'] = $_POST['orionprofile']." ".$_SESSION['hwplatformid'];
		// invoke worker
		wrk_control('exec','orionprofile',$data);
	}

	if (isset($_POST['cmediafix'])){
		// save new value on SQLite datastore
		if ($_POST['cmediafix']['value'] == 1 && $_POST['cmediafix']['value'] != $_SESSION['cmediafix']) {
		// save new value on SQLite datastore
		playerSession('write',$db,'cmediafix',1);
		// send notify message to UI
		ui_notify('cmediafix', 'enabled');
		} else {
		// save new value on SQLite datastore
		playerSession('write',$db,'cmediafix',0);
		// send notify message to UI
		ui_notify('cmediafix', 'disabled');
		}
	}

	// ----------------------------------------------------------
*/
	if (isset($_POST['features'])) {

			if (isset($_POST['features']['airplay'])) {
				// save new value on SQLite datastore
				playerSession('write',$db,'airplay',1);
				// setup worker queue (start shairport)
				// $wrkdata = array('action' => 'start', 'jobid' => '000001');
				// $wrkdata = "start";
				// invoke worker
				// wrk_control('exec','airplay',$wrkdata);
				wrk_control('newjob',$data = array('wrkcmd' => 'airplay','action' => 'start','args' => array('mp1' => 10,'mp2' => 11)));
				session_write_close();
			} else {
				if ($_SESSION['airplay'] != 0) {
				// setup worker queue (stop shairport)
				$data = "stop";
					// invoke worker
					if (wrk_control('exec','airplay',$data)) {
						// save new value on SQLite datastore
						playerSession('write',$db,'airplay',0);
					}
				}
			}
	/*
			if (isset($_POST['features']['udevil'])) {
				// save new value on SQLite datastore
				playerSession('write',$db,'udevil',1);
				// setup worker queue (disable USB Automount)
				$data['args'] = 'start';
				// invoke worker
				wrk_control('exec','udevil',$data);
			} else {
				// save new value on SQLite datastore
				playerSession('write',$db,'udevil',0);
				if ($_SESSION['udevil'] != 0) {
				// setup worker queue (disable USB Automount)
				$data['args'] = 'stop';
				// invoke worker
				wrk_control('exec','udevil',$data);
				}
			}

			if (isset($_POST['features']['coverart'])) {
				// save new value on SQLite datastore
				playerSession('write',$db,'coverart',1);
			} else {
				// save new value on SQLite datastore
				playerSession('write',$db,'coverart',0);
			}
	
			if (isset($_POST['features']['scrobbling_lastfm']) && $_POST['features']['scrobbling_lastfm'] == 1 && ($_POST['features']['scrobbling_lastfm'] != $_SESSION['scrobbling_lastfm'] OR ($_POST['features']['scrobbling_lastfm']['lastfm']['pass'] != $template->lastfm['pass'] && !empty($_POST['features']['scrobbling_lastfm']['lastfm']['pass'])) OR $_POST['features']['scrobbling_lastfm']['lastfm']['user'] != $template->lastfm['user'] && !empty($_POST['features']['scrobbling_lastfm']['lastfm']['user'])) ) {
			// save new value on SQLite datastore
			playerSession('write',$db,'scrobbling_lastfm',1);
				if (($_POST['features']['scrobbling_lastfm']['lastfm']['user'] != $template->lastfm['user'] && !empty($_POST['features']['scrobbling_lastfm']['lastfm']['user'])) OR ($_POST['features']['scrobbling_lastfm']['lastfm']['pass'] != $_POST['features']['scrobbling_lastfm']['pass'] && !empty($_POST['features']['scrobbling_lastfm']['lastfm']['pass']))) {
				$data['args']['lastfm'] = $_POST['features']['scrobbling_lastfm']['lastfm'];
				$_SESSION['notify']['msg'] = '\nLast.FM auth data updated\n';
				}		
				// setup worker queue (enable LastFM scrobbling)
				$data['args']['action'] = 'start';
				// invoke worker
				wrk_control('exec','scrobbling_lastfm',$data);

			} else {
				if (isset($_POST['features']['scrobbling_lastfm']) && $_POST['features']['scrobbling_lastfm'] != $_SESSION['scrobbling_lastfm']) {
				// save new value on SQLite datastore
				playerSession('write',$db,'scrobbling_lastfm',0);
				// setup worker queue (disable LastFM scrobbling)
				$data['args']['action'] = 'stop';
				// invoke worker
				wrk_control('exec','scrobbling_lastfm',$data);
				}
			} */
	
	}
	// ------------------------------

/*
	if (isset($_POST['hostname']) && $_POST['hostname'] != $_SESSION['hostname']) {
		if (empty($_POST['hostname'])) {	
		$_POST['hostname'] = 'runeaudio';
		}
		// setup worker queue
		$data['args'] = $_POST['hostname'];
		// invoke worker
		wrk_control('exec','hostname',$data);
	}

	if (isset($_POST['ntpserver']) && $_POST['ntpserver'] != $_SESSION['ntpserver']) {
		if (empty($_POST['ntpserver'])) {	
		$_POST['ntpserver'] = 'ntp.inrim.it';
		}
		// setup worker queue
		$data['args'] = $_POST['ntpserver'];
		// invoke worker
		wrk_control('exec','ntpserver',$data);
	}
*/
}
// wait for worker output if $_SESSION['w_active'] = 1
waitWorker(1);
?>