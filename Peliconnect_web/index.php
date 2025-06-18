<?php
  session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="css/estilos.css">
	<link rel="stylesheet" href="css/styles.css">
	<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet"> 
	<title>PeliConnect</title>
	<!-- Bootstrap para el carrusel -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

	<style>
		.bd-mode-toggle .dropdown-menu .active .bi {
         display: block !important;
     }

	 .btn-bd-primary {
        --bd-violet-bg: #712cf9;
        --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

        --bs-btn-font-weight: 600;
        --bs-btn-color: var(--bs-white);
        --bs-btn-bg: var(--bd-violet-bg);
        --bs-btn-border-color: var(--bd-violet-bg);
        --bs-btn-hover-color: var(--bs-white);
        --bs-btn-hover-bg: #6528e0;
        --bs-btn-hover-border-color: #6528e0;
        --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
        --bs-btn-active-color: var(--bs-btn-hover-color);
        --bs-btn-active-bg: #5a23c8;
        --bs-btn-active-border-color: #5a23c8;
      }

	</style>

</head>
<body>

<svg xmlns="http://www.w3.org/2000/svg" class="d-none">
      <symbol id="check2" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
      </symbol>
      <symbol id="circle-half" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
      </symbol>
      <symbol id="moon-stars-fill" viewBox="0 0 16 16">
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
      </symbol>
      <symbol id="sun-fill" viewBox="0 0 16 16">
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
      </symbol>
    </svg>

<div style="background-dolor=" class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button  class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
              id="bd-theme"
              type="button"
              aria-expanded="false"
              data-bs-toggle="dropdown"
              aria-label="Toggle theme (auto)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#circle-half"></use></svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="#sun-fill"></use></svg>
            Light
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="#moon-stars-fill"></use></svg>
            Dark
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="#circle-half"></use></svg>
            Auto
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="#check2"></use></svg>
          </button>
        </li>
      </ul>
    </div>

	<svg xmlns="http://www.w3.org/2000/svg" class="d-none">
  <symbol id="arrow-right-short" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
  </symbol>
  <symbol id="x-lg" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
    <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
  </symbol>
</svg>

<!-- Header -->
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
		</div>
	</header>

	<main>
		<div class="pelicula-principal">
			<div class="contenedor">
				<h3 class="titulo">Interestellar</h3>
				<p class="descripcion">
					Narra las aventuras de un grupo de exploradores que hacen uso de un agujero de gusano recientemente descubierto para superar las limitaciones de los viajes espaciales tripulados y vencer las inmensas distancias que tiene un viaje interestelar.
				</p>
				<button role="button" class="boton"><i class="fas fa-play"></i> Reproducir</button>
				<button role="button" class="boton"><i class="fas fa-info-circle"></i> Más información</button>
			</div>
		</div>
		
		  <div class="b-example-divider"></div>

<!-- Carrusel de peliculas -->

		  <div class="container mt-5">
			<h2 class="text-center mb-4">Catalogo</h2>
			<div id="movieCarousel" class="carousel slide" data-bs-ride="carousel">
				<!-- Indicadores Personalizados -->
				<div class="carousel-indicators">
					<button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="0" class="active"></button>
					<button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="1"></button>
					<button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="2"></button>
				</div>
	
				<!-- Carrusel -->
				<div class="carousel-inner">
					<div class="carousel-item active">
						<div class="d-flex justify-content-around" id="carru1">
						</div>
					</div>
					<div class="carousel-item">
						<div class="d-flex justify-content-around" id="carru2">
						</div>
					</div>
					<div class="carousel-item">
						<div class="d-flex justify-content-around" id="carru3">
						</div>
					</div>
				</div>
			</div>
		</div>
<br><br>

<!-- Carrusel de anuncios de peliculas -->
		<div id="carouselExampleDark" class="carousel carousel-dark slide">
			<div class="carousel-indicators">
			  <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
			  <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
			  <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
			</div>
			<div class="carousel-inner">
			  <div class="carousel-item active" data-bs-interval="10000">
				<img style=" filter: brightness(40%); " src="img/carrusel1.png" class="d-block w-100" alt="...">
				<div class="carousel-caption d-none d-md-block">
				  <h5 style="color: white;">Explora la Oscuridad</h5>
				  <p style="color: white;">Descubre historias que desafían tus límites.</p>
				</div>
			  </div>
			  <div class="carousel-item" data-bs-interval="2000">
				<img style=" filter: brightness(40%); " src="img/carrusel2.jpg" class="d-block w-100" alt="...">
				<div class="carousel-caption d-none d-md-block">
				  <h5 style="color: white;">Elige tu Próxima Aventura</h5>
				  <p style="color: white;">Acción, drama o terror... ¿Qué verás hoy?</p>
				</div>
			  </div>
			  <div class="carousel-item">
				<img style=" filter: brightness(40%); " src="img/carrusel3.jpeg" class="d-block w-100" alt="...">
				<div class="carousel-caption d-none d-md-block">
				  <h5 style="color: white;">Sumérgete en el Suspenso</h5>
				  <p style="color: white;">Las emociones están a un clic de distancia.</p>
				</div>
			  </div>
			</div>
			<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
			  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
			  <span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
			  <span class="carousel-control-next-icon" aria-hidden="true"></span>
			  <span class="visually-hidden">Next</span>
			</button>
		  </div>
	</main>
<br>
<br>
	<!-- Footer -->
	<div class="container">
		<footer class="py-5">
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
		</footer>
	  </div>

	<!-- Font Awesome y Bootstrap JS -->
	<script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	<script src="js/main.js"></script>
	<script src="js/script.js"></script>
	<script src="../assets/dist/js/bootstrap.bundle.min.js"></script>


	<!-- Tu JavaScript para el cambio de tema -->
    <script>
      (() => {
  const setTheme = theme => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    // Actualizar el icono en el botón principal
    const themeIcon = document.querySelector('.theme-icon-active use');
    if (theme === 'light') {
      themeIcon.setAttribute('href', '#sun-fill');
    } else if (theme === 'dark') {
      themeIcon.setAttribute('href', '#moon-stars-fill');
    } else {
      themeIcon.setAttribute('href', '#circle-half');
    }
  };

  const storedTheme = localStorage.getItem('theme') || 'auto';
  setTheme(storedTheme);

  document.querySelectorAll('[data-bs-theme-value]').forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-bs-theme-value');
      setTheme(theme);

      // Actualiza la clase active
      document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
    });
  });
})();
    </script>
</body>
</html>
