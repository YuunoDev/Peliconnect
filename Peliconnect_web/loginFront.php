<?php
session_start();
?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="css/estilos.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    	 <link rel="shortcut icon" href="media/images (1).jpg" />


    <style>
     body {
        background: url('img/fondo_signin.jpg') no-repeat center center fixed;
        background-size: cover; 
        margin: 0;
        padding: 0;
        position: relative;
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

    main {
        position: relative;
        z-index: 1;
        flex: 1; /* Ocupar espacio disponible */
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    /* Tarjeta de inicio de sesión */
    main > div {
        max-width: 400px;
        width: 100%;
        padding: 2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    p {
        text-align: center;
        margin-top: 1rem;
        color: #fff;
    }

    .btn-primary {
        background-color: #e50914;
        border: none;
    }

    .btn-primary:hover {
        background-color: #c10812;
    }

    /* Ajustar el header y el footer para que el texto sea más legible sobre el fondo */
    header .contenedor h2, 
    header .contenedor nav a {
        color: #fff;
    }

    header {
        background: rgba(0,0,0,0.5);
        padding: 1rem 0;
    }

    header .contenedor {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 90%;
        margin: 0 auto;
    }

    header nav a {
        margin-left: 1rem;
        text-decoration: none;
    }

    footer {
        background: rgba(0,0,0,0.5);
        color: #fff;
        padding: 1rem 0;
    }

    footer a {
        color: #fff !important;
    }

    footer .row h5, 
    footer .row p, 
    footer .row a {
        color: #fff !important;
    }

    .text-body-secondary {
        color: rgba(255,255,255,0.7)!important;
    }

    /* En el footer, ajuste de colores e iconos */
    footer .link-body-emphasis {
        color: #fff !important;
    }

    footer .link-body-emphasis:hover {
        color: #ccc !important;
    }

    /* Ajustar el texto del formulario */
    main form p a {
        color: #e50914;
        text-decoration: none;
    }

    main form p a:hover {
        text-decoration: underline;
    }
    
    </style>
  </head>
  <body>
  
<div class="page-container">

	<header>
		<div class="contenedor">
			<h2 class="logotipo" style="color:#E50914">PeliConnect</h2>
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
      <div>
      <?php if (isset($_SESSION["usuario"])): ?>
        <h1>Bienvenido <?php echo htmlspecialchars($_SESSION["usuario"]); ?>!</h1>
        <form action="logout.php" method="POST" class="text-center">
        </form>
      <?php else: ?>
        <h1>Iniciar sesión</h1>
        <form action="login.php" method="POST">
          <div class="mb-3">
            <label for="user" class="form-label">Usuario</label>
            <input type="text" class="form-control" id="user" name="user" placeholder="Ingrese su usuario" required>
          </div>
          <div class="mb-3">
            <label for="pass" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="pass" name="pass" placeholder="Ingrese su contraseña" required>
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" value="remember-me" id="rememberMe">
            <label class="form-check-label" for="rememberMe">
              Acuérdame
            </label>
          </div>
          <button class="btn btn-primary w-100" type="submit">Iniciar sesión</button>
        </form>
        <p class="text-center" style="color:black">
        ¿No tienes una cuenta? <a href="#" class="text-primary">Regístrate aquí</a>
        </p>
      <?php endif; ?>
      <p class="text-muted">&copy; 2017–2024</p>
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
    <!-- Font Awesome y Bootstrap JS -->
	<script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
	<script src="js/main.js"></script>
	<script src="js/script.js"></script>
	<script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

  </body>
</html>
