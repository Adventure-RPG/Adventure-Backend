#!/bin/bash

while true;
do
    npm run migrate
    if [[ $? -ne 1 ]]; then
        break
    fi
    sleep 5
done
npm start
