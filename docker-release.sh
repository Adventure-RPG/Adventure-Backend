#! /usr/bin/env bash
docker-compose down
tsc
docker-compose build
docker-compose up -d