<div id="poweroff-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="poweroff-modal-label" aria-hidden="true">
	<form class="form-horizontal" action="/settings/" method="post">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="poweroff-modal-label">Turn off the player</h3>
				</div>
				<div class="modal-body txtmid">
					<button id="syscmd-poweroff" name="syscmd" value="poweroff" class="btn btn-primary btn-lg btn-block"><i class="fa fa-power-off sx"></i> Power off</button>
					&nbsp;
					<button id="syscmd-reboot" name="syscmd" value="reboot" class="btn btn-primary btn-lg btn-block"><i class="fa fa-refresh sx"></i> Reboot</button>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default btn-lg" data-dismiss="modal" aria-hidden="true">Cancel</button>
				</div>
			</form>
		</div>
	</div>
</div>
<!-- loader -->
<div id="loader"><div id="loaderbg"></div><div id="loadercontent"><i class="fa fa-refresh fa-spin"></i>connecting...</div></div>
<div id="spinner" class="hide">
	<div id="spinner-inner">
		<div class="rect1"></div>
		<div class="rect2"></div>
		<div class="rect3"></div>
		<div class="rect4"></div>
		<div class="rect5"></div>
	</div>
</div>
<script src="<?=$this->asset('/js/vendor/jquery-2.0.3.min.js')?>"></script>
<!-- dev only -->
<!--
<script src="assets/js/vendor/less-1.6.0.min.js"></script>
    <script type="text/javascript" charset="utf-8">
    less.env = "development";
    less.watch();
    </script>
-->
<!-- /dev only -->
<script src="<?=$this->asset('/js/vendor/pushstream.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/jquery-ui-1.10.3.custom.min.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/bootstrap.min.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/modernizr.custom.js')?>"></script>
<script src="<?=$this->asset('/js/notify.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/jquery.countdown.min.js')?>"></script>
<script src="<?=$this->asset('/js/player_lib.js')?>"></script>
<?php if ($this->section == 'index'): ?>
<script src="<?=$this->asset('/js/vendor/jquery.knob.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/bootstrap-contextmenu.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/jquery.scrollTo.min.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/Sortable.min.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/fastclick.js')?>"></script>
<script src="<?=$this->asset('/js/scripts-playback.js')?>"></script>
<?php else: ?>
<script src="<?=$this->asset('/js/vendor/bootstrap-select.min.js')?>"></script>
<script src="<?=$this->asset('/js/vendor/parsley.min.js')?>"></script>
<script src="<?=$this->asset('/js/scripts-configuration.js')?>"></script>
<?php endif ?>
<?php if ($this->section == 'settings'): ?>
<script src="<?=$this->asset('/js/vendor/bootstrap-fileupload.min.js')?>"></script>
<?php endif ?>
<script src="<?=$this->asset('/js/vendor/jquery.pnotify.min.js')?>"></script>
<?php
// write backend response on UI Notify popup
// if (isset($_SESSION['notify']) && $_SESSION['notify'] != '') {
// sleep(1);
// ui_notify($_SESSION['notify']);
// session_start();
// $_SESSION['notify'] = '';
// session_write_close();
// }
?>