// ================================
// Puerto
// ================================
process.env.PORT = process.env.PORT || 3000;



// ================================
// Entorno
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";



// ================================
// Base de datos
// ================================

let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb+srv://jhon_325:AidBcZ95QTiSPGF5@cluster0.cqkam.mongodb.net/cafe";
}


process.env.URLDB = urlDB;

