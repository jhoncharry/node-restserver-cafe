// ================================
// Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;



// ================================
// Entorno
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";


// ================================
// Vencimiento del Token
// ================================
//
process.env.CADUCIDAD_TOKEN = "48h";


// ================================
// SEED de autenticacion
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ================================
// Base de datos
// ================================

let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;



// ================================
// Google Client ID
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "1096895710300-cvgb9cm18f1j469qtvvi29ppf0el2ub5.apps.googleusercontent.com";

