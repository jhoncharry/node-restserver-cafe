const jwt = require("jsonwebtoken");

// ================================
// Verificar Token
// ================================

let verificaToken = (req, res, next) => {

    let token = req.get("token");


    jwt.verify(token, process.env.SEED, (error, decoded) => {

        if (error) {

            return res.status(401).json({
                ok: false,
                error: {
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });



};



// ================================
// Verificar AdminRole
// ================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;


    if (usuario.role === "ADMIN_ROLE") {

        next();
    } else {

        return res.json({
            ok: false,
            error: {
                message: "El usuario no es administrador"
            }
        });

    }



}



// ================================
// Verifica Token por URL para imagen
// ================================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (error, decoded) => {

        if (error) {

            return res.status(401).json({
                ok: false,
                error: {
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

}

module.exports = { verificaToken, verificaAdmin_Role, verificaTokenImg };