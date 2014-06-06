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
	// check if we are into interface details (ex. http://runeaudio/network/edit/eth0)
	if (isset($template->arg)) {
		// retrieve current nic status data (detected from the system)
		$nic_connection = $redis->hGet('nics', $template->arg);
		$template->nic = json_decode($nic_connection);
		// check if we action is = 'edit' or 'wlan' (ex. http://runeaudio/network/edit/....)
		if ($template->action === 'edit') {
				// fetch current (stored) nic configuration data
				if ($redis->get($template->arg)) {
					$template->{$template->arg} = json_decode($redis->get($template->arg));
				// ok nic configuration not stored, but check if it is configured
				} else if ($nic_connection == null) {
				// last case, nonexistant nic. route to error template
				$template->content = 'error';
				} 
				
				if ($template->nic->wireless === 1) {
					$template->wlans = json_decode($redis->get('wlans'));
				}
			// debug
			var_dump($template->{$template->arg});
			var_dump($template->nic);
			var_dump($nic_connection);
			print_r($template->wlans);
		} else {
			$template->wlans = json_decode($redis->get('wlans'));
			foreach ($template->wlans->{$template->arg} as $key => $value) {
				if ($template->uri(4) === $value->ESSID) {
					$template->{$template->uri(4)} =  $value;
				}
				// debug
				// echo $key."\n";
				// print_r($value);
			}
			// debug
			// print_r($template->{$template->uri(4)});
			var_dump($template->nic);
		}
	}

	// print_r($template->wlans);
	
} 
 


?>
