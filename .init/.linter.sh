#!/bin/bash
cd /home/kavia/workspace/code-generation/meta-whatsapp-messaging-suite-221679-221688/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

