import Express from 'express'
import {
    queryGetProductos,
    queryPostProductos
} from '../../controlllers/productos/productoControllers.js';
import {
    getDB
} from '../../db/db.js'

const rutasProducto = Express.Router();

const genericCallback = (res) => (err, result) => {
    if (err) {
        console.error(err);
        res.status(400).send('Error consultando los vehiculos');
    } else {
        console.log(result);
        res.json(result);
    }
};

rutasProducto.route('/productos').get((req, res) => {
    queryGetProductos(genericCallback(res));
});

rutasProducto.route('/productos/nuevo').post((req, res) => {
    queryPostProductos(req.body, genericCallback(res));
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