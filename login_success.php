<?php
	session_start();
	if(isset($_SESSION['user']))
	{
		echo $_SESSION['user'];
		echo " is logged in";
	}
	else
	{
		header("location:login.html");
	}
?>