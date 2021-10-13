import Express from 'express'
import {
    queryDeleteProductos,
    queryGetProductos,
    queryPatchProductos,
    queryPostProductos
} from '../../controlllers/productos/productoControllers.js';

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
    queryPatchProductos(req.body, genericCallback(res));
});

rutasProducto.route('/productos/eliminar').delete((req, res) => {
    queryDeleteProductos(req.body, genericCallback(res));
});

export default rutasProducto