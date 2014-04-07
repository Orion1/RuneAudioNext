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

// inspect POST
if (isset($_POST)) {
	
	if ($_POST['updatempd'] == 1) sendMpdCommand($mpd,'update');
	
	if (!empty($_POST['mount'])) {
		
		$_POST['mount']['remotedir'] = str_replace('\\', '/', $_POST['mount']['remotedir']);
		
		if ($_POST['mount']['rsize'] == '') $_POST['mount']['rsize'] = 16384;
		
		if ($_POST['mount']['wsize'] == '') $_POST['mount']['wsize'] = 17408;
		
		if ($_POST['mount']['options'] == '') {
			if ($_POST['mount']['type'] == 'cifs') {
				$_POST['mount']['options'] = "cache=strict,ro";
			} else {
				$_POST['mount']['options'] = "nfsvers=3,ro";
			}
		}
		
		if ($_POST['action'] == 'add') $jobID = wrk_control($redis,'newjob', $data = array('wrkcmd' => 'sourcecfg', 'action' => 'add', 'args' => $_POST['mount']));
		
		if ($_POST['action'] == 'edit') $jobID = wrk_control($redis,'newjob', $data = array('wrkcmd' => 'sourcecfg', 'action' => 'edit', 'args' => $_POST['mount']));
		
		if ($_POST['action'] == 'delete') $jobID = wrk_control($redis,'newjob', $data = array('wrkcmd' => 'sourcecfg', 'action' => 'delete', 'args' => $_POST['mount']));
		
		if ($_POST['action'] == 'reset') $jobID = wrk_control($redis,'newjob', $data = array('wrkcmd' => 'sourcecfgman', 'action' => 'reset' ));
		
	}
	
}

waitSyWrk($redis,$jobID);

$dbh = cfgdb_connect($db);
$source = cfgdb_read('cfg_source',$dbh);
$dbh = null;
if( $source !== true ){ foreach ($source as $mp) {
	if (wrk_checkStrSysfile('/proc/mounts',$mp['name']) ) {
		$mp['status'] = 1;
	} else {
		$mp['status'] = 0;
	}
	$mounts[]=$mp;
} }

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

?>