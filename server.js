//'import' de express tradicional
//const express = require('express');

//'import' de express normal
import Express from "express";
import Cors from "cors"
import dotenv from 'dotenv';
import {
    conectarDB,
    getDB
} from './db/db.js'
import rutasProducto from "./views/productos/rutas.js";
import rutasUsuario from "./views/usuarios/rutas.js";

dotenv.config({
    path: './.env'
});

const app = Express()
app.use(Express.json(), Cors(), rutasProducto, rutasUsuario);

const main = () => {
    return app.listen(process.env.PORT, () => {
        console.log(`escuchando puerto ${process.env.PORT}`)
    });
}

conectarDB(main)