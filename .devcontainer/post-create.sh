#!/bin/bash

if [ -n "$DOTENV_CONTENT" ]; then
  echo "$DOTENV_CONTENT" > .env
fi