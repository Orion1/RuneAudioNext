	<form class="form-horizontal" action="$_SERVER['PHP_SELF']" method="post" role="form" data-validate="parsley">
		<fieldset>
			<legend>Network Setup</legend>
			<div class="alert alert-info">
				eth0 IP address: $_SESSION['netconf']['eth0']['ip']
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="dhcp">DHCP</label>
				<div class="col-sm-10">
					<select id="dhcp" name="net[dhcp]" class="input-lg">
						<option value="true" "selected">enabled (Auto)</option>
						<option value="false">disabled (Static)</option>
					</select>
					<span class="help-block">Choose between DHCP and Static configuration</span>
				</div>
			</div>
			<div id="network-manual-config" class="">
				<div class="form-group">
					<label class="col-sm-2 control-label" for="ip-addr">IP address</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" class="input-large" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="address" name="net[address]" value="$net['address']" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the IP address.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="netmask">Netmask</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" class="input-block-level" type="text" data-regexp="^[1-2]{1}[2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-9]{1,3}$" id="netmask" name="net[netmask]" value="$net['netmask']" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the network mask.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="netmask">Gateway</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" class="input-block-level" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="gateway" name="net[gateway]" value="$net['gateway']" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the gateway.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="net[dns1]">Primary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" class="input-block-level" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns1" name="net[dns1]" value="$net['dns1']" data-trigger="change" data-required="true">
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="net[dns2]">Secondary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" class="input-block-level" type="text" data-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns2" name="net[dns2]" value="$net['dns2']" data-trigger="change" data-required="true">
						<span class="help-block">Manually set the primary and secondary DNS.</span>
					</div>
				</div>
			</div>
		</fieldset>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="button" class="btn btn-large">Cancel</button>
				<button type="submit" class="btn btn-primary btn-large" name="save" value="save">Save changes</button>
			</div>
		</div>
	</form>