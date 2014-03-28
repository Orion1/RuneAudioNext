/*
 * Copyright (C) 2013 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013 – Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013 – Carmelo San Giovanni (aka Um3ggh1U)
 *
 * RuneAudio website and logo
 * copyright (C) 2013 – ACX webdesign (Andrea Coiutti)
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
 *  file: scripts-configuration.js
 *  version: 1.1
 *
 */

// Global GUI Array
// ----------------------------------------------------------------------------------------------------
var GUI = {
	json: 0,
	cmd: 'status',
	playlist: null,
	currentsong: null,
	currentalbum: null,
	currentknob: null,
	state: '',
	currentpath: '',
	volume: null,
	currentDBpos: new Array(0,0,0,0,0,0,0,0,0,0,0),
	browsemode: 'file',
	DBentry: new Array('', '', ''),
	visibility: 'visible',
	DBupdate: 0,
	stepVolumeInt: 0,
	stepVolumeDelta: 0
};

jQuery(document).ready(function($){ 'use strict';
	
	// open display channel
	displayChannel();	
	if (GUI.state != 'disconnected') {
		$('#loader').hide();
	}
	
	// PNotify init options
	$.pnotify.defaults.styling = 'bootstrap3';
	$.pnotify.defaults.history = false;
	$.pnotify.defaults.styling = 'fontawesome';
	// open notify channel
	notifyChannel();
	
	
	// BUTTONS
	// ----------------------------------------------------------------------------------------------------
	// playback
	$('.btn-cmd').click(function(){
		var cmd;
		// stop
		if ($(this).attr('id') == 'stop') {
			$(this).addClass('btn-primary');
			$('#play').removeClass('btn-primary');
			refreshTimer(0, 0, 'stop')
			window.clearInterval(GUI.currentKnob);
			$('.playlist li').removeClass('active');
			$('#total').html('');
		}
		// play/pause
		else if ($(this).attr('id') == 'play') {
			//if (json['currentsong'] != null) {
				if (GUI.state == 'play') {
					cmd = 'pause';
					$('#countdown-display').countdown('pause');
				} else if (GUI.state == 'pause') {
					cmd = 'play';
					$('#countdown-display').countdown('resume');
				} else if (GUI.state == 'stop') {
					cmd = 'play';
					$('#countdown-display').countdown({since: 0, compact: true, format: 'MS'});
				}
				//$(this).find('i').toggleClass('fa fa-play').toggleClass('fa fa-pause');
				window.clearInterval(GUI.currentKnob);
				sendCmd(cmd);
				//console.log('sendCmd(' + cmd + ');');
				return;
			// } else {
				// $(this).addClass('btn-primary');
				// $('#stop').removeClass('btn-primary');
				// $('#time').val(0).trigger('change');
				// $('#countdown-display').countdown({since: 0, compact: true, format: 'MS'});
			// }
		}
		// previous/next
		else if ($(this).attr('id') == 'previous' || $(this).attr('id') == 'next') {
			GUI.halt = 1;
			// console.log('GUI.halt (next/prev)= ', GUI.halt);
			$('#countdown-display').countdown('pause');
			window.clearInterval(GUI.currentKnob);
		}
		// step volume control
		else if ($(this).hasClass('btn-volume')) {
			if (GUI.volume == null ) {
				GUI.volume = $('#volume').val();
			}
			if ($(this).attr('id') == 'volumedn') {
				var vol = parseInt(GUI.volume) - 3;
				GUI.volume = vol;
				$('#volumemute').removeClass('btn-primary');
			} else if ($(this).attr('id') == 'volumeup') {
				var vol = parseInt(GUI.volume) + 3;
				GUI.volume = vol;
				$('#volumemute').removeClass('btn-primary');
			} else if ($(this).attr('id') == 'volumemute') {
				if ($('#volume').val() != 0 ) {
					GUI.volume = $('#volume').val();
					$(this).addClass('btn-primary');
					var vol = 0;
				} else {
					$(this).removeClass('btn-primary');
					var vol = GUI.volume;
				}
			}
			//console.log('volume = ', GUI.volume);
			sendCmd('setvol ' + vol);
			return;
		}

		// toggle buttons
		if ($(this).hasClass('btn-toggle')) {
			if ($(this).hasClass('btn-primary')) {
				cmd = $(this).attr('id') + ' 0';
			} else {
				cmd = $(this).attr('id') + ' 1';
			}
			$(this).toggleClass('btn-primary');
		// send command
		} else {
			cmd = $(this).attr('id');
		}
		sendCmd(cmd);
		//console.log('sendCmd(' + cmd + ');');
	});

	
	// COMMON
	// ----------------------------------------------------------------------------------------------------
	
	// Bootstrap-select
	$('.selectpicker').selectpicker();
	

	// DATABASE
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-sources').length ){
	
		// enable/disable CIFS auth section
		if ($('#mount-type').val() == 'nfs') {
			$('#mount-cifs').children('.disabler').removeClass('hide');
		}						
		$('#mount-type').change(function(){		  
			if ($(this).val() == 'cifs') {
				$('#mount-cifs').children('.disabler').addClass('hide');
			}
			else {
				$('#mount-cifs').children('.disabler').removeClass('hide');
			}															
		});
		
		// enable/disable CIFS user and password fields
		$('#nas-guest').change(function(){
			if ($(this).prop('checked')) {
				//console.log('checked');
				$('#mount-auth').children('.disabler').removeClass('hide');
			} else {
				//console.log('unchecked');
				$('#mount-auth').children('.disabler').addClass('hide');
			}													  
		});
		
		// show advanced options
		$('#nas-advanced').change(function(){
			if ($(this).prop('checked')) {
				$('#mount-advanced-config').removeClass('hide');
			} else {
				$('#mount-advanced-config').addClass('hide');
			}													  
		});
		
		$('#show-mount-advanced-config').click(function(e){
			e.preventDefault();
			if ($(this).hasClass('active')) {
				$('#mount-advanced-config').toggleClass('hide');
				$(this).removeClass('active');
				$(this).find('i').removeClass('fa fa-minus-circle').addClass('fa fa-plus-circle');
				$(this).find('span').html('show advanced options');
			} else {
				$('#mount-advanced-config').toggleClass('hide');
				$(this).addClass('active');
				$(this).find('i').removeClass('fa fa-plus-circle').addClass('fa fa-minus-circle');
				$(this).find('span').html('hide advanced options');
			}
		});
	}
	
	
	// NETWORK
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-net-edit-eth').length || $('#section-net-edit-wifi').length ){
	
		// show/hide static network configuration based on select value
		if ($('#dhcp').val() == 'false') {
			$('#network-manual-config').children('.disabler').addClass('hide');
		}						
		$('#dhcp').change(function(){		  
			if ($(this).val() == 'true') {
				$('#network-manual-config').children('.disabler').removeClass('hide');
			}
			else {
				$('#network-manual-config').children('.disabler').addClass('hide');
			}															
		});
	}
	
	
	// SETTINGS
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-settings').length ){
	
		// show/hide Last.fm user/pass form  
		$('#scrobbling-lastfm').change(function(){
			if ($(this).prop('checked')) {
				$('#lastfmAuth').removeClass('hide');
			} else {
				$('#lastfmAuth').addClass('hide');
			}													  
		});
	}
	
	
	// MPD
	// ----------------------------------------------------------------------------------------------------
	
	// confirm manual data
	if( $('.manual-edit-confirm').length ){
		$(this).find('.btn-primary').click(function(){
			$('#mpdconf_editor').show().removeClass('hide');
			$(this).hide();
		});
	}
	
});