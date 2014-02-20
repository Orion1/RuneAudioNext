<div class="container">
	<h1>Network interface</h1>
	<!--<p>If you mess up with this configuration you can <a data-toggle="modal" href="#net-config-defaults">reset to default</a>.</p>-->
	<form class="form-horizontal" data-validate="parsley" method="post">
		<!--$_eth0-->
		<fieldset>
			<legend>Interface information</legend>
			<div class="boxed">
				<table class="info-table">
					<tbody>
						<tr><th>Interface name:</th><td>$_int0name</td></tr>
						<tr><th>Assigned IP address:</th><td><strong>172.16.22.23</strong> <i class="fa fa-check green dx"></i></td></tr>
						<tr><th>Interface speed:</th><td>10/100 Mbps</td></tr>
						<tr><th><a href="net-config.php"><i class="fa fa-arrow-left sx"></i> back to the list</a></th><td></td></tr>
					</tbody>
				</table>
			</div>
		</fieldset>
		<br>
		<fieldset>
			<legend>Interface configuration</legend>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="eth0[dhcp]">IP assignment</label>
				<div class="col-sm-10">
					<select id="dhcp" name="eth0[dhcp]" class="selectpicker" data-style="btn-default btn-lg">
						$_int0dhcp
					</select>
					<span class="help-block">Choose between DHCP and Static configuration</span>
				</div>
			</div>
			<div id="network-manual-config" class="optional">		
				<div class="form-group">
					<label class="col-sm-2 control-label" for="eth0[ip]">IP address</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="address" name="eth0[ip]" value="$_int0[ip]" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the IP address.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="eth0[netmask]">Netmask</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" data-regexp="^[1-2]{1}[2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-9]{1,3}$" id="netmask" name="eth0[netmask]" value="$_int0[netmask]" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the network mask.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="eth0[gw]">Gateway</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="gateway" name="eth0[gw]" value="$_int0[gw]" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the gateway.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="eth0[dns1]">Primary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns1" name="eth0[dns1]" value="$_int0[dns1]" data-trigger="change" >
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="eth0[dns2]">Secondary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns2" name="eth0[dns2]" value="$_int0[dns2]" data-trigger="change" >
						<span class="help-block">Manually set the primary and secondary DNS.</span>
					</div>
				</div>
				<div class="disabler"><!-- disabling layer --></div>
			</div>
			$_wlan0
		</fieldset>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="net-config.php" class="btn btn-default btn-lg">Cancel</a>
				<button type="submit" class="btn btn-primary btn-lg" name="save" value="save">Save and apply</button>
			</div>
		</div>
	</form>
</div>
<div id="net-config-defaults" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="mpd-config-defaults-label" aria-hidden="true">
		  <form name="netconf_reset" method="post" id="netconf_reset">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3 id="mpd-config-defaults-label">Reset the configuration</h3>
			</div>
			<div class="modal-body">
				<p>You are going to reset the configuration to the default original values.<br>
				You will lose any modification.</p>
			</div>
			
			<div class="modal-footer">
			<input type="hidden" name="reset" value="1">
				<button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<button type="submit" class="btn btn-primary" >Continue</button>
			</div>
		  </form>
</div>