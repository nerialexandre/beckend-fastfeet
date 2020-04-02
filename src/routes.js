import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/Auth';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import StatusController from './app/controllers/StatusController';
import ProblemsController from './app/controllers/ProblemsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', StatusController.index);
routes.put(
  '/deliveryman/:deliverymanId/deliveries/:deliveryId',
  upload.single('file'),
  StatusController.update
);
routes.post('/delivery/:id/problems', ProblemsController.store);

routes.use(authMiddleware);

routes.get('/delivery/:id/problems', ProblemsController.show);
routes.get('/problems', ProblemsController.index);
routes.delete('/problem/:id/cancel-delivery', ProblemsController.delete);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// upload de arquivos
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
