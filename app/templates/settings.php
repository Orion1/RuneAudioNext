<div class="container">
	<h1>Settings</h1>
	<form class="form-horizontal" method="post" role="form">
		<fieldset>
			<legend>Environment</legend>
            <div class="form-group" id="environment">
				<label class="control-label col-sm-2" for="hostname">Player hostname</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="text" id="hostname" name="hostname" value="<?=$this->hostname ?>" placeholder="runeaudio" autocomplete="off">
					<span class="help-block">set <i>player HOSTNAME</i></span>
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2" for="ntpserver">NTP server</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="text" id="ntpserver" name="ntpserver" value="<?=$this->ntpserver ?>" placeholder="pool.ntp.org" autocomplete="off">
					<span class="help-block">set your reference time sync server <i>(NTP server)</i></span>
				</div>
			</div>
			<div class="form-group">
				<label for="proxy" class="control-label col-sm-2">HTTP Proxy server</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input id="proxy" name="features[proxy]" type="checkbox" value="1"<?php if($this->proxy['enable'] == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="<?php if($this->proxy['enable'] != 1): ?>hide<?php endif ?>" id="proxyAuth">
				<div class="form-group">
					<label class="control-label col-sm-2" for="proxy-user">Host</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" id="proxy_host" name="features[proxy][host]" value="<?=$this->proxy['host'] ?>" data-trigger="change" placeholder="<host IP or FQDN>:<port>">
						<span class="help-block">Insert HTTP Proxy host<i> (format: proxy_address:port)</i></span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-2" for="proxy-user">Username</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" id="proxy_user" name="features[proxy][user]" value="<?=$this->proxy['user'] ?>" data-trigger="change" placeholder="user">
						<span class="help-block">Insert your HTTP Proxy <i>username</i> (leave blank for anonymous authentication)</span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-2" for="proxy-pass">Password</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="password" id="proxy_pass" name="features[proxy][pass]" value="<?=$this->proxy['pass'] ?>" placeholder="pass" autocomplete="off">
						<span class="help-block">Insert your HTTP Proxy <i>password</i> (case sensitive) (leave blank for anonymous authentication)</span>
					</div>
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
			<legend>RuneOS kernel settings</legend>
			<p>
				section description
			</p>
			<?php if($this->hwplatformid === '01'): ?>
			<div class="form-group">
				<label class="control-label col-sm-2" for="i2smodule">I&#178;S kernel module activation / selection</label>
				<div class="col-sm-10">
					<select class="selectpicker" name="i2smodule" data-style="btn-default btn-lg">
						<option value="none" <?php if($this->i2smodule == 'none'): ?> selected <?php endif ?>>I&#178;S &#8722; disabled</option>
						<option value="berrynos" <?php if($this->i2smodule == 'berrynos'): ?> selected <?php endif ?>>G2Labs BerryNOS</option>
						<option value="berrynosmini" <?php if($this->i2smodule == 'berrynosmini'): ?> selected <?php endif ?>>G2Labs BerryNOS mini</option>
						<option value="hifiberrydac" <?php if($this->i2smodule == 'hifiberrydac'): ?> selected <?php endif ?>>HiFiBerry DAC</option>
						<option value="hifiberrydigi" <?php if($this->i2smodule == 'hifiberrydigi'): ?> selected <?php endif ?>>HiFiBerry Digi</option>
						<option value="iqaudiopidac" <?php if($this->i2smodule == 'iqaudiopidac'): ?> selected <?php endif ?>>IQaudIO Pi-DAC</option>
						<option value="raspi2splay3" <?php if($this->i2smodule == 'raspi2splay3'): ?> selected <?php endif ?>>RaspI2SPlay3</option>
					</select>
					<span class="help-block">feature description</span>
				</div>
			</div>
			<?php endif;?>
			<div class="form-group">
				<label class="control-label col-sm-2" for="orionprofile">Sound Quality optimization profile</label>
				<div class="col-sm-10">
					<select class="selectpicker" name="orionprofile" data-style="btn-default btn-lg">
						<option value="default" <?php if($this->orionprofile == 'default'): ?> selected <?php endif ?>>ArchLinux default</option>
						<option value="RuneAudio" <?php if($this->orionprofile == 'RuneAudio'): ?> selected <?php endif ?>>RuneAudio</option>
						<option value="ACX" <?php if($this->orionprofile == 'ACX'): ?> selected <?php endif ?>>ACX</option>
						<option value="Orion" <?php if($this->orionprofile == 'Orion'): ?> selected <?php endif ?>>Orion</option>
						<option value="OrionV2" <?php if($this->orionprofile == 'OrionV2'): ?> selected <?php endif ?>>OrionV2</option>
						<option value="RaspberryPi+i2s" <?php if($this->orionprofile == 'RaspberryPi+i2s'): ?> selected <?php endif ?>>RaspberryPi+i2s</option>
						<option value="Um3ggh1U" <?php if($this->orionprofile == 'Um3ggh1U'): ?> selected <?php endif ?>>Um3ggh1U</option>
					</select>
					<span class="help-block">These profiles include a set of performance tweaks that act on some system kernel parameters.
				It does not have anything to do with DSPs or other sound effects: the output is kept untouched (bit perfect).
				It happens that these parameters introduce an audible impact on the overall sound quality, acting on kernel latency parameters (and probably on the amount of overall<a href="http://www.thewelltemperedcomputer.com/KB/BitPerfectJitter.htm" title="Bit Perfect Jitter by Vincent Kars" target="_blank"> jitter</a>).
				Sound results may vary depending on where music is listened, so choose according to your personal taste.
				(If you can't hear any tangible differences... nevermind, just stick to the default settings.)</span>
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
						<input name="features[airplay]" type="checkbox" value="1"<?php if($this->airplay == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="udevil" class="control-label col-sm-2">USB Automount</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[udevil]" type="checkbox" value="1"<?php if($this->udevil == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="coverart" class="control-label col-sm-2">Display album cover</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[coverart]" type="checkbox" value="1"<?php if($this->coverart == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="udevil" class="control-label col-sm-2">Global Random mode</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input name="features[globalrandom]" type="checkbox" value="1"<?php if($this->globalrandom == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
			<div class="form-group">
				<label for="scrobbling_lastfm" class="control-label col-sm-2">Last.FM scrobbling</label>
				<div class="col-sm-10">
					<label class="switch-light well" onclick="">
						<input id="scrobbling-lastfm" name="features[scrobbling_lastfm]" type="checkbox" value="1"<?php if($this->scrobbling_lastfm == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
				</div>
			</div>
            <div class="<?php if($this->scrobbling_lastfm != 1): ?>hide<?php endif ?>" id="lastfmAuth">
				<div class="form-group">
					<label class="control-label col-sm-2" for="lastfm-usr">Username</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" id="lastfm_user" name="features[lastfm][user]" value="<?=$this->lastfm['user'] ?>" data-trigger="change" placeholder="user">
						<span class="help-block">Insert your Last.FM <i>username</i></span>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-2" for="lastfm-pasw">Password</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="password" id="lastfm_pass" name="features[lastfm][pass]" value="<?=$this->lastfm['pass'] ?>" placeholder="pass" autocomplete="off">
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
						<input name="cmediafix[1]" type="checkbox" value="1"<?php if($this->cmediafix == 1): ?> checked="checked" <?php endif ?>>
						<span><span>OFF</span><span>ON</span></span><a class="btn btn-primary"></a>
					</label>
					<span class="help-block">For those who have a CM6631 receiver and experiment issues (noise, crackling) between tracks with different sample rates and/or bit depth.<br> 
					A "dirty" fix that should avoid the problem, do NOT use if everything works normally.</span>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button class="btn btn-primary btn-lg" value="1" name="cmediafix[0]" type="submit">Apply fixes</button>
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