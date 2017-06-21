class ModelController {

  constructor(DynamicModel) {
    this.dynamicModel = DynamicModel;
  }

  find(req, res) {
    const modelName = req.params.model;
    return this.dynamicModel.getModel(modelName)
      .then(model => model.find())
      .then(result => res.send(result))
      .catch(error => res.status(404).send(error));
  }

  findById(req, res) {
    const modelName = req.params.model;
    const query = req.params;
    delete(query.model);

    return this.dynamicModel.getModel(modelName)
      .then(model => {
        return model.findOne({_id: query._id})
          .then(result => res.send(result))
      })
      .catch(error => res.status(404).send(error));
  }

  create(req, res) {
    const modelName = req.params.model;
    const body = req.body;

    return this.dynamicModel.getModel(modelName)
      .then(model => {
        return model.create(body)
          .then(
            result => res.send(result),
            error => res.status(400).send(error)
          );
      })
      .catch(error => res.status(404).send(error));
  }

  update(req, res) {
    const modelName = req.params.model;
    const params = req.params;
    const body = req.body;

    return this.dynamicModel.getModel(modelName)
      .then(model => {
        return model.findOne({_id: params._id})
          .then((response) => {
            if (response) {
              return model.update({_id: params._id}, body);
            }
            return false;
          })
          .then(result => {
            if (result) {
              return res.send(result);
            }
            return res.status(404).send('not found');
          })
          .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(404).send(error));
  }

  delete(req, res) {
    const modelName = req.params.model;
    const params = req.params;

    return this.dynamicModel.getModel(modelName)
      .then(model => {
        return model.remove({_id: params._id})
          .then(
            result => res.send(result)
          );
      })
      .catch(error => res.status(404).send(error));
  }
}

export default ModelController;