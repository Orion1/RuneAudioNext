<div class="container credits">
	<h1>Network configuration</h1>
	<p><button class="btn btn-lg btn-primary" name="update-net-interfaces" value="1" id="update-net-interfaces" onClick="location.reload(true)"><i class="fa fa-refresh sx"></i>Refresh interfaces</button></p>
	<div class="boxed">
		<p>Bla bla bla</p>
	</div>	
	<h2>Network interfaces</h2>
	<p>List of available network interfaces (click to configure)</p>
	<form id="network-interface-list" class="button-list" method="post">
	<?php foreach ($this->nics as $key => $value): ?>
		<p><a href="/network/edit/<?=$key ?>" class="btn btn-lg btn-default btn-block"> <i class="fa <?php if ($value->ip !== null): ?>fa-check green<?php else: ?>fa-times red<?php endif; ?> sx"></i> <strong><?=$key ?> </strong>&nbsp;&nbsp;&nbsp;&nbsp;<span><?=$value->ip ?></span></a></p>
	<?php endforeach; ?>
	</form>
</div>