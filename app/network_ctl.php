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
 *  file: app/network_ctl.php
 *  ver: 1.3
 *
 */

// inspect POST
if (isset($_POST)) {

	if (isset($_POST['nic'])) {
		$redis->get($_POST['nic']['name']) === json_encode($nic) || $jobID[] = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'netcfg', 'action' => 'config', 'args' => $_POST['nic'] ));		
	}
	
	if (isset($_POST['refresh'])) {
		$jobID[] = wrk_control($redis,'newjob', $data = array( 'wrkcmd' => 'netcfg', 'action' => 'refresh' ));
	}

}
 
waitSyWrk($redis,$jobID);
$template->nics = wrk_netconfig($redis,'getnics');

if (isset($template->action)) {

	if (isset($template->arg)) {
	$nic_connection = $redis->hGet('nics', $template->arg);
		// fetch current nic configuration data
		if ($redis->get($template->arg)) {
			$template->{$template->arg} = json_decode($redis->get($template->arg));
			$template->nic = json_decode($nic_connection);
			if ($template->nic->wireless === '1') {
				$template->wlans = json_decode($redis->get('wlans'));
			}
		} else if ($nic_connection) {
		// fetch current nic connection details
			$template->nic = json_decode($nic_connection);
		} else {
		// nonexistant nic
			$template->content = 'error';
		}
		
	// debug
	// print_r($template->{$template->arg});
	}
	$template->wlans = json_decode($redis->get('wlans'));
	// print_r($template->wlans);
} 
 


?>
