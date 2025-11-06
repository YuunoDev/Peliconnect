const express = require("express"); //importar express 
const bodyParser = require("body-parser"); 

const cors = require("cors");
const fetch = require('node-fetch');

var fs = require('fs');
const bcrypt = require('bcrypt');

const { google } = require('googleapis');

var mysql = require('mysql2');
const { log } = require("console");

// Autenticación con Google
const auth = new google.auth.GoogleAuth({
    keyFile: 'proyecto-redes-444904-47e9db701377.json', // Ruta al archivo JSON de claves
    scopes: ['https://www.googleapis.com/auth/drive.file'], // Permisos para Drive
});

const drive = google.drive({ version: 'v3', auth });

const app = express(); //crear al servidor 
const router = express.Router();
const port = process.env.PORT || 3000; 

const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDhkYjEyZTBkNGM2OTU1MzhkMjMwYzI2NzBlMmU5YyIsIm5iZiI6MTczMzk2MzU2Ny4wMDYsInN1YiI6IjY3NWEyZjJlYzdkM2YyZjkzZTEyZTRhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ckuzPo91b88XnhxtpPGdQCaKjIXs_vtYwy1N9tXqs2k';

app.use(cors());
app.use(bodyParser.urlencoded({ extended:false})); 
app.use(bodyParser.json()); 
app.listen(port, () => { 
    console.log(`hola servidor ejecucion en http://localhost:${port}`); 
}) 

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "peliconnect"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

async function subirArchivo(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName, // Nombre del archivo en Google Drive
            parents: ['1wX1Awl_4npftAVFDNKoo320To3w4jiwI']
        };

        const media = {
            mimeType: 'text/plain', // Tipo de archivo
            body: fs.createReadStream(filePath), // Leer el archivo
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id', // Solicita el ID del archivo subido
        });

        console.log(`Archivo subido con éxito. ID: ${response.data.id}`);
    } catch (error) {
        console.error('Error al subir el archivo:', error);
    }
}



router.get('/fetch_movie/:param', async (req, res) => {
  const { param } = req.params;
  const isNumeric = !isNaN(param); // Verifica si es un ID numérico
  log(isNumeric);
  log(param);
  const baseUrl = 'https://api.themoviedb.org/3';
  const url = isNumeric
    ? `${baseUrl}/movie/${param}?language=es-MX` // búsqueda por ID
    : `${baseUrl}/search/movie?query=${encodeURIComponent(param)}&include_adult=false&language=es-MX&page=1`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: API_KEY
    }
  };

  log(url)

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (isNumeric) {
      // Si se buscó por ID
      if (!data || data.success === false) {
        return res.json({ movies: [] });
      }

      const movie = {
        id: data.id,
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path,
        vote_average: data.vote_average
      };

      return res.json({ movies: [movie] });
    }

    // Si se buscó por nombre
    if (!data.results || data.results.length === 0) {
      return res.json({ movies: [] });
    }

    const movies = data.results
      .filter(m => 
        m.overview && m.overview.trim().length > 0 &&
        m.poster_path && m.poster_path.trim().length > 0
      )
      .map(m => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        poster_path: m.poster_path,
        vote_average: m.vote_average
      }));
    
    res.json({ movies });
  } catch (error) {
    console.error('Error al buscar película:', error);
    res.status(500).json({ error: 'Error al buscar película' });
  }
});




router.get('/get_details/:id', async (req, res) => {
  const { id } = req.params;

  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?language=es-MX`;
  const movieVideosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?language=es-MX`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: API_KEY
    }
  };

  try {
    // --- Obtener detalles de la película ---
    const responseDetails = await fetch(movieDetailsUrl, options);
    const details = await responseDetails.json();

    // --- Obtener videos (para el tráiler) ---
    const responseVideos = await fetch(movieVideosUrl, options);
    const videos = await responseVideos.json();

    // Buscar el tráiler oficial de YouTube
    const trailer = videos.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    // --- Construir respuesta final ---
    res.json({
      id: details.id,
      title: details.title,
      original_title: details.original_title,
      overview: details.overview,
      release_date: details.release_date,
      runtime: details.runtime,
      vote_average: details.vote_average,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      genres: details.genres?.map(g => g.name) || [],
      trailer_key: trailer ? trailer.key : null, // para generar el embed de YouTube
      homepage: details.homepage,
      tagline: details.tagline,
      status: details.status,
      production_companies: details.production_companies?.map(c => c.name) || []
    });

  } catch (e) {
    console.error("Error al obtener detalles:", e);
    res.status(500).json({ error: 'Error al obtener los detalles de la película' });
  }
});


router.get(`/get_movies/:page`, async (req, res) => {
    const page = req.params.page || 1; // Default to page 1 if not provided
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-MX&page=${page}&sort_by=popularity.desc`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const responseMovies = await fetch(url, options)
    .then(res => res.json())
    .catch(e => {
        console.log(e);
    })

    console.log("RESPONSE: ", responseMovies);

    res.json({
        movies: responseMovies.results
    });

})

router.get(`/aniadeLista/:pelicula/:usuario`, async(req, res) =>{
    const pelicula = req.params.pelicula;
    const usuario = req.params.usuario;
    let peliculaExiste = false;
    let idUser = '';
    
    const idUserQuery = 'SELECT id FROM Usuario WHERE nombre = ?';
    con.query(idUserQuery, [usuario], (err, results) => {
        if (results) {
            idUser = results[0].id;
            console.log('ID de usuario encontrado:', idUser);
        }
        if (err) {
            console.error('Error al buscar ID de usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }});

    try {
        // Verificar si ya existe en la lista de favoritos
        const checkQuery = 'SELECT * FROM favorito WHERE ID_usuario = ? AND ID_pelicula = ?';
        con.query(checkQuery, [usuario, pelicula], (err3, results3) => {
            if (err3) {
                console.error('Error al verificar favorito existente:', err3);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            if (results3.length > 0) {
                console.log('La película ya está en la lista de favoritos');
                peliculaExiste = true;
            }
            // Si no existe, insertar en la lista de favoritos
            if (!peliculaExiste) {
                const insertQuery = 'INSERT INTO favorito (ID_usuario, ID_pelicula, ID_preferencia, Fecha) VALUES (?, ?, ?, ?)';
                // numero aleatorio entre 1 y 5
                const num = Math.floor(Math.random() * 5) + 1; // Genera un número entre 1 y 5
                con.query(insertQuery, [idUser, pelicula, num, new Date()], (err4) => {
                    if (err4) {
                        console.error('Error al insertar en la lista de favoritos:', err4);
                        return res.status(500).json({ error: 'Error interno del servidor.' });
                    }
                    console.log('Película añadida a la lista de favoritos');
                    res.json({ success: true, message: 'Película añadida a la lista de favoritos' });
                });
            } else {
                // Si la película ya existe, enviar respuesta
                res.json({ success: false, message: 'La película ya está en la lista de favoritos' });
            }});
    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
})

router.get(`/leerLista/:usuario`, async (req, res) => {
    console.log('Leer lista de usuario:', req.params.usuario);
    const usuario = req.params.usuario;

    try {
        // Buscar ID de usuario
        const idQuery = 'SELECT id FROM Usuario WHERE nombre = ?';
        
        con.query(idQuery, [usuario], (err, results) => {
            if (err) {
                console.error('Error al buscar ID de usuario:', err);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }

            if (results.length === 0) {
                console.log('Usuario no encontrado');
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const idUser = results[0].id;
            console.log('ID de usuario encontrado:', idUser);

            // Ahora buscar las películas favoritas (dentro del callback)
            const query = `SELECT ID_pelicula FROM favorito where ID_usuario = 501;`;

            con.query(query, [idUser], (err, results) => {
                if (err) {
                    console.error('Error al obtener las películas favoritas:', err);
                    return res.status(500).json({ error: 'Error interno del servidor.' });
                }

                if (results.length > 0) {
                    console.log('Películas favoritas encontradas:', results);
                    const peliculas = results.map(row => row.ID_pelicula);
                    res.json(peliculas);
                } else {
                    console.log('No se encontraron películas favoritas para el usuario.');
                    res.json([]); // Enviar array vacío en lugar de error 404
                }
            });
        });

    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


router.post('/guardaReview', (req, res) => {
    log('Registrar review' + req.body);
    const { usuario, pelicula, texto, calificacion } = req.body;
    idUser = '';
    idMovie = '';
    
    // Verificar si el usuario existe
    const idQuery = 'SELECT id FROM Usuario WHERE nombre = ?';
    con.query(idQuery, [usuario], (err, results) => {
        if (err) {
            console.error('Error al verificar usuario:', err);
            return res.status(500).send(false);
        }
        if (results.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(404).send(false);
        }
        idUser = results[0].id;
    });


    // Verificar si ya existe una review del mismo usuario para la misma película
    const checkQuery = 'SELECT * FROM review WHERE ID_usuario = ? AND ID_pelicula = ?';
    con.query(checkQuery, [idUser, pelicula], (err, results) => {
        if (err) {
            console.error('Error al verificar review existente:', err);
            return res.status(500).send(false);
        }

        if (results.length > 0) {
            console.log('Review ya registrada');
            return res.send(false);
        }

        // Insertar la nueva review
        const insertQuery = 'INSERT INTO review (ID_usuario, ID_pelicula, contenido, calificacion) VALUES (?, ?, ?, ?)';
        con.query(insertQuery, [idUser, pelicula, texto, calificacion], (err2) => {
            if (err2) {
                console.error('Error al insertar review:', err2);
                return res.status(500).send(false);
            }

            console.log('Review registrada');
            res.send(true);
        });
    });
});

router.get('/leerReviews/:pelicula', (req, res) => {
    log('Obtener reviews de la pelicula: ' + req.params.pelicula);
    const pelicula = req.params.pelicula;
    

    const query = `
        SELECT u.Nombre AS usuario, r.Contenido AS texto, r.Calificacion AS calificacion
        FROM Usuario u
        INNER JOIN review r ON u.ID = r.ID_usuario
        WHERE r.ID_pelicula = ?
    `;

    con.query(query, [pelicula], (err, results) => {
        if (err) {
            console.error('Error al obtener las reseñas:', err);
            return res.status(500).send('Error interno del servidor.');
        }

        res.json(results);

        log('Reseñas obtenidas:', results);
    });
});

router.post('/login', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    // Consulta para verificar si existe un usuario con esa contraseña
    const query = 'SELECT * FROM Usuario WHERE nombre = ? AND contraseña = ?';
    con.query(query, [user, pass], (err, results) => {
        if (err) {
            console.error('Error al verificar credenciales:', err);
            return res.status(500).send('Error interno del servidor.');
        }

        if (results.length > 0) {
            console.log('Sesión iniciada');
            res.send(true);
        } else {
            console.log('Fallo en inicio de sesión');
            res.send(false);
        }
    });
});

router.post(`/registrarUsuario`, async (req, res) =>{
    console.log('entro a funcion');
    const user = req.body.user;
    const pass = req.body.pass;
    log('Registrar usuario: ' + user + pass);

    // Verificar si el usuario ya existe
    con.query('SELECT * FROM Usuario WHERE nombre = ?', [user], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).send('Error interno');
        }

        if (results.length > 0) {
            console.log('Usuario ya existente');
            return res.send(false);
        }

        // Usuario no existe, registrarlo
        try {
            con.query(
                'INSERT INTO Usuario (nombre, contraseña) VALUES (?, ?)',
                [user, pass],
                (err2, results2) => {
                    if (err2) {
                        console.error('Error al insertar usuario:', err2);
                        return res.status(500).send('Error al registrar usuario');
                    }

                    console.log('Usuario registrado');
                    res.send(true);
                }
            );
        } catch (error) {
            console.error('Error al registrar ususario:', error);
            res.status(500).send('Error interno');
        }
    });
})

app.use(router);
module.exports = router;
