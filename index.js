var mysql = require("mysql2");
const express = require("express"); //importar express 
const bodyParser = require("body-parser");

const cors = require("cors");
const fetch = require('node-fetch');

var fs = require('fs');
const bcrypt = require('bcrypt');

const { google } = require('googleapis');


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`hola servidor ejecucion en http://localhost:${port}`);
})

//conexion a la base de datos
var connection = mysql.createConnection({
    host: "peliconnect.ddns.net",
    port: 3306,
    user: "wndarchitect",
    password: "Wndall.?53",
    database: "peliconnectdb"
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
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


// Rutas de la API

// Buscar pelicula por nombre
router.get(`/fetch_movie/:nombre`, async (req, res) => {
    const { nombre } = req.params;
    const urlSearchMovie = `https://api.themoviedb.org/3/search/movie?query=${nombre}&include_adult=false&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const responseSearch = await fetch(urlSearchMovie, options)
        .then(res => res.json())
        .catch(e => {
            console.log(e);
        })

    console.log("RESPONSE: ", responseSearch);

    res.json({
        title: responseSearch.results[0].title,
        overview: responseSearch.results[0].overview,
        poster_path: responseSearch.results[0].poster_path,
        vote_average: responseSearch.results[0].vote_average
    });

})

router.get(`/get_details/:id`, async (req, res) => {
    const { id } = req.params;
    const urlSearchMovie = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    };

    const responseDetails = await fetch(urlSearchMovie, options)
        .then(res => res.json())
        .catch(e => {
            console.log(e);
        })

    console.log("RESPONSE: ", responseDetails);

    res.json({
        title: responseDetails.title,
        original_title: responseDetails.original_title,
        release_date: responseDetails.release_date,
        runtime: responseDetails.runtime,
        overview: responseDetails.overview,
        poster_path: responseDetails.poster_path,
        vote_average: responseDetails.vote_average
    });
})

// Obtener lista de peliculas populares
router.get(`/get_movies/:page`, async (req, res) => {
    const page = req.params.page || 1; // Default to page 1 if not provided
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
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

// Añadir pelicula a la lista de favoritos
router.get(`/aniadeLista/:pelicula/:id/:idp`, async (req, res) => {
    const pelicula = req.params.pelicula;
    const userId = req.params.id;
    const idp = req.params.idp; // ID de la película, si se proporciona
    let peliculaExiste = false;

    try {
        // agregar pelicula a la base de datos si es que no existe en peliculas
        const checkMovieQuery = 'SELECT * FROM pelicula WHERE id = ?';
        connection.query(checkMovieQuery, [idp], (err, results) => {
            if (err) {
                console.error('Error al verificar película existente:', err);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            if (results.length === 0) {
                // Si la película no existe, insertarla llamando al api de TMDB, por id
                const urlSearchMovie = `https://api.themoviedb.org/3/movie/${idp}?language=en-US`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: API_KEY
                    }
                };
                fetch(urlSearchMovie, options)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results && data.results.length > 0) {
                            const movieData = data.results[0];
                            const insertMovieQuery = 'INSERT INTO pelicula (ID,Nombre, Genero, Año, Duracion, Imagen, Descripcion, Calificacion) VALUES (?, ?, ?, ?, ?, ?, ?)';
                            connection.query(insertMovieQuery, [
                                idp,
                                movieData.title,
                                movieData.genre_ids.join(', '), // Asumiendo que tienes un campo para géneros
                                new Date(movieData.release_date).getFullYear(),
                                movieData.runtime || 0, // Si no hay duración, poner 0
                                movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
                                movieData.overview || '',
                                movieData.vote_average ? movieData.vote_average.toString() : 'N/A'
                            ], (err2) => {
                                if (err2) {
                                    console.error('Error al insertar película:', err2);
                                    return res.status(500).json({ error: 'Error interno del servidor.' });
                                }
                                console.log('Película añadida a la base de datos');
                            });
                        } else {
                            console.log('No se encontraron resultados para la película');
                            return res.status(404).json({ error: 'Película no encontrada' });
                        }
                    })
            }

        });
        // Buscar ID de usuario
        console.log('ID de usuario encontrado:', userId);
        // Ahora buscar ID de película

        const movieQuery = 'SELECT id FROM pelicula WHERE nombre = ?';
        connection.query(movieQuery, [pelicula], (err2, results2) => {
            if (err2) {
                console.error('Error al buscar ID de película:', err2);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            if (results2.length === 0) {
                console.log('Película no encontrada');
                return res.status(404).json({ error: 'Película no encontrada' });
            }
            const idMovie = results2[0].id;
            console.log('ID de película encontrado:', idMovie);
            // Verificar si ya existe en la lista de favoritos
            const checkQuery = 'SELECT * FROM favorito WHERE ID_usuario = ? AND ID_pelicula = ?';
            connection.query(checkQuery, [userId, idMovie], (err3, results3) => {
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
                    connection.query(insertQuery, [userId, idMovie, num, new Date()], (err4) => {
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
                }
            });
        });
    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
})

// Leer lista de peliculas favoritas
router.get(`/leerLista/:id`, async (req, res) => {
    console.log('Leer lista de usuario:', req.params.id);
    const userId = req.params.id;

    try {
        // Buscar ID de usuario
        console.log('ID de usuario encontrado:', userId);

        // Ahora buscar las películas favoritas (dentro del callback)
        const query = `SELECT P.Nombre
                FROM favorito F 
                JOIN pelicula P ON F.ID_pelicula = P.ID 
                JOIN usuario U ON F.ID_usuario = U.ID
                WHERE U.ID = ?`;

        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error al obtener las películas favoritas:', err);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }

            if (results.length > 0) {
                console.log('Películas favoritas encontradas:', results);
                const peliculas = results.map(row => row.Nombre);
                res.json(peliculas);
            } else {
                console.log('No se encontraron películas favoritas para el usuario.');
                res.json([]); // Enviar array vacío en lugar de error 404
            }
        });

    } catch (error) {
        console.error('Error general:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Guardar review
router.get('/guardaReview/:id/:pelicula/:calificacion/:texto', (req, res) => {
    const id = req.params.id;
    const pelicula = req.params.pelicula;
    const calificacion = req.params.calificacion;
    const texto = req.params.texto;
    idUser = '';
    idMovie = '';

    // Verificar si el usuario existe
    const idQuery = 'SELECT id FROM Usuario WHERE id = ?';
    connection.query(idQuery, [usuario], (err, results) => {
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

    // Verificar si la película existe
    const movieQuery = 'SELECT id FROM Pelicula WHERE nombre = ?';
    connection.query(movieQuery, [pelicula], (err2, results2) => {
        if (err2) {
            console.error('Error al verificar película:', err2);
            return res.status(500).send(false);
        }
        if (results2.length === 0) {
            console.log('Película no encontrada');
            return res.status(404).send(false);
        }
        idMovie = results2[0].id;
    });

    // Verificar si ya existe una review del mismo usuario para la misma película
    const checkQuery = 'SELECT * FROM review WHERE ID_usuario = ? AND ID_pelicula = ?';
    connection.query(checkQuery, [idUser, idMovie], (err, results) => {
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
        connection.query(insertQuery, [idUser, idMovie, texto, calificacion], (err2) => {
            if (err2) {
                console.error('Error al insertar review:', err2);
                return res.status(500).send(false);
            }

            console.log('Review registrada');
            res.send(true);
        });
    });
});

// Leer reviews
router.get('/leerReviews/:pelicula', (req, res) => {
    const pelicula = req.params.pelicula;

    // Verificar si la película existe
    const movieQuery = 'SELECT id FROM Pelicula WHERE nombre = ?';
    connection.query(movieQuery, [pelicula], (err2, results2) => {
        if (err2) {
            console.error('Error al verificar película:', err2);
            return res.status(500).send(false);
        }

        if (results2.length === 0) {
            console.log('Película no encontrada');
            return res.status(404).send(false);
        }

        const idMovie = results2[0].id;

        const query = `
            SELECT u.Nombre AS usuario, r.Contenido AS texto, r.Calificacion AS calificacion
            FROM Usuario u
            INNER JOIN review r ON u.ID = r.ID_usuario
            WHERE r.ID_pelicula = ?
        `;

        connection.query(query, [idMovie], (err, results) => {
            if (err) {
                console.error('Error al obtener las reviews:', err);
                return res.status(500).send('Error interno del servidor.');
            }

            res.json(results);
        });
    });
});

// Borrar review
router.get('/borrarReview/:id/:pelicula', (req, res) => {
    const userId = req.params.id;
    const pelicula = req.params.pelicula;

    // Verificar si la película existe
    const movieQuery = 'SELECT id FROM Pelicula WHERE nombre = ?';
    connection.query(movieQuery, [pelicula], (err2, results2) => {
        if (err2) {
            console.error('Error al verificar película:', err2);
            return res.status(500).send(false);
        }
        if (results2.length === 0) {
            console.log('Película no encontrada');
            return res.status(404).send(false);
        }
        idMovie = results2[0].id;
        // Borrar la review
        const deleteQuery = 'DELETE FROM review WHERE ID_usuario = ? AND ID_pelicula = ?';
        connection.query(deleteQuery, [userId, idMovie], (err3) => {
            if (err3) {
                console.error('Error al borrar review:', err3);
                return res.status(500).send(false);
            }

            console.log('Review borrada');
            res.send(true);
        }
        );
    });
});

// Editar review
router.get('/editarReview/:id/:pelicula/:calificacion/:texto', (req, res) => {
    const userId = req.params.id;
    const pelicula = req.params.pelicula;
    const calificacion = req.params.calificacion;
    const texto = req.params.texto;
    idMovie = '';
    

    // Verificar si la película existe
    const movieQuery = 'SELECT id FROM Pelicula WHERE nombre = ?';
    connection.query(movieQuery, [pelicula], (err2, results2) => {
        if (err2) {
            console.error('Error al verificar película:', err2);
            return res.status(500).send(false);
        }
        if (results2.length === 0) {
            console.log('Película no encontrada');
            return res.status(404).send(false);
        }
        idMovie = results2[0].id;
        // Actualizar la review
        const updateQuery = 'UPDATE review SET contenido = ?, calificacion = ? WHERE ID_usuario = ? AND ID_pelicula = ?';
        connection.query(updateQuery, [texto, calificacion, userId, idMovie], (err3) => {
            if (err3) {
                console.error('Error al editar review:', err3);
                return res.status(500).send(false);
            }
            console.log('Review editada');
            res.send(true);
        });
    });
});

// Iniciar sesión
router.get('/login/:user/:pass', (req, res) => {
    const user = req.params.user;
    const pass = req.params.pass;

    const passhash = bcrypt.hashSync(pass, 10);

    // Consulta para verificar si existe un usuario con esa contraseña
    const query = 'SELECT * FROM Usuario WHERE nombre = ? AND contraseña = ?';
    connection.query(query, [user, passhash], (err, results) => {
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

// Registrar usuario
router.post(`/registrarUsuario`, async (req, res) => {
    console.log('entro a funcion');
    const user = req.body.user;
    const pass = req.body.pass;

    // Verificar si el usuario ya existe
    connection.query('SELECT * FROM Usuario WHERE nombre = ?', [user], async (err, results) => {
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
            // encriptar contraseña con bcrypt
            const hashedPass = await bcrypt.hash(pass, 10);

            connection.query(
                'INSERT INTO Usuario (nombre, password) VALUES (?, ?)',
                [user, hashedPass],
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
});

// Eliminar usuario (baja logica)
router.get('/eliminarUsuario/:id',  (req, res) => {
    const userId = req.params.id;

    console.log('ID de usuario a eliminar:', userId);

    // Marcar usuario como eliminado
    const query = 'UPDATE Usuario SET activo = 0 WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).send('Error interno del servidor.');
        }

        if (results.affectedRows > 0) {
            console.log('Usuario eliminado');
            res.send(true);
        } else {
            console.log('Usuario no encontrado');
            res.send(false);
        }
    });
});

// Activar usuario
router.get('/activarUsuario/:id', (req, res) => {
    const userId = req.params.id;
    // Buscar ID de usuario
    console.log('ID de usuario a activar:', userId);
    // Marcar usuario como activo
    const query = 'UPDATE Usuario SET activo = 1 WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al activar usuario:', err);
            return res.status(500).send('Error interno del servidor.');
        }
        if (results.affectedRows > 0) {
            console.log('Usuario activado');
            res.send(true);
        } else {
            console.log('Usuario no encontrado');
            res.send(false);
        }
    });
});
// --------------------------------------- CRUD reporte ---------------------------------------

// 🟢 Obtener todos los reportes
router.get("/report/view", (req, res) => {
  const sql = "SELECT * FROM reporte";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔵 Obtener un reporte por ID
router.get("/report/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM reporte WHERE id_reporte = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Reporte no encontrado" });
    res.json(results[0]);
  });
});

// 🟡 Crear un nuevo reporte
router.post("/report", (req, res) => {
    console.log("entro a crear reporte");
  const { descripcion, id_user, id_review, fecha_reporte } = req.body;
  const sql = "INSERT INTO reporte (descripcion, id_user, id_review, fecha_reporte) VALUES (?, ?, ?, ?)";
  connection.query(sql, [descripcion, id_user, id_review, fecha_reporte], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Reporte creado", id: result.insertId });
  });
});

// 🟠 Actualizar un reporte
router.put("/report/:id", (req, res) => {
  const { id } = req.params;
  const { descripcion, id_user, id_review, fecha_reporte } = req.body;
  const sql = "UPDATE reporte SET descripcion = ?, id_user = ?, id_review = ?, fecha_reporte = ? WHERE id_reporte = ?";
  connection.query(sql, [descripcion, id_user, id_review, fecha_reporte, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Reporte no encontrado" });
    res.json({ message: "Reporte actualizado" });
  });
});

// 🔴 Eliminar un reporte
router.delete("/report/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM reporte WHERE id_reporte = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Reporte no encontrado" });
    res.json({ message: "Reporte eliminado" });
  });
});


// Función de ejemplo (asegúrate está definida antes)
function calcularSuma(a, b) {
    const numA = Number(a);
    const numB = Number(b);
    if (Number.isNaN(numA) || Number.isNaN(numB)) {
        throw new Error('Parámetros no son números válidos');
    }
    return numA + numB;
}

// Ruta de ejemplo (si no la tienes ya)
router.get('/calcular/suma/:a/:b', (req, res) => {
    try {
        const { a, b } = req.params;
        const resultado = calcularSuma(a, b);
        res.json({ a, b, resultado });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//funciones del servidor 

app.use(router);
module.exports = router;

// Exportar para pruebas unitarias
module.exports = { calcularSuma };
