import express from 'express';
import entity from './entity.routes';
import model from './model.routes';

const router = express.Router();

router.use('/entity', entity);
router.use('/', model);

export default  router;

