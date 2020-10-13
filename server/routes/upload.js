const express = require('express');
const app = express();

const fileUpload = require("express-fileupload");
const uniqid = require("uniqid");


const fs = require("fs");
const path = require("path");


const Usuario = require("../models/usuario");
const Producto = require("../models/producto");


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function (req, res) {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            error: {
                message: "No se ha seleccionado ningun archivo"
            }
        });

    }


    //Validar tipo
    let tiposValidos = ["productos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Los tipos permitidos son " + tiposValidos.join(", ")
            }

        });

    }





    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Las extensiones permitidas son " + extensionesValidas.join(", "),
                ext: extension
            }

        });
    }





    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${uniqid()}.${extension}`


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        //Aqui, imagen cargada


        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });


});




function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (error, usuarioDB) => {


        if (error) {

            borraArchivo(nombreArchivo, "usuarios");

            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!usuarioDB) {

            borraArchivo(nombreArchivo, "usuarios");

            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no existe"
                }
            });
        }



        borraArchivo(usuarioDB.img, "usuarios");


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });




    });


}



function imagenProducto(id, res, nombreArchivo) {


    Producto.findById(id, (error, productoDB) => {


        if (error) {

            borraArchivo(nombreArchivo, "productos");

            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!productoDB) {

            borraArchivo(nombreArchivo, "productos");

            return res.status(400).json({
                ok: false,
                error: {
                    message: "Producto no existe"
                }
            });
        }



        borraArchivo(productoDB.img, "productos");


        productoDB.img = nombreArchivo;

        productoDB.save((error, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });




    });


}


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;