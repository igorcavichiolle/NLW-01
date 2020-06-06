import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response){
        //UTILIZANDO O KNEX
        //SELECT * FROM ITEMS
        const items = await knex('items').select('*');
    
        //Serialização, tranformar dados que veem do banco antes de retornar para o front end
        const selializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.14:3333/uploads/${item.image}`,
            };
        });
    
        return response.json(selializedItems);
    }
}

export default ItemsController;