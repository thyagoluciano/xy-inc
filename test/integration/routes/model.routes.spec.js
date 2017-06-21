import mongoose from 'mongoose';
import redis from 'redis';
import Entity from '../../../src/models/entity.models';
import DynamicModel from '../../../src/helpers/dynamic.helpers';

describe('Routes: Dynamic', () => {
  let request;
  const dynamicModel = new DynamicModel(redis);
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
  const produtoExemplo = {
    "_id": "5942f830c9a8ed614241c339",
    "nome": "Playstation 4",
    "preco": 1400.00,
    "descricao": "Os maiores nomes do mundo dos jogos ganham vida em PS4, desde os icônicos personagens de Star Wars™ Battlefront™ até o futuro combate de Call of Duty®: Infinite Warfare.",
    "ind_disponivel": true,
    "fabricacao": "01/01/2017",
    "tags": ["Games", "ps4"]
  };

  const produtoUpdate = {
    "_id": "5942f830c9a8ed614241c339",
    "nome": "Playstation 4",
    "preco": 1600.00,
    "descricao": "Os maiores nomes do mundo dos jogos ganham vida em PS4, desde os icônicos personagens de Star Wars™ Battlefront™ até o futuro combate de Call of Duty®: Infinite Warfare.",
    "ind_disponivel": true,
    "fabricacao": "06/06/2017",
    "tags": ["Games", "ps4"]
  };

  before(() => {
    return setupApp()
      .then(app => {
        request = supertest(app);
        delete mongoose.connection.models['produto'];
        dynamicModel.addModels(produtoEntity)
          .then(() => {
            console.log('Model produto iniciado');
          });
      });
  });

  beforeEach(() => {
    return Entity.remove({})
      .then(() => {
        Entity.create(produtoEntity);
      });
  });

  afterEach(() => {
    Entity.remove({});
  });

  after(() => {
    dynamicModel.getModel('produto')
    .then(model => {
      return model.remove({})
      .then(() => {
        mongoose.connection.close();
      });
    });
  });

  describe('GET /api/v1/produto', () => {
    it('should return not found', done => {
      dynamicModel.getModel('produto')
        .then((model) => {
          request
            .get('/api/v1/produtos')
            .end((err, res) => {
              expect(res.status).to.be.eql(404);
              done(err);
          });
        });
    });

    it('should return a list of product', done => {
      dynamicModel.getModel('produto')
        .then((model) => {
          request
            .get('/api/v1/produto')
            .end((err, res) => {
              expect(res.status).to.be.eql(200);
              expect(res.body).to.be.eql([]);
              done(err);
          });
        });
    });
  });

  describe('POST /api/v1/produto', () => {
    it('should return not found', done => {
      request
        .post('/api/v1/produtos')
        .send(produtoExemplo)
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done(err);
        });
    });

    it('should create a product', done => {
      request
        .post('/api/v1/produto')
        .send(produtoExemplo)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body._id).to.be.eql(produtoExemplo._id);
          expect(res.body.nome).to.be.eql(produtoExemplo.nome);
          done(err);
        });
    });

    it('should return a conflict error', done => {
      request
        .post('/api/v1/produto')
        .send(produtoExemplo)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          done(err);
        });
    });
  });

  describe('GET /api/v1/produto/{id}', () => {
    it('should return not found', done => {
      dynamicModel.getModel('produto')
        .then((model) => {
          request
            .get('/api/v1/produtos/5942f830c9a8ed614241c339')
            .end((err, res) => {
              expect(res.status).to.be.eql(404);
              done(err);
          });
        });
    });

    it('should return a list of product', done => {
      dynamicModel.getModel('produto')
        .then((model) => {
          request
            .get('/api/v1/produto/5942f830c9a8ed614241c339')
            .end((err, res) => {
              expect(res.status).to.be.eql(200);
              expect(res.body.nome).to.be.eql("Playstation 4");
              expect(res.body.preco).to.be.eql(1400.00);
              done(err);
          });
        });
    });

    it('should return a not found entity', done => {
      request
        .get('/api/v1/produto/5942f830c9a8ed614241c38')
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done(err);
        });
    });
  });

  describe('PUT /api/v1/produtos/{id}', () => {
    it('should return not found', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .put('/api/v1/produtos/5942f830c9a8ed614241c338')
          .send(produtoUpdate)
          .end((err, res) => {
            expect(res.status).to.be.eql(404);
            done(err);
        });
      });
    });

    it('should a error', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .put('/api/v1/produto/1')
          .send(produtoUpdate)
          .end((err, res) => {
            expect(res.status).to.eql(500);
            done(err);
          });
      });
    });

    it('should not found', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .put('/api/v1/produto/5942f830c9a8ed614241c338')
          .send(produtoUpdate)
          .end((err, res) => {
            expect(res.status).to.eql(404);
            done(err);
          });
      });
    });

    it('should updated a entity', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .put('/api/v1/produto/5942f830c9a8ed614241c339')
          .send(produtoUpdate)
          .end((err, res) => {
            expect(res.status).to.eql(200);
            expect(res.body.ok).to.be.eql(1);
            done(err);
          });
      });
    });
  });

  describe('DELETE /api/v1/produto/{id}', () => {
    it('should return not found', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .delete('/api/v1/produtos/5942f830c9a8ed614241c338')
          .end((err, res) => {
            expect(res.status).to.be.eql(404);
            done(err);
        });
      });
    });

    it('should remove a entity', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .delete('/api/v1/produto/5942f830c9a8ed614241c338')
          .end((err, res) => {
            expect(res.status).to.be.eql(200);
            expect(res.body.n).to.be.eql(0);
            done(err);
        });
      });
    });

    it('should remove a entity', done => {
      dynamicModel.getModel('produto')
      .then(model => {
        request
          .delete('/api/v1/produto/5942f830c9a8ed614241c339')
          .end((err, res) => {
            expect(res.status).to.be.eql(200);
            expect(res.body.n).to.be.eql(1);
            done(err);
        });
      });
    });
  });

});