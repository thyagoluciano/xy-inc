import mongoose from 'mongoose';

mongoose.Promise = Promise;

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost/xy_inc_test';
const connect = () => mongoose.connect(
  mongodbUrl, 
  { server: { poolSize: 5 } }
);

export default {
  connect
};
