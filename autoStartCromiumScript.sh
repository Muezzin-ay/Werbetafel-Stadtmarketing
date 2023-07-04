#!/bin/bash
echo "Starting chromium in 5 seconds..."
sleep 5
while :
    do
        chromium-browser --noerrdialogs --kiosk http://localhost:8084/show
done