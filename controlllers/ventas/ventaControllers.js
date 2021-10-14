import {
    getDB
} from '../../db/db.js'
/* import { ObjectId } from 'mongodb'; */ //para obtener el id defecto de mongo

const queryGetVentas = async (callback) => {
    const conexion = getDB();
    await conexion.collection('ventas').find({}) /* .limit(50) */ .toArray(callback); //limit para tener solo 50 registros. find es la operacion                       
}

const queryPostVentas = async (datosVenta, callback) => {
    //console.log('venta a crear: ', req.body) //me muestra la info del venta a crear
    //console.log("llaves: ", Object.keys(datosVenta)); //me muestra las llaves del venta a crear
    if (
        Object.keys(datosVenta).includes('_id') &&
        Object.keys(datosVenta).includes('fechaVenta') &&
        Object.keys(datosVenta).includes('vendedor') &&
        Object.keys(datosVenta).includes('estadoVenta') &&
        Object.keys(datosVenta).includes('idCliente') &&
        Object.keys(datosVenta).includes('nameCliente') &&
        Object.keys(datosVenta).includes('descripcion') &&
        Object.keys(datosVenta).includes('cantidad')) {

        const conexion = getDB();
        await conexion.collection('ventas').insertOne(datosVenta, callback);
    } else {
        return 'error';
    }
};

const queryPatchVentas = async (id, edicion, /*  ,*/ callback) => {
    const filtroVenta = {
        _id: id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id; //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
    const operacion = {
        $set: edicion
    };
    const conexion = getDB();
    await conexion
        .collection('ventas')
        .findOneAndUpdate(filtroVenta, operacion, {
            upsert: true,
            returnOriginal: true
        }, callback);
}

const queryDeleteVentas = async (id, callback) => {
    const filtroVenta = {
        _id: id //_id: new ObjectId(edicion.id) cuando es el id por defecto
    };
    //delete edicion._id;   //se usa cuando enviamos el id por el body o usamos el id por defecto de mongo
                            //esto no se hace si usamos rutas dinamicas con id en la url

    const conexion = getDB();
    await conexion.collection('ventas').deleteOne(filtroVenta, callback);
}

export {
    queryGetVentas,
    queryPostVentas,
    queryPatchVentas,
    queryDeleteVentas
};