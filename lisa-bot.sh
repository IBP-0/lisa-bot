#!/bin/bash
echo "Starting node process..."
node index.js &
wait
echo "Node process exited."
