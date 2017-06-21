import mongoose from 'mongoose';
import Entity from '../../../src/models/entity.models';

describe('Routes: Entity', () => {
  let request;
  const defaultEntity = {
    entity: 'product',
    fields: [],
  };
  const expectedEntity = [{
    _id: '5942f830c9a8ed614241c338',
    entity: 'product',
    fields: [],
  }];
  
  before(() => {
    return setupApp()
      .then(app => {
        request = supertest(app);
      });
  });

  beforeEach(() => {
    return Entity.remove({})
      .then(() => {
        Entity.create(expectedEntity);
      });
  });

  afterEach(() => {
    Entity.remove({});
  });

   after(() => {
    mongoose.connection.close();
  });

  describe('GET /api/v1/entity', () => {
    it('should return a list of entity', done => {
      request
        .get('/api/v1/entity')
        .end((err, res) => {
          expect(res.body).to.eql(expectedEntity);
          done(err);
        });
    });
  });

  describe('GET /api/v1/entity/{id}', () => {
    it('should return a entity', done => {
      request
        .get('/api/v1/entity/5942f830c9a8ed614241c338')
        .end((err, res) => {
          expect(res.body).to.eql(expectedEntity[0]);
          done(err);
        });
    });

    it('should return a not found entity', done => {
      request
        .get('/api/v1/entity/5942f830c9a8ed614241c38')
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done(err);
        });
    });
  });

  describe('POST /api/v1/entity', () => {
    const newEntity = {
      _id: '5942f830c9a8ed614241c339',
      entity: 'category',
      fields: [],
    };

    it('should create a entity', done => {
      request
        .post('/api/v1/entity')
        .send(newEntity)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body._id).to.be.eql(newEntity._id);
          expect(res.body.entity).to.be.eql(newEntity.entity);
          done(err);
        });
    });

    it('should return a conflict error', done => {
      Entity.create(newEntity);
      request
        .post('/api/v1/entity')
        .send(newEntity)
        .end((err, res) => {
          expect(res.status).to.eql(409);
          expect(res.error.text).to.eql('Conflict');
          expect(res.body).to.be.eql({});
          done(err);
        });
    });
  });

  describe('PUT /api/v1/entity/{id}', () => {
    const newEntity = {
      _id: '5942f830c9a8ed614241c330',
      entity: 'update',
      fields: [],
    };

    const updateEntity = {
      entity: 'update_1',
      fields: [
        {
          name: 'category',
          type: 'String',
        }
      ]
    };

    it('should updated a entity', done => {
      Entity.create(newEntity);
      request
        .put('/api/v1/entity/5942f830c9a8ed614241c330')
        .send(updateEntity)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.ok).to.be.eql(1);
          done(err);
        });
    });

    it('should not found', done => {
      Entity.create(newEntity);
      request
        .put('/api/v1/entity/5942f830c9a8ed614241c339')
        .send(updateEntity)
        .end((err, res) => {
          expect(res.status).to.be.eql(404);
          done(err);
        });
    });

    it('should a error', done => {
      request
        .put('/api/v1/entity/9')
        .send(updateEntity)
        .end((err, res) => {
          expect(res.status).to.eql(500);
          done(err);
        });
    });
  });

  describe('DELETE /api/v1/entity/{id}', () => {
    it('should remove a entity', done => {
      request
        .delete('/api/v1/entity/5942f830c9a8ed614241c338')
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.ok).to.be.eql(1);
          done(err);
        });
    });

    it('should remove a entity', done => {
      request
        .delete('/api/v1/entity/1')
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done(err);
        });
    });
  });
});
