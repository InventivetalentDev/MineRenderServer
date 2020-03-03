#!/bin/sh
## sudo apt-get install xvfb
xvfb-run -s "-ac -screen 0 1024x1024x24" node index.js
