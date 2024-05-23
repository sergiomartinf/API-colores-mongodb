require("dotenv").config();
const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");
const {leerColores,crearColor,borrarColor} = require("./db");

const servidor = express();

servidor.use(cors());

servidor.use(json());

if(process.env.PRUEBAS){
    servidor.use(express.static("./pruebas"));
}

servidor.get("/colores", async (peticion,respuesta) => {
    try{
        let colores = await leerColores();

        respuesta.json(colores);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/nuevo",async (peticion,respuesta) => {
    try{
        let id = await crearColor(peticion.body);

        respuesta.json({id});

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.delete("/borrar",async (peticion,respuesta) => {
    try{
        let cantidad = await borrarColor(peticion.body);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found" });
});



servidor.listen(process.env.PORT);