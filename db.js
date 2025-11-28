const mysql = require("mysql2");

// Exporta la configuración para mysql2/promise
const dbConfig = {
    host: "peliconnect.ddns.net",
    port: 3306,
    user: "wndarchitect",
    password: "Wndall.?53",
    database: "peliconnectdb"
};

// Si otros archivos usan la conexión tradicional (mysql2 sin promises)
if (process.env.NODE_ENV !== 'test') {
    const con = mysql.createConnection(dbConfig);

    // Exporta ambos: la configuración y la conexión tradicional
    module.exports = {
        config: dbConfig,  // Para usar con mysql2/promis
        connection: con    // Para usar con mysql2 tradicional
    };
}

// Exporta ambos: la configuración y la conexión tradicional
module.exports = {
    config: dbConfig,  // Para usar con mysql2/promis
};

