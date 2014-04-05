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
 *  file: player_lib.js
 *  version: 1.1
 *
 */
 


// FUNCTIONS
// ----------------------------------------------------------------------------------------------------

// send a MPD playback control command
function sendCmd(inputcmd) {
	var request = new XMLHttpRequest();
	request.open('GET', '/command/?cmd='+inputcmd, true);
	request.onreadystatechange = function() {
		if (this.readyState === 4){
		// TODO: check this
			if (this.status >= 200 && this.status < 400){
				// Success! resp = this.responseText;
			} else {
				// Error
			}
		}
	};
	request.send();
	request = null;
}

// open the Playback UI refresh channel
function displayChannel(){
	var pushstream = new PushStream({
		host: window.location.hostname,
		port: window.location.port,
		modes: "websocket|longpolling"
	});
	pushstream.onmessage = renderUI;
	pushstream.onstatuschange = function(status) {
	// force UI rendering (backend-call)
		if (status === 2) sendCmd('renderui');
	};
	pushstream.addChannel('display');
	pushstream.connect();
}

// open the notify messages channel
function notifyChannel(){
	var pushstream = new PushStream({
		host: window.location.hostname,
		port: window.location.port,
		modes: "websocket|longpolling"
	});
	pushstream.onmessage = renderMSG;
	pushstream.addChannel('notify');
	pushstream.connect();
}

// launch the Playback UI refresh from the data response
function renderUI(text) {
	// update global GUI array
	GUI.json = text[0];
	GUI.state = GUI.json.state;
	// console.log('current song = ', GUI.json.currentsong);
	// console.log( 'GUI.state = ', GUI.state );
	updateGUI(GUI.json);
	if (GUI.state != 'disconnected') {
		$('#loader').hide();
	}
	refreshTimer(parseInt(GUI.json.elapsed), parseInt(GUI.json.time), GUI.json.state);
	if (GUI.stream !== 'radio') {
		refreshKnob();
	} else {
		$('#time').val(0).trigger('change');
	}
	if (GUI.json.playlist != GUI.playlist) {
		getPlaylistCmd();
		GUI.playlist = GUI.json.playlist;
		// console.log('playlist = ', GUI.playlist);
	}
}

function getPlaylistCmd(json){
	loadingSpinner('pl');
	$.ajax({
		url: '/db/?cmd=playlist',
		success: function(data){
			if ( data.length > 4) {
				$('.playlist').addClass('hide');
				$('#playlist-entries').removeClass('hide');
				console.time('getPlaylistPlain timer');
				getPlaylistPlain(data);
				console.timeEnd('getPlaylistPlain timer');
				
				var current = parseInt(GUI.json.song);
				if ($('#panel-dx').hasClass('active')) {
					customScroll('pl', current, 200); // highlight current song in playlist
				}
			} else {
				$('.playlist').addClass('hide');
				$('#playlist-warning').removeClass('hide');
			}
			loadingSpinner('pl', 'hide');
		}
	});
}

// render the playing queue from the data response 
function getPlaylistPlain(data){
	var current = parseInt(GUI.json.song) + 1;
	var state = GUI.json.state;
	var content = '', time = '', artist = '', album = '', title = '', name='', str = '', filename = '', path = '', id = 0, songid = '', bottomline = '', totaltime = '';
	var i, line, lines = data.split('\n'), infos=[];
	for (i = 0; line = lines[i]; i += 1) {
		
		infos = line.split(': ');
		if ( 'Time' === infos[0] ) {
			time = parseInt(infos[1]);
		}
		else if ( 'Artist' === infos[0] ) {
			artist = infos[1];
		}
		else if ( 'Title' === infos[0] ) {
			title = infos[1];
		}
		else if ( 'Name' === infos[0] ) {
			name = infos[1];
		}
		else if ( 'Album' === infos[0] ) {
			album = infos[1];
		}
		else if ( 'file' === infos[0] ) {
			str = infos[1];
		}
		else if ( 'Id' === infos[0] ) {
			songid = infos[1];
			if (title === '' || album === '') {
				path = parsePath(str);
				filename = str.split('/').pop();
				title = filename;
				if (artist === '' ) {
					bottomline = 'path: ' + path;
				} else {
					bottomline = artist;
				}
			} else {
				bottomline = artist + ' - ' + album;
			}
			if (name !== '') {
				title = '<i class="fa fa-microphone"></i>' + name;
				bottomline = 'URL: ' + (path === '') ? str : path;
				totaltime = '';
			} else {
				totaltime = '<span>' + timeConvert2(time) + '</span>';
			}
			content += '<li id="pl-' + songid + (state != "stop" && songid == current ? ' class="active"' : '') + '"><i class="fa fa-times-circle pl-action" title="Remove song from playlist"></i><span class="sn">' + title + totaltime + '</span><span class="bl">' + bottomline + '</span></li>';
			time = ''; artist = ''; album = ''; title = ''; name = '';
		}
	}
	$('.playlist').addClass('hide');
	$('#playlist-entries').removeClass('hide');
	//$('#playlist-entries').html(content);
	var pl_entries = document.getElementById('playlist-entries');
	if( pl_entries ){ pl_entries.innerHTML = content; }
	$('#pl-filter-results').addClass('hide').html('');
	$('#pl-filter').val('');
	$('#pl-manage').removeClass('hide');
}

// get saved playlists
function getPlaylists(){
	loadingSpinner('pl');
	$.ajax({
		url: '/command/?cmd=listplaylists',
		success: function(data){
			renderPlaylists(data);
		}
	});
}

// render saved playlists
function renderPlaylists(data){	
	var content = '', playlistname = '';
	var i, line, lines=data.split('\n'), infos=[];
	for (i = 0; line = lines[i]; i += 1 ) {
		infos = line.split(': ');
		if( 'playlist' === infos[0] ) {
			playlistname = infos[1];
			content += '<li class="pl-folder" data-path="' + playlistname + '"><i class="fa fa-bars pl-action" data-target="#context-menu-playlist" data-toggle="context" title="Actions"></i><span><i class="fa fa-folder-open"></i>' + playlistname + '</span></li>';
			playlistname = '';
		}
	}
	document.getElementById('playlist-entries').innerHTML = '';
	$('.playlist').addClass('hide');
	$('#pl-manage').addClass('hide');
	$('#pl-filter-results').removeClass('hide').addClass('back-to-queue').html('<i class="fa fa-arrow-left sx"></i> to queue');
	$('#pl-currentpath').removeClass('hide');
	$('#pl-editor').removeClass('hide');
	document.getElementById('pl-editor').innerHTML = content;
	loadingSpinner('pl', 'hide');
}

// recover the path from input string
function parsePath(str) {
	var cutpos = str && str.length? str.lastIndexOf('/'):0;
	// console.log('parsePath.cutpos', cutpos)
	//-- verify this switch! (Orion)
	var songpath = '';
	if (cutpos && cutpos !=-1){
		songpath = str.slice(0,cutpos);
	}
	return songpath;
}

// launch the right AJAX call for Library rendering
function getDB(options){
	// DEFAULTS
	var cmd = options.cmd || 'filepath',
		path = options.path || '',
		browsemode = options.browsemode || '',
		uplevel = options.uplevel || '',
		plugin = options.plugin || '',
		querytype = options.querytype || '',
		args = options.args || '';
		
	// DEBUG
	// console.log('OPTIONS: cmd = ' + cmd + ', path = ' + path + ', browsemode = ' + browsemode + ', uplevel = ' + uplevel + ', plugin = ' + plugin);
	
	loadingSpinner('db');
	
	if (plugin !== '') {
	// plugins
		if (plugin === 'Dirble') {
		// Dirble plugin
			$.post('/db/?cmd=dirble', { 'querytype': (querytype === '') ? 'categories' : querytype, 'args': args }, function(data){
				populateDB({
					data: data,
					path: path,
					plugin: plugin,
					querytype: querytype,
					uplevel: uplevel
				});
			}, 'json');
			
		}
		else if (plugin === 'Jamendo') {
		// Jamendo plugin
			$.post('/db/?cmd=jamendo', { 'querytype': (querytype === '') ? 'radio' : querytype, 'args': args }, function(data){
				populateDB({
					data: data.results,
					path: path,
					plugin: plugin,
					querytype: querytype
				});
			}, 'json');
			
		}
	} else {
	// normal browsing
		if (cmd === 'search') {
			var keyword = $('#db-search-keyword').val();
			$.post('/db/?querytype=' + browsemode + '&cmd=search', { 'query': keyword }, function(data) {
				populateDB({
					data: data,
					path: path,
					uplevel: uplevel,
					keyword: keyword
				});
			}, 'json');
		} else if (cmd === 'filepath') {	
			$.post('/db/?cmd=filepath', { 'path': path }, function(data) {
				populateDB({
					data: data,
					path: path,
					uplevel: uplevel
				});
			}, 'json');
		} else {
		// EXAMPLE: cmd === 'update', 'addplay', 'addreplaceplay', 'update'
			loadingSpinner('db', 'hide');
			$.post('/db/?cmd='+cmd, { 'path': path }, function(path) {
				// console.log('add= ', path);
			}, 'json');
		}
	}
} // end getDB()

// populate the Library view lists with entries
function populateDB(options){
	// DEFAULTS
	var data = options.data || '',
		path = options.path || '',
		uplevel = options.uplevel || 0,
		keyword = options.keyword || '',
		plugin = options.plugin || '',
		querytype = options.querytype || '',
		content = '',
		i = 0,
		row = [];
		
	// DEBUG
	// console.log('OPTIONS: data = ' + data + ', path = ' + path + ', uplevel = ' + uplevel + ', keyword = ' + keyword +', querytype = ' + querytype);

	if (plugin !== '') {
	// plugins
		if (plugin === 'Dirble') {
		// Dirble plugin
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			document.getElementById('database-entries').innerHTML = '';
			for (i = 0; row = data[i]; i += 1) {
				content += parseResponse({
					inputArr: row,
					respType: 'Dirble',
					i: i,
					querytype: querytype
				});
			}
			document.getElementById('database-entries').innerHTML = content;
		}		
		if (plugin === 'Jamendo') {
		// Jamendo plugin
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			document.getElementById('database-entries').innerHTML = '';
			for (i = 0; row = data[i]; i += 1) {
				content += parseResponse({
					inputArr: row,
					respType: 'Jamendo',
					i: i,
					querytype: querytype
				});
			}
			document.getElementById('database-entries').innerHTML = content;
		}
	} else {
	// normal MPD browsing by file
		if (path === '' && keyword === '') {
		// Library home
			libraryHome();
			return;
		} else {
		// browsing
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			// console.log(' new GUI.currentpath = ', GUI.currentpath);
			document.getElementById('database-entries').innerHTML = '';
			if (keyword !== '') {
			// search results
				var results = (data.length) ? data.length : '0';
				var s = (data.length == 1) ? '' : 's';
				$('#db-level-up').addClass('hide');
				$('#db-search-results').removeClass('hide').html('<i class="fa fa-times sx"></i> <span class="visible-xs">back</span><span class="hidden-xs">' + results + ' result' + s + ' for "<span class="keyword">' + keyword + '</span>"</span>');
			}
			for (i = 0; row = data[i]; i += 1) {
				content += parseResponse({
					inputArr: row,
					respType: 'db',
					i: i,
					inpath: path
				});
			}
			document.getElementById('database-entries').innerHTML = content;
			// DEBUG
			// console.log('GUI.currentDBpos = ', GUI.currentDBpos);
			// console.log('level = ', GUI.currentDBpos[10]);
			// console.log('highlighted entry = ', GUI.currentDBpos[GUI.currentDBpos[10]]);
		}
	}
	$('span', '#db-currentpath').html(path);
	if (uplevel) {
		$('#db-' + GUI.currentDBpos[GUI.currentDBpos[10]]).addClass('active');
		customScroll('db', GUI.currentDBpos[GUI.currentDBpos[10]], 0);
	} else {
		customScroll('db', 0, 0);
	}
	loadingSpinner('db', 'hide');
} // end populateDB()

// parse the JSON response and return the formatted code
function parseResponse(options) {
	// DEFAULTS
	var inputArr = options.inputArr || '',
		respType = options.respType || '',
		i = options.i || 0,
		inpath = options.inpath || '',
		querytype = options.querytype || '',
		content = '';
		
	// DEBUG
	// console.log('OPTIONS: inputArr = ' + inputArr + ', respType = ' + respType + ', i = ' + i + ', inpath = ' + inpath +', querytype = ' + querytype);
	
	switch (respType) {
		case 'playlist':		
			// code placeholder
		break;
		
		case 'db':
		// normal MPD browsing by file
			if (inpath === '' && inputArr.file !== undefined) {
				inpath = parsePath(inputArr.file);
			}
			if (inputArr.file !== undefined || inpath === 'Webradio') {
				// DEBUG
				// console.log('inputArr.file: ', inputArr.file);
				// console.log('inputArr.Title: ', inputArr.Title);
				// console.log('inputArr.Artist: ', inputArr.Artist);
				// console.log('inputArr.Album: ', inputArr.Album);
				content = '<li id="db-' + (i + 1) + '" data-path="';
				if (inputArr.Title !== undefined) {
				// files
					content += inputArr.file;
					content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu-file"></i><i class="fa fa-music db-icon"></i><span class="sn">';
					content += inputArr.Title + ' <span>' + timeConvert(inputArr.Time) + '</span></span>';
					content += ' <span class="bl">';
					content +=  inputArr.Artist;
					content += ' - ';
					content +=  inputArr.Album;
				} else {
					if (inpath !== 'Webradio') {
					// files with no tags
						content += inputArr.file;
						content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu"></i><i class="fa fa-music db-icon"></i><span class="sn">';
						content += inputArr.file.replace(inpath + '/', '') + ' <span>' + timeConvert(inputArr.Time) + '</span></span>';
						content += '<span class="bl">';
						content += ' path \: ';
						content += inpath;
					} else {
					// webradio playlists
						content += inputArr.playlist;
						content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu-webradio"></i><i class="fa fa-microphone db-icon db-radio"></i>';
						content += '<span class="sn">' + inputArr.playlist.replace(inpath + '/', '').replace('.' + inputArr.fileext , '');
						content += '</span><span class="bl">webradio';
					}
				}
				content += '</span></li>';
			} else if (inputArr.playlist !== undefined) {
			// nothing to display
				content += '';
			} else {
			// folders
				content = '<li id="db-' + (i + 1) + '" class="db-folder" data-path="';
				content += inputArr.directory;
				if (inpath !== '') {
					content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu"></i><span><i class="fa fa-folder-open"></i>';
				} else {
					content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu-root"></i><i class="fa fa-hdd-o icon-root"></i><span>';
				}
				content += inputArr.directory.replace(inpath + '/', '');
				content += '</span></li>';
			}
		break;
		
		case 'Dirble':
		// Dirble plugin
			if (querytype === '') {
			// folders
				content = '<li id="db-' + (i + 1) + '" class="db-dirble db-folder" data-path="';
				content += inputArr.id;
				content += '"><span><i class="fa fa-folder-open"></i>';
				content += inputArr.name;
				content += '</span></li>';
			} else if (querytype === 'stations') {
			// stations
				content = '<li id="db-' + (i + 1) + '" class="db-dirble db-radio" data-path="';
				content += inputArr.streamurl;
				content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu-file"></i><i class="fa fa-microphone db-icon"></i>';
				content += '<span class="sn">' + inputArr.name + ' <span>' + inputArr.bitrate + '</span></span>';
				content += '<span class="bl">';
				content += inputArr.website;
				content += '</span></li>';
			}
		break;		
		
		case 'Jamendo':
		// Jamendo plugin
			// if (querytype === 'radio') {
				content = '<li id="db-' + (i + 1) + '" class="db-jamendo db-folder" data-path="';
				content += inputArr.stream;
				content += '"><img class="jamendo-cover" src="/tun/' + inputArr.image + '" alt=""><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu-file"></i>';
				content += inputArr.dispname + '</div></li>';
			// }
		break;
		
	}
	return content;
} // end parseResponse()

// update the Playback UI
function updateGUI(json){
	var volume = json.volume;
	var radioname = json.radioname;
	var currentartist = json.currentartist;
	var currentsong = json.currentsong;
	var currentalbum = json.currentalbum;
	// set radio mode if stream is present
	GUI.stream = ((radioname !== null && radioname !== undefined && radioname !== '') ? 'radio' : '');
	// check MPD status and refresh the UI info
	refreshState(GUI.state);
	// check song update
	// console.log('A = ', json.currentsong); console.log('B = ', GUI.currentsong);
	if (GUI.currentsong != json.currentsong) {
		countdownRestart(0);
		if ($('#panel-dx').hasClass('active')) {
			var current = parseInt(json.song);
			customScroll('pl', current);
		}
	}
	// common actions
	$('#volume').val((volume == '-1') ? 100 : volume).trigger('change');
	// console.log('currentartist = ', json.currentartist);
	if (GUI.stream !== 'radio') {
		$('#currentartist').html((currentartist === null || currentartist === undefined || currentartist === '') ? '<span class="notag">[no artist]</span>' : currentartist);
		$('#currentsong').html((currentsong === null || currentsong === undefined || currentsong === '') ? '<span class="notag">[no title]</span>' : currentsong);
		$('#currentalbum').html((currentalbum === null || currentalbum === undefined || currentalbum === '') ? '<span class="notag">[no album]</span>' : currentalbum);
	} else {
		$('#currentartist').html((currentartist === null || currentartist === undefined || currentartist === '') ? radioname : currentartist);
		$('#currentsong').html((currentsong === null || currentsong === undefined || currentsong === '') ? radioname : currentsong);
		$('#currentalbum').html('<span class="notag">streaming</span>');
	}
	if (json.repeat == 1) {
		$('#repeat').addClass('btn-primary');
	} else {
		$('#repeat').removeClass('btn-primary');
	}
	if (json.random == 1) {
		$('#random').addClass('btn-primary');
	} else {
		$('#random').removeClass('btn-primary');
	}
	if (json.consume == 1) {
		$('#consume').addClass('btn-primary');
	} else {
		$('#consume').removeClass('btn-primary');
	}
	if (json.single == 1) {
		$('#single').addClass('btn-primary');
	} else {
		$('#single').removeClass('btn-primary');
	}
	
	GUI.currentsong = currentsong;
	var currentalbumstring = currentartist + ' - ' + currentalbum;
	if (GUI.currentalbum != currentalbumstring) {
		if (radioname === null || radioname === undefined || radioname === '') {
			var covercachenum = Math.floor(Math.random()*1001);
			$('#cover-art').css('background-image','url(/coverart2/?v=' + covercachenum + ')');
		} else {
			$('#cover-art').css('background-image','url(assets/img/cover-radio.jpg');
		}
	}
	GUI.currentalbum = currentalbumstring;
}

// update info and status on Playback tab
function refreshState(state) {
	if (state === 'play') {
		$('#play').addClass('btn-primary');
		$('i', '#play').removeClass('fa fa-pause').addClass('fa fa-play');
		$('#stop').removeClass('btn-primary');
	} else if (state === 'pause') {
		$('#playlist-position').html('Not playing');
		$('#play').addClass('btn-primary');
		$('i', '#play').removeClass('fa fa-play').addClass('fa fa-pause');
		$('#stop').removeClass('btn-primary');
	} else if (state === 'stop') {
		$('#play').removeClass('btn-primary');
		$('i', '#play').removeClass('fa fa-pause').addClass('fa fa-play');
		$('#stop').addClass('btn-primary');
		$('#countdown-display').countdown('destroy');
		if (GUI.stream === 'radio') {
			$('#elapsed').html('&infin;');
		} else {
			$('#elapsed').html('00:00');
		}
		if (GUI.stream === 'radio') {
			$('#total').html('<span>&infin;</span>');
		} else {
			$('#total').html('');
		}
		$('#time').val(0).trigger('change');
		$('#format-bitrate').html('&nbsp;');
		$('li', '#playlist-entries').removeClass('active');
	}
	if ( state != 'stop' ) {
		$('#elapsed').html(timeConvert(GUI.json.elapsed));
		if (GUI.stream === 'radio') {
			$('#total').html('<span>&infin;</span>');
		} else {
			$('#total').html(timeConvert(GUI.json.time));
		}
		var fileinfo = (GUI.json.audio_channels && GUI.json.audio_sample_depth && GUI.json.audio_sample_rate) ? (GUI.json.audio_channels + ', ' + GUI.json.audio_sample_depth + ' bit, ' + GUI.json.audio_sample_rate +' kHz, '+GUI.json.bitrate+' kbps') : '&nbsp;';
		$('#format-bitrate').html(fileinfo);
		$('li', '#playlist-entries').removeClass('active');
		var current = parseInt(GUI.json.song);
		$('li', '#playlist-entries').eq(current).addClass('active'); // TODO: check efficiency
	}
	if( GUI.json.song && GUI.json.playlistlength ){ 
		$('#playlist-position').html('Playlist position ' + (parseInt(GUI.json.song) + 1) +'/'+GUI.json.playlistlength);
	} else {
		$('#playlist-position').html( $('<a>',{
			text: 'Add the vibe!', 
			title: 'Load some tracks on your Library',
			href: '#panel-sx',
			'data-toggle': 'tab'
		}) ); // TODO: highlight the "Library" tab
	}
	// show UpdateDB icon
	// console.log('dbupdate = ', GUI.json.updating_db);
	if (typeof GUI.json.updating_db != 'undefined') {
		$('.open-panel-sx').html('<i class="fa fa-refresh fa-spin"></i> Updating');
	} else {
		$('.open-panel-sx').html('<i class="fa fa-music sx"></i> Library');
	}
}

// update countdown
function refreshTimer(startFrom, stopTo, state){
	// console.log('startFrom = ', startFrom);
	// console.log('state = ', state);
	var display = $('#countdown-display').countdown('destroy');
	display.countdown({ since: (state != 'stop'? -startFrom:0), compact: true, format: 'MS' });
	if (state != 'play'){
		// console.log('startFrom = ', startFrom);
		display.countdown('pause');
	}
}

// update playback progress knob
function refreshKnob(){
	window.clearInterval(GUI.currentKnob);
	var initTime = parseInt(GUI.json.song_percent)*10;
	var delta = parseInt(GUI.json.time);
	var step = parseInt(1000/delta);
	// console.log('initTime = ' + initTime + ', delta = ' + delta + ', step = ' + step);
	var time = $('#time');
	time.val(initTime).trigger('change');
	if (GUI.state == 'play') {
		GUI.currentKnob = setInterval(function() {
			// console.log('initTime = ', initTime);
			initTime = initTime + (GUI.visibility != 'visible'? parseInt(1000/delta):1);
			time.val(initTime).trigger('change');
			//document.title = Math.round(initTime)/10 + '% - ' + GUI.visibility;
		}, delta);
	}
}

// time conversion
function timeConvert(seconds) {
	var minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	var mm = (minutes < 10) ? ('0' + minutes) : minutes;
	var ss = (seconds < 10) ? ('0' + seconds) : seconds;
	return mm + ':' + ss;
}
function timeConvert2(ss) {
	var hr = Math.floor(ss/3600);
	var mm = Math.floor((ss -(hr * 3600))/60);
	ss = Math.floor(ss -(hr*3600) -(mm * 60));
	if ( hr > 0 ) {
		if ( hr < 10 ){
			hr = '0' + hr;
		}
		hr += ':';
	} else hr = '';
	if (mm < 10) { mm = '0' + mm; }
	if (ss < 10) { ss = '0' + ss; }
	return hr + mm + ':' + ss;
}

// reset countdown
function countdownRestart(startFrom) {
	var display = $('#countdown-display').countdown('destroy');
	display.countdown({since: -(startFrom), compact: true, format: 'MS'});
}

// set volume with knob
function setvol(val) {
	$('#volume').val(val).trigger('change');
	GUI.volume = val;
	$('#volumemute').removeClass('btn-primary');
	sendCmd('setvol ' + val);
}

// custom scrolling
function customScroll(list, destination, speed) {
	// console.log('list = ' + list + ', destination = ' + destination + ', speed = ' + speed);
	if (typeof(speed) === 'undefined') speed = 500;
	var entryheight = 49;
	var centerheight = parseInt($(window).height()/2);
	var scrolltop = $(window).scrollTop();
	var scrollcalc = 0;
	var scrolloffset = 0;
	if (list === 'db') {
		scrollcalc = parseInt((destination)*entryheight - centerheight);
		scrolloffset = scrollcalc;
	} else if (list === 'pl') {
		//var scrolloffset = parseInt((destination + 2)*entryheight - centerheight);
		scrollcalc = parseInt((destination + 2)*entryheight - centerheight);
		scrolloffset = Math.abs(scrollcalc - scrolltop);
		scrolloffset = (scrollcalc > scrolltop ? '+':'-') + '=' + scrolloffset + 'px';
	}
	// debug
	// console.log('-------------------------------------------');
	// console.log('customScroll parameters = ' + list + ', ' + destination + ', ' + speed);
	// console.log('scrolltop = ', scrolltop);
	// console.log('scrollcalc = ', scrollcalc);
	// console.log('scrolloffset = ', scrolloffset);
	$.scrollTo( (scrollcalc >0? scrolloffset:0), speed);
	//$('#' + list + '-' + (destination + 1)).addClass('active');
	$('li', '#playlist-entries').eq(destination).addClass('active'); // TODO: check efficiency
}

// [!] scrolling debug purpose only
function randomScrollPL() {
	var n = $(".playlist li").size();
	var random = 1 + Math.floor(Math.random() * n);
	customScroll('pl', random);
}
function randomScrollDB() {
	var n = $(".database li").size();
	var random = 1 + Math.floor(Math.random() * n);
	customScroll('db', random);
}

// notify messages rendering
function renderMSG(text) {
	notify = text[0];
	// console.log((notify.hide === undefined) ? 'undefined' : notify.hide);
	$.pnotify({
		title: notify.title,
		text: notify.text,
		icon: (notify.icon === undefined) ? 'fa fa-check' : notify.icon,
		opacity: (notify.opacity === undefined) ? 0.9 : notify.opacity,
		hide: (notify.hide === undefined)
	});
}

// client side notify
function notify(command, msg) {
	switch (command) {
		case 'add':
			$.pnotify({
				title: 'Added to playlist',
				text: msg,
				icon: 'icon-ok',
				opacity: .9
			});
		break;

		case 'addreplaceplay':
			$.pnotify({
				title: 'Playlist cleared<br> Added to playlist',
				text: msg,
				icon: 'icon-remove',
				opacity: .9
			});
		break;
		
		case 'update':
			$.pnotify({
				title: 'Update path: ',
				text: msg,
				icon: 'icon-remove',
				opacity: .9
			});
		break;
		
		case 'remove':
			$.pnotify({
				title: 'Removed from playlist',
				text: msg,
				icon: 'icon-remove',
				opacity: .9
			});
		break;
	}
}

// sorting commands
function sortOrder(id) {
	var pos = $('#' + id).index();
	id = parseInt(id.replace('pl-', ''));
	// console.log('id = ' + id + ', pos = ', pos);
	sendCmd('moveid ' + id + ' ' + pos);
}

// loading spinner display/hide
function loadingSpinner(section, hide) {
	if (hide === 'hide') {
		if (section === 'db') {
			$('#spinner-db').addClass('hide');
		}
		if (section === 'pl') {
			$('#spinner-pl').addClass('hide');
		}
	} else {
		if (section === 'db') {
			$('#spinner-db').removeClass('hide');
		}
		if (section === 'pl') {
			$('#spinner-pl').removeClass('hide');
		}
	}
}

// Library home screen
function libraryHome() {
	loadingSpinner('db');
	$('#database-entries').addClass('hide');
	$('#db-level-up').addClass('hide');
	$('#home-blocks').removeClass('hide');
	$.getJSON('/assets/js/json-temp.txt', function(data) {
		renderLibraryHome(data);
	});
	$('span', '#db-currentpath').html('');
}

// render the Library home screen
function renderLibraryHome(jsonLib) {
	// console.log(jsonLib);
	var i = 0, content = '';
	content = '<div class="col-sm-12"><h1 class="txtmid">Browse your library</h1></div>';
	for (i = 0; obj = jsonLib[i]; i += 1) {
		content += '<div class="col-md-4 col-sm-6">';
		if (obj.bookmark !== undefined && obj.bookmark !== '') {
		// bookmark block
			content += '<div id="home-favorite-' + obj.bookmark + '" class="home-block" data-path="' + obj.path + '"><i class="fa fa-star"></i><h3>' + obj.name + '</h3>bookmark</div>';
		} else if (obj.networkMounts !== undefined && obj.networkMounts !== '') {
		// network mounts block
			if (obj.networkMounts == 0) {
				content += '<a class="home-block" href="/sources/add/"><i class="fa fa-sitemap"></i><h3>Network mounts (0)</h3>click to add some</a>';
			} else {
				content += '<div id="home-nas" class="home-block" data-path="NAS"><i class="fa fa-sitemap"></i><h3>Network mounts (' + obj.networkMounts + ')</h3>' + obj.networkMounts + ' item available</div>';
			}
		} else if (obj.USBMounts !== undefined && obj.USBMounts !== '') {
		// USB mounts block
			if (obj.USBMounts == 0) {
				content += '<a id="home-usb" class="home-block" href="/sources"><i class="fa fa-hdd-o"></i><h3>USB storage (0)</h3>refresh</a>';
			} else {
				content += '<div id="home-usb" class="home-block" data-path="USB"><i class="fa fa-hdd-o"></i><h3>USB storage (' + obj.USBMounts + ')</h3>browse USB drives</div>';
			}
		} else if (obj.webradio !== undefined && obj.webradio !== '') {
		// webradios block
			if (obj.webradio == 0) {	
				content += '<div id="home-webradio" class="home-block" data-path="Webradio"><i class="fa fa-microphone"></i><h3>My Webradios (0)</h3>click to add some</div>';
			} else {
				content += '<div id="home-webradio" class="home-block" data-path="Webradio"><i class="fa fa-microphone"></i><h3>My Webradios (' + obj.webradio + ')</h3>webradio local playlists</div>';
			}
		} else if (obj.Dirble !== undefined && obj.Dirble !== '') {
		// Dirble block
			content += '<div id="home-dirble" class="home-block" data-plugin="Dirble" data-path="Dirble"><i class="fa fa-globe"></i><h3>Dirble <span id="home-count-dirble">(' + obj.Dirble + ')</span></h3>Radio stations Open Directory</div>';
		}
		content += '</div>';
	}
	// Jamendo (static)
	content += '<div class="col-md-4 col-sm-6"><div id="home-jamendo" class="home-block" data-plugin="Jamendo" data-path="Jamendo"><i class="fa fa-play-circle-o"></i><h3>Jamendo<span id="home-count-jamendo"></span></h3>the world\'s largest platform for free music</div></div>';
	document.getElementById('home-blocks').innerHTML = content;
	loadingSpinner('db', 'hide');
}

// check visibility of the window
(function() {
	hidden = 'hidden';
	// Standards:
	if (hidden in document)
		document.addEventListener('visibilitychange', onchange);
	else if ((hidden = 'mozHidden') in document)
		document.addEventListener('mozvisibilitychange', onchange);
	else if ((hidden = "webkitHidden") in document)
		document.addEventListener('webkitvisibilitychange', onchange);
	else if ((hidden = "msHidden") in document)
		document.addEventListener('msvisibilitychange', onchange);
	// IE 9 and lower:
	else if ('onfocusin' in document)
		document.onfocusin = document.onfocusout = onchange;
	// All others:
	else
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

	function onchange (evt) {
		var v = 'visible', h = 'hidden',
			evtMap = {
				focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
			};

		evt = evt || window.event;
		if (evt.type in evtMap) {
			document.body.className = evtMap[evt.type];
			// console.log('boh? = ', evtMap[evt.type]);
		} else {
			document.body.className = this[hidden] ? 'hidden' : 'visible';
			if (this[hidden]) {
				GUI.visibility = 'hidden';
				// console.log('focus = hidden');
			} else {
				GUI.visibility = 'visible';
				// console.log('focus = visible');
			}
		}
	}
})();

// trigger social overlay
(function() {
	var triggerBttn = $('#social-overlay-open'),
		overlay = $('#social-overlay'),
		closeBttn = $('button.overlay-close');
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		};
		// transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support = { transitions : Modernizr.csstransitions };
	function toggleOverlay() {
		if (overlay.hasClass('open')) {
			overlay.removeClass('open');
			overlay.addClass('closed');
			var onEndTransitionFn = function(ev) {
				if (support.transitions) {
					if (ev.propertyName !== 'visibility') return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				overlay.removeClass('closed');
			};
			// if (support.transitions) {
				// overlay.addEventListener( transEndEventName, onEndTransitionFn );
			// }
			// else {
				// onEndTransitionFn();
			// }
		}
		else if (overlay.hasClass('closed')) {
			overlay.addClass('open');
			var urlTwitter = 'https://twitter.com/home?status=Listening+to+' + GUI.json.currentsong.replace(/\s+/g, '+') + '+by+' + GUI.json.currentartist.replace(/\s+/g, '+') + '+on+%40RuneAudio+http%3A%2F%2Fwww.runeaudio.com%2F+%23nowplaying';
			var urlFacebook = 'https://www.facebook.com/sharer.php?u=http%3A%2F%2Fwww.runeaudio.com%2F&display=popup';
			var urlGooglePlus = 'https://plus.google.com/share?url=http%3A%2F%2Fwww.runeaudio.com%2F';
			$('#urlTwitter').attr('href', urlTwitter);
			$('#urlFacebook').attr('href', urlFacebook);
			$('#urlGooglePlus').attr('href', urlGooglePlus);
		}
	}
	triggerBttn.click(function(){
		toggleOverlay();
	});
	closeBttn.click(function(){
		toggleOverlay();
	});
})();