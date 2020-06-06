import express, { request, response } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

//LISTAR DE ITEMS
routes.get('/items', itemsController.index);

//LISTAR UM PONTO DE COLETA ESPECIFICO PELO ID
routes.get('/points/:id', pointsController.show);

//LISTAR PONTO DE COLETA POR ESTADO/CIDADE/ITEMS
routes.get('/points', pointsController.index);

//INSERINDO NOVO PONTO DE COLETA
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),  
    pointsController.create);

export default routes;