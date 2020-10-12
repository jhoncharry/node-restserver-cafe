const express = require('express');
const app = express();

const Producto = require("../models/producto");
const { verificaToken } = require("../middlewares/autenticacion");

// ==============================
// Obtener todos los productos
// ==============================
app.get("/productos", verificaToken, (req, res) => {

    //Trae todos los productos
    //populate: usuario, categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .skip(desde)
        .limit(limite)
        .exec((error, productos) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }


            res.json({
                ok: true,
                productos
            });


        });





});


// ==============================
// Obtener un producto por ID
// ==============================
app.get("/productos/:id", verificaToken, (req, res) => {

    //populate: usuario, categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((error, productoDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }


            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "El ID no existe"
                    }
                });

            }


            res.json({
                ok: true,
                producto: productoDB
            });


        });




});




// ==============================
// Buscar productos
// ==============================

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");

    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((error, productos) => {


            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }


            res.json({
                ok: true,
                productos
            });



        });


});






// ==============================
// Crear un nuevo producto
// ==============================
app.post("/productos", verificaToken, (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado


    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    });


    producto.save((error, productoDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })



    });






});


// ==============================
// Actualizar un nuevo producto
// ==============================
app.put("/productos/:id", verificaToken, (req, res) => {


    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;

    let body = req.body;


    let producto = {

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    };

    /*   if (producto.descripcion === null || producto.descripcion === undefined) delete producto.descripcion;
        (body.descripcion) ? producto.descripcion = body.descripcion : producto.descripcion = "";
    
        (body.descripcion) ? producto.descripcion = body.descripcion : producto.$unset = { descripcion: 1 };
        let cardChanges = { $unset: { descripcion: 1 } } */

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: "query" }, (error, productoDB) => {


        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El ID no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })





    });

});

// ==============================
// Borrar un  producto
// ==============================
app.delete("/productos/:id", (req, res) => {

    //actualizar estado


    let id = req.params.id;

    let cambiarEstado = {
        disponible: false
    }


    /*     Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => { */

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true }, (error, productoBorrado) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El ID no existe"
                }
            });
        }



        res.json({
            ok: true,
            producto: productoBorrado,
            message: "Producto borrado"
        });


    });

});




module.exports = app;