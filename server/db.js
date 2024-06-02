// // En server/db.js
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "comtal",
//     port: 3307
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Error conectando a la base de datos:', err);
//     } else {
//         console.log('Conectado a la base de datos MySQL');
//     }
// });

// module.exports = db;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('comtal', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307 // Asegúrate de especificar el puerto si no es el predeterminado
});

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos MySQL');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = sequelize;
