<?php
	session_start();
	if(isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_SESSION['user'];
	   $db = $m->cs252;
	   $collection = $db->user_graphs;
	   $cursor = $collection->find();
	   $flag = 0;
	   $data = "Available graphs are :<br>";
	   foreach ($cursor as $document) {
	   	$data .= "<a href='graph_viewOnly.html?gname=".$document["gname"] . "'>".$document['gname']."</a><br>";
	      $flag = 1;
	   }
	   if($flag == 0)
	   {
	   	$data = "No graph available";
	   }
	   $stat = 1;
		echo json_encode(array('dataval' => $data, 'stat' => $stat ));
	}
	else
	{
		$data = "Error";
		$stat = 0;
		echo json_encode(array('dataval' => $data, 'stat' => $stat ));
	}
?>