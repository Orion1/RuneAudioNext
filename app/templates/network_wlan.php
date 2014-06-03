<div class="container">
	<h1>WiFi SSID Configuration</h1>
	<!--<p>If you mess up with this configuration you can <a data-toggle="modal" href="#net-config-defaults">reset to default</a>.</p>-->
	<form class="form-horizontal" action="" method="post" data-parsley-validate>
		<!--$_eth0-->
		<fieldset>
			<legend>Interface information</legend>
			<div class="boxed">
				<table class="info-table">
					<tbody>
						<tr><th>Interface name:</th><td><?=$this->uri(3) ?></td></tr>
						<tr><th>Network SSID:</th><td><?=$this->uri(4) ?></td></tr>
						<tr><th><a href="/network/edit/<?=$this->uri(3) ?>"><i class="fa fa-arrow-left sx"></i> back to <?=$this->uri(3) ?> details</a></th><td></td></tr>
					</tbody>
				</table>
				
			</div>
		</fieldset>
		<br>
		
		<fieldset>
			<legend>Security parameters</legend>
			<div class="form-group <?php if ($this->uri(4) !== ''): ?>hide<?php endif; ?>">
				<label class="col-sm-2 control-label" for="wifisec[ssid]">SSID</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="text" id="wifi-name" name="wifisec[ssid]" value="<?=$this->uri(4) ?>" data-trigger="change">
					<span class="help-block">Set the SSID name of the Wi-Fi you want to connect.</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="wifisec[encryption]">Security</label>
				<div class="col-sm-10">
					<select id="wifi-security" name="wifisec[encryption]" class="selectpicker" data-style="btn-default btn-lg">
						<option <?php if(strpos($this->wlans->{$this->arg}->{'Encryption key'},'off')): ?>selected<?php endif; ?>>none</option>
						<option <?php if(strpos($this->wlans->{$this->arg}->IE,'WPA')): ?>selected<?php endif; ?>>WPA/WPA2 PSK</option>
						<option <?php if(strpos($this->wlans->{$this->arg}->IE,'WEP')): ?>selected<?php endif; ?>>WEP</option>
					</select>
					<span class="help-block">Choose the security type of the Wi-Fi you want to connect.</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="wifisec[password]">Password</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="password" id="wifi-password" name="wifisec[password]" value="" data-trigger="change" >
					<span class="help-block">Set the password of the Wi-Fi you want to connect.</span>
				</div>
			</div>
		</fieldset>
		<div class="form-group form-actions">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="net-config.php" class="btn btn-default btn-lg">Cancel</a>
				<button type="submit" class="btn btn-primary btn-lg" name="save" value="save">Save profile</button>
			</div>
		</div>
	</form>
</div>