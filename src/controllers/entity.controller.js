import DynamicModel from '../helpers/dynamic.helpers';

class EntityController {

  constructor(Entity, redis) {
    this.Entity = Entity;
    this.dynamicModel = new DynamicModel(redis);
  }

  find(req, res) {
    const query = req.query;
    return this.Entity.find(query)
      .then(result => res.send(result));
  }

  findById(req, res) {
    const query = req.params;
    return this.Entity.findOne(query)
      .then(result => res.send(result))
      .catch(err => res.status(404).send(err.message));
  }

  create(req, res) {
    const body = req.body;

    return this.Entity.create(body)
      .then(
        result => {
          this.dynamicModel.addModels(result);
          return res.send(result);
        },
        err => res.status(409).send('Conflict')
      );
  }

  update(req, res) {
    const params = req.params;
    const body = req.body;
    return this.Entity.findOne({ _id: params._id })
      .then(result => {
        if (result) {
          return this.Entity.update({ _id: params._id }, body);
        }

        return false
      })
      .then((result) => {
        if (result) {
          return res.send(result)
        }
        return res.status(404).send('not found');
      })
      .catch(err => res.status(500).send(err.message));
  }

  delete(req, res) {
    const params = req.params;
    return this.Entity.remove({_id: params._id})
      .then(
        result => res.send(result),
        err => res.status(404).send(err.message)
      );
  }
}

export default EntityController;
