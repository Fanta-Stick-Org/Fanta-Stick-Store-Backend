import {
    getDB
} from '../../db/db.js'
/* import { ObjectId } from 'mongodb'; */ //para obtener el id defecto de mongo

const queryGetProductos = async (callback) => {
    const conexion = getDB();
    await conexion.collection('productos').find({}) /* .limit(50) */ .toArray(callback); //limit para tener solo 50 registros. find es la operacion                       
}

const queryPostProductos = async (datosProducto, callback) => {
    //console.log('producto a crear: ', req.body) //me muestra la info del producto a crear
    //console.log("llaves: ", Object.keys(datosProducto)); //me muestra las llaves del producto a crear
    if (
        Object.keys(datosProducto).includes('_id') &&
        Object.keys(datosProducto).includes('descripcion') &&
        Object.keys(datosProducto).includes('valorUnitario') &&
        Object.keys(datosProducto).includes('estado')) {

        const conexion = getDB();
        await conexion.collection('productos').insertOne(datosProducto, callback);
    } else {
        return 'error';
    }
};

const queryPatchProductos = async (edicion, /*  ,*/ callback) => {
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };
    const conexion = getDB();
    await conexion
        .collection('productos')
        .findOneAndUpdate(filtroProducto, operacion, {
            upsert: true,
            returnOriginal: true
        }, callback);
}

const queryDeleteProductos = async (edicion, callback) => {
    const filtroProducto = {
        _id: edicion._id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo

    const conexion = getDB();
    await conexion.collection('productos').deleteOne(filtroProducto, callback);
}

export {
    queryGetProductos,
    queryPostProductos,
    queryPatchProductos,
    queryDeleteProductos
};