import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {

    async index (request: Request, response: Response) {
        //cidade, uf, items {query parms}
        const { city, uf, items } = request.query;

        //Convertendo em array numérico
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            //PROCURA TODOS OS PONTOS QUE TEM PELO MENOS UM POINT ID QUE PASSA NO QUERY PARAMS
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            //TRAZ APENAS UMA VEZ O PONTO DE COLETA, EVITANDO REPETIÇÃO
            .distinct()
            .select('points.*')

                //Serialização, tranformar dados que veem do banco antes de retornar para o front end
            const selializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.1.14:3333/uploads/${point.image}`,
                };
            });

        return response.json(selializedPoints);
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({
                message: 'point not found.'
            });
        }

        const selializedPoint = {
            ...point,
            image_url: `http://192.168.1.14:3333/uploads/${point.image}`
        };
        //LISTANDO TODOS OS ITEMS QUE TEM RELAÇÃO COM O PONTO DE COLETA
        //    SELECT * 
        //      FROM ITEMS 
        //      JOIN POINT_ITEM
        //        ON ITEMS.ID = POINT_ITEM.ITEM_ID
        //     WHERE POINT_ITEM.POINT_ID = {id} 
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point: selializedPoint, items });
    }

    async create(request: Request, response: Response) {
            //RECEBENDO OS DADOS REQUEST
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = request.body;
        
            const trx = await knex.transaction();
        
            const point = {
                image: request.file.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };

            //ADICIONANDO OS DADOS DO REQUEST EM VARIAVEIS COM O MEMSO NOME DOS DADOS
            //name:name,
            //email:email
            const insertedIds = await trx('points').insert(point);
        
            //RETORNANDO O REGRISTRO QUE FOI INSERIDO
            const point_id = insertedIds[0];
        
            const pointItems = items
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((item_id:number) =>{
                    return {
                    item_id,
                    point_id,
                };
            })
        
            //INSERINDO NA POINT ITEMS COM O RELACIONAMENTO MUITO PRA MUITOS 
            await trx('point_items').insert(pointItems);

            await trx.commit();
        
            return response.json({
                id: point_id,
                ... point,
            });
        
    }
}

export default PointsController;