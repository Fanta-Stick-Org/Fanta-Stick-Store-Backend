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
import jwt from "express-jwt";
import jwtAuthz from "express-jwt-authz";
import jwksRsa from "jwks-rsa";
import rutasProducto from "./views/productos/productoRutas.js";
import rutasUsuario from "./views/usuarios/usuarioRutas.js";
import rutasVenta from "./views/ventas/ventaRutas.js";

dotenv.config({
    path: './.env'
});

const app = Express()
app.use(Express.json());
app.use(Cors());
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://fanta-stick.us.auth0.com/.well-known/jwks.json`
    }),

    audience: 'https://api-autenticacion-fanta-store',
    issuer: [`https://fanta-stick.us.auth0.com/`],
    algorithms: ['RS256']
});
//PASO 4 Y 5 > ENVIARLE EL TOKEN A AUTH0 PARA QUE DEVULVA SI ES VALIDO
app.use(checkJwt)
app.use(rutasProducto);
app.use(rutasUsuario);
app.use(rutasVenta);

const main = () => {
    return app.listen(process.env.PORT, () => {
        console.log(`escuchando puerto ${process.env.PORT}`)
    });
}

conectarDB(main)