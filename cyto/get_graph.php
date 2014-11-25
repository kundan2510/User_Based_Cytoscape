<?php
session_start();
	if(isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_SESSION['user'];
	   $g_name = $_POST['gname'];
	   $g_type = $_POST['gtype'];

	   $db = $m->cs252;
	   $flag = 0;

	   //$graph = "temp";
	   $base_found = 0;

	   $graph = array();

	   
	   //if ( $g_type == "version" )
	   //{
	   		while ( $base_found == 0 )
	   		{
	   			$collection = $db->$g_name;
		   		$cursor = $collection->find();
		   		$temp_count = 0;
		   // 		foreach ($cursor as $document) 
		   // 		{
					// $flag += 1;
					// //$graph[$flag] = $document;
					// array_unshift($graph, $document );
					
			  //   }
				
			    array_unshift($graph, iterator_to_array($cursor) );

			    $collection = $db->user_graphs;
			    $cursor = $collection->find(array("gname" => "$g_name"));
			    foreach ($cursor as $document) 
		   		{
					$g_name = $document['parent'];
					$collection = $db->user_graphs;
			    	$cursor = $collection->find(array("gname" => "$g_name"));
			    	foreach ($cursor as $document) 
		   			{
						if ( $document['type'] == "base" )
						{
							$base_found = 1;
							break;
						}
					}
					if ( $base_found == 1 )
						break;
			    }
	   		}
	  // }

	   
   		$collection = $db->graph_details;
   		$cursor = $collection->find(array("gname" => "$g_name"));
   		foreach ($cursor as $document) 
   		{
			$flag += 1;
			$graph['gdata'] = $document['gdata'];
			$graph['gstyle'] = $document['gstyle'];
	    }


	   if ($flag >= 1)
	   {
	   		$_SESSION['user'] = $user;
	         //$data = json_encode($graph);
	         $stat = 1;
	   		echo json_encode(array('dataval' => $graph, 'stat' => $stat ));
	   }
	   else
	   {

	      $data = "Wrong UserName and/or password";
	      $stat = 0;
	      echo json_encode(array('dataval' => $data, 'stat' => $stat ));
	   }
	}

?>
