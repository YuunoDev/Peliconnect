<?php
  session_start();

  session_destroy();

  header("Location: index.php");
  setcookie("usuario",'',-1);
  exit;
?>