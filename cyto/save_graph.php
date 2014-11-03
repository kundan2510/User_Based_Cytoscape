<?php
	session_start();
	if(!isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_POST['user'];
	   $collection = $db->graph_details;
		$graph_data = $_POST['g_data'];
		$graph_style = $_POST['g_style'];
		$graph_name = $_POST['g_name'];
		$document = array( 
			 "gname" => $graph_name,
	         "gdata" => $graph_data, 
	         "gstyle" => $graph_style,
	         "submitted_by" => $user
	         );
		$collection->insert($document);
		$collection = $db->user_graph;
		$document = array( 
			 "user" => $_SESSION['user'],
	         "name" => $graph_name
	         );
		$collection->insert($document);
		$data = "Successfully inserted the graph";
		$stat = 1;
		echo json_encode(array('dataval' => $data, 'stat' => $stat ));
	}
	else
	{
		$data = "Error";
		$stat = 0;
	}
?>
