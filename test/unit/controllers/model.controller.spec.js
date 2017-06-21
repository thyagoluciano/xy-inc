import sinon from 'sinon';
import ModelController from '../../../src/controllers/model.controller';
import DynamicModel from '../../../src/helpers/dynamic.helpers';

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

describe('Controllers: model.controller', () => {

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

  describe('find() Product', () => {
    it('should call send with a list of products', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy()
      };
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => {
            const model = {
              find: (query = {}) => {
                return new Promise((resolve, reject) => resolve(produtoEntity));
              }
            }
            return resolve(model);
          });
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.find(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, produtoEntity);
      })
    });

    it('should call send with a list of products', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
      response.status.withArgs(404).returns(response);
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => reject('error'));
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.find(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'error');
      })
    });
  });

  describe('findById() product', () => {
    it('should return a product', () => {
      const request = {
        params: {
          model: 'produto',
          _id: 10,
        }
      };
      const response = {
        send: sinon.spy()
      };
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => {
            const model = {
              findOne: (query = {}) => {
                return new Promise((resolve, reject) => resolve(produtoEntity));
              }
            }
            return resolve(model);
          });
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.findById(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, produtoEntity);
      })
    });

    it('should return a error', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
      response.status.withArgs(404).returns(response);
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => reject('error'));
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.findById(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'error');
      })
    });
  });

  describe('created() product', () => {
    it('should created a entity', () => {
      const request = {
          params: {
            model: 'produto',
            _id: 10,
          }
        };
        const response = {
          send: sinon.spy()
        };
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                create: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(produtoEntity));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.create(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, produtoEntity);
        })
    });

    it('should return 404', () => {
      const request = {
          params: {
            model: 'produto',
          }
        };
        const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
        response.status.withArgs(400).returns(response);
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                create: (query = {}) => {
                  return new Promise((resolve, reject) => reject('error'));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.create(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'error');
        })
    });

    it('should created a entity with error', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
      response.status.withArgs(404).returns(response);
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => reject('error'));
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.create(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'error');
      })
    });
  });

  describe('updated() product', () => {
    it('should update a product', () => {
      const request = {
          params: {
            model: 'produto',
            _id: 10,
          }
        };
        const response = {
          send: sinon.spy()
        };
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                findOne: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(produtoEntity));
                },
                update: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(produtoEntity));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, produtoEntity);
        })
    });

    it('should return 404 when update with not exist id', () => {
      const request = {
          params: {
            model: 'produto',
            _id: 10,
          }
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };
        response.status.withArgs(404).returns(response);
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                findOne: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(null));
                },
                update: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(produtoEntity));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'not found');
        })
    });

    it('should return 500 when update with invalid id', () => {
      const request = {
          params: {
            model: 'produto',
            _id: 10,
          }
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub(),
        };
        response.status.withArgs(500).returns(response);
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                findOne: (query = {}) => {
                  return new Promise((resolve, reject) => resolve(null));
                },
                update: (query = {}) => {
                  return new Promise((resolve, reject) => reject('error'));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.status, 500);
        })
    });

    it('should remove error 404', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
      response.status.withArgs(404).returns(response);
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => reject('error'));
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.update(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'error');
      })
    });
  });

  describe('removed() product', () => {
    it('should remove a entity', () => {
      const request = {
          params: {
            model: 'produto',
            _id: 10,
          }
        };
        const response = {
          send: sinon.spy()
        };
        const fakeDynamicModel = {
          getModel: (modelName) => {
            return new Promise((resolve, reject) => {
              const model = {
                remove: (query = {}) => {
                  return new Promise((resolve, reject) => resolve({ok: 1}));
                }
              }
              return resolve(model);
            });
          }
        }
        const modelController = new ModelController(fakeDynamicModel);
        
        modelController.delete(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, {ok: 1});
        })
    });

    it('should remove error 404', () => {
      const request = {
        params: {
          model: 'produto'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub(),
      };
      response.status.withArgs(404).returns(response);
      const fakeDynamicModel = {
        getModel: (modelName) => {
          return new Promise((resolve, reject) => reject('error'));
        }
      }
      const modelController = new ModelController(fakeDynamicModel);
      
      modelController.delete(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'error');
      })
    });
  });
});