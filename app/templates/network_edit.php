<div class="container">
	<h1>Network interface</h1>
	<form class="form-horizontal" action="/network" method="post" data-parsley-validate>
		<input type="hidden" name="nic[name]" value="<?=$this->arg ?>" />
		<fieldset>
			<legend>Interface information</legend>
			<div class="boxed">
				<table class="info-table">
					<tbody>
						<tr><th>Interface name:</th><td><strong><?=$this->arg ?></strong></td></tr>
						<tr><th>Interface type:</th><td><?php if ($this->nic->wireless === 1): ?>wireless<?php else: ?>wired ethernet<?php endif ?></td></tr>
						<tr><th>Assigned IP address:</th><td><strong><?=$this->nic->ip ?></strong> <i class="fa <?php if ($this->nic->speed !== ' Unknown!' && $this->nic->speed !== null): ?>fa-check green<?php else: ?>fa-times red<?php endif; ?> dx"></i></td></tr>
						<tr><th>Interface speed:</th><td><?=$this->nic->speed ?></td></tr>
						<tr><th><a href="/network"><i class="fa fa-arrow-left sx"></i> back to the list</a></th><td></td></tr>
					</tbody>
				</table>
			</div>
		</fieldset>
		<!-- <p>If you mess up with this configuration you can <a data-toggle="modal" href="#net-config-defaults">reset to default</a>.</p> -->
		<fieldset>
			<legend>Interface configuration</legend>
			<div class="form-group">
				<label class="col-sm-2 control-label" for="nic[dhcp]">IP assignment</label>
				<div class="col-sm-10">
					<select id="dhcp" name="nic[dhcp]" class="selectpicker" data-style="btn-default btn-lg">
						<option value="1" <?php if ($this->{$this->uri(3)}->dhcp === '1'): ?> selected <?php endif; ?>>DHCP</option>
						<option value="0" <?php if ($this->{$this->uri(3)}->dhcp === '0'): ?> selected <?php endif; ?>>Static</option>
					</select>
					<span class="help-block">Choose between DHCP and Static configuration</span>
				</div>
			</div>
			<div id="network-manual-config" class="hide">		
				<div class="form-group">
					<label class="col-sm-2 control-label" for="nic[ip]">IP address</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" parsley-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="address" name="nic[ip]" value="<?=$this->nic->ip ?>" placeholder="<?=$this->nic->ip ?>" data-parsley-trigger="change" data-parsley-required="true">
						<span class="help-block">Manually set the IP address.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="nic[netmask]">Netmask</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" parsley-regexp="^[1-2]{1}[2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-2]{1}[0,2,4,5,9]{1}[0,2,4,5,8]{1}\.[0-9]{1,3}$" id="netmask" name="nic[netmask]" value="<?=$this->nic->netmask ?>" data-parsley-trigger="change" placeholder="<?=$this->nic->netmask ?>" data-parsley-required="true">
						<span class="help-block">Manually set the network mask.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="nic[gw]">Gateway</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" parsley-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="gateway" name="nic[gw]" value="<?=$this->nic->gw ?>" placeholder="<?=$this->nic->gw ?>" data-parsley-trigger="change" data-parsley-required="true">
						<span class="help-block">Manually set the gateway.</span>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="nic[dns1]">Primary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" parsley-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns1" name="nic[dns1]" value="<?=$this->nic->dns1 ?>" placeholder="<?=$this->nic->dns1 ?>" data-parsley-trigger="change" >
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="nic[dns2]">Secondary DNS</label>
					<div class="col-sm-10">
						<input class="form-control input-lg" type="text" parsley-regexp="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" id="dns2" name="nic[dns2]" value="<?=$this->nic->dns2 ?>" placeholder="<?=$this->nic->dns2 ?>" data-parsley-trigger="change" >
						<span class="help-block">Manually set the primary and secondary DNS.</span>
					</div>
				</div>
			</div>
		</fieldset>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="/network" class="btn btn-default btn-lg">Cancel</a>
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