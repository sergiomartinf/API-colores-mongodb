require("dotenv").config();
const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");

const {leerColores,crearColor,borrarColor} = require("./db");

const servidor = express();

// Para poder hacer peticiones de otro sitio
servidor.use(cors());

servidor.use(json());

if(process.env.PRUEBA){
    servidor.use(express.static("./prueba"));
}

// Middleware GET ruta "/colores" para ver los colores
servidor.get("/colores", async (peticion,respuesta) => {
    try {
        let colores = await leerColores();

        respuesta.json(colores);

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

// Middleware POST ruta "/nuevo" para crear un color
servidor.post("/nuevo", async (peticion,respuesta) => {
    try {
        // Crea el color de la peticion que tenemos en el html(FETCH)
        let id = await crearColor(peticion.body);

        respuesta.json({id});

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

// Middleware DELETE ruta "/borrar" para borrar un color
servidor.delete("/borrar", async (peticion,respuesta) => {

    //respuesta.send("funciona"); --> para probar antes de escribir codigo para ver si funciona
    try {
        let id = await borrarColor(peticion.body);

        if (id == 1) {
            respuesta.json("Se ha borrado con exito");
        } else {
            respuesta.json("No existe el id escrito");
        }
        

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found"});
});




servidor.listen(3000);