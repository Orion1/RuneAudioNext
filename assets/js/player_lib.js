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

// send a Library or Queue related command
function sendPLCmd(inputcmd) {
	/*
	$.ajax({
		url: '/db/?cmd='+inputcmd,
		success: function(data){
			GUI.halt = 1;
			// console.log('GUI.halt (sendPLcmd)= ', GUI.halt);
		},
	});
	*/
	var request = new XMLHttpRequest;
	request.open('GET', '/db/?cmd='+inputcmd, true);
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
	$.ajax({
		url: '/db/?cmd=playlist',
		success: function(data){
			// console.log('DATA: ', data);
			if ( data.length > 4) {
				$('#playlist-warning').addClass('hide');
				$('#playlist-entries').removeClass('hide');
				console.time('getPlaylistPlain timer');
				getPlaylistPlain(data, json);
				console.timeEnd('getPlaylistPlain timer');
				// console.time('getPlaylist timer');
				// getPlaylist(data, json);
				// console.timeEnd('getPlaylist timer');
				
				var current = parseInt(json['song']);
				if (GUI.halt != 1 && $('#panel-dx').hasClass('active')) {
					customScroll('pl', current, 200); // highlight current song in playlist
				}
			} else {
				$('#playlist-warning').removeClass('hide');
				$('#playlist-entries').addClass('hide');
			}
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
			content = '<li id="pl-' + (i + 1) + '" class="active clearfix">';
		} else {
			content = '<li id="pl-' + (i + 1) + '" class="clearfix">';
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
	var content = '', time = '', artist = '', album = '', title = '', name='', str = '', filename = '', path = '', id = 0, bottomline = '', totaltime = '';
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
			++id;
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
				bottomline = 'URL: ' + path;
				totaltime = '';
			} else {
				totaltime = '<em class="songtime">' + timeConvert2(time) + '</em>';
			}
			content += '<li id="pl-'+id+'" class="'+ (state != "stop" && id == current ? 'active' : '') + ' clearfix"><a class="pl-action" href="#notarget" title="Remove song from playlist"><i class="fa fa-times-circle"></i></a><div class="pl-entry">' + title + totaltime + '<span>' + bottomline + '</span></div></li>';
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
		content += '<li class="clearfix"><a class="pl-actions" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-playlist"><i class="fa fa-bars"></i></a><div class="pl-entry">Nome playlist<span>293 entries</span></div></li>';
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

function parseResponse(inputArr,respType,i,inpath) {		
	switch (respType) {
		case 'playlist':		
			// code placeholder
		break;
		
		case 'db':
			// console.log('inpath = ',inpath);
			// console.log('inputArr[i].file= :',inputArr[i].file);
			if (inpath === '' && inputArr[i].file !== undefined) {
				inpath = parsePath(inputArr[i].file)
			}
			if (inputArr[i].file !== undefined || inpath === 'Webradio') {
				//debug
				// console.log('inputArr[i].file: ', inputArr[i].file);
				// console.log('inputArr[i].Title: ', inputArr[i].Title);
				// console.log('inputArr[i].Artist: ', inputArr[i].Artist);
				// console.log('inputArr[i].Album: ', inputArr[i].Album);
				if (inputArr[i].Title !== undefined) {
					content = '<li id="db-' + (i + 1) + '" class="clearfix" data-path="';
					content += inputArr[i].file;
					content += '"><i class="fa fa-music db-icon db-song db-browse"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-file"><i class="fa fa-bars"></i></a><div class="db-entry db-song db-browse">';
					content += inputArr[i].Title + ' <em class="songtime">' + timeConvert(inputArr[i].Time) + '</em>';
					content += ' <span>';
					content +=  inputArr[i].Artist;
					content += ' - ';
					content +=  inputArr[i].Album;
					content += '</span></div></li>';
				} else {
					content = '<li id="db-' + (i + 1) + '" class="clearfix" data-path="';
					content += inputArr[i].file;
					if (inpath !== 'Webradio') {
						content += '"><i class="fa fa-music db-icon db-song db-browse"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu"><i class="fa fa-bars"></i></a><div class="db-entry db-song db-browse">';
						content += inputArr[i].file.replace(inpath + '/', '') + ' <em class="songtime">' + timeConvert(inputArr[i].Time) + '</em>';
						content += ' <span>';
						content += ' path \: ';
						content += inpath;
						content += '</span></div></li>';
					} else {
					// case Webradio
						content += '"><i class="fa fa-microphone db-icon db-radio db-browse"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-webradio"><i class="fa fa-bars"></i></a><div class="db-entry db-song db-browse">';
						content += inputArr[i].playlist.replace(inpath + '/', '').replace('.' + inputArr[i].fileext , '');
						content += ' <span>';
						content += 'webradio';
						content += '</span></div></li>';
					}
				}
			} else {
				// console.log('inputArr[i].directory: ', inputArr[i].directory);
				content = '<li id="db-' + (i + 1) + '" class="clearfix" data-path="';
				content += inputArr[i].directory;
				if (inpath !== '') {
					content += '"><i class="fa fa-folder-open db-icon db-folder db-browse"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu"><i class="fa fa-bars"></i></a><div class="db-entry db-folder db-browse">';
				} else {
					content += '"><i class="fa fa-hdd-o db-icon db-folder db-browse icon-root"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-root"><i class="fa fa-bars"></i></a><div class="db-entry db-folder db-browse">';
				}
				content += inputArr[i].directory.replace(inpath + '/', '');
				content += '</div></li>';
			}
		break;
		
		case 'webradio':
			content = '<li id="db-' + (i + 1) + '" class="clearfix" data-path="';
			content += inputArr[i].streamurl;
			content += '"><i class="fa fa-microphone db-icon db-radio db-browse"></i><a class="db-action" href="#notarget" title="Actions" data-toggle="context" data-target="#context-menu-webradio"><i class="fa fa-bars"></i></a><div class="db-entry db-song db-browse">';
			content += inputArr[i].name + ' <em class="songtime">' + inputArr[i].bitrate + '</em>';
			content += ' <span>';
			content += inputArr[i].website;
			content += '</span></div></li>';
		break;
		
	}
	return content;
} // end parseResponse()

function getDB(options){
	// DEFAULTS
	var cmd = options.cmd || 'filepath';
	var path = options.path || '';
	var browsemode = options.browsemode || '';
	var uplevel = options.uplevel || '';
	var plugin = options.plugin || '';
	console.log('OPTIONS: cmd = ' + cmd + ', path = ' + path + ', browsemode = ' + browsemode + ', uplevel = ' + uplevel + ', plugin = ' + plugin);
	
	if (plugin !== '') {
		if (plugin === 'Dirble') {
			// $.post('/db/?cmd=dirble', { 'args': args, 'querytype': querytype }, function(data){
			$.post('/db/?cmd=dirble', { 'args': 1, 'querytype': 'id' }, function(data){
				populateDB(data, path);
			}, 'json');
		}
	} else {
		if (cmd === 'search') {
			var keyword = $('#db-search-keyword').val();
			$.post('/db/?querytype=' + browsemode + '&cmd=search', { 'query': keyword }, function(data) {
				populateDB(data, path, uplevel, keyword);
			}, 'json');
		} else if (cmd === 'filepath') {	
			$.post('/db/?cmd=filepath', { 'path': path }, function(data) {
				populateDB(data, path, uplevel);
			}, 'json');
		} else {
		/* cmd === 'update', 'addplay', 'addreplaceplay', 'update' */
			$.post('/db/?cmd='+cmd, { 'path': path }, function(path) {
				// console.log('add= ', path);
			}, 'json');
		}
	}
}

function Dirble(cmd, path, browsemode, uplevel){
	if (path === 'Dirble') {
		$.post('/db/?cmd=dirble', { 'args': args, 'querytype': querytype }, function(data){
			populateDB(data, path);
		}, 'json');
	} else {
		// something
	}
}
 
function populateDB(data, path, uplevel, keyword){
	// console.log('PATH =', path);
	// console.log('KEYWORD =', keyword);
	if (path === '' && keyword === undefined) {
		$('#database-entries').addClass('hide');
		$('#db-level-up').addClass('hide');
		$('#home-blocks').removeClass('hide');
		$('span', '#db-currentpath').html('');
		return;
	} else {
		$('#database-entries').removeClass('hide');
		$('#db-level-up').removeClass('hide');
		$('#home-blocks').addClass('hide');
		if (path) GUI.currentpath = path;
		// console.log(' new GUI.currentpath = ', GUI.currentpath);
		document.getElementById('database-entries').innerHTML = '';
		if (keyword) {
			var results = (data.length) ? data.length : '0';
			var s = (data.length == 1) ? '' : 's'
			$('#db-level-up').addClass('hide');
			$('#db-search-results').removeClass('hide').html('<i class="fa fa-times sx"></i> <span class="visible-xs">back</span><span class="hidden-xs">' + results + ' result' + s + ' for "<span class="keyword">' + keyword + '</span>"</span>');
		}
		var content = '';
		var i = 0;
		if (path === 'Dirble') {
			for (i = 0; i < data.length; i++){
				content += parseResponse(data, 'webradio', i);
			}
		} else {
			for (i = 0; i < data.length; i++){
				content += parseResponse(data, 'db', i, path);
			}
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
		// console.log('livello = ', GUI.currentDBpos[10]);
		// console.log('elemento da illuminare = ', GUI.currentDBpos[GUI.currentDBpos[10]]);
	}
}

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
		$('#cover-art').css('background-image','url(assets/img/cover-default.png');
		if (radioname === null || radioname === undefined || radioname === '') {
			var covercachenum = Math.floor(Math.random()*1001);
			$.ajax({
				url: '/coverart/',
				data: { v: covercachenum },
				success: function(data){
					// if ($.parseJSON(data) != 'NOCOVER') {
						$('#cover-art').css('background-image','url(/coverart/?v=' + covercachenum + ')');
						// $('#cover-art').css('background-image','url(' + data + ')');
					// }
				}
			});
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
	$('#playlist-position').html('Playlist position ' + (parseInt(GUI.json['song']) + 1) +'/'+GUI.json['playlistlength']);
	// show UpdateDB icon
	// console.log('dbupdate = ', GUI.json['updating_db']);
	if (typeof GUI.json['updating_db'] != 'undefined') {
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