//'import' de express tradicional
//const express = require('express');

//'import' de express normal
import Express from "express";
import Cors from "cors"
import {
    MongoClient,
    ObjectId
} from "mongodb";
import dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const stringConexion = process.env.DATABASE_URL;

const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let conexion;

const app = Express()
app.use(Express.json(), Cors());

app.get('/productos', (req, res) => {
    conexion.collection('productos').find({}) /* .limit(50) */ .toArray((err, result) => { //liimt para tener solo 50 registros. find es la operacion
        if (err) {
            console.error(err);
            res.status(400).send('Error consultando los vehiculos');
        } else {
            console.log(result);
            res.json(result);
        }
    });
});

app.post('/productos/nuevo', (req, res) => {
    const datosProducto = req.body;
    console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
    console.log("llaves: ", Object.keys(datosProducto)); //me muestra las llaves del producto a crear

    try {
        if (
            Object.keys(datosProducto).includes('_id') &&
            Object.keys(datosProducto).includes('descripcion') &&
            Object.keys(datosProducto).includes('valorUnitario') &&
            Object.keys(datosProducto).includes('estado')) {

            conexion.collection('productos').insertOne(datosProducto, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error agregando el producto');
                } else {
                    console.log(result);
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        res.sendStatus(500);
    }
})

app.patch('/productos/editar', (req, res) => {
    const edicion = req.body;
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };

    conexion.collection('productos').findOneAndUpdate(filtroProducto, operacion, {
        upsert: true,
        returnOriginal: true
    }, (err, result) => {
        if (err) {
            console.error('Error actualizando el producto', err);
            res.sendStatus(500);
        } else {
            console.log('Actualizado con éxito');
            res.sendStatus(200);
        }
    });
});

app.delete('/productos/eliminar', (req, res) => {
    const edicion = req.body;
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo

    conexion.collection('productos').deleteOne(filtroProducto, (err, result) => {
        if (err) {
            console.error('Error eliminado el producto', err);
            res.sendStatus(500);
        } else {
            console.log('Eliminado con éxito');
            res.sendStatus(200);
        }
    });
})

app.get('/usuarios', (req, res) => {
    conexion.collection('usuarios').find({}) /* .limit(50) */ .toArray((err, result) => { //liimt para tener solo 50 registros. find es la operacion
        if (err) {
            console.error(err);
            res.status(400).send('Error consultando los usuarios');
        } else {
            console.log(result);
            res.json(result);
        }
    });
});

app.post('/usuarios/nuevo', (req, res) => {
    const datosUsuario = req.body;
    console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
    console.log("llaves: ", Object.keys(datosUsuario)); //me muestra las llaves del producto a crear

    try {
        if (
            Object.keys(datosUsuario).includes('_id') &&
            Object.keys(datosUsuario).includes('name') &&
            Object.keys(datosUsuario).includes('email') &&
            Object.keys(datosUsuario).includes('rol') &&
            Object.keys(datosUsuario).includes('estadoUsuario') &&
            Object.keys(datosUsuario).includes('password')) {

            conexion.collection('usuarios').insertOne(datosUsuario, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error agregando el usuario');
                } else {
                    console.log(result);
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        res.sendStatus(500);
    }
})

app.patch('/usuarios/editar', (req, res) => {
    const edicion = req.body;
    const filtroUsuario = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };

    conexion.collection('usuarios').findOneAndUpdate(filtroUsuario, operacion, {
        upsert: true,
        returnOriginal: true
    }, (err, result) => {
        if (err) {
            console.error('Error actualizando el usuario', err);
            res.sendStatus(500);
        } else {
            console.log('Actualizado con éxito');
            res.sendStatus(200);
        }
    });
});

app.delete('/usuarios/eliminar', (req, res) => {
    const edicion = req.body;
    const filtroUsuario = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo

    conexion.collection('usuarios').deleteOne(filtroUsuario, (err, result) => {
        if (err) {
            console.error('Error eliminado el usuario', err);
            res.sendStatus(500);
        } else {
            console.log('Eliminado con éxito');
            res.sendStatus(200);
        }
    });
})

const main = () => {

    client.connect((err, db) => {
        if (err) {
            console.error('Error conectando a la base de datos');
        }
        conexion = db.db('productos');
        console.log('conexión éxitosa')
        return app.listen(process.env.PORT, () => {
            console.log(`escuchando puerto ${process.env.PORT}`)
        });
    })
}

main();