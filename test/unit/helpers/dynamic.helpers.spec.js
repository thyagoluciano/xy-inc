import sinon from 'sinon';
import DynamicModel from '../../../src/helpers/dynamic.helpers';
import Entity from '../../../src/models/entity.models';

const redis = {
  createClient: () => {
    return {
      on: (msg, fb) => {
        if (msg === 'connect') {
          return fb;
        }
        if (msg === 'message') {
          return fb;
        }
      },
      subscribe: (msg) => true,
      publish: (channel, message) => true
    };
  }
};

describe('Helpers: DynamicModel', () => {
  const dynamicModel = new DynamicModel(redis);
  const entityList = [
    {
      "_id" : "59489cefa647b760b5c51eb6",
      "entity" : "produto",
      "fields" : [ 
        {
            "required" : "true",
            "type" : "string",
            "name" : "nome"
        }, 
        {
            "required" : "true",
            "type" : "number",
            "name" : "preco"
        }, 
        {
            "required" : "true",
            "type" : "int",
            "name" : "preco"
        }, 
        {
            "required" : "true",
            "type" : "integer",
            "name" : "preco"
        }, 
        {
            "required" : "true",
            "type" : "float",
            "name" : "preco"
        }, 
        {
            "required" : "true",
            "type" : "decimal",
            "name" : "preco"
        }, 
        {
            "required" : "true",
            "type" : "string",
            "name" : "descricao"
        }, 
        {
            "required" : "true",
            "type" : "boolean",
            "name" : "ind_disponivel"
        }, 
        {
            "required" : "true",
            "type" : "date",
            "name" : "fabricacao"
        }, 
        {
            "required" : "false",
            "type" : "array",
            "name" : "tags"
        }
      ]
    }
  ];
  const produtoEntity = [{
    "entity": "produto",
    "fields": [
      { "name": "nome", "type": "string", "required": "true" },
      { "name": "preco", "type": "number", "required": "true" },
      { "name": "preco", "type": "int", "required": "true" },
      { "name": "preco", "type": "integer", "required": "true" },
      { "name": "preco", "type": "float", "required": "true" },
      { "name": "preco", "type": "decimal", "required": "true" },
      { "name": "descricao", "type": "string", "required": "true" },
      { "name": "ind_disponivel", "type": "boolean", "required": "true" },
      { "name": "fabricacao", "type": "date", "required": "true" },
      { "name": "tags", "type": "array", "required": "false" }
    ]
  }];

  describe('dynamic constructor', () => {
    it('should return a DynamicModel instance', () => {
      const instance = new DynamicModel(redis);
      return expect(instance).to.eql(dynamicModel);
    });

    it('should loaded schema to memory', () => {
      Entity.find = sinon.stub();
      Entity.find.withArgs({}).resolves(produtoEntity);
      const init = dynamicModel.init(Entity);

      return expect(init).to.eql(undefined);
    });

    it('should loaded schema to memory', () => {
      Entity.find = sinon.stub();
      Entity.find.withArgs({}).resolves(produtoEntity);
      const init = dynamicModel.init(Entity);
      dynamicModel.loadModels(produtoEntity[0]);

      return expect(init).to.eql(undefined);
    });

    it('should add schema to memory', () => {
      dynamicModel.addModels(entityList[0])
      .then(result => expect(result).to.eql(true));
    });
  });
});