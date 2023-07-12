# Werbetafel-Stadtmarketing

An Open-Source and Free-to-use advertisement platform developed for [RaspberryPi4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) built with [NodeJs](https://nodejs.org/). Use the video output via HDMI of your RaspberryPi to display your own ads. The advertisement can the uploaded on a local website in PDF -format (originally Powerpoint).

**Version: v1.0.2**

## Installation

Before you can start, you have to install all components of [NodeJs](https://nodejs.org/) and the package manager [Npm](https://www.npmjs.com/).

```console
$ sudo apt update
$ sudo apt install nodejs npm
```

For storing all relevant informations, *Werbetafel-Stadtmarketing* uses [MariaDB](https://mariadb.org/) as database solution. To install it type:

```console
$ sudo apt-get install mariadb-server
$ sudo sudo mysql_secure_installation
```

Inside the cloned *Werbetafel-Stadtmarketing* Repository run:

```console
$ npm install
```



To setup the autostart capabilities you have to configure RaspberryPi's *rc.local*. *Werbetafel-Stadtmarketing* needs two autostarts (Chromium and the NodeJs -Script). First edit the *rc.local* file: 

```console
$ sudo nano /etc/rc.local
```
Inside the File add the following line:

```
sudo --user=[YOUR_USER] sh [PATH_TO_THE_REPOSITORY]/Werbetafel-Stadtmarketing/autoStartChromiumScript.sh
```

Finally change the rights mode of the *rc.local* file:

```console
$ sudo chmod +x /etc/rc.local
```

To setup the NodeJs scripts autostart, you have to install [PM2](https://pm2.keymetrics.io/). Run:

```console
$ npm install pm2 -g
```

After that run the following inside the Repository:

```console
$ pm2 start app.js 
$ pm2 startup
```

The second command will put out an Linux-shell-command you have to execute by yourself in order to complete the autostart setup. 

Also do not forget to run:
```console
$ pm2 save
```

A static IP address is strongly recommended, therefore change RaspberryPis DHCP settings:

```console
$ sudo nano /etc/dhcpcd.conf
```

Add the following lines:

```
interface eth0
static ip_address=[IP ADDRESS]
static routers=[GATEWAY]
static domain_name_servers=[DNS SERVER]
```
You should change *eth0* ot *wlan0* if you are using ad wifi connection.

Finally restart the system:

```console
$ sudo reboot
```

## Usage

Devices in the same Network as your RaspberryPi can open the configuration panel of the *Werbetafel-Stadtmarketing* system in theire Browser via this address:

```
http://[IP OF THE SYSTEM]:8080/
```
Please note that unsecure *http* instead of *https* was used. Additionally the configuration panel is not protected with a password.


## Collaborators

<a href="https://github.com/Muezzin-ay/Werbetafel-Stadtmarketing/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Muezzin-ay/Werbetafel-Stadtmarketing" />
</a>