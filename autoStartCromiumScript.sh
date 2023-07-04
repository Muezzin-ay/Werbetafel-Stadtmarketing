#!/bin/bash
echo "Starting chromium in 5 seconds..."
sleep 5
while :
    do
        chromium-browser DISPLAY=:0.0 xeyes --noerrdialogs --kiosk --no-sandbox http://localhost:8084/show
done