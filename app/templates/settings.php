<div class="container">
	<h1>Settings</h1>
	<form class="form-horizontal" method="post" role="form">
		<fieldset>
			<legend>Environment</legend>
            <div class="form-group" id="environment">
				<label class="control-label col-sm-2" for="hostname">Player hostname</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="text" id="hostname" name="hostname" value="<?=$_SESSION['hostname']?>" placeholder="runeaudio" autocomplete="off">
					<span class="help-block">set <i>player HOSTNAME</i></span>
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2" for="ntpserver">NTP server</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="text" id="ntpserver" name="ntpserver" value="<?=$_SESSION['ntpserver']?>" placeholder="ntp.inrim.it" autocomplete="off">
					<span class="help-block">set your reference time sync server <i>(NTP server)</i></span>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button class="btn btn-primary btn-lg" value="save" name="save" type="submit">Apply settings</button>
				</div>
			</div>
		</fieldset>
	</form>
	<form class="form-horizontal" method="post" role="form">
		<fieldset>
			<legend>Sound quality tweaks</legend>
			<p>
				These profiles include a set of performance tweaks that act on some system kernel parameters.<br>
				It does not have anything to do with DSPs or other sound effects: the output is kept untouched (bit perfect).<br>
				It happens that these parameters introduce an audible impact on the overall sound quality, acting on kernel latency parameters (and probably on the amount of overall<a href="http://www.thewelltemperedcomputer.com/KB/BitPerfectJitter.htm" title="Bit Perfect Jitter by Vincent Kars" target="_blank"> jitter</a>).<br>
				Sound results may vary depending on where music is listened, so choose according to your personal taste.<br>
				(If you can't hear any tangible differences... nevermind, just stick to the default settings.)
			</p>
			<div class="form-group">
				<label class="control-label col-sm-2" for="orionprofile">Kernel profile</label>
				<div class="col-sm-10">
					<select class="selectpicker" name="orionprofile" data-style="btn-default btn-lg">
						<option value="default" <?php if($_SESSION['orionprofile'] == 'default'): ?> selected <?php endif ?>>ArchLinux default</option>
						<option value="RuneAudio" <?php if($_SESSION['orionprofile'] == 'RuneAudio'): ?> selected <?php endif ?>>RuneAudio</option>
						<option value="ACX" <?php if($_SESSION['orionprofile'] == 'ACX'): ?> selected <?php endif ?>>ACX</option>
						<option value="Orion" <?php if($_SESSION['orionprofile'] == 'Orion'): ?> selected <?php endif ?>>Orion</option>
						<option value="OrionV2" <?php if($_SESSION['orionprofile'] == 'OrionV2'): ?> selected <?php endif ?>>OrionV2</option>
						<option value="RaspberryPi+i2s" <?php if($_SESSION['orionprofile'] == 'RaspberryPi+i2s'): ?> selected <?php endif ?>>RaspberryPi+i2s</option>
						<option value="Um3ggh1U" <?php if($_SESSION['orionprofile'] == 'Um3ggh1U'): ?> selected <?php endif ?>>Um3ggh1U</option>
					</select>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button class="btn btn-primary btn-lg" value="save" name="save" type="submit">Apply settings</button>
				</div>
			</div>
		</fieldset>
	</form>
	<form class="form-horizontal" action="" method="post" role="form" data-validate="parsley">
        <fieldset>
            <legend>Features management</legend>
			<p>
				Enable/disable optional modules that best suit your needs. Disabling unusued features will free system resources and might improve the overall performance.
			</p>
			<div class="form-group">
				<label for="airplay" class="control-label col-sm-2">AirPlay</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[airplay]" type="checkbox" value="1"<?php if($_SESSION['airplay'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="udevil" class="control-label col-sm-2">USB Automount</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[udevil]" type="checkbox" value="1"<?php if($_SESSION['udevil'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="coverart" class="control-label col-sm-2">Display album cover</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[coverart]" type="checkbox" value="1"<?php if($_SESSION['coverart'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="scrobbling_lastfm" class="control-label col-sm-2">Last.FM scrobbling</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[scrobbling_lastfm]" type="checkbox" value="1"<?php if($_SESSION['scrobbling_lastfm'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
            <div class="<?php if($_SESSION['scrobbling_lastfm'] != 1): ?> hide <?php endif ?>" id="lastfmAuth">
				<div class="form-group">
					<label class="control-label col-sm-2" for="lastfm-usr">Username</label>
					<div class="col-sm-10">
						<input class="input-lg" type="text" id="lastfm_user" name="features[lastfm][user]" value="<?=$this->lastfm['user'] ?>" data-trigger="change" placeholder="user">
						<span class="help-block">Insert your Last.FM <i>username</i></span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-2" for="lastfm-pasw">Password</label>
					<div class="col-sm-10">
						<input class="input-lg" type="password" id="lastfm_pass" name="features[lastfm][pass]" value="<?=$this->lastfm['pass'] ?>" placeholder="pass" autocomplete="off">
						<span class="help-block">Insert your Last.FM <i>password</i> (case sensitive)</span>
					</div>
				</div>
            </div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button class="btn btn-primary btn-lg" value="1" name="features[submit]" type="submit">apply settings</button>
				</div>
			</div>
		</fieldset>
	</form>
	<form class="form-horizontal" method="post" role="form">
		<fieldset>
			<legend>Compatibility fixes</legend>
			<p>For people suffering problems with some receivers and DACs.</p>
			<div class="form-group">
				<label for="cmediafix" class="control-label col-sm-2">CMedia fix</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="cmediafix" type="checkbox" value="1"<?php if($_SESSION['cmediafix'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
					<span class="help-block">For those who have a CM6631 receiver and experiment issues (noise, crackling) between tracks with different sample rates and/or bit depth.<br> 
					A "dirty" fix that should avoid the problem, do NOT use if everything works normally.</span>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button class="btn btn-primary btn-lg" value="apply" name="apply" type="submit">Apply fixes</button>
				</div>
			</div>
		</fieldset>
	</form>
	<form class="form-horizontal" method="post" role="form">
		<fieldset>
			<legend>System commands</legend>
			<p>Just some handy system commands, without the hassle of logging into SSH.</p>
			<div class="form-group">
				<label class="control-label col-sm-2">System reboot</label>
				<div class="col-sm-10">
					<input class="btn btn-default" type="submit" name="syscmd" value="reboot" id="syscmd-reboot">
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2">System poweroff</label>
				<div class="col-sm-10">
					<input class="btn btn-default" type="submit" name="syscmd" value="poweroff" id="syscmd-poweroff">
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2">Restart MPD service</label>
				<div class="col-sm-10">
					<input class="btn btn-default" type="submit" name="syscmd" value="mpdrestart" id="syscmd-mpdrestart">
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2">Update MPD database</label>
				<div class="col-sm-10">
					<input class="btn btn-default" type="submit" name="syscmd" value="updatempdDB" id="syscmd-updatempddb">
				</div>
			</div>
		</fieldset>
	</form>
<!--
<form class="form-horizontal" method="post">
		<fieldset>
			<legend>Backup / Restore configuration</legend>
			<p>&nbsp;</p>
			<div class="form-group">
				<label class="control-label col-sm-2">Backup player config</label>
				<div class="col-sm-10">
					<input class="btn" type="submit" name="syscmd" value="backup" id="syscmd-backup">
				</div>
			</div>
					</fieldset>
	</form>
	<form class="form-horizontal" method="post">
		<fieldset>
			<div class="form-group" >
				<label class="control-label col-sm-2" for="port">Configuration file</label>

				<div class="col-sm-10">
			
			<div class="fileupload fileupload-new" data-provides="fileupload">
					  <span class="btn btn-file"><span class="fileupload-new">restore</span><span class="fileupload-exists">Change</span><input type="file" /></span>
					  <span class="fileupload-preview"></span>
					  <a href="#" class="close fileupload-exists" data-dismiss="fileupload" style="float: none">×</a>
					</div>

				</div>
			</div>
			<div class="form-actions">
				<button class="btn btn-primary btn-lg" value="restore" name="syscmd" type="submit">Restore config</button>
			</div>
		</fieldset>
	</form>
	-->
</div>