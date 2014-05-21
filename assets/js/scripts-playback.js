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
 * along with RuneAudio; see the file COPYING.	If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.txt>.
 *
 *	file: scripts-playback.js
 *	version: 1.3
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
	stream: ''
};

jQuery(document).ready(function($){ 'use strict';

	// INITIALIZATION
	// ----------------------------------------------------------------------------------------------------
	 
	// first connection with MPD daemon
	// open UI rendering channel;
	playbackChannel();
	// queueChannel();
	
	// first GUI update
	updateGUI();
	libraryHome();
	
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
	
	$('#volume-step-dn').on({
		mousedown : function () {
			volumeStepCalc('dn');
		},
		mouseup : function () {
			volumeStepSet();
		}
	});
	
	$('#volume-step-up').on({
		mousedown : function () {
			volumeStepCalc('up');
		},
		mouseup : function () {
			volumeStepSet();
		}
	});
	
	
	// KNOBS
	// ----------------------------------------------------------------------------------------------------
	
	// playback progressing
	$('.playbackknob').knob({
		inline: false,
			change : function (value) {
			if (GUI.state != 'stop') {
				window.clearInterval(GUI.currentKnob);
				//$('#time').val(value);
				// console.log('click percent = ', value);
				// add command
			} else $('#time').val(0);
		},
		release : function (value) {
			if (GUI.state !== 'stop' && GUI.state !== '') {
				if (GUI.stream !== 'radio') {
					// console.log('release percent = ', value);
					console.log(GUI.state);
					window.clearInterval(GUI.currentKnob);
					var seekto = Math.floor((value * parseInt(GUI.json.time)) / 1000);
					sendCmd('seek ' + GUI.json.song + ' ' + seekto);
					// console.log('seekto = ', seekto);
					$('#time').val(value);
					$('#countdown-display').countdown('destroy');
					$('#countdown-display').countdown({since: -seekto, compact: true, format: 'MS'});
				} else {
					$('#time').val(0).trigger('change');
				}
			}
		},
		cancel : function () {
			// console.log('cancel : ', this);
		},
		draw : function () {}
	});

	// volume knob
	$('.volumeknob').knob({
		change : function (value) {
			//setvol(value);	// disabled until perfomance issues are solved (mouse wheel is not working now)
		},
		release : function (value) {
			setvol(value);
		},
		cancel : function () {
			// console.log('cancel : ', this);
		},
		draw : function () {
			// "tron" case
			if(this.$.data('skin') == 'tron') {

				var a = this.angle(this.cv),	// Angle
					sa = this.startAngle,	// Previous start angle
					sat = this.startAngle,	// Start angle
					ea,	// Previous end angle
					eat = sat + a,	// End angle
					r = true;

				this.g.lineWidth = this.lineWidth;

				this.o.cursor && (sat = eat - 0.05) && (eat = eat + 0.05);

				if (this.o.displayPrevious) {
					ea = this.startAngle + this.angle(this.value);
					this.o.cursor && (sa = ea - 0.1) && (ea = ea + 0.1);
					this.g.beginPath();
					this.g.strokeStyle = this.previousColor;
					this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
					this.g.stroke();
				}

				this.g.beginPath();
				this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
				this.g.stroke();

				this.g.lineWidth = 2;
				this.g.beginPath();
				this.g.strokeStyle = this.o.fgColor;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 10 + this.lineWidth * 2 / 3, 0, 20 * Math.PI, false);
				this.g.stroke();

				return false;
			}
		}
	});


	// PLAYING QUEUE
	// ----------------------------------------------------------------------------------------------------

	var playlist = $('#playlist-entries');
	
	// click on queue entry
	playlist.on('click', 'li', function(e) {
		var cmd = '';
		if ($(e.target).hasClass('pl-action')) {
			// remove queue entry
			e.preventDefault();
			// console.log($(this).parent());
			var id = $(this).attr('id');
			id = parseInt(id.replace('pl-', ''));
			cmd = 'deleteid ' + id;
			// var path = $(this).parent().data('path');
			// notify('remove', '');
			sendCmd(cmd);
		} else {
			// play queue entry
			var pos = $('li', '#playlist-entries').index(this);
			cmd = 'play ' + pos;
			sendCmd(cmd);
			$('li.active', '#playlist-entries').removeClass('active');
			$(this).addClass('active');
		}
	});

	// on ready playlist tab
	$('a', '#open-panel-dx').click(function(){
		if ($('#open-panel-dx').hasClass('active')) {
			var current = parseInt(GUI.json.song);
			customScroll('pl', current, 500);
		}
	})
	.on('shown.bs.tab', function (e) {
		var current = parseInt(GUI.json.song);
		customScroll('pl', current, 0);
	});

	// open Library tab
	$('#open-library').click(function(){
		$('#open-panel-dx').removeClass('active');
		$('#open-panel-sx').addClass('active');
	});

	// Queue on the fly filtering
	$('#pl-filter').keyup(function(){
		$.scrollTo(0 , 500);
		var filter = $(this).val(), count = 0;
		$('li', '#playlist-entries').each(function(){
			var el = $(this);
			if (el.text().search(new RegExp(filter, 'i')) < 0) {
				el.hide();
			} else {
				el.show();
				count++;
			}
		});
		var numberItems = count;
		var s = (count == 1) ? '' : 's';
		if (filter !== '') {
			$('#pl-filter-results').removeClass('hide').html('<i class="fa fa-times sx"></i> <span class="visible-xs">back</span><span class="hidden-xs">' + (+count) + ' result' + s + ' for "<span class="keyword">' + filter + '</span>"</span>');
		} else {
			$('#pl-filter-results').addClass('hide').html('');
		}
	});
	
	// close filter results
	$('#pl-filter-results').click(function(){
		$(this).addClass('hide');
		if ($(this).hasClass('back-to-queue')) {
			$('.playlist').addClass('hide');
			getPlaylistCmd();
			$('#pl-currentpath').addClass('hide');
			$('#pl-manage').removeClass('hide');
		} else {
			$('li', '#playlist-entries').each(function(){
				var el = $(this);
				el.show();
			});
			$('#pl-currentpath').removeClass('hide');
			$('#pl-filter').val('');
		}
		customScroll('pl', parseInt(GUI.json.song), 500);
	});
	
	// playlists management
	$('#pl-list').click(function(){
		getPlaylists();
	});
	
	// save current Queue to playlist
	$('#modal-pl-save-btn').click(function(){
		var playlistname = $('#pl-save-name').val();
		sendCmd('save "' + playlistname + '"');
	});
	
	// playlists management - actions context menu
	$('#pl-editor').on('click', '.pl-action', function(e) {
		e.preventDefault();
		var path = $(this).parent().attr('data-path');
		GUI.DBentry[0] = path;
	});
	
	// playlist rename action
	$('#pl-rename-button').click(function(){
		var oldname = $('#pl-rename-oldname').text();
		var newname = $('#pl-rename-name').val();
		sendCmd('rename "' + oldname + '" "' + newname + '"');
		getPlaylists();
	});
	
	// sort Queue entries
	// var sortlist = document.getElementById('playlist-entries');
	// new Sortable(sortlist, {
		// ghostClass: 'sortable-ghost',
		// onUpdate: function (evt){
			// sortOrder(evt.item.getAttribute('id'));	
		// }
	// });
	
	
	// LIBRARY
	// ----------------------------------------------------------------------------------------------------
	
	// on ready Library tab
	$('a', '#open-panel-sx').click(function(){
		if ($('#open-panel-sx').hasClass('active')) {
			customScroll('pl', parseInt(GUI.json.song), 500);
		}
	})	
	.on('shown.bs.tab', function (e) {
		customScroll('db', GUI.currentDBpos[GUI.currentDBpos[10]], 0);
	});
	
	var db = $('#database-entries');
	
	// click on Library home block
	$('#home-blocks').on('click', '.home-block', function() {
		++GUI.currentDBpos[10];
		getDB({
			path: $(this).data('path'),
			browsemode: GUI.browsemode,
			uplevel: 0,
			plugin: $(this).data('plugin')
		});
	});
	
	// click on Library list entry
	db.on('click', 'li', function(e) {
		var path = '';
		if ($(e.target).hasClass('db-action')) {
		// actions context menu
			e.preventDefault();
			path = $(this).attr('data-path');
			GUI.DBentry[0] = path;
			// console.log('getDB path = ', GUI.DBentry);
		} else {
		// list browsing
			var el = $(this);
			$('li.active', '#database-entries').removeClass('active');
			el.addClass('active');
			if (el.hasClass('db-folder')) {
				if (el.hasClass('db-dirble')) {
				// Dirble folders
					path = GUI.currentpath	+ '/' + el.find('span').text();
					var querytype = 'stations';
					var args = el.data('path');
					getDB({
						path: path,
						browsemode: GUI.browsemode,
						plugin: 'Dirble',
						querytype: querytype,
						args : args
					});
					GUI.plugin = 'Dirble';
				} else if (el.hasClass('db-jamendo')) {
				// Jamendo folders
					// path = GUI.currentpath	+ '/' + el.find('span').text();
					// var querytype = 'radio';
					// var args = el.data('path');
					// getDB({
						// path: path,
						// browsemode: GUI.browsemode,
						// plugin: 'Jamendo',
						// querytype: querytype,
						// args : args
					// });
				} else {
				// normal MPD file browsing
					path = el.data('path');
					//GUI.currentDBpos[GUI.currentDBpos[10]] = $('.database .db-entry').index(this);
					getDB({
						path: path,
						browsemode: GUI.browsemode,
						uplevel: 0
					});
				}
				var entryID = el.attr('id');
				entryID = entryID.replace('db-','');
				GUI.currentDBpos[GUI.currentDBpos[10]] = entryID;
				++GUI.currentDBpos[10];
				// console.log('getDB path = ', path);
			} else if (el.hasClass('db-webradio-add')) {
				$('#modal-webradio-add').modal();
			}
		}
	});
	// double click on Library list entry
	db.on('dblclick', 'li', function(e) {
		if (!$(e.target).hasClass('db-action')) {
			$('li.active', '#database-entries').removeClass('active');
			$(this).addClass('active');
			var path = $(this).data('path');
			// console.log('doubleclicked path = ', path);
			getDB({
				cmd: 'addplay',
				path: path
			});
			// notify('add', path);
		}
	});

	// browse level up (back arrow)
	$('#db-level-up').click(function(){
		--GUI.currentDBpos[10];
		var path = GUI.currentpath;
		if (GUI.currentDBpos[10] === 0) {
			path = '';
		} else {
			var cutpos = path.lastIndexOf('/');
			path = cutpos !=-1 ? path.slice(0,cutpos):'';
		}
		getDB({
			path: path,
			browsemode: GUI.browsemode,
			plugin: GUI.plugin,
			uplevel: 1
		});
		GUI.plugin = '';
	});

	// close search results
	$('#db-search-results').click(function(){
		$(this).addClass('hide');
		$('#db-level-up').removeClass('hide');
		getDB({
			path: GUI.currentpath
		});
	});

	// context dropdown menu
	$('a', '.context-menu').click(function(){
		var dataCmd = $(this).data('cmd');
		var path = GUI.DBentry[0];
		GUI.DBentry[0] = '';
		if (dataCmd == 'add') {
			getDB({
				cmd: 'add',
				path: path
			});
			// notify('add', path);
		}
		if (dataCmd == 'addplay') {
			getDB({
				cmd: 'addplay',
				path: path
			});
			// notify('add', path);
		}
		if (dataCmd == 'addreplaceplay') {
			getDB({
				cmd: 'addreplaceplay',
				path: path
			});
			// notify('addreplaceplay', path);
		}
		if (dataCmd == 'update') {
			getDB({
				cmd: 'update',
				path: path
			});
			// notify('update', path);
		}
		if (dataCmd == 'bookmark') {
			getDB({
				cmd: 'bookmark',
				path: path
			});
		}
		if (dataCmd == 'pl-add') {
			sendCmd('load "' + path + '"');
		}
		if (dataCmd == 'pl-replace') {
			sendCmd('clear');
			sendCmd('load "' + path + '"');
		}
		if (dataCmd == 'pl-rename') {
			$('#modal-pl-rename').modal();
			$('#pl-rename-oldname').text(path);
		}
		if (dataCmd == 'pl-rm') {
			$.ajax({
				url: '/command/?cmd=rm%20%22' + path + '%22',
				success: function(data){
					getPlaylists(data);
				}
			});
		}
		if (dataCmd == 'wredit') {
			$('#modal-webradio-edit').modal();
			$.post('/db/?cmd=readradio', { 'filename' : path }, function(data){
				// get parsed content of .pls file and populate the form fields
				$('#webradio-edit-name').val('RADIO NAME');
				$('#webradio-edit-url').val('RADIO URL');
			}, 'json');
		}
		if (dataCmd == 'wrdelete') {
			$('#modal-webradio-delete').modal();
			$('#webradio-delete-name').text(path.replace('Webradio/', ''));
		}
		if (dataCmd == 'wradd') {
			var parameters = path.split(' | ');
			$.post('/db/?cmd=addradio', { 'name' : parameters[0], 'url' : parameters[1] });
		}
	});

	// add webradio
	$('#webradio-add-button').click(function(){
		var radioname = $('#webradio-add-name').val();
		var radiourl = $('#webradio-add-url').val();
		$.post('/db/?cmd=addradio', { 'name' : radioname, 'url' : radiourl }, function(data){
			// console.log('SENT');
		}, 'json');
	});
	// edit webradio
	$('#webradio-edit-button').click(function(){
		var radioname = $('#webradio-edit-name').val();
		var radiourl = $('#webradio-edit-url').val();
		$.post('/db/?cmd=editradio', { 'name' : radioname, 'url' : radiourl }, function(data){
			// console.log('SENT');
		}, 'json');
	});
	// delete webradio
	$('#webradio-delete-button').click(function(){
		var radioname = $('#webradio-delete-name').text();
		$.post('/db/?cmd=deleteradio', { 'name' : path }, function(data){
			// console.log('SENT');
		}, 'json');
	});
	
	// [!] browse mode menu - temporarly disabled
	$('a', '.browse-mode').click(function(){
		$('.browse-mode').removeClass('active');
		$(this).parent().addClass('active').closest('.dropdown').removeClass('open');
		var browsemode = $(this).find('span').html();
		GUI.browsemode = browsemode.slice(0,-1);
		$('#browse-mode-current').html(GUI.browsemode);
		getDB({
			path: '',
			browsemode: GUI.browsemode
		});
		// console.log('Browse mode set to: ', GUI.browsemode);
	});
	
	
	// GENERAL
	// ----------------------------------------------------------------------------------------------------
	
	// scroll buttons
	$('#db-firstPage').click(function(){
		$.scrollTo(0 , 500);
	});
	$('#db-prevPage').click(function(){
		var scrolloffset = '-=' + $(window).height() + 'px';
		$.scrollTo(scrolloffset , 500);
	});
	$('#db-nextPage').click(function(){
		var scrolloffset = '+=' + $(window).height() + 'px';
		$.scrollTo(scrolloffset , 500);
	});
	$('#db-lastPage').click(function(){
		$.scrollTo('100%', 500);
	});

	$('#pl-firstPage').click(function(){
		$.scrollTo(0 , 500);
	});
	$('#pl-prevPage').click(function(){
		var scrollTop = $(window).scrollTop();
		var scrolloffset = scrollTop - $(window).height();
		$.scrollTo(scrolloffset , 500);
	});
	$('#pl-nextPage').click(function(){
		var scrollTop = $(window).scrollTop();
		var scrolloffset = scrollTop + $(window).height();
		$.scrollTo(scrolloffset , 500);
	});
	$('#pl-lastPage').click(function(){
		$.scrollTo('100%', 500);
	});
	
	// open tab from external link
	var url = document.location.toString();
	// console.log('url = ', url);
	if ( url.match('#') ) {
		$('#menu-bottom a[href="/#' + url.split('#')[1] + '"]').tab('show');
	}
	// do not scroll with HTML5 history API
	$('#menu-bottom a').on('shown', function(e) {
		if(history.pushState) {
			history.pushState(null, null, e.target.hash);
		} else {
			window.location.hash = e.target.hash; // Polyfill for old browsers
		}
	}).on('click', function() {
		if ($('#social-overlay').hasClass('open')) {
			$('.overlay-close').trigger('click');
		}
	});
	
	// tooltips
	if( $('.ttip').length ){
		$('.ttip').tooltip();
	}
	
	// remove the 300ms click delay on mobile browsers
	FastClick.attach(document.body);
	
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
});