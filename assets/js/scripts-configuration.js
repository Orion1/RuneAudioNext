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
	playlist: null,
	currentsong: null,
	currentalbum: null,
	currentknob: null,
	state: '',
	currentpath: '',
	volume: null,
	currentDBpos: [0,0,0,0,0,0,0,0,0,0,0],
	browsemode: 'file',
	plugin: '',
	DBentry: ['', '', ''],
	visibility: 'visible',
	DBupdate: 0,
	stepVolumeInt: 0,
	stepVolumeDelta: 0,
	stream: '',
	libraryhome: ''
};

jQuery(document).ready(function($){ 'use strict';
	
	// INITIALIZATION
	// ----------------------------------------------------------------------------------------------------
	 
	// first connection with MPD daemon
	// open UI rendering channel;
	playbackChannel();
	
	// first GUI update
	updateGUI();
	
	// PNotify init options
	$.pnotify.defaults.styling = 'bootstrap3';
	$.pnotify.defaults.history = false;
	$.pnotify.defaults.styling = 'fontawesome';
	// open notify channel
	notifyChannel();
	
	
	// BUTTONS
	// ----------------------------------------------------------------------------------------------------
	
	// playback buttons
	$('.btn-cmd').click(function(){
		var el = $(this);
		commandButton(el);
	});
	
	// system poweroff
	$('#syscmd-poweroff').click(function(){
		$.post('/settings/', { 'syscmd' : 'poweroff' });
		$('#loader').removeClass('hide');
	});
	// system reboot
	$('#syscmd-reboot').click(function(){
		$.post('/settings/', { 'syscmd' : 'reboot' });
		$('#loader').removeClass('hide');
	});
	
	
	// COMMON
	// ----------------------------------------------------------------------------------------------------
	
	// Bootstrap-select
	$('.selectpicker').selectpicker();
	

	// DATABASE
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-sources').length ){
	
		// enable/disable CIFS auth section
		if ($('#mount-type').val() === 'nfs') {
			$('#mount-cifs').addClass('disabled').children('.disabler').removeClass('hide');
		}
		$('#mount-type').change(function(){
			if ($(this).val() === 'cifs' || $(this).val() === 'osx') {
				$('#mount-cifs').removeClass('disabled').children('.disabler').addClass('hide');
			}
			else {
				$('#mount-cifs').addClass('disabled').children('.disabler').removeClass('hide');
			}
		});
		
		// enable/disable CIFS user and password fields
		$('#nas-guest').change(function(){
			if ($(this).prop('checked')) {
				//console.log('checked');
				$('#mount-auth').addClass('disabled').children('.disabler').removeClass('hide');
			} else {
				//console.log('unchecked');
				$('#mount-auth').removeClass('disabled').children('.disabler').addClass('hide');
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
	
		
	// SETTINGS
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-settings').length ){
		
		// show/hide AirPlay name form
		$('#airplay').change(function(){
			if ($(this).prop('checked')) {
				$('#airplayName').removeClass('hide');
				$('#airplayBox').addClass('boxed-group');
			} else {
				$('#airplayName').addClass('hide');
				$('#airplayBox').removeClass('boxed-group');
			}
		});
		
		// show/hide Last.fm auth form  
		$('#scrobbling-lastfm').change(function(){
			if ($(this).prop('checked')) {
				$('#lastfmAuth').removeClass('hide');
				$('#lastfmBox').addClass('boxed-group');
			} else {
				$('#lastfmAuth').addClass('hide');
				$('#lastfmBox').removeClass('boxed-group');
			}
		});
		
		// show/hide proxy settings form  
		$('#proxy').change(function(){
			if ($(this).prop('checked')) {
				$('#proxyAuth').removeClass('hide');
				$('#proxyBox').addClass('boxed-group');
			} else {
				$('#proxyAuth').addClass('hide');
				$('#proxyBox').removeClass('boxed-group');
			}
		});
		
	}
	
	
	// NETWORK
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-network').length ){
		
		// show/hide static network configuration based on select value
		var netManualConf = $('#network-manual-config');
		if ($('#dhcp').val() === '0') {
			netManualConf.removeClass('hide');
		}
		$('#dhcp').change(function(){
			if ($(this).val() === '0') {
				netManualConf.removeClass('hide');
			}
			else {
				netManualConf.addClass('hide');
			}
		});
		
		// show/hide WiFi security configuration based on select value
		var WiFiKey = $('#wifi-security-key');
		if ($('#wifi-security').val() !== 'open') {
			WiFiKey.removeClass('hide');
		}
		$('#wifi-security').change(function(){
			if ($(this).val() !== 'open') {
				WiFiKey.removeClass('hide');
			}
			else {
				WiFiKey.addClass('hide');
			}
		});
		
		// refresh in range Wi-Fi networks list
		if($('#wifiNetworks').length){
			wlansChannel();
			var refreshWiFi = setInterval(function() {
				$.ajax({url: '/command/?cmd=wifiscan'});
			}, 15000);
		}
		
		// show/hide WiFi stored profile box
		$('#wifiProfiles').change(function(){
			if ($(this).prop('checked')) {
				$('#wifiProfilesBox').removeClass('hide');
			} else {
				$('#wifiProfilesBox').addClass('hide');
			}
		});

	}
	

	// MPD
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-mpd').length ){
		
		// output interface select
		$('#audio-output-interface').change(function(){
			var output = $(this).val();
			$.ajax({
				type: 'POST',
				url: '/mpd/',
				data: { ao: output }
			});
		});
		
		// MPD config manual edit
		$('.manual-edit-confirm').find('.btn-primary').click(function(){
			$('#mpdconf_editor').removeClass('hide');
			$('#manual-edit-warning').addClass('hide');
		});
	}
	
	
	// DEBUG
	// ----------------------------------------------------------------------------------------------------
	
	if( $('#section-debug').length ){

		ZeroClipboard.config({swfPath: '/assets/js/vendor/ZeroClipboard.swf'});
		var client = new ZeroClipboard(document.getElementById('copy-to-clipboard'));
		client.on('ready', function(readyEvent){
			// alert('ZeroClipboard SWF is ready!');
			client.on('aftercopy', function(event){
				// alert('Copied text to clipboard: ' + event.data['text/plain']);
				$.pnotify({
					title: 'Copied to clipboard',
					text: 'The debug output was copied successfully in your clipboard.',
					icon: 'fa fa-check'
				});
			});
		});

	}
	
});