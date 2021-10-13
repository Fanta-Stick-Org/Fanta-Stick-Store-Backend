import Express from 'express'
import {
    getDB
} from '../../db/db.js'

const rutasProducto = Express.Router(); 

rutasProducto.route('/productos').get((req, res) => {
    const conexion = getDB();
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

rutasProducto.route('/productos/nuevo').post((req, res) => {
    const datosProducto = req.body;
    console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
    console.log("llaves: ", Object.keys(datosProducto)); //me muestra las llaves del producto a crear

    try {
        if (
            Object.keys(datosProducto).includes('_id') &&
            Object.keys(datosProducto).includes('descripcion') &&
            Object.keys(datosProducto).includes('valorUnitario') &&
            Object.keys(datosProducto).includes('estado')) {

            const conexion = getDB();
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
});

rutasProducto.route('/productos/editar').patch((req, res) => {
    const edicion = req.body;
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };
    const conexion = getDB();
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

rutasProducto.route('/productos/eliminar').delete((req, res) => {
    const edicion = req.body;
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo

    const conexion = getDB();
    conexion.collection('productos').deleteOne(filtroProducto, (err, result) => {
        if (err) {
            console.error('Error eliminado el producto', err);
            res.sendStatus(500);
        } else {
            console.log('Eliminado con éxito');
            res.sendStatus(200);
        }
    });
});

export default rutasProducto