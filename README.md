# xy-inc
xy-inc - Backend as a Service

### Arquitetura
 * Nodejs 6+
 * Express
 * Mongo
 * Redis
 * Mongoose
 * Mocha
 * Chai
 * Instalbul
 * Docker

### Pré-requisitos para executar
 * docker
 * docker-compose

### Instalação e execução
Necessário clonar o projeto:

```sh
git clone https://github.com/thyagoluciano/xy-inc.git
```

Acesse o diretório do projeto:

```sh
cd xy-inc/docker
```

Execute o comando:

```sh
docker-compose up
```

Para subir mais de uma instâncias da api rode o comando:

```sh
docker-compose scale api=10
```

Para reduzir o número de instâncias é so rodar o mesmo comando reduzindo o valor das instâncias:

```sh
docker-compose scale api=1
```

Executar os testes unitários

```sh
docker-compose -f docker-compose-unit-test.yml up
```

Para executar os testes de integração

```sh
docker-compose -f docker-compose-integration-test.yml up
```


### Documentação

#### Endpoint para criação das entidades:

| Método | Rota | Descrição |
| ------------- | ------------- | -------------|
| POST  | `/api/v1/entity`  | Criação de uma nova entidade
| GET  | `/api/v1/entity`  | Retorna todas as entidades criadas
| GET  | `/api/v1/entity/:id`  | Retorna uma entidade específica

**Exemplo**: POST `/api/v1/entity` - Criação de uma nova entidade

```sh
curl -X POST \
  http://localhost:8080/api/v1/entity \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "entity": "produto",
    "fields": [
      { "name": "nome", "type": "string", "required": "true" },
      { "name": "preco", "type": "decimal", "required": "true" },
      { "name": "descricao", "type": "string", "required": "true" },
      { "name": "ind_disponivel", "type": "boolean", "required": "true" },
      { "name": "fabricacao", "type": "date", "required": "true" },
      { "name": "tags", "type": "array", "required": "false" }
    ]
}'
```

**Exemplo**: GET `/api/v1/entity` - Retorna todas as entidades criadas
```sh
curl -X GET \
  http://localhost:8080/api/v1/entity \
  -H 'cache-control: no-cache' \
``` 

**Exemplo**: GET `/api/v1/entity/:id` - Retorna uma entidade com um determinado id
```shell
curl -X GET \
  http://localhost:3000/api/v1/entity/5949e8c7f604fb002be6a65d \
  -H 'cache-control: no-cache' \
``` 

#### Endpoint para o CRUD dos modelos criados:

| Método | Rota | Descrição |
| ------------- | ------------- | -------------|
| POST  | `/api/v1/:model`  | Insere um novo registro
| GET  | `/api/v1/:model`  | Retorna todos os registros
| GET  | `/api/v1/:model/:id`  | Retorna um registro específico
| PUT  | `/api/v1/:model/:id`  | Atualiza um registro
| DELETE  | `/api/v1/:model/:id`  | Exclui um registro

**Exemplo**: POST `/api/v1/:model` - Insere um novo registro

```sh
curl -X POST \
  http://localhost:8080/api/v1/produto \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "nome": "Playstation 4",
    "preco": 1400.00,
    "descricao": "Os maiores nomes do mundo dos jogos ganham vida em PS4, desde os icônicos personagens de Star Wars™ Battlefront™ até o futuro combate de Call of Duty®: Infinite Warfare.",
    "ind_disponivel": true,
    "fabricacao": "01/01/2017",
    "tags": ["Games", "ps4"]
  }'
```
**Exemplo**: GET `/api/v1/:model` - Retorna todos os registros

```sh
curl -X GET \
  http://localhost:8080/api/v1/produto \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
```

**Exemplo**: GET `/api/v1/:model/:id` - Retorna um registro específico

```sh
curl -X GET \
  http://localhost:8080/api/v1/produto/5949f93d98ccbc002b544861 \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
```
**Exemplo**: PUT  `/api/v1/:model/:id` - Atualiza um registro

```sh
curl -X PUT \
  http://localhost:8080/api/v1/produto/5949f93d98ccbc002b544861 \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "nome": "Playstation 4",
    "preco": 1900.00,
    "descricao": "Os maiores nomes do mundo dos jogos ganham vida em PS4, desde os icônicos personagens de Star Wars™ Battlefront™ até o futuro combate de Call of Duty®: Infinite Warfare.",
    "ind_disponivel": true,
    "fabricacao": "16/06/2017",
    "tags": ["Games", "ps4"]
  }'
```

**Exemplo**: DELETE  `/api/v1/:model/:id` - Exclui um registro

```sh
curl -X DELETE \
  http://localhost:8080/api/v1/produto/5949f93d98ccbc002b544861 \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
```
