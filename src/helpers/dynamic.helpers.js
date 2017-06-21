import mongoose from 'mongoose';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
let instance = null;

class DynamicModel {

  constructor(redis) {
    if(!instance) {
      instance = this;
      this.publisher = redis.createClient(redisPort, redisHost);
      this.subscriber = redis.createClient(redisPort, redisHost);
      this.subscriber.on("connect", () => console.log('Subscriber connected'));
      this.publisher.on("connect", () => console.log('Publisher connected'));
      this.subscriber.on("message", (channel, message) => {
        this.loadModels(JSON.parse(message));
      });
      this.subscriber.subscribe("models");
    }
    return instance;
  }

  init(Entity) {
    this.Entity = Entity;
    this.Entity.find({})
      .then(result => {
        result.forEach((element) => {
          this.loadModels(element);
        }, this);
      });
  }

  addModels(model) {
    return new Promise((resolve, reject) => {
      this.publisher.publish('models', JSON.stringify(model));
      return resolve(true);
    });
  }

  convertTypes(type) {
    switch(type.toLowerCase()) {
      case "number":
      case "int":
      case "integer":
      case "float":
      case "double":
      case "decimal":
          return Number;
      case "date":
      case "datetime":
          return Date;
      case "boolean":
      case "bool":
          return Boolean;
      case "array":
        return Array;
      default:
          return String;
    }
  }

  loadModels(models) {
    return new Promise((resolve, reject) => {
      const options = {
        versionKey: false
      };

      const attributes = {};
      const name = models.entity;
      const fields = models.fields;

      fields.forEach((element) => {
        attributes[element.name] = {
          name: element.name,
          required: element.required,
          type: this.convertTypes(element.type)
        };
      });

      const load = mongoose.modelNames();
      if (!load.includes(models.entity)) {
        const newSchema = new mongoose.Schema(attributes, options);
        mongoose.model(name, newSchema);
        return resolve(true);
      }

      console.log('Registrando novo modelo');
      return resolve(true);
    });
  }

  getModel(model) {
    return new Promise((resolve, reject) => {
      const load = mongoose.modelNames();

      if (load.includes(model)) {
        return resolve(mongoose.model(model));
      }

      return reject({status: 404, message: 'Rota não encontrada'});
    });
  }
}

export default DynamicModel;
