import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/Auth';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.post('/deliverymen', DeliverymanController.store);
// routes.get('/deliverymen', DeliverymanController.index);

// routes.put('/deliverymen/:id', DeliverymanController.update);
// routes.delete('/deliverymen/:id', DeliverymanController.update);

// upload de arquivos
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
