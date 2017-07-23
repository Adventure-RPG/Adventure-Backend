#!/bin/bash

while true; do
    npm run migrate
    if [ $? -eq 0]; then
        break
    fi
    sleep 5
done
npm start
