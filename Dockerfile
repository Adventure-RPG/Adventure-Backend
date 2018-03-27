FROM node:8-alpine

RUN mkdir /src
RUN mkdir -p /src/logs
RUN chown node /src/logs

RUN npm install nodemon -g

WORKDIR /src
ADD package.json package.json
RUN npm install --save