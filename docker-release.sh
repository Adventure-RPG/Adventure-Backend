#! /usr/bin/env bash
docker-compose down -v
tsc
docker-compose build
docker-compose up -d