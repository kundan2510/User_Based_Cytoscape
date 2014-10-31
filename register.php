<?php
	session_start();
   $m = new MongoClient();
   $user = $_POST['user'];
   $pwd = $_POST['pwd'];
   $email = $_POST['email'];
   $db = $m->cs252;
   //echo "Database mydb selected";
   $collection = $db->user_details;
   $cursor = $collection->find(array('user'=>$user));
   $flag = 0;
   foreach ($cursor as $document) {
      $flag = 1;
   }
   if ($flag > 0)
   {
   		$data = "User Name already exist";
         $stat = 0;
         echo json_encode(array('dataval' => $data, 'stat' => $stat ));
   }
   else
   {
   		$document = array( 
         "user" => $user, 
         "pwd" => $pwd, 
         "email" => $email
         );
         $collection->insert($document);
        $data = "User Registered";
         $stat = 1;
         echo json_encode(array('dataval' => $data, 'stat' => $stat ));
   }
?>