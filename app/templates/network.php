<div class="container credits">
	<h1>Network configuration</h1>
	<p><button class="btn btn-lg btn-primary" name="update-net-interfaces" value="1" id="update-net-interfaces" onClick="location.reload(true)"><i class="fa fa-refresh sx"></i>Refresh interfaces</button></p>
	<div class="boxed">
		<p>Bla bla bla</p>
	</div>
	
	<h2>Network interfaces</h2>
	<p>List of available network interfaces (click to configure)</p>
	<form id="network-interface-list" class="button-list" method="post">
		<p><a href="net-edit-eth.php" class="btn btn-lg btn-default btn-block"> <i class="fa fa-check green sx"></i> <strong>Eth0</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span>172.16.22.23</span></a></p>
		<p><a href="net-edit-wifi.php" class="btn btn-lg btn-default btn-block"> <i class="fa fa-check green sx"></i> <strong>WiFi0</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span>172.16.22.58</span></a></p>
	</form>
</div>