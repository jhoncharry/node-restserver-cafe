require("./config/config");

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { isEmpty } = require("underscore");
const path = require("path");


const app = express();




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));




//Configuracion global de rutas
app.use(require("./routes/index"));





//Conexion base de datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log("Base de datos ONLINE"))
    .catch((error) => console.log("Error connecting to MongoDB", error));








app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});