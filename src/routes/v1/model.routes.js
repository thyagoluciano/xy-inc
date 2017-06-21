import express from 'express';
import redis from 'redis';
import DynamicModel from '../../helpers/dynamic.helpers';
import ModelController from '../../controllers/model.controller';

const router = express.Router();
const dynamicModel = new DynamicModel(redis);
const modelController = new ModelController(dynamicModel);

router
  .route('/:model')
  .get((req, res) => modelController.find(req, res))
  .post((req, res) => modelController.create(req, res));

router
  .route('/:model/:_id')
  .get((req, res) => modelController.findById(req, res))
  .put((req, res) => modelController.update(req, res))
  .delete((req, res) => modelController.delete(req, res));

export default router;
