require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}

function leerColores(){
    return new Promise(async (ok,ko) => {
        try {
            const conexion = conectar();

            let colores = await conexion.db("colores").collection("colores").find({}).toArray();

            conexion.close();

            ok(colores.map( ({_id,r,g,b}) => {
                return {id:_id,r,g,b};
            }));

        } catch (error) {
            ko({ error : "error en BBDD"});
        }

    });
}

function crearColor({r,g,b}){
    return new Promise(async (ok,ko) => {
        
        try {
            const conexion = await conectar();

            let {insertedId} = await conexion.db("colores").collection("colores").insertOne({r,g,b});

            conexion.close();

            ok(insertedId);

        } catch (error) {
            ko({ error : "error en BBDD"});
        }

    });
}

function borrarColor({id}){
    return new Promise(async (ok,ko) => {
        try {
            const conexion = await conectar();

            let {deletedCount} = await conexion.db("colores").collection("colores").deleteOne( { _id : new ObjectId(id) });

            conexion.close();

            ok(deletedCount)

        } catch (error) {
            ko({ error : "ERROR: No se ha borrado NADA"});
        }

    });
}

module.exports = {leerColores,crearColor,borrarColor};