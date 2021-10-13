import Express from 'express'
import {
    getDB
} from '../../db/db.js'

const rutasUsuario = Express.Router();

rutasUsuario.route('/usuarios').get((req, res) => {
    const conexion = getDB();
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

rutasUsuario.route('/usuarios/nuevo').post((req, res) => {
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

            const conexion = getDB();
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
});

rutasUsuario.route('/usuarios/editar').patch((req, res) => {
    const edicion = req.body;
    const filtroUsuario = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };

    const conexion = getDB();
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

rutasUsuario.route('/usuarios/eliminar').delete((req, res) => {
    const edicion = req.body;
    const filtroUsuario = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo

    const conexion = getDB();
    conexion.collection('usuarios').deleteOne(filtroUsuario, (err, result) => {
        if (err) {
            console.error('Error eliminado el usuario', err);
            res.sendStatus(500);
        } else {
            console.log('Eliminado con éxito');
            res.sendStatus(200);
        }
    });
});

export default rutasUsuario