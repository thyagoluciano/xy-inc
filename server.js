import setupApp from './src/app';

const port = process.env.NODE_PORT || 3000;

setupApp()
  .then(app => app.listen(port, () => console.log(`app running on port ${port}`)))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
