# pi-cobalt

![Preview Image](https://raw.github.com/bigtimebuddy/pi-cobalt/master/preview.jpg)

This project started after I adopted a new puppy, Cobalt. My girlfriend, being a scientist, wanted a way to track the times when the puppy peed, pooped, went for a walk or was feed. I hooked up a Rasberry Pi Zero W to a few buttons and then created this NodeJS app to send events to IFTTT.

## Hardware

* [Raspberry Pi Zero W Starter Kit](http://www.canakit.com/raspberry-pi-zero-wireless.html) $34.95 
* 4x [Arcade Buttons](https://www.adafruit.com/product/471) $2.95/each
* [GPIO Hammer Headers](https://www.adafruit.com/product/3413) $6.50
* [Arcade/Button Quick-Connect Wires](https://www.adafruit.com/product/1152) $4.95
* (optional) [Micro SD Card Adapter**](https://www.amazon.com/SanDisk-microSDHC-Class-Adapter-SDSDQ-8192/dp/B001B1AR50/ref=sr_1_1?ie=UTF8&qid=1495114581&sr=8-1&keywords=micro+sd+adapter+8gb) ~$8-10

_** The SD Card Adapter was useful because using [NOOBS](https://www.raspberrypi.org/downloads/noobs/) on the Pi Zero was very slow installing Raspbian. I was able to image faster [downloading](https://www.raspberrypi.org/downloads/raspbian/) and imaging on my MacOS computer._

## Getting Started

* Install the [GPIO headers](https://learn.pimoroni.com/tutorial/sandyj/fitting-hammer-headers)
* Connect the Quick-Connect Wires to leads on each button
* Plug four buttons into the following GPIO making sure the white connector attaches to an open GPIO and ground. See [diagram](https://pinout.xyz/)
    * GPIO 26 (pins 37 & 39)
    * GPIO 17 (pins 9 & 11)
    * GPIO 25 (pins 20 & 22)
    * GPIO 12 (pins 30 & 32)
* Install the Pi Zero in the case
* Attach mouse/keyboard in the USB connect (I used a Mac keyboard and Logitech USB mouse attached to keyboard)
* Attach the HDMI connector to monitor
* Attach the power supply to the Pi Zero

## Setup Application

* Successfully boot into Raspbian
* Connect to a Wifi Network using the Wifi icon in the upper right-hand corner
* Open a Terminal window by clicking on the Terminal icon
* Upgrade default version of [Node](https://github.com/sdesalas/node-pi-zero) to v7.7.1
```bash
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v7.7.1.sh | bash
node -v
npm -v
```
* Clone the application repository
```bash
mkdir ~/projects
git clone git@github.com:bigtimebuddy/pi-cobalt.git
```
* Install any dependencies
```
cd ~/projects/pi-cobalt
npm install
```
* Add the application to **/etc/rc.local**, to make sure it starts up whenever the Pi Zero reboots 
```bash
sudo nano /etc/rc.local
# add the following line before "exit 0"
/usr/local/bin/node /home/pi/projects/pi-cobalt &
```

## Setup IFTTT Maker Hooks

* Login to [IFTTT](https://ifttt.com)
* Go to My Applets > New Applet
* Click on **+ this** and select Maker Webhooks
* Click "Receive a web request"
* In the action field provide one of the following games:
    * `cobalt_pee`
    * `cobalt_walk`
    * `cobalt_feed`
    * `cobalt_poop`
* Select the trigger clicking on **+ then** (I setup an SMS message to test)
* Go to [Maker Webhooks](https://ifttt.com/maker_webhooks) and click on "Documentation"
* Copy and paste whatever follows "Your key is:" 
* Add the key to your project, where "abcdefghijklmnopqrstuv" is your key
```
echo "abcdefghijklmnopqrstuv" > ~/projects/pi-cobalt/ifttt.key
```

## Test Application

Test the script to make sure it works. Clicking on one of the four physical buttons should echo on the command-line. If everything goes well, you should receive a notification from the IFTTT trigger you setup.

```bash
sudo node .
# Press ctrl + c to exit process
```

## Shout-out

Thanks for my friend Chris who helped me fabricate the fancy wooden box.
