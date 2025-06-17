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
app.use(bodyParser.urlencoded({ extended:false})); 
app.use(bodyParser.json()); 

app.use(express.static(process.cwd() + '/public')); //para servir archivos estaticos

app.listen(port, () => { 
    console.log(`hola servidor ejecucion en http://localhost:${port}`); 
}) 


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



router.get(`/fetch_movie/:nombre`, async (req,res) =>{
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

router.get(`/get_details/:id` , async (req,res) =>{
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

router.get(`/get_movies`, async (req, res) => {
    const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
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
    const data = fs.readFileSync('listas.txt', 'utf8');

    // Dividir el archivo en líneas y verificar si el usuario ya existe
    const lineas = data.split('\n').map(line => line.trim());
    for (const linea of lineas) {
        const [username, movie] = linea.split('|');
        if (usuario === username && pelicula === movie) {
            console.log('Pelicula ya registrada');
            peliculaExiste = true;
            break;
        }
    }

    if (peliculaExiste) {
        // Si la pelicula existe, enviar respuesta
        res.send(false);
    } else {
        const movieRegister = `\n${usuario}|${pelicula}`;
        fs.appendFileSync('listas.txt', movieRegister, 'utf8');
            console.log('Pelicula registrada');
            res.send(true);

            subirArchivo('listas.txt', 'listas.txt');
    }
})

router.get(`/leerLista/:usuario`, async(req, res) =>{
    const usuario = req.params.usuario;

    const data = fs.readFileSync('listas.txt', 'utf8');
    let peliculas = [];

    // Dividir el archivo en líneas y verificar si el usuario ya existe
    const lineas = data.split('\n').map(line => line.trim());
    for (const linea of lineas) {
        const [username, movie] = linea.split('|');
        if (usuario === username) {
            console.log(movie);
            peliculas.push(movie);
        }
    }

    res.send(peliculas);
})

router.get(`/guardaReview/:usuario/:pelicula/:calificacion/:texto`, async (req, res) => {
    const usuario = req.params.usuario;
    const pelicula = req.params.pelicula;
    const calificacion = req.params.calificacion;
    const texto = req.params.texto;
    let reviewExiste = false;

    const data = fs.readFileSync('reviews.txt', 'utf8');

    // Dividir el archivo en líneas y verificar si el usuario ya existe
    const lineas = data.split('\n').map(line => line.trim());
    for (const linea of lineas) {
        const [username, movie] = linea.split('|');
        if (usuario === username && pelicula === movie) {
            console.log('Review ya registrada');
            reviewExiste = true;
            break;
        }
    }

    if (reviewExiste) {
        res.send(false);
    }else{
        // Construir la nueva entrada de review
        const reviewEntry = `\n${usuario}|${pelicula}|${calificacion}|${texto}`;

        try {
            // Escribir la nueva entrada en el archivo reviews.txt
            fs.appendFileSync('reviews.txt', reviewEntry, 'utf8');
            subirArchivo('reviews.txt', 'reviews.txt');
            console.log('Review registrada');
            res.send(true); // Indicar éxito
        } catch (err) {
            console.error("Error al registrar la review:", err);
            res.status(500).send(false); // Indicar fallo
        }
    }
});

router.get(`/leerReviews/:pelicula`, async (req, res) => {
    const pelicula = req.params.pelicula;
    let reviews = [];

    try {
        // Leer el archivo reviews.txt
        const data = fs.readFileSync('reviews.txt', 'utf8');

        // Dividir el archivo en líneas
        const lineas = data.split('\n').map(line => line.trim());

        // Filtrar las reseñas que coincidan con la película
        for (const linea of lineas) {
            if (linea) {
                const [usuario, movie, calificacion, texto] = linea.split('|');
                if (movie === pelicula) {
                    reviews.push({ usuario, calificacion, texto });
                }
            }
        }

        // Enviar las reseñas como respuesta
        res.json(reviews);
    } catch (err) {
        console.error("Error al leer las reseñas:", err);
        res.status(500).send("Error interno del servidor.");
    }
});

router.get(`/login/:user/:pass`, async(req, res) => {
    const user = req.params.user;
    const pass = req.params.pass;

     // Leer el archivo de usuarios
     fs.readFile('usuarios.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return res.status(500).send("Error interno del servidor.");
        }

        // Dividir el archivo en líneas y verificar las credenciales
        const lineas = data.split('\n').map(line => line.trim());
        let usuarioValido = false;

        for (const linea of lineas) {
            const [username, hashedPass] = linea.split(':');
            if (user === username) {
                // Verificar la contraseña hasheada
                const isMatch = bcrypt.compare(pass, hashedPass);
                if (isMatch) {
                    usuarioValido = true;
                    break;
                }
            }
        }

        // Responder según el resultado
        if (usuarioValido) {
            console.log("Sesion Iniciada");
            res.send(true);
        } else {
            console.log("Fallo en inicio de sesion");
            res.send(false);
        }
    });
})

router.get(`/registrarUsuario/:user/:pass`, async (req, res) =>{
    console.log('entro a funcion');
    const user = req.params.user;
    const pass = req.params.pass;
    let usuarioExiste = false;

    try {
        // Leer el archivo de usuarios de forma síncrona
        const data = fs.readFileSync('usuarios.txt', 'utf8');

        // Dividir el archivo en líneas y verificar si el usuario ya existe
        const lineas = data.split('\n').map(line => line.trim());
        for (const linea of lineas) {
            const [username] = linea.split(':');
            if (user === username) {
                console.log('Usuario ya existente');
                usuarioExiste = true;
                break;
            }
        }

        if (usuarioExiste) {
            // Si el usuario existe, enviar respuesta
            res.send(false);
        } else {
            // Si no existe, agregar el usuario
            // Generar hash para la contraseña
        const salt = await bcrypt.genSalt(10); // Generar salt (aleatoriedad)
        const hashedPass = await bcrypt.hash(pass, salt); // Hashear contraseña

        // Guardar en el archivo
        const userRegister = `\n${user}:${hashedPass}`;
        fs.appendFileSync('usuarios.txt', userRegister, 'utf8');
        subirArchivo('usuarios.txt', 'usuarios.txt');
        console.log('Usuario registrado');
        res.send(true);
        }
    } catch (err) {
        console.error("Error al procesar el archivo:", err);
        res.status(500).send("Error interno del servidor.");
    }
})

app.use(router);
module.exports = router;
