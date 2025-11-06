<?php
  session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Info</title>
    <link rel="stylesheet" href="css/estilos.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet"> 
    <!-- Iconos de Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="styles.css">
    	 <link rel="shortcut icon" href="media/images (1).jpg" />

    
    <style>
        body {
            background-color: #1e1e1e;
            color: #e0e0e0;
           
        }
        h1 {
            color: #ffffff;
            font-size: 3rem;
            margin-bottom: 0;
        }
        p.text-muted {
            color: #aaaaaa !important;
            font-size: 1.1rem;
        }
        /* Contenedor principal de video y poster */
        .media-container {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            justify-content: center;
        }
        /* Ajustar altura y anchura proporcional de poster y video */
        .poster-container, .video-container {
            height: 400px;
            width: 300px; /* Ancho fijo para el póster */
        }
        .video-container {
            width: 500px; /* Más ancho para el video */
        }
        .poster-container img, .video-container video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
        .sidebar {
            background-color: #2b2b2b;
            border-radius: 10px;
            padding: 20px 15px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            height: 190px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .sidebar i {
            font-size: 2.5rem;
            color: #ffc107;
        }
        .sidebar p {
            font-size: 1.1rem;
            color: #ffffff;
            margin: 10px 0 0;
        }
        .btn-custom {
            background-color: #ffc107;
            color: #000;
            font-weight: bold;
            border-radius: 20px;
        }
        .btn-custom:hover {
            background-color: #e0a800;
        }
        /* Ajuste para que los badges no se solapen */
        .badges-container {
            margin-top: 2.5rem; /* Margen superior */
            clear: both; /* Evita el solapamiento */
        }
        .badges-container .badge {
            margin: 0 5px 5px 0;
            padding: 8px 12px;
            font-size: 0.9rem;
            white-space: nowrap;
        }
        /* Estilos para la sección de reseñas */
#reviewForm {
    max-width: 600px; /* Ancho máximo para el formulario */
    margin: 0 auto; /* Centrar el formulario */
}

#reviewForm input, 
#reviewForm textarea, 
#reviewForm select {
    width: 100%; /* Ajustar el ancho al 100% del contenedor */
    margin-bottom: 1rem; /* Espacio entre los campos */
    border-radius: 8px; /* Bordes redondeados */
    padding: 10px; /* Espaciado interno */
    border: 1px solid #ced4da; /* Borde suave */
}

#reviewForm textarea {
    resize: none; /* Evita que se redimensione manualmente */
    height: 150px; /* Altura específica para el textarea */
}

#reviewForm button {
    width: 100%; /* Botón del mismo ancho */
    padding: 10px; /* Espaciado interno */
    border-radius: 8px; /* Bordes redondeados */
    font-weight: bold;
}

#reviewsContainer {
    max-width: 600px; /* Ancho máximo para las reseñas */
    margin: 0 auto; /* Centrar reseñas */
    padding: 10px;
    background-color: #2b2b2b; /* Fondo oscuro */
    color: #e0e0e0; /* Texto claro */
    border-radius: 10px;
}

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

      .contenedor {
	width: 90%;
	margin: auto;
}

header {
	padding: 30px 0;
    background: #14141;
}

header .contenedor {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

header .logotipo {
	font-family: 'Bebas Neue', cursive;
	font-weight: normal;
	color: var(--rojo);
	font-size: 40px;
}

header nav a {
	color: #AAA;
	text-decoration: none;
	margin-right: 20px;
}

header nav a:hover,
header nav a.activo {
	color: #FFF;
}

    
      
    </style>
</head>
<body id="infoPeli">

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
</header>


    <div class="container mt-5">
        <!-- Encabezado -->
        <div class="row mb-4">
            <div class="col-12">
                <h1 class="fw-bold" id="titulo">Wicked</h1>
                <p class="text-muted" id="detalles">Título original: Wicked: Part I &bull; 2024 &bull; 120 minutos</span></p>
            </div>
        </div>

        <!-- Contenedor Principal -->
        <div class="media-container">
            <!-- Poster -->
            <div class="poster-container">
                <img id="imgPelicula" src="img/poster-wicked.jpg" alt="Wicked Poster">
                <button class="btn btn-custom mt-3 px-4 py-2" id="btnLista" onclick="aniadirLista()">Añadir a Mi lista</button>
            </div>

            <!-- Video -->
            <div class="video-container">
                <video controls>
                    <source src="media/trailer-wicked.mp4" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>

            <!-- Sidebar (Videos e Imágenes) -->
            <div class="d-flex flex-column justify-content-between">
                <div class="sidebar mb-3">
                    <i class="bi bi-camera-video"></i>
                    <p>27 VIDEOS</p>
                </div>
                <div class="sidebar">
                    <i class="bi bi-image"></i>
                    <p>99+ IMÁGENES</p>
                </div>
            </div>
        </div>

        <!-- Géneros y Descripción -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="badges-container">
                    <span class="badge bg-secondary">Fairy Tale</span>
                    <span class="badge bg-secondary">Pop Musical</span>
                    <span class="badge bg-secondary">Fantasy</span>
                    <span class="badge bg-secondary">Musical</span>
                    <span class="badge bg-secondary">Romance</span>
                </div>
                <p id="overview">
                    La historia de cómo una joven de piel verde es incriminada por el Mago de Oz y se convierte en la Malvada Bruja del Oeste. La primera de una adaptación cinematográfica en dos partes del musical de Broadway.
                </p>
                <p><strong>Dirección:</strong> <a href="#" class="text-info">Jon M. Chu</a></p>
                <p><strong>Guion:</strong> <a href="#" class="text-info">Winnie Holzman</a>, <a href="#" class="text-info">Dana Fox</a>, <a href="#" class="text-info">Gregory Maguire</a></p>
            </div>
        </div>
    </div>


     <!-- Sección de Reseñas -->
     <div class="row mt-5" id="resenia">
            <div class="col-12">
                <h3 style="text-align: center" class="fw-bold mb-3">Escribe una Reseña</h3>
                <form id="reviewForm" class="mb-4">
                    <!-- <div class="mb-3">
                        <label for="reviewName" class="form-label">Tu Nombre</label>
                        <input type="text" class="form-control" id="reviewName" placeholder="Ingresa tu nombre" required>
                    </div> -->
                    <div class="mb-3">
                        <label for="reviewText" class="form-label">Tu Reseña</label>
                        <textarea class="form-control" id="reviewText" rows="4" placeholder="Escribe tu reseña aquí..." required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="reviewRating" class="form-label">Calificación</label>
                        <select class="form-select" id="reviewRating" required>
                            <option value="" disabled selected>Selecciona una calificación</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>

                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar Reseña</button>
                </form>
                
                <!-- Reseñas Publicadas -->
                <h4 style="text-align: center" class="fw-bold mb-3">Reseñas</h4>
                <div id="reviewsContainer">
                    <p id="noReviews" class="text-muted">Aún no hay reseñas. ¡Sé el primero en escribir una!</p>
                </div>
            </div>

        </div>
<br><br><br>

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




        <!-- Script para manejar reseñas -->
        <script>
            const reviewForm = document.getElementById('reviewForm');
            const reviewsContainer = document.getElementById('reviewsContainer');
            const noReviews = document.getElementById('noReviews');
            const resenia = document.getElementById('resenia');

            reviewForm.addEventListener('submit', function(event) {
                event.preventDefault();

                // Captura los valores del formulario
                let usuario = getCookie('usuario');
                let pelicula = localStorage.getItem('nombre');
                const text = document.getElementById('reviewText').value;
                const rating = document.getElementById('reviewRating').value;

                let url = NODE_URL + "/guardaReview/" + usuario + "/" + pelicula + "/" + rating+  "/" + text;
                fetch(url)
                .then(res => res.json())
                .then(data =>{
                    console.log(data);
                })

                
                // Limpia el formulario
                reviewForm.reset();
            });

            document.addEventListener('DOMContentLoaded', function() {
                event.preventDefault();

                let pelicula = localStorage.getItem('nombre');

                let url =  NODE_URL + "/leerReviews/" + pelicula;
                console.log('Llamada a load');
                fetch(url)
                .then(res => res.json())
                .then(data =>{
                    data.forEach(review => {
                        const { usuario, calificacion, texto} = review;
                        // Crea una reseña
                        const reviewElement = document.createElement('div');
                        reviewElement.classList.add('border', 'rounded', 'p-3', 'mb-3', 'bg-light', 'text-dark');
                        reviewElement.innerHTML = `
                            <h5 class="mb-1">${usuario}</h5>
                            <p class="mb-1">${texto}</p>
                            <p class="mb-0"><strong>Calificación:</strong> ${calificacion} / 10</p>
                        `;

                        // Elimina el mensaje de "no hay reseñas" si existe
                        if (noReviews) {
                            noReviews.remove();
                        }

                        // Agrega la reseña al contenedor
                        reviewsContainer.appendChild(reviewElement);
                    });
                })
            });

        </script>

        <script src="js/script.js"></script>
        <script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
        <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

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