<?php
	session_start();
	if(isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_SESSION['user'];
	   $db = $m->cs252;

		$graph_name = $_POST['edit_graph_name'];
		$parent_graph = $_POST['parent_graph_name'];
		$graph_inheritance_type = $_POST['graph_inheritance_type'];

		$collection = $db->user_graphs;

		$cursor = $collection->find(array("gname" => "$graph_name"));

		$stat = 0;

		if ( $cursor->count() == 0 )
		{
			$document = array( 
			 "user" => $user,
	         "gname" => $_SESSION['user']."_".$graph_name,
	         "type" => "version",
	         "parent" => $parent_graph
	         );
			$collection->insert($document);
			$data = "Successfully inserted the graph ".$_SESSION['user']."_".$graph_name;
			$graph_name = $_SESSION['user']."_".$graph_name;
			$stat = 1;
		}

		
		//echo json_encode(array("dataval" => $data, "stat" => $stat ));
		echo "<br>".$parent_graph."<br>";

		header("Location: app.html?parent_graph=".$parent_graph."?version_graph=".$graph_name."?graph_inheritance_type=".$graph_inheritance_type);


	}
	else
	{
		$data = "Error";
		$stat = 0;
		echo json_encode(array('dataval' => $data, "stat" => $stat ));
	}
?>
