<?php
	session_start();
	if(isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_SESSION['user'];
	   $db = $m->cs252;
	   $collection = $db->graph_details;
	   //$psize = strlen($_POST);
		$graph_data = $_POST['g_data'];
		$graph_style = $_POST['g_style'];
		$graph_name = $_POST['g_name'];
		$document = array( 
			 "gname" => $graph_name['name'],
	         "gdata" => $graph_data, 
	         "gstyle" => $graph_style,
	         "submitted_by" => $user
	         );
		$collection->insert($document);

		$collection = $db->user_graphs;
		$document = array( 
			 "user" => $user,
	         "gname" => $graph_name['name']
	         );
		$collection->insert((string)$document);

		/*$collection = $db->graph_names;
		$document = array( 
			 "gname" => $graph_name['name'],
	         "submitted_by" => $user
	         );
		$collection->insert($document);*/

		$data = "Successfully inserted the graph ".$graph_name['name'];
		$stat = 1;
		//echo json_encode(array("dataval" => $data, "stat" => $stat ));
		echo json_encode($_POST);
	}
	else
	{
		$data = "Error";
		$stat = 0;
		echo json_encode(array('dataval' => $data, "stat" => $stat ));
	}
?>
