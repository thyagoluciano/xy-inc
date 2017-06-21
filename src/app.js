import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import methodOverride from 'method-override';
import redis from 'redis';
import database from './config/database';
import v1 from './routes/v1';
import DynamicModel from './helpers/dynamic.helpers';
import Entity from './models/entity.models';

const app = express();

const configurarExpress = () => {
  app.set('json spaces', 4);
  app.use(logger('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  const dynamicModel = new DynamicModel(redis);
  dynamicModel.init(Entity);

  app.use('/api/v1/', v1);
  return app;
};

export default () => database.connect().then(configurarExpress);
