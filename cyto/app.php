<?php
	session_start();
	if(isset($_SESSION['user']))
	{
		$m = new MongoClient();
		$user = $_SESSION['user'];
		$graph = $_POST['graph'];
		$db = $m->cs252;
		$table = $user."_".$graph;
		$collection = $db->$table;
		$node_complete = $_POST['node_complete'];
		$collection->insert($node_complete);
		/*$collection = $db->user_graph;
		$document = array( 
			 "user" => $user,
	         "name" => $graph_name
	         );
		$collection->insert($document);*/
		$data = "Successfully inserted the graph";
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
