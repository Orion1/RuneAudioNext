<div class="container">
	<h1>DB sources</h1>
	<form method="post">
		<p><button class="btn btn-lg btn-primary" type="submit" name="updatempd" value="1" id="updatempddb"><i class="fa fa-refresh sx"></i>Update MPD Database</button></p>
	</form>
	<div class="boxed">
		<p>RuneAudio&#39;s MPD creates and updates its database scanning the content of the following source directories:</p>
		<ul>
			<li><strong>Network mounts</strong><br><span class="help-block">where all network mounts fit</span></li>
			<li><strong>USB mounts</strong><br><span class="help-block">the content of the USB drive, if plugged</span></li>
			<!-- <li><strong>RAM</strong><br><span class="help-block">the content of the RAMdisk, used for RAM play purposes</span></li> -->
		</ul>
	</div>
	<h2>Network mounts</h2>
	<p>List of configured network mounts (click to edit)</p>
	<form id="mount-list" class="button-list" method="post">
		<?php if( !empty($this->mounts) ): foreach($this->mounts as $mount): ?>
		<p><a href="/sources/edit/<?=$mount['id'] ?>" class='btn btn-lg btn-default btn-block'> <i class='fa <?php if ($mount['status'] == 1): ?> fa-check green <?php else: ?> fa-times red <?php endif ?> sx'></i> <?=$mount['name'] ?>&nbsp;&nbsp;&nbsp;&nbsp;<span>//<?=$mount['address'] ?>/<?=$mount['remotedir'] ?></span></a></p>
		<?php endforeach; endif; ?>
		<p><a href="/sources/add" class="btn btn-lg btn-primary btn-block" data-ajax="false"><i class="fa fa-plus sx"></i> Add new mount</a></p>
	</form>
</div>