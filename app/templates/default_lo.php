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
<?php if (isset($this->debug)): ?>
<!-- debug -->
<div id="debug">
<pre>
<?=$this->e($this->debug) ?>
</pre>
</div>
<!-- debug -->
<?php endif ?>
</body>
</html>