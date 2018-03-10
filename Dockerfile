FROM node:8-alpine

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD package.json package.json
RUN npm install --save