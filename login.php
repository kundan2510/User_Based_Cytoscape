<?php
	session_start();
   $m = new MongoClient();
   $user = $_POST['user'];
   $pwd = $_POST['pwd'];
   $db = $m->cs252;
   //echo "Database mydb selected";
   $collection = $db->user_details;
   $cursor = $collection->find(array("user" => "$user" , "pwd"=>"$pwd"));
   $flag = 0;
   foreach ($cursor as $document) {
      $flag = 1;
   }

   if ($flag > 0)
   {
   		$_SESSION['user'] = $user;
         $data = "Success";
         $stat = 1;
   		echo json_encode(array('dataval' => $data, 'stat' => $stat ));
   }
   else
   {
      $data = "Wrong UserName and/or password";
      $stat = 0;
      echo json_encode(array('dataval' => $data, 'stat' => $stat ));
   }
?>
