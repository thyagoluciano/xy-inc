
const http = require('http');
const http_proxy = require('http-proxy');
const monitor = require('node-docker-monitor');

let proxServer = 0;
let proxServerMax = 0;
const servidoresKey = [];
const servidores = [];
const proxy = http_proxy.createProxy();

const dockerOpts = { socketPath: process.env.DOCKER_SOCKET };
if (!dockerOpts.socketPath) {
    dockerOpts.host = process.env.DOCKER_HOST;
    dockerOpts.port = process.env.DOCKER_PORT;
    if (!dockerOpts.host) {
        dockerOpts.socketPath = '/var/run/docker.sock';
    }
}

const httpPort = process.env.HTTP_HOST || 8080;

console.log('Connecting to Docker: %j', dockerOpts);

monitor({
  onContainerUp: (containerInfo, docker) => {
    if (containerInfo.Labels && containerInfo.Labels.api_zy_inc) {
      const container = docker.getContainer(containerInfo.Id);
      container.inspect((err, containerDetails) => {
        if (err) {
          console.log('Error getting container details for: %j', containerInfo, err);
        } else {
          try {
            const url = getUpstreamUrl(containerDetails);
            servidoresKey.push(containerInfo.Id);
            servidores[containerInfo.Id] = { 'url': url };
            proxServerMax++;
            proxServer = 0;
            console.log('Registered new api route: %j', url);
          } catch(e) {
            console.log('Error creating new api route for: %j', containerDetails, e);
          }
        }
      });
    }
  },
  onContainerDown: function (container) {
    if (container.Labels && container.Labels.api_zy_inc) {
        const serve = servidores[container.Id];
        if (serve) {
            proxServerMax--;
            proxServer = 0;
            delete servidores[container.Id];
            delete servidoresKey[containerInfo.Id];
            console.log('Removed api serve: %j', serve);
        }
    }
  }
}, dockerOpts);

require('http').createServer((req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.write(`Nenhuma API Inicializada`);
  res.end();
}).listen(8181);

require('http').createServer((req, res) => {

  let servidor = '';
  
  // console.log(servidores);

  if (Object.keys(servidores).length > 0) {
    servidor = servidores[servidoresKey[proxServer]];  
    // console.log('Servidor => ', servidor);
  } else {
    servidor =  { 'url' : 'http://localhost:8181' };
  }
  // console.log({
  //   'proxServer': proxServer,
  //   'proxServerMax': proxServerMax,
  //   'servidoresKey': servidoresKey
  // });
  proxy.web(req, res, {
    target: servidor.url
  }, (e) => { 
    console.log(e); 
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write(`Internal Server Error ${JSON.stringify(e)}`);
    res.end();
  });
  proxServer = proxServer >= (proxServerMax-1) ? 0 : proxServer + 1;
}).listen(8080); 

// generate upstream url from containerDetails
function getUpstreamUrl(containerDetails) {
    const ports = containerDetails.NetworkSettings.Ports;
    for (id in ports) {
        if (ports.hasOwnProperty(id)) {
            // return 'http://' + containerDetails.NetworkSettings.IPAddress + ':' + id.split('/')[0];
            return 'http://' + containerDetails.Config.Hostname + ':' + id.split('/')[0];
        }
    }
}  
