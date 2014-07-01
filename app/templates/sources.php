<div class="container">
	<h1>Local sources</h1>
	<div class="boxed">
		<p>Your <a href="/#panel-sx">music library</a> is composed by two main content types: <strong>local sources</strong> and streaming sources.<br>
		This section lets you configure your local sources, telling <a href="http://www.musicpd.org/" title="Music Player Daemon" rel="nofollow" target="_blank">MPD</a> to scan the contents of <strong>network mounts</strong> and <strong>USB mounts</strong>.</p>
		<form action="" method="post">
			<button class="btn btn-lg btn-primary" type="submit" name="updatempd" value="1" id="updatempddb"><i class="fa fa-refresh sx"></i>Force MPD DB update</button>
			<button class="btn btn-lg btn-primary" type="submit" name="mountall" value="1" id="mountall"><i class="fa fa-refresh sx"></i>Remount all net sources</button>
		</form>
	</div>
	
	<h2>Network mounts</h2>
	<p>List of configured network mounts. Click an existing entry to edit it, or add a new one.</p>
	<form id="mount-list" class="button-list" action="" method="post">
		<?php if( !empty($this->mounts) ): foreach($this->mounts as $mount): ?>
		<p><a href="/sources/edit/<?php echo $mount['id']; ?>" class='btn btn-lg btn-default btn-block'> <i class='fa <?php if ($mount['status'] == 1): ?> fa-check green <?php else: ?> fa-times red <?php endif ?> sx'></i> <?php echo $mount['name']; ?>&nbsp;&nbsp;&nbsp;&nbsp;<span>//<?php echo $mount['address']; ?>/<?php echo $mount['remotedir']; ?></span></a></p>
		<?php endforeach; endif; ?>
		<p><a href="/sources/add" class="btn btn-lg btn-primary btn-block" data-ajax="false"><i class="fa fa-plus sx"></i> Add new mount</a></p>
	</form>
	
	<h2>USB mounts</h2>
	<p>List of mounted USB drives. If a drive is connected but not shown in the list, please check if <a href="/settings/#features-management">USB automount</a> is enabled.</p>
	<div class="button-list">	
	<?php if( $this->usbmounts !== null ): foreach($this->usbmounts as $usbmount): ?>
		<p><a href="#" class="btn btn-lg btn-default btn-block"><i class="fa fa-check green sx"></i>/dev/<?=$usbmount->device ?>&nbsp;&nbsp;<?=$usbmount->name ?>&nbsp;&nbsp;<span>(size:&nbsp;<?=$usbmount->size ?>&nbsp;<?=$usbmount->use ?>&nbsp;in use)</span></a></p>
	<?php endforeach; else: ?>
		<p><button class="btn btn-lg btn-disabled btn-block" disabled="disabled">no USB mounts present</button></p>
	<?php endif; ?>
	</div>
</div>