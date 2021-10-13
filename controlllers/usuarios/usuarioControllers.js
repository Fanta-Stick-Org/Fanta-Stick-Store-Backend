import {
    getDB
} from '../../db/db.js'
/* import { ObjectId } from 'mongodb'; */ //para obtener el id defecto de mongo

const queryGetUsuarios = async (callback) => {
    const conexion = getDB();
    await conexion.collection('usuarios').find({}) /* .limit(50) */ .toArray(callback); //limit para tener solo 50 registros. find es la operacion                       
}

const queryPostUsuarios = async (datosUsuario, callback) => {
    //console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
    //console.log("llaves: ", Object.keys(datosUsuario)); //me muestra las llaves del producto a crear
    if (
        Object.keys(datosUsuario).includes('_id') &&
        Object.keys(datosUsuario).includes('name') &&
        Object.keys(datosUsuario).includes('email') &&
        Object.keys(datosUsuario).includes('rol') &&
        Object.keys(datosUsuario).includes('estadoUsuario') &&
        Object.keys(datosUsuario).includes('password')) {

        const conexion = getDB();
        await conexion.collection('usuarios').insertOne(datosUsuario, callback);
    } else {
        return 'error';
    }
};

const queryPatchUsuarios = async (id, edicion, /*  ,*/ callback) => {
    const filtroUsuario = {
        _id: id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };
    const conexion = getDB();
    await conexion
        .collection('usuarios')
        .findOneAndUpdate(filtroUsuario, operacion, {
            upsert: true,
            returnOriginal: true
        }, callback);
}

const queryDeleteUsuarios = async (id, callback) => {
    const filtroUsuario = {
        _id: id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id;   //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    //esto no se hace si usamos rutas dinamicas con id en la url

    const conexion = getDB();
    await conexion.collection('usuarios').deleteOne(filtroUsuario, callback);
}

export {
    queryGetUsuarios,
    queryPostUsuarios,
    queryPatchUsuarios,
    queryDeleteUsuarios
};