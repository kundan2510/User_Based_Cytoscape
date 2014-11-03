<?php
	session_start();
	if(isset($_SESSION['user']))
	{
		$user = $_SESSION['user'];
		//$db = $m->cs252;
	   //echo "Database mydb selected";
	    //$collection = $db->graphs;

	    echo json_encode(array('user' => $user, 'stat' => 1 ));
	}
	else
	{
		echo json_encode(array('user' => "NO", 'stat' => 0 ));
	}
?>

