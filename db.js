const { MongoClient, ObjectId } = require("mongodb");

//FUNCIONES PARA LOS MIDDLEWARES
function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}

function leerColores(){
    return new Promise(async (ok,ko) => {
        const conexion = conectar();

        try {
            let colores = await conexion.db("colores").collection("colores").find({}).toArray();

            conexion.close();

            ok(colores.map({_id,r,g,b}));

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

            let {count} = await conexion.db("colores").collection("colores").deleteOne( { _id : new ObjectId(id) });

            conexion.close();

            ok(count)

        } catch (error) {
            ko({ error : "ERROR: No se ha borrado NADA"});
        }

    });
}

//module.exports = {leerColores,crearColor,borrarColor};


crearColor({ r : 200, g : 100, b : 50 })
.then(x => console.log(x))
.catch(x => console.log(x));