const express = require("express");
const app = express();
const mysql2 = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comtal",
    port: 3307
})

app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    db.query("INSERT INTO empleados(nombre, edad, pais, cargo, anos) VALUES(?, ?, ?, ?, ?)", [nombre, edad, pais, cargo, anios],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Empleado registrado con exito!");
            }
        }
    )
});

app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    db.query("UPDATE empleados SET nombre = ?, edad=?, pais=?, cargo=?, anos=? WHERE id=?", [nombre, edad, pais, cargo, anios, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Empleado actualizado con exito!");
            }
        }
    )
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM empleados WHERE id=?", [id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Empleado eliminado con exito!");
            }
        }
    )
});

app.get("/empleados", (req, res) => {
    
    db.query("SELECT * FROM empleados",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
});

app.listen(3001, () => {
    console.log("corriendo en el puerto 3001")
})
// const mysql = require('mysql2');

// // Configuración de la conexión a la base de datos
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'comtal'
// });

// // Intentar conectar
// connection.connect(function (err) {
//     if (err) {
//         console.error('Error al conectar a la base de datos:', err);
//     } else {
//         console.log('Conexión a la base de datos establecida correctamente');
//     }
// });

// // Cerrar la conexión al salir de la aplicación
// process.on('SIGINT', function () {
//     connection.end(function (err) {
//         console.log('Conexión a la base de datos cerrada');
//         process.exit(err ? 1 : 0);
//     });
// });
