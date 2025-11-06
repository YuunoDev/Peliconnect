<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro - Pelicconnect</title>

  <link rel="stylesheet" href="css/estilos.css">
  	 <link rel="shortcut icon" href="media/images (1).jpg" />

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

  <style>
    body {
      background: url('img/fondo_signin.jpg') no-repeat center center fixed;
      background-size: cover;
      margin: 0;
      position: relative;
      font-family: Arial, sans-serif;
      min-height: 100vh;
    }

    body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 0;
    }

    /* Contenedor principal que organiza header, main y footer */
    .page-container {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header, footer {
      position: relative;
      z-index: 2;
    }

    header {
      background: rgba(0,0,0,0.5);
      padding: 2rem 0;
    }

    header .contenedor {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      margin: 0 auto;
    }

    header .logotipo {
      font-size: 5rem;
      color: #e50914;
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    header nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: #fff;
      font-weight: normal;
    }

    header nav a:hover {
      text-decoration: underline;
    }

    main {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .form-container {
      position: relative;
      z-index: 1;
      max-width: 400px;
      width: 100%;
      padding: 2rem;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      text-align: left;
    }

    .form-container h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.8rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #0d6efd;
      box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
    }

    .btn-register {
      width: 100%;
      padding: 0.75rem;
      background-color: #e50914;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      text-align: center;
      margin-top: 1rem;
    }

    .btn-register:hover {
      background-color: #c10812;
    }

    footer {
      background: rgba(0,0,0,0.5);
      color: #fff;
      padding: 1rem 0;
    }

    footer .container {
      width: 90%;
      margin: 0 auto;
    }

    footer h5, footer p, footer a {
      color: #fff !important;
    }

    footer a {
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    .text-body-secondary {
      color: rgba(255,255,255,0.7)!important;
    }

    .link-body-emphasis {
      color: #fff !important;
    }

    .link-body-emphasis:hover {
      color: #ccc !important;
    }
  </style>
</head>
<body>
<div class="page-container">

    <header>
        <div class="contenedor">
            <h2 class="logotipo">PeliConnect</h2>
            <nav>
                <a href="index.php" class="activo">Inicio</a>
                <a href="indexAndres.php">Películas</a>
                <?php if (isset($_SESSION["usuario"])): ?>
                    <a href=""><?php echo $_SESSION["usuario"]; ?></a>
                    <a href="lista.php">Mi lista</a>
                    <a href="logout.php">Cerrar Sesion</a>
                <?php else: ?>
                    <a href="loginFront.php">Iniciar Sesion</a>
                    <a href="registroFront.php">Registrarse</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <main>
      <div class="form-container">
        <h2>Registro</h2>
        <form action="registro.php" method="POST">
          <div class="form-group">
            <label for="user">Nombre de usuario</label>
            <input type="text" id="user" name="user" required>
          </div>
          <div class="form-group">
          <label for="pass">Contraseña</label>
          <input type="password"id="pass" name="pass" placeholder="Ingrese su contraseña" required>
          </div>
          <button type="submit" class="btn-register">Registrarme</button>
        </form>
      </div>
    </main>

    <footer class="py-5">
      <div class="container">
          <div class="row">
            <div class="col-6 col-md-2 mb-3">
              <h5>Section</h5>
              <ul class="nav flex-column">
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Home</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Features</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Pricing</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">FAQs</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">About</a></li>
              </ul>
            </div>

            <div class="col-6 col-md-2 mb-3">
              <h5>Section</h5>
              <ul class="nav flex-column">
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Home</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Features</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Pricing</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">FAQs</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">About</a></li>
              </ul>
            </div>

            <div class="col-6 col-md-2 mb-3">
              <h5>Section</h5>
              <ul class="nav flex-column">
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Home</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Features</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Pricing</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">FAQs</a></li>
                <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">About</a></li>
              </ul>
            </div>

            <div class="col-md-5 offset-md-1 mb-3">
              <form>
                <h5>Subscribe to our newsletter</h5>
                <p>Monthly digest of what's new and exciting from us.</p>
                <div class="d-flex flex-column flex-sm-row w-100 gap-2">
                  <label for="newsletter1" class="visually-hidden">Email address</label>
                  <input id="newsletter1" type="text" class="form-control" placeholder="Email address">
                  <button class="btn btn-primary" type="button">Subscribe</button>
                </div>
              </form>
            </div>
          </div>

          <div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            <p>&copy; 2024 Company, Inc. All rights reserved.</p>
            <ul class="list-unstyled d-flex">
                <li class="ms-3">
                    <a class="link-body-emphasis" href="#">
                        <i class="bi bi-twitter" style="font-size: 24px;"></i>
                    </a>
                </li>
                <li class="ms-3">
                    <a class="link-body-emphasis" href="#">
                        <i class="bi bi-instagram" style="font-size: 24px;"></i>
                    </a>
                </li>
                <li class="ms-3">
                    <a class="link-body-emphasis" href="#">
                        <i class="bi bi-facebook" style="font-size: 24px;"></i>
                    </a>
                </li>
            </ul>
          </div>
      </div>
    </footer>

</div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Font Awesome -->
  <script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
  <script src="js/main.js"></script>
  <script src="js/script.js"></script>
  <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>