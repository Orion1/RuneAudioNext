<?php
/*
 * Copyright (C) 2013-2014 RuneAudio Team
 * http://www.runeaudio.com
 *
 * RuneUI
 * copyright (C) 2013-2014 - Andrea Coiutti (aka ACX) & Simone De Gregori (aka Orion)
 *
 * RuneOS
 * copyright (C) 2013-2014 - Carmelo San Giovanni (aka Um3ggh1U) & Simone De Gregori (aka Orion)
 *
 * RuneAudio website and logo
 * copyright (C) 2013-2014 - ACX webdesign (Andrea Coiutti)
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
 *  file: app/config/config.php
 *  version: 1.3
 *
 */
 
// Environment vars
define('APP',$_SERVER['HOME'].'/app/');
define('DAEMONIP', '127.0.0.1'); // default = 'localhost'
// extend include path for Vendor Libs
$libs = APP.'/libs/vendor';
set_include_path(get_include_path() . PATH_SEPARATOR . $libs);
// RuneAudio Library include
include(APP.'libs/runeaudio.php');
// DEV debug parameters
// ini_set('display_errors',1);
// define('ERRORLEVEL', '-1'); // default = 'E_ALL ^ E_NOTICE'
//__production
ini_set('display_errors',0);
define('ERRORLEVEL', 'E_ERROR'); // default = 'E_ALL ^ E_NOTICE'
// datastore SQLite
$db = 'sqlite:'.$_SERVER['HOME'].'/db/player.db';
// debug
runelog('--- [connection.php] >>> OPEN MPD SOCKET --- [connection.php] ---','');
// connect to MPD daemon
$mpd = openMpdSocket('/run/mpd.sock') ;
?>