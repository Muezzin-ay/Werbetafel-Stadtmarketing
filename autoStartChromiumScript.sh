#!/bin/bash
echo "Starting chromium in 10 seconds..."
sleep 10
while :
    do
        DISPLAY=:0 chromium-browser --noerrdialogs --kiosk --no-sandbox http://localhost:8084/show
done

## Information and Todo ##
# --no-sandbox
# write to 'rc.local' -file at '/etc/rc.local' :
# sudo --user=pi sh /home/pi/Dev/Werbetafel-Stadtmarketing/autoStartChromiumScript.sh (Inside of the File)
# sudo chmod +x /etc/rc.local (Terminal)