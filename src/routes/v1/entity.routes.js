import express from 'express';
import redis from 'redis';
import EntityController from '../../controllers/entity.controller';
import Entity from '../../models/entity.models';

const router = express.Router();
const entityController = new EntityController(Entity, redis);

router
  .route('/')
  .get((req, res) => entityController.find(req, res))
  .post((req, res) => entityController.create(req, res));

router
  .route('/:_id')
  .get((req, res) => entityController.findById(req, res))
  .put((req, res) => entityController.update(req, res))
  .delete((req, res) => entityController.delete(req, res));

export default router;
