// const express = require("express");
// const app = express();
// const cors = require("cors");
// const db = require('./models');

// app.use(cors());
// app.use(express.json());

// const authRoutes = require('./routes/auth');

// app.use('/api', authRoutes);

// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log("Servidor corriendo en el puerto 3001");
//     });
// });


// --------------------------------------------------------------------------
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const db = require('./models');

// app.use(express.json());

// const allowedOrigins = [
//     'http://localhost:3000',
//     'http://subdomi.comtal.ser:3000',
//     'http://comtal.ser:3000',
//     'https://comtal.ser:3000',
//     'https://comtal.ser:3000/'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);

//         if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

// const authRoutes = require('./routes/auth');

// app.use('/api', authRoutes);

// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log("Servidor corriendo en el puerto 3001");
//     });
// });


// -------------------------------------------------------------------------------------------------------------

const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const cors = require("cors");
const db = require('./models');

app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'http://subdomi.comtal.ser:3000',
    'http://comtal.ser:3000',
    'https://comtal.ser:3000',
    'https://comtal.ser:3000/'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);

// Ruta para la raíz del servidor
app.get('/', (req, res) => {
    res.send('¡Hola! Esta es la página de inicio de mi servidor.');
});

const privateKey = fs.readFileSync('C:/xampp/apache/conf/ssl.key/server.key', 'utf8');
const certificate = fs.readFileSync('C:/xampp/apache/conf/ssl.crt/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

db.sequelize.sync().then(() => {
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(3001, () => {
        console.log("Servidor corriendo en el puerto 3001 con HTTPS");
    });
});