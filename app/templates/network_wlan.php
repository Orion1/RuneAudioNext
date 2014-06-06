<div class="container">
	<h1>WiFi SSID Configuration</h1>
	<!--<p>If you mess up with this configuration you can <a data-toggle="modal" href="#net-config-defaults">reset to default</a>.</p>-->
	<form class="form-horizontal" action="" method="post" data-parsley-validate>
		<!--$_eth0-->
		<fieldset>
			<!-- <legend>Interface information</legend> -->
			<div class="boxed">
				<table class="info-table">
					<tbody>
						<tr><th>Network SSID:</th><td><strong><?=$this->uri(4) ?></strong><?php if ($this->nic->currentssid === $this->{$this->uri(4)}->{'ESSID'}): ?><i class="fa fa-check green dx"></i>&nbsp;&nbsp;&nbsp;<?php endif; ?></td></tr>
						<tr><th>Signal level:</th><td><strong><?=$this->{$this->uri(4)}->{'Quality'} ?></strong>&nbsp;&#37;</td></tr>
						<tr><th>Encryption:</th><td><?php if ($this->{$this->uri(4)}->{'Encryption key'} === 'on' && $this->{$this->uri(4)}->{'Group Cipher'} != null && strpos($this->{$this->uri(4)}->IE,'WPA')): ?>WPA / WPA2 - PSK (<?=$this->{$this->uri(4)}->{'Group Cipher'}?>)&nbsp;&nbsp;&nbsp;<i class="fa fa-lock dx"></i><?php elseif ($this->{$this->uri(4)}->{'Encryption key'} === 'on'): ?>WEP&nbsp;&nbsp;&nbsp;<i class="fa fa-lock dx"><?php else: ?>none (Open Network)&nbsp;&nbsp;&nbsp;<i class="fa fa-unlock dx"><?php endif; ?></td></tr>
						<tr><th><a href="/network/edit/<?=$this->uri(3) ?>"><i class="fa fa-arrow-left sx"></i> back to NIC details</a></th><td></td></tr>
					</tbody>
				</table>
			</div>
		</fieldset>
		<br>
		
		<fieldset>
			<legend>Security parameters</legend>
			<div class="form-group <?php if ($this->uri(4) !== null): ?>hide<?php endif; ?>">
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
						<option <?php if($this->uri(4) !== null && strpos($this->{$this->uri(4)}->{'Encryption key'},'off')): ?>selected<?php endif; ?>>none (Open network)</option>
						<option <?php if($this->uri(4) !== null && strpos($this->{$this->uri(4)}->IE,'WPA')): ?>selected<?php endif; ?>>WPA/WPA2 PSK</option>
						<option <?php if($this->uri(4) !== null && $this->{$this->uri(4)}->{'Encryption key'} === 'on' && !strpos($this->{$this->uri(4)}->IE,'WPA')): ?>selected<?php endif; ?>>WEP</option>
					</select>
					<span class="help-block">Choose the security type of the Wi-Fi you want to connect.</span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="wifisec[key]">Key</label>
				<div class="col-sm-10">
					<input class="form-control input-lg" type="password" id="wifi-password" name="wifisec[key]" value="" data-trigger="change" >
					<span class="help-block">Set the key of the Wi-Fi you want to connect.</span>
				</div>
			</div>
		</fieldset>
		<div class="form-group form-actions">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="net-config.php" class="btn btn-default btn-lg">Cancel</a>
				<button type="submit" class="btn btn-primary btn-lg" name="save" value="save">Connect and Save profile</button>
			</div>
		</div>
	</form>
</div>