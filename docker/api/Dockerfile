FROM node:8.1.0-alpine
RUN apk update && apk upgrade && \
    apk add --no-cache bash git && \
    npm install -g nodemon babel-cli babel-preset-node6
RUN mkdir app && \
    cd app && \    
    git clone https://github.com/thyagoluciano/xy-inc.git && \
    cd xy-inc && npm install

CMD cd /app/xy-inc && npm start