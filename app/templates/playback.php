<div class="tab-content">
    <!-- -------------------- PLAYBACK PANEL -------------------- -->
    <div id="playback" class="tab-pane active">
        <div class="container txtmid">
            <span id="currentartist"></span>
            <span id="currentsong"></span>
            <span id="currentalbum"></span>
            <span id="playlist-position">&nbsp;</span>
            <span id="format-bitrate"></span>
            <div class="knobs row">
                <div class="col-sm-<?=$this->colspan?>">
                    <div id="timeknob">
                        <div id="countdown" ms-user-select="none">
                            <input id="time" class="playbackknob" value="0" data-width="100%" data-bgColor="#34495E" data-fgcolor="#0095D8" data-thickness="0.30" data-min="0" data-max="1000" data-displayInput="false">
                        </div>
                        <span id="countdown-display"></span>
                        <span id="total"></span>
                    </div>
                    <div class="btn-group">
                        <button type="button" id="repeat" class="btn btn-default btn-lg btn-cmd btn-toggle" title="Repeat" data-cmd="repeat"><i class="fa fa-repeat"></i></button>
                        <button type="button" id="random" class="btn btn-default btn-lg btn-cmd btn-toggle" title="Random" data-cmd="random"><i class="fa fa-random"></i></button>
                        <button type="button" id="single" class="btn btn-default btn-lg btn-cmd btn-toggle" title="Single" data-cmd="single"><i class="fa fa-refresh"></i></button>
                        <button type="button" id="consume" class="btn btn-default btn-lg btn-cmd btn-toggle" title="Consume Mode" data-cmd="consume"><i class="fa fa-trash-o"></i></button>
                    </div>
                </div>
                <?php if ($this->coverart == 1): ?>
				<div class="col-sm-<?=$this->colspan?> coverart">
					<img id="cover-art" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
				</div>
				<?php endif ?>
                <div class="col-sm-<?=$this->colspan?>">
                    <div id="volumeknob">
                        <input id="volume" class="volumeknob" value="100" data-width="100%" data-bgColor="#000" data-fgColor="#0095D8" data-thickness=".25" data-skin="tron" data-cursor="true" data-angleArc="250" data-angleOffset="-125">
                    </div>
                    <div class="btn-group">
                        <button type="button" id="volumedn" class="btn btn-default btn-lg btn-cmd btn-volume" title="Volume down" data-cmd="volumedn"><i class="fa fa-volume-down"></i></button>
                        <button type="button" id="volumemute" class="btn btn-default btn-lg btn-cmd btn-volume" title="Volume mute/unmute" data-cmd="volumemute"><i class="fa fa-volume-off"></i> <i class="fa fa-exclamation"></i></button>
                        <button type="button" id="volumeup" class="btn btn-default btn-lg btn-cmd btn-volume" title="Volume up" data-cmd="volumeup"><i class="fa fa-volume-up"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- -------------------- DATABASE PANEL -------------------- -->
    <div id="panel-sx" class="tab-pane">
        <div class="btnlist btnlist-top">
            <form id="db-search" class="form-inline" action="javascript:getDB('search', '', GUI.browsemode);">
                <input id="db-search-keyword" class="form-control" type="text" value="" placeholder="search in DB..."><button class="btn btn-default" type="submit"><i class="fa fa-search"></i></button>
            </form>
            <button id="level-up" class="btn hide" title="Go back one level"><i class="fa fa-arrow-left sx"></i> back</button>
        </div>
        <div id="database">
            <ul id="database-entries" class="database">
                <!--<li class="clearfix"><div class="db-entry">Unknown Song <span>Unknown Artist - Unknown Album</span></div></li>-->
            </ul>
            <div id="home-blocks" class="row">
                <div class="col-sm-12">
                    <h1 class="txtmid">Browse your library</h1>
                </div>
                <div class="col-sm-6">
                    <div id="home-nas" class="home-block" data-path="NAS/Musica">
                        <i class="fa fa-star"></i>
                        <h3>Musica</h3>
                        bookmark
                        <!--<a href="#" class="home-action"><i class="fa fa-gear"></i></a>-->
                    </div>
                </div>
                <div class="col-sm-6">
                    <div id="home-nas" class="home-block" data-path="Cristian">
                        <i class="fa fa-star"></i>
                        <h3>Cristian</h3>
                        bookmark
                    </div>
                </div>
                <div class="col-sm-6">
                    <div id="home-nas" class="home-block" data-path="NAS">
                        <i class="fa fa-sitemap"></i>
                        <h3>Network mounts (2)</h3>
                        2 items available
                    </div>
                </div>
                <div class="col-sm-6">
                    <div id="home-usb" class="home-block" data-path="USB">
                        <i class="fa fa-hdd-o"></i>
                        <h3>USB storage (1)</h3>
                        1 item available
                    </div>
                </div>
                <div class="col-sm-6">
                    <div id="home-webradio" class="home-block" data-path="Webradio">
                        <i class="fa fa-bullseye"></i>
                        <h3>Webradios (0)</h3>
                        click to add some
                    </div>
                </div>
            </div>
        </div>
        <div class="btnlist btnlist-bottom">
            <div id="db-controls">
                <button id="db-firstPage" class="btn btn-default" title="Scroll to the top"><i class="fa fa-angle-double-up"></i></button>
                <button id="db-prevPage" class="btn btn-default" title="Scroll one page up"><i class="fa fa-angle-up"></i></button>
                <button id="db-nextPage" class="btn btn-default" title="Scroll one page down"><i class="fa fa-angle-down"></i></button>
                <button id="db-lastPage" class="btn btn-default" title="Scroll to the bottom"><i class="fa fa-angle-double-down"></i></button>
            </div>
            <div id="db-currentpath">
                <i class="fa fa-folder-open"></i> <span>Home</span>
            </div>
        </div>
    </div>
    <!-- -------------------- PLAYLIST PANEL -------------------- -->
    <div id="panel-dx" class="tab-pane">
        <div class="btnlist btnlist-top">
            <form id="pl-search" class="form-inline" method="post" onSubmit="return false;" role="form">
                <input id="pl-filter" class="form-control ttip" type="text" value="" placeholder="search in playlist..." data-placement="bottom" data-toggle="tooltip" data-original-title="Type here to search on the fly"><button class="btn btn-default"><i class="fa fa-search"></i></button>
            </form>
            <div id="pl-filter-results"></div>
        </div>
        <div id="playlist">
            <ul id="playlist-entries" class="playlist">
                <!--<li>Unknown Song <span>Unknown Artist - Unknown Album</span></li>-->
            </ul>
            <ul id="pl-editor" class="playlist hide">
                <!--<li>Unknown Song <span>Unknown Artist - Unknown Album</span></li>-->
            </ul>
            <ul id="pl-detail" class="playlist hide">
                <!--<li>Unknown Song <span>Unknown Artist - Unknown Album</span></li>-->
            </ul>
            <div id="playlist-warning" class="hide">
                <div class="col-sm-12">
                    <h1 class="txtmid">Playing queue</h1>
                </div>
                <div class="col-sm-6 col-sm-offset-3">
                    <div class="empty-block">
                        <i class="fa fa-exclamation"></i>
                        <h3>Empty queue</h3>
                        <p>Add some entries from your library</p>
                        <p><a id="open-library" href="#panel-sx" class="btn btn-primary btn-lg" data-toggle="tab">Browse Library</a></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnlist btnlist-bottom">
            <div id="pl-controls">
                <button id="pl-firstPage" class="btn btn-default" title="Scroll to the top"><i class="fa fa-angle-double-up"></i></button>
                <button id="pl-prevPage" class="btn btn-default" title="Scroll one page up"><i class="fa fa-angle-up"></i></button>
                <button id="pl-nextPage" class="btn btn-default" title="Scroll one page down"><i class="fa fa-angle-down"></i></button>
                <button id="pl-lastPage" class="btn btn-default" title="Scroll to the bottom"><i class="fa fa-angle-double-down"></i></button>
            </div>
            <div id="pl-manage">
                <button id="pl-prevPage" class="btn btn-default btn-cmd" data-cmd='load "1000 voci"' title="Manage playlists"><i class="fa fa-file-text-o"></i></button>
                <button id="pl-nextPage" class="btn btn-default" title="Save current queue as playlist" data-toggle="modal" data-target="#modal-pl-save"><i class="fa fa-save"></i></button>
                <button id="pl-firstPage" class="btn btn-default btn-cmd" data-cmd="clear" title="Clear the playing queue"><i class="fa fa-trash-o"></i></button>
            </div>
        </div>
    </div>
</div>

<div id="context-menus">
    <div id="context-menu" class="context-menu">
        <ul class="dropdown-menu" role="menu">
            <li><a href="#notarget" data-cmd="add"><i class="fa fa-plus-circle sx"></i> Add</a></li>
            <li><a href="#notarget" data-cmd="addplay"><i class="fa fa-play sx"></i> Add and play</a></li>
            <li><a href="#notarget" data-cmd="addreplaceplay"><i class="fa fa-share-square-o sx"></i> Add, replace and play</a></li>
            <li><a href="#notarget" data-cmd="update"><i class="fa fa-refresh sx"></i> Update this folder</a></li>
        </ul>
    </div>
    <div id="context-menu-root" class="context-menu">
        <ul class="dropdown-menu" role="menu">
            <li><a href="#notarget" data-cmd="update"><i class="fa fa-refresh sx"></i> Update this folder</a></li>
        </ul>
    </div>
</div>

<div id="modal-pl-save" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-pl-save-label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title" id="modal-pl-save-label">Save current queue as playlist</h3>
            </div>
            <div class="modal-body">
                <label for="pl-save-name">Give a name to this playlist</label>
                <input id="pl-save-name" class="form-control" type="text" placeholder="Enter playlist name">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-lg" data-dismiss="modal">Close</button>
                <button type="button" id="modal-pl-save-btn" class="btn btn-primary btn-lg" data-dismiss="modal">Save playlist</button>
            </div>
        </div>
    </div>
</div>