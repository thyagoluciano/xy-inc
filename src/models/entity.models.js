import mongoose from 'mongoose';
mongoose.Promise = Promise; 

const schema = new mongoose.Schema({
  entity: {
    type: String,
    lowercase: true,
    index: {
      unique: true,
    },
  },
  fields: {
    type: Array,
  },
},
{
  versionKey: false
});

const Entity = mongoose.model('Entity', schema);

export default Entity;