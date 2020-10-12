const express = require('express');
const app = express();


const Categoria = require("../models/categoria");
const { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");




// ==============================
// Mostar todas la categorias
// ==============================
app.get("/categoria", verificaToken, (req, res) => {


    Categoria.find()
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((error, categorias) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }


            res.json({
                ok: true,
                categorias
            });


        });


});



// ==============================
// Mostar una categoria por ID
// ==============================
app.get("/categoria/:id", verificaToken, (req, res) => {


    let id = req.params.id;

    Categoria.findById(id, (error, categoriaDB) => {


        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El id no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    });



});



// ==============================
// Crear nueva categoria
// ==============================
app.post("/categoria", verificaToken, (req, res) => {


    // Regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })



    });

});




// ==============================
// Actualizar  categoria
// ==============================
app.put("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;


    let body = req.body;

    let descripcionCategoria = {
        descripcion: body.descripcion
    }



    Categoria.findByIdAndUpdate(id, descripcionCategoria, { new: true, runValidators: true, context: "query" }, (error, categoriaDB) => {


        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El id no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })



    });




});




// ==============================
// Borrar categoria
// ==============================
app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {

    //Solo un administrador puede borrar categoria
    //Categoria.findbyidandremove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (error, categoriaBorrada) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }


        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "El id no existe"
                }
            });
        }


        res.json({
            ok: true,
            message: "Categoria borrada"
        });


    });




});





module.exports = app;