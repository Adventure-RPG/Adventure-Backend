#!/bin/bash

while true;
do
    npm run migrate
    if [[ $? -ne 1 ]]; then
        break
    fi
    sleep 5
done

if [[ ${NODE_DEBUG} = "*" ]]; then
    npm start
else
    npm run build:live:node
fi
