import {
    getDB
} from '../../db/db.js'

const queryGetProductos = async (callback) => {
    const conexion = getDB();
    conexion.collection('productos').find({}) /* .limit(50) */ .toArray(callback); //limit para tener solo 50 registros. find es la operacion                       
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
        conexion.collection('productos').insertOne(datosProducto, callback);
    } else {
        return 'error';
    }
};


export {
    queryGetProductos,
    queryPostProductos
};