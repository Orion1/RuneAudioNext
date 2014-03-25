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
	/*
	$.ajax({
		url: '/command/?cmd='+inputcmd,
		success: function(data){
			GUI.halt = 1;
			// console.log('GUI.halt (sendCmd)= ', GUI.halt);
		},
	});
	*/
	var request = new XMLHttpRequest;
	request.open('GET', '/command/?cmd='+inputcmd, true);
	request.onreadystatechange = function() {
		if (this.readyState === 4){
			if (this.status >= 200 && this.status < 400){
				// Success! resp = this.responseText;
				GUI.halt = 1;
				// console.log('GUI.halt (sendCmd)= ', GUI.halt);
			} else {
				// Error
			}
		}
	}
	request.send();
	request = null;
}

// [!] discontinued function, see displayChannel() below
function backendRequest(){
    $.ajax({
		url: '/lp/display/',
		//data: { state: GUI.state },
		success: function(data){
			// console.log('GUI.halt (backendRequest)= ', GUI.halt);
			renderUI(data);
			GUI.currentsong = GUI.json['currentsong'];
			// GUI.halt = 1;
			backendRequest(GUI.state);
		},
		error: function(){
			setTimeout(function(){
				GUI.state = 'disconnected';
				// console.log('GUI.state = ', GUI.state);
				// console.log('GUI.halt (disconnected) = ',GUI.halt);
				$('#loader').show();
				$('#countdown-display').countdown('pause');
				window.clearInterval(GUI.currentKnob);
				backendRequest(GUI.state);
			}, 5000);
		}
    });
}

// open the Playback UI refresh channel
function displayChannel(){
    var pushstream = new PushStream({
		host: window.location.hostname,
		port: window.location.port,
		modes: "websocket|longpolling"
	});
	pushstream.onmessage = renderUI;
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
	// GUI.json = eval('(' + data + ')');
	GUI.json = text[0];
	GUI.state = GUI.json['state'];
	// console.log('current song = ', GUI.json['currentsong']);
	// console.log( 'GUI.state = ', GUI.state );
	updateGUI(GUI.json);
	if (GUI.state != 'disconnected') {
	   $('#loader').hide();
	}
	refreshTimer(parseInt(GUI.json['elapsed']), parseInt(GUI.json['time']), GUI.json['state']);
	refreshKnob(GUI.json);
	if (GUI.json['playlist'] != GUI.playlist) {
		getPlaylistCmd(GUI.json);
		GUI.playlist = GUI.json['playlist'];
		// console.log('playlist = ', GUI.playlist);
	}
	GUI.halt = 0;
	// console.log('GUI.halt (renderUI)= ', GUI.halt);
}

function getPlaylistCmd(json){
	loadingSpinner('pl');
	$.ajax({
		url: '/db/?cmd=playlist',
		success: function(data){
			// console.log('DATA: ', data);
			if ( data.length > 4) {
				$('#playlist-warning').addClass('hide');
				$('#playlist-entries').removeClass('hide');
				// console.time('getPlaylistPlain timer');
				getPlaylistPlain(data, json);
				// console.timeEnd('getPlaylistPlain timer');
				
				var current = parseInt(json['song']);
				if (GUI.halt != 1 && $('#panel-dx').hasClass('active')) {
					customScroll('pl', current, 200); // highlight current song in playlist
				}
			} else {
				$('#playlist-warning').removeClass('hide');
				$('#playlist-entries').addClass('hide');
			}
			loadingSpinner('pl', 'hide');
		}
	});
}

// [!] discontinued function, see getPlaylistPlain() below
function getPlaylist(data, json){
	var i = 0;
	var content = '';
	var output = '';
	for (i = 0; i < data.length; i++){
		if (json['state'] != 'stop' && i == parseInt(json['song'])) {
			content = '<li id="pl-' + (i + 1) + '" class="active">';
		} else {
			content = '<li id="pl-' + (i + 1) + '">';
		}
		content += '<a class="pl-action" href="#notarget" title="Remove song from playlist"><i class="fa fa-times-circle"></i></a>';
		if (typeof data[i].Title != 'undefined') {
			content += '<div class="pl-entry">';
			content += data[i].Title + ' <em class="songtime">' + timeConvert(data[i].Time) + '</em>';
			content += ' <span>';
			content +=  data[i].Artist;
			content += ' - ';
			content +=  data[i].Album;
			content += '</span></div></li>';
			output = output + content;
		} else {
			songpath = parsePath(data[i].file);
			content += '<div class="pl-entry">';
			content += data[i].file.replace(songpath + '/', '') + ' <em class="songtime">' + timeConvert(data[i].Time) + '</em>';
			content += ' <span>';
			content += ' path \: ';
			content += songpath;
			content += '</span></div></li>';
			output = output + content;
		}
	}
	$('ul.playlist').html(output);
}

// render the playing queue from the data response 
function getPlaylistPlain(data, json){
	var current = parseInt(json['song']) + 1;
	var state = json['state'];
	var content = '', time = '', artist = '', album = '', title = '', name='', str = '', filename = '', path = '', id = 0, songid = '', bottomline = '', totaltime = '';
	var i, line, lines=data.split('\n'), infos=[];
	//while( line = lines[i++] ){
	for (i = 0; i < lines.length; i+=1){
		line = lines[i];
		infos = line.split(': ');
		if( 'Time' === infos[0] ){
			time = parseInt(infos[1])
		}
		else if( 'Artist' === infos[0] ){
			artist = infos[1]
		}
		else if( 'Title' === infos[0] ){
			title = infos[1]
		}
		else if( 'Name' === infos[0] ){
			name = infos[1]
		}
		else if( 'Album' === infos[0] ){
			album = infos[1]
		}
		else if( 'file' === infos[0] ){
			str = infos[1];
		}
		else if( 'Id' === infos[0] ){
			songid = infos[1];
			// ++id;
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
			content += '<li id="pl-' + songid + (state != "stop" && id == current ? ' class="active"' : '') + '"><i class="fa fa-times-circle pl-action" title="Remove song from playlist"></i><span class="sn">' + title + totaltime + '</span><span class="bl">' + bottomline + '</span></li>';
			time = '', artist = '', album = '', title = '', name = '';
		}
	}
	$('.playlist').addClass('hide');
	$('#playlist-entries').removeClass('hide');
	//$('#playlist-entries').html(content);
	document.getElementById('playlist-entries').innerHTML = content;
	$('#pl-filter-results').addClass('hide').html('');
	$('#pl-filter').val('');
	$('#pl-manage').removeClass('hide');
}

// get the list of saved Playlists
function getPlaylists(data, json){	
	var content = '';
	for (i = 0; i < 10; i+=1){
		content += '<li><a class="pl-actions" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-playlist"><i class="fa fa-bars"></i></a><div class="pl-entry">Nome playlist<span>293 entries</span></div></li>';
	}
	document.getElementById('playlist-entries').innerHTML = '';
	$('.playlist').addClass('hide');
	$('#pl-manage').addClass('hide');
	$('#pl-filter-results').removeClass('hide').addClass('back-to-queue').html('<i class="fa fa-arrow-left sx"></i> back to queue');
	$('#pl-editor').removeClass('hide');
	document.getElementById('pl-editor').innerHTML = content;
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
			$.post('/db/?cmd=dirble', { 'querytype': (querytype === '') ? 'categories' : querytype, 'args': args }, function(data){
				if (querytype === 'amountStation') {
					$('#home-count-dirble').html('(' + data + ')');
					loadingSpinner('db', 'hide');
				} else {
					populateDB({
						data: data,
						path: path,
						plugin: plugin,
						querytype: querytype
					});
				}
			}, 'json');
			
		}
		else if (plugin === 'Jamendo') {
			$.post('/db/?cmd=jamendo', { 'querytype': (querytype === '') ? 'radio' : querytype, 'args': args }, function(data){
				if (querytype === 'amountStation') {
					$('#home-count-jamendo').html('(' + data + ')');
					loadingSpinner('db', 'hide');
				} else {
					populateDB({
						data: data['results'],
						path: path,
						plugin: plugin,
						querytype: querytype
					});
				}
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
			$.post('/db/?cmd='+cmd, { 'path': path }, function(path) {
				// console.log('add= ', path);
			}, 'json');
		}
	}
}

// populate the Library view lists with entries
function populateDB(options){
	// DEFAULTS
	var data = options.data || '',
		path = options.path || '',
		uplevel = options.uplevel || 0,
		keyword = options.keyword || '',
		plugin = options.plugin || '',
		querytype = options.querytype || '';
		
	// DEBUG
	// console.log('OPTIONS: data = ' + data + ', path = ' + path + ', uplevel = ' + uplevel + ', keyword = ' + keyword +', querytype = ' + querytype);

	if (plugin !== '') {
		if (plugin === 'Dirble') {
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			document.getElementById('database-entries').innerHTML = '';
			var content = '';
			var i = 0;
			for (i = 0; i < data.length; i++){
				content += parseResponse({
					inputArr: data[i],
					respType: 'Dirble',
					i: i,
					querytype: querytype
				});
			}
			document.getElementById('database-entries').innerHTML = content;
			$('span', '#db-currentpath').html(path);
		}		
		if (plugin === 'Jamendo') {
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			document.getElementById('database-entries').innerHTML = '';
			var content = '';
			var i = 0;
			for (i = 0; i < data.length; i++){
				content += parseResponse({
					inputArr: data[i],
					respType: 'Jamendo',
					i: i,
					querytype: querytype
				});
			}
			document.getElementById('database-entries').innerHTML = content;
			$('span', '#db-currentpath').html(path);
		}
	} else {
		if (path === '' && keyword === '') {
			$('#database-entries').addClass('hide');
			$('#db-level-up').addClass('hide');
			$('#home-blocks').removeClass('hide');
			$('span', '#db-currentpath').html('');
			loadingSpinner('db', 'hide');
			return;
		} else {
			$('#database-entries').removeClass('hide');
			$('#db-level-up').removeClass('hide');
			$('#home-blocks').addClass('hide');
			if (path) GUI.currentpath = path;
			// console.log(' new GUI.currentpath = ', GUI.currentpath);
			document.getElementById('database-entries').innerHTML = '';
			if (keyword !== '') {
				var results = (data.length) ? data.length : '0';
				var s = (data.length == 1) ? '' : 's'
				$('#db-level-up').addClass('hide');
				$('#db-search-results').removeClass('hide').html('<i class="fa fa-times sx"></i> <span class="visible-xs">back</span><span class="hidden-xs">' + results + ' result' + s + ' for "<span class="keyword">' + keyword + '</span>"</span>');
			}
			var content = '';
			var i = 0;
			for (i = 0; i < data.length; i++){
				content += parseResponse({
					inputArr: data[i],
					respType: 'db',
					i: i,
					inpath: path
				});
			}
			document.getElementById('database-entries').innerHTML = content;
			$('span', '#db-currentpath').html(path);
			if (uplevel) {
				// console.log('PREV LEVEL');
				$('#db-' + GUI.currentDBpos[GUI.currentDBpos[10]]).addClass('active');
				customScroll('db', GUI.currentDBpos[GUI.currentDBpos[10]], 0);
			} else {
				// console.log('NEXT LEVEL');
				customScroll('db', 0, 0);
			}
			// DEBUG
			// console.log('GUI.currentDBpos = ', GUI.currentDBpos);
			// console.log('level = ', GUI.currentDBpos[10]);
			// console.log('highlighted entry = ', GUI.currentDBpos[GUI.currentDBpos[10]]);
		}
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
		querytype = options.querytype || '';
		
	// DEBUG
	// console.log('OPTIONS: inputArr = ' + inputArr + ', respType = ' + respType + ', i = ' + i + ', inpath = ' + inpath +', querytype = ' + querytype);
	
	switch (respType) {
		case 'playlist':		
			// code placeholder
		break;
		
		case 'db':
		// normal MPD browsing by file
			if (inpath === '' && inputArr.file !== undefined) {
				inpath = parsePath(inputArr.file)
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
				// playlists
					if (inpath !== 'Webradio') {
					// ???
						content += inputArr.file;
						content += '"><i class="fa fa-bars db-action" title="Actions" data-toggle="context" data-target="#context-menu"></i><i class="fa fa-music db-icon"></i><span class="sn">';
						content += inputArr.file.replace(inpath + '/', '') + ' <span>' + timeConvert(inputArr.Time) + '</span></span>';
						content += '<span class="bl">';
						content += ' path \: ';
						content += inpath;
					} else {
					// webradios
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
    // check MPD status
    refreshState(GUI.state);
    // check song update
    // console.log('A = ', json['currentsong']); console.log('B = ', GUI.currentsong);
    if (GUI.currentsong != json['currentsong']) {
        countdownRestart(0);
        if ($('#panel-dx').hasClass('active')) {
            var current = parseInt(json['song']);
            customScroll('pl', current);
        }
    }
	
    // common actions
	var volume = json['volume'];
	$('#volume').val((volume == '-1') ? 100 : volume).trigger('change');
	// console.log('currentartist = ', json['currentartist']);
	var radioname = json['radioname'];
	var currentartist = json['currentartist'];
	var currentsong = json['currentsong'];
	var currentalbum = json['currentalbum'];
	if (radioname === null || radioname === undefined || radioname === '') {
		$('#currentartist').html((currentartist === null || currentartist === undefined || currentartist === '') ? '<span class="notag">[no artist]</span>' : currentartist);
		$('#currentsong').html((currentsong === null || currentsong === undefined || currentsong === '') ? '<span class="notag">[no title]</span>' : currentsong);
		$('#currentalbum').html((currentalbum === null || currentalbum === undefined || currentalbum === '') ? '<span class="notag">[no album]</span>' : currentalbum);
	} else {
		$('#currentartist').html((currentartist === null || currentartist === undefined || currentartist === '') ? radioname : currentartist);
		$('#currentsong').html((currentsong === null || currentsong === undefined || currentsong === '') ? radioname : currentsong);
		$('#currentalbum').html('<span class="notag">streaming</span>');
	}
	if (json['repeat'] == 1) {
		$('#repeat').addClass('btn-primary');
	} else {
		$('#repeat').removeClass('btn-primary');
	}
	if (json['random'] == 1) {
		$('#random').addClass('btn-primary');
	} else {
		$('#random').removeClass('btn-primary');
	}
	if (json['consume'] == 1) {
		$('#consume').addClass('btn-primary');
	} else {
		$('#consume').removeClass('btn-primary');
	}
	if (json['single'] == 1) {
		$('#single').addClass('btn-primary');
	} else {
		$('#single').removeClass('btn-primary');
	}
	
    GUI.halt = 0;
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
        $('#elapsed').html('00:00');
        $('#total').html('');
        $('#time').val(0).trigger('change');
        $('#format-bitrate').html('&nbsp;');
        $('li', '#playlist-entries').removeClass('active');
    }
    if ( state != 'stop' ) {
        $('#elapsed').html(timeConvert(GUI.json['elapsed']));
        $('#total').html(timeConvert(GUI.json['time']));
        //$('#time').val(json['song_percent']).trigger('change');
        var fileinfo = (GUI.json['audio_channels'] && GUI.json['audio_sample_depth'] && GUI.json['audio_sample_rate']) ? (GUI.json['audio_channels'] + ', ' + GUI.json['audio_sample_depth'] + ' bit, ' + GUI.json['audio_sample_rate'] +' kHz, '+GUI.json['bitrate']+' kbps') : '&nbsp;';
        $('#format-bitrate').html(fileinfo);
        $('li', '#playlist-entries').removeClass('active');
        var current = parseInt(GUI.json['song']);
        $('li', '#playlist-entries').eq(current).addClass('active'); // check efficiency
        current = $('.playlist').children[current];
        $(current).addClass('active');
    }
	if( GUI.json['song'] && GUI.json['playlistlength'] ){ 
		$('#playlist-position').html('Playlist position ' + (parseInt(GUI.json['song']) + 1) +'/'+GUI.json['playlistlength']);
	} else {
		$('#playlist-position').html( $('<a>',{
			text: 'Add the vibe!', 
			title: 'Load some tracks on your Library',
			href: '#panel-sx',
			'data-toggle': 'tab'
		}) ); // TODO: highlight the "Library" tab
	}
	// show UpdateDB icon
	// console.log('dbupdate = ', GUI.json['updating_db']);
	if (typeof GUI.json['updating_db'] != 'undefined') {
		$('.open-panel-sx').html('<i class="fa fa-refresh fa-spin"></i> Updating');
	} else {
		$('.open-panel-sx').html('<i class="fa fa-music sx"></i> Library');
	}
	
	// Library main screen counters
	getDB({
		plugin: 'Dirble',
		querytype: 'amountStation'
	});
}

// update countdown
function refreshTimer(startFrom, stopTo, state){
    // console.log('startFrom = ', startFrom);
    // console.log('state = ', state);
    var display = $('#countdown-display').countdown('destroy');
    display.countdown({ since: (state != 'stop'? -startFrom:0), compact: true, format: 'MS' });
    if( state != 'play' ){
      // console.log('startFrom = ', startFrom);
      display.countdown('pause');
    }
}

// update playback progress knob
function refreshKnob(json){
    window.clearInterval(GUI.currentKnob)
    var initTime = parseInt(json['song_percent'])*10;
    var delta = parseInt(json['time']);
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
function timeConvert2( ss ) {
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
    GUI.halt = 1;
    // console.log('GUI.halt (setvol)= ', GUI.halt);
    $('#volumemute').removeClass('btn-primary');
    sendCmd('setvol ' + val);
}

// custom scrolling
function customScroll(list, destination, speed) {
    if (typeof(speed) === 'undefined') speed = 500;
    var entryheight = parseInt(1 + $('#' + list + '-1').height());
    var centerheight = parseInt($(window).height()/2);
    var scrolltop = $(window).scrollTop();
    if (list === 'db') {
        var scrollcalc = parseInt((destination)*entryheight - centerheight);
        var scrolloffset = scrollcalc;
    } else if (list === 'pl') {
        //var scrolloffset = parseInt((destination + 2)*entryheight - centerheight);
        var scrollcalc = parseInt((destination + 2)*entryheight - centerheight);
        var scrolloffset = Math.abs(scrollcalc - scrolltop);
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
	console.log((notify['hide'] === undefined) ? 'undefined' : notify['hide']);
	$.pnotify({
		title: notify['title'],
		text: notify['text'],
		icon: (notify['icon'] == undefined) ? 'fa fa-check' : notify['icon'],
		opacity: (notify['opacity'] == undefined) ? .9 : notify['opacity'],
		hide: (notify['hide'] == undefined)
	});
}

// sorting commands
function sortOrder(id) {
	var pos = $('#' + id).index();
	id = parseInt(id.replace('pl-', ''));
	console.log('id = ' + id + ', pos = ', pos);
	sendCmd('moveid ' + id + ' ' + pos);
}

// loading spinner display/hide
function loadingSpinner(section, hide) {
	if (hide === 'hide') {
		if (section === 'db' && $('#panel-sx').hasClass('active')) {
			$('#spinner').addClass('hide');
		}
		if (section === 'pl' && $('#panel-dx').hasClass('active')) {
			$('#spinner').addClass('hide');
		}
	} else {
		if (section === 'db' && $('#panel-sx').hasClass('active')) {
			$('#spinner').removeClass('hide');
		}
		if (section === 'pl' && $('#panel-dx').hasClass('active')) {
			$('#spinner').removeClass('hide');
		}
	}
}



// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      // Generate a reusable function that will serve as a template generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();