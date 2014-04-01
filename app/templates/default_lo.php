<!DOCTYPE html>
<html lang="en">
<!-- header -->
<?php $this->insert('header') ?>
<!-- header -->
<!-- content -->
<?php $this->insert($this->content) ?>
<!-- content -->
<!-- footer -->
<?php $this->insert('footer') ?>
<!-- footer -->
<?php if (isset($this->dfooter)): ?>
<!-- debug_footer -->
<div id="dfooter">
	<code>
		<?=$this->e($this->dfooter) ?>
	</code>
</div>
<!-- debug_footer -->
<?php endif ?>
</body>
</html>