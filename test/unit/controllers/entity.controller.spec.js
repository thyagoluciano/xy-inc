import sinon from 'sinon';
import EntityController from '../../../src/controllers/entity.controller';
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

describe('Controllers: Entity', () => {
  const produtoEntity = {
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
  };

    describe('find() entity', () => {
      it('should call send with a list of entitys', () => {
        const request = {
          query: {}
        };
        const response = {
          send: sinon.spy()
        };
        Entity.find = sinon.stub();
        Entity.find.withArgs({}).resolves(produtoEntity);

        console.log(redis);

        const entityController = new EntityController(Entity, redis);

        return entityController.find(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, produtoEntity);
          });
      });
    });

    describe('findById() entity', () => {
      it('should call send with a entity', () => {
        const request = {
          params: {}
        };
        const response = {
          send: sinon.spy()
        };
        Entity.findOne = sinon.stub();
        Entity.findOne.withArgs({}).resolves(produtoEntity);

        const entityController = new EntityController(Entity, redis);

        return entityController.findById(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, produtoEntity);
          });
      });

      it('should return 400 when an error occurs', () => {
        const request = {
          params: {}
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };

        response.status.withArgs(404).returns(response);
        Entity.findOne = sinon.stub();
        Entity.findOne.withArgs({}).rejects({ message: 'Error' });

        const entityController = new EntityController(Entity, redis);

        return entityController.findById(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });

    describe('created() entity', () => {
      it('should created a entity', () => {
        const request = {
          body: {}
        };
        const response = {
          send: sinon.spy(),
        };

        Entity.create = sinon.stub();
        Entity.create.withArgs({}).resolves(produtoEntity);

        const entityController = new EntityController(Entity, redis);

        return entityController.create(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, produtoEntity);
          });
      });

      it('should created a entity with error', () => {
        const request = {
          body: {}
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };

        response.status.withArgs(409).returns(response);
        Entity.create = sinon.stub();
        Entity.create.withArgs({}).rejects('Conflict');

        const entityController = new EntityController(Entity, redis);

        return entityController.create(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Conflict');
          });
      });
    });

    describe('updated() entity', () => {
      it('should update a entity', () => {
        const request = {
          params: { _id: 10 },
          body: produtoEntity
        };
        const response = {
          send: sinon.spy()
        };
        Entity.findOne = sinon.stub();
        Entity.findOne.withArgs(request.params).resolves(produtoEntity);

        Entity.update = sinon.stub();
        Entity.update.withArgs(request.params, request.body).resolves({ok: 1});

        const entityController = new EntityController(Entity, redis);

        return entityController.update(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, {ok: 1});
          });
      });

      it('should return 404 when update with not exist id', () => {
        const request = {
          params: { _id: 10 },
          body: produtoEntity
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };

        response.status.withArgs(404).returns(response);
        Entity.findOne = sinon.stub();
        Entity.findOne.withArgs(request.params).resolves(null);

        const entityController = new EntityController(Entity, redis);

        return entityController.update(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'not found');
          });
      });

      it('should return 500 when update with invalid id', () => {
        const request = {
          params: { _id: 10 },
          body: produtoEntity
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };

        response.status.withArgs(500).returns(response);
        Entity.findOne = sinon.stub();
        Entity.findOne.withArgs(request.params).rejects({ message: 'Error' });

        const entityController = new EntityController(Entity, redis);

        return entityController.update(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });

    describe('removed() entity', () => {
      it('should remove a entity', () => {
        const request = {
          params: {
            _id: 10
          }
        };
        const response = {
          send: sinon.spy()
        };

        Entity.remove = sinon.stub();
        Entity.remove.withArgs(request.params).resolves({});
        
        const entityController = new EntityController(Entity, redis);

        return entityController.delete(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, {});
          });
      });

      it('should remove error 404', () => {
        const request = {
          params: {
            _id: 10
          }
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };

        response.status.withArgs(404).returns(response);
        Entity.remove = sinon.stub();
        Entity.remove.withArgs(request.params).rejects({ message: 'Error' });
        
        const entityController = new EntityController(Entity, redis);

        return entityController.delete(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });
});
