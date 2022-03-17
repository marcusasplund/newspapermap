<?php
    $twitterUser = empty($_GET['twitterUser']) ? 'webdesignermag' : $_GET['twitterUser'];
	 $json = file_get_contents("http://twitter.com/status/user_timeline/$twitterUser.json", true);
$result = json_decode($json); 
$feedName = $result[0]->user->name;
	X?>
<!DOCTYPE html> 
 <html>
    <head>
       <meta charset="UTF-8">
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" />
<link rel="stylesheet" href="mobile.css" />
<script src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
<script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"></script>
 </head>
 <body>
<div data-role="page">
 <header data-role="header">
    <h1><?php echo($feedName) ?></h1>
</header>
</div>
<ul class="tweets">
    <?php
    foreach ($result as $item) {
		$text = htmlentities($item->text, ENT_QUOTES, 'utf-8');
 $time = date('g:ia', strtotime($item->created_at));
  $text = preg_replace('@(https?://([-\w\.]+)+(/([\w/_\.]*(\?\S+)?(#\S+)?)?)?)@', 
'<a href="$1">$1</a>', $text); 
      echo('<li class="ui-li">');
	  echo('<h3>'.$text.'</h3>');
 echo('<p>Posted on '.$date.' at '.$time.'</p>');
	?>
    </ul>
</div>
<footer data-role="footer">
    <h4><a href="http://www.studiomohu.com" rel="external">Developed by Mohu&trade;</a></h4>
 </footer>
 </div>
</body>
</html>