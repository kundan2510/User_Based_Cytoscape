<?php
session_start();
	if(isset($_SESSION['user']))
	{
	   $m = new MongoClient();
	   $user = $_SESSION['user'];
	   $g_name = $_POST['gname'];
	   $db = $m->cs252;
	   $collection = $db->graph_details;
	   $cursor = $collection->find(array("gname" => "$g_name"));
	   $flag = 0;
	   $graph = "temp";
	   foreach ($cursor as $document) {
	   	/*if($flag == 1)
	   	{

	   	}*/
	      $flag += 1;
	      $graph = array('gdata' => $document['gdata'],'gstyle' => $document['gstyle'] );
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
