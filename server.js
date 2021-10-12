//'import' de express tradicional
//const express = require('express');

//'import' de express normal
import Express from "express";
import Cors from "cors"
import {
    MongoClient,
    ObjectId
} from "mongodb";

const stringConexion = 'mongodb+srv://dbkevin:dbkevin21@fanta-store.afzpo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

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
    //console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
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

const main = () => {

    client.connect((err, db) => {
        if (err) {
            console.error('Error conectando a la base de datos');
        }
        conexion = db.db('productos');
        console.log('conexión éxitosa')
        return app.listen(5000, () => {
            console.log('escuchando puerto 5000')
        });
    })
}

main();