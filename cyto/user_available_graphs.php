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
	   $data = "Available Base graphs are :<br>";
	   $data .= "<select id='base_graph_id' class = 'btn btn-default' name='base_graph_name'><option value=''></option>";
	   foreach ($cursor as $document) 
	   {
			if ( $document["type"] == "base" )
			{
				$data .= "<option>".$document['gname']."</option><br>";
				$flag = 1;
			}  	
	   }
	   $data .= "</select>";
	   $data .= "<br/>My versioned graphs:<br/>";
	   $data .= "<select id='version_graph_id' class = 'btn btn-default' name='version_graph_name'><option value=''></option>";

	   $cursor = $collection->find(array("user" => "$user"));
	   foreach ($cursor as $document) 
	   {
			if ( $document["type"] == "version" )
			{
				$data .= "<option>".$document['gname']."</option><br>";
				$flag = 1;
			}  	
	   }
	   $data .= "</select>";

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