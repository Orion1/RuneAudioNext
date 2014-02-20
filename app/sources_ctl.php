<?php 
/*
 * Copyright (C) 2013 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013 - Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013 - Carmelo San Giovanni (aka Um3ggh1U)
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
 *  file: app/sources_ctl.php
 *  version: 1.3
 *
 */

// handle (reset)
if (isset($_POST['reset']) && $_POST['reset'] == 1) {
	// tell worker to write new MPD config
	if ($_SESSION['w_lock'] != 1 && $_SESSION['w_queue'] == '') {
	session_start();
	$_SESSION['w_queue'] = "sourcecfgman";
	$_SESSION['w_queueargs']  = 'sourcecfgreset';
	$_SESSION['w_active'] = 1;
	// set UI notify
	$_SESSION['notify']['title'] = 'auto.nas modified';
	$_SESSION['notify']['msg'] = 'remount shares in progress...';
	session_write_close();
	} else {
	session_start();
	$_SESSION['notify']['title'] = 'Job Failed';
	$_SESSION['notify']['msg'] = 'background worker is busy.';
	session_write_close();
	}
unset($_POST);
}

if (isset($_GET['updatempd']) && $_GET['updatempd'] == '1' ){
	if ( !$mpd) {
		session_start();
		$_SESSION['notify']['title'] = 'Error';
		$_SESSION['notify']['msg'] = 'Cannot connect to MPD Daemon';
	} else {
		sendMpdCommand($mpd,'update');
		session_start();
		$_SESSION['notify']['title'] = 'MPD Update';
		$_SESSION['notify']['msg'] = 'database update started...';
	}
}

// handle POST
if(isset($_POST['mount']) && !empty($_POST['mount'])) {
// convert slashes for remotedir path
$_POST['mount']['remotedir'] = str_replace('\\', '/', $_POST['mount']['remotedir']);

	if ($_POST['mount']['rsize'] == '') {
	$_POST['mount']['rsize'] = 16384;
	}

	if ($_POST['mount']['wsize'] == '') {
	$_POST['mount']['wsize'] = 17408;
	}

	if ($_POST['mount']['options'] == '') {
		if ($_POST['mount']['type'] == 'cifs') {
		$_POST['mount']['options'] = "cache=strict,ro";
		} else {
		$_POST['mount']['options'] = "nfsvers=3,ro";
		}
	}
// activate worker
if (isset($_POST['delete']) && $_POST['delete'] == 1) {
// delete an existing entry
		if ($_SESSION['w_lock'] != 1 && $_SESSION['w_queue'] == '') {
		session_start();
		$_SESSION['w_queue'] = 'sourcecfg';
		$_POST['mount']['action'] = 'delete';
		$_SESSION['w_queueargs'] = $_POST;
		$_SESSION['w_active'] = 1;
		// set UI notify
		$_SESSION['notify']['title'] = 'mount point deleted';
		$_SESSION['notify']['msg'] = 'Update DB in progress...';
		session_write_close();
		} else {
		session_start();
		$_SESSION['notify']['title'] = 'Job Failed';
		$_SESSION['notify']['msg'] = 'background worker is busy.';
		session_write_close();
		}
	
	} else {
	
		if ($_SESSION['w_lock'] != 1 && $_SESSION['w_queue'] == '') {
		session_start();
		$_SESSION['w_queue'] = 'sourcecfg';
		$_SESSION['w_queueargs']  = $_POST;
		$_SESSION['w_active'] = 1;
		// set UI notify
		$_SESSION['notify']['title'] = 'mount point modified';
		$_SESSION['notify']['msg'] = 'Update DB in progress...';
		session_write_close();
		} else {
		session_start();
		$_SESSION['notify']['title'] = 'Job Failed';
		$_SESSION['notify']['msg'] = 'background worker is busy.';
		session_write_close();
		} 
	}
}
	
// wait for worker output if $_SESSION['w_active'] = 1
waitWorker(5,'sources');

$dbh = cfgdb_connect($db);
$source = cfgdb_read('cfg_source',$dbh);
$dbh = null;

// set normal config template
// $tpl = "sources.html";
// unlock session files
playerSession('unlock',$db,'','');
foreach ($source as $mp) {
if (wrk_checkStrSysfile('/proc/mounts',$mp['name']) ) {
	$mp['status'] = 1;
	} else {
	$mp['status'] = 0;
	}
$mounts[]=$mp;
}

$template->mounts = $mounts;

if (isset($template->action)) {

	if (isset($template->arg)) {
		foreach ($source as $mp) {
			if ($mp['id'] == $template->arg) {
			$template->mount = $mp;
			}
		}
	$template->title = 'Edit network mount';
	} else {
	$template->title = 'Add new network mount';
	}
} 
// debug($_POST);
?>