<?php
	session_start();
	if(isset($_SESSION['user']))
	{
		$m = new MongoClient();
		$user = $_SESSION['user'];
		$graph = $_POST['graph'];
		$operation_type = $_POST['operation_type'];
		$db = $m->cs252;
		$table = $graph;

		//$table = $user."_".$graph;
		
		$collection = $db->$table;
		


		/*function getNextCounter() 
		{
			$cursor = $collection->find();
		   //$greatest_counter = $collection->count()+1;
		   return $cursor->count();
		}*/

		if( $operation_type == "counter_query" ) 
		{
			$counter = 0;
			$counter = $collection->count();
			if ( $counter >= 0 )
			{
				$data = "Successfully returned counter of the graph";
				$stat = $counter;
			}
			else
			{
				$data = "Counter query in mongo failed";
				$stat = -1;
			}
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
		else if( $operation_type == "add_node" ) 
		{
			$node_sending = $_POST['node_sending'];
			if ( $collection->insert($node_sending) )
			{
				/*$collection = $db->user_graph;
				$document = array( 
					 "user" => $user,
			         "name" => $graph_name
			         );
				$collection->insert($document);*/
				$data = "Successfully inserted node in the graph";
				$stat = 1;
			}
			else
			{
				$data = "Node insert in mongo failed";
				$stat = -1;
			}
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
		else if ( $operation_type == "delete_node" )
		{
			$node_sending = $_POST['node_sending'];
			if ( $collection->insert($node_sending) )
			{
				$data = "Successfully inserted delete data in the graph";
				$stat = 1;
			}
			else
			{
				$data = "Node delete in mongo failed";
				$stat = -1;
			}
			
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
		else if( $operation_type == "add_edge" ) 
		{
			$edge_sending = $_POST['edge_sending'];

			if ( $collection->insert($edge_sending) )
			{
				$data = "Successfully inserted edge in the graph";
				$stat = 1;
			}
			else
			{
				$data = "Edge insert in mongo failed";
				$stat = -1;
			}
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
		else if ( $operation_type == "delete_edge" )
		{
			$edge_sending = $_POST['edge_sending'];
			if ( $collection->insert($edge_sending) )
			{
				$data = "Successfully inserted delete edge in the graph";
				$stat = 1;
			}
			else
			{
				$data = "Node delete edge in mongo failed";
				$stat = -1;
			}
			
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
		else if ($operation_type == "modify_graph" )
		{
			$modify_element = $_POST['modify_element'];
			if ( $collection->insert($modify_element) )
			{
				$data = "Successfully modified element in the graph";
				$stat = 1;
			}
			else
			{
				$data = "Modification in mongo failed";
				$stat = -1;
			}
			
			echo json_encode(array('dataval' => $data, 'stat' => $stat ));
		}
	}
	else
	{
		$data = "Error";
		$stat = 0;
		echo json_encode(array('dataval' => $data, 'stat' => $stat ));
	}
?>
