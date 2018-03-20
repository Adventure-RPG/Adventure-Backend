#! /usr/bin/env bash
docker-compose down
node_modules/.bin/tsc
docker-compose build
docker-compose up -d