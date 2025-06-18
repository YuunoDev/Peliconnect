<?php
    // Obtener credenciales del formulario
    $usuario = $_POST['user'];
    $contrasena = $_POST['pass'];

    // Construir la URL con los parámetros
    $url = "http://peliconnect.ddns.net:3000/login/$usuario/$contrasena";

    // Realizar la solicitud GET
    $response = file_get_contents($url);

    // Decodificar la respuesta
    if ($response === "true") {
        echo "Inicio de sesión exitoso.";
        session_start();

        $_SESSION["usuario"] = $_POST["user"];
        setcookie('usuario', $_POST['user']);
        
        header("Location: indexAndres.php");
        exit;
    } else {
        echo "Credenciales incorrectas.";
    }
?>
<?php
  
?>