import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

/*app.use(cors({
    origin: 'SEU DOMINIO AQUI'
}));*/
app.use(cors());

//funcionalidade a mais no nosso express, nosso express entende o json
app.use(express.json());
app.use(routes);

//servindo arquivos de forma estatica com o express
//Mostrando imagems na rota uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333);