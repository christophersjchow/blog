---
layout: post
title: Asrock 330HT and XBMC Live
---

I've been searching for a way to play my media for quite awhile and could never find anything that would do everything that I wanted. Specifically I wanted full Substation Alpha support, and none of the embedded media player devices on the market have this fully supported. The latest firmware(s) for the A/C-200/210 Popcorn hours provide some support but it's still not quite there yet. So I decided to setup an Ion based nettop with XBMC. The following documents how I got XBMC Live CD Dharma working.  

## Download and install LiveCD
First thing you'll need is to download and burn the LiveCD from here http://xbmc.org/download I didn't bother with trying to make a USB bootable with this image as the Asrock 330HT has a DVD drive.  Boot off the CD and follow the prompts to install. I just stuck with the recommended settings. Make sure to use xbmc/xbmc as the username and password for the user you create to allow XBMC to autostart.

Once XBMC has started up there are 2 things that need to be setup. Sound and the IR Remote. SSH in to the box using the user you just created. (I'm gonna assume that anyone who follows this will have the box hooked up via ethernet). If it isn't on the network, press Control-F1 to switch sessions. To get back to XBMC press Control-F7 or Control-F8. (I can't remember which).

## Sound

Make sure HDMI is selected as the audio output device in XBMC.

Now SSH in and run `alsamixer` on the command line. This will allow you to un-mute `S/PDIF`, `S/PDIF Default PCM`, `S/PDIF 1` by selecting each channel and pressing `m`. Then hit `esc` to quit. Run `sudo alsactl store` to save the settings across reboots. Sound should now be output through HDMI. 

## Remote

The current RC1 LiveCD comes with kernel 2.6.32-25. Asrock have released a driver for the IR remote that supports this kernel.

From the command line run:
    
    wget 'ftp://174.142.97.10/drivers/Nettop/Ubuntu/IR(10.04)2.6.32-25.zip'

Now unzip the driver:
    
    unzip IR(10.04)2.6.32-25.zip

This will extract a 32bit and 64bit driver to the current directory. To check which architecture you're running on run `uname -a | cut -d' ' -f12` on the command line. If you get `i686` then the system is on 32bit. Otherwise it's 64 bit.

To install the driver run:

    sudo dpkg -i lirc-nct677x-1.0.4-ubuntu10.04_kernel2.6.32-25.deb

Now run `sudo reboot` to restart the system and the remote should work.

## Wifi

Getting wifi working is as simple as installing a few packages.

    sudo apt-get install wicd wicd-curses

Then start wicd by running:
    
    sudo /etc/init.d/wicd start

Run `wicd-curses` and you'll be presented with a method of choosing networks.

1. Highlight the one you want to connect to and press the right cursor key to configure it
2. Scroll down and check 'Automatically connect to this network'
4. Scroll down to the botton and enter the wireless key
5. Press `F10` to save. You should be back at the list of networks with your network highlighted
6. Press `Shift-c` to connect to the network

Once connected (check status in the bottom left), press `q` to quit

Note that I had pretty bad wireless performance when I tried this. I couldn't stream anything with constant buffering so your mileage may vary. I'd strongly recommend using ethernet.

## Unicode Support

XBMC supports unicode. To enable it change the default font to Arial under Appearance settings then reboot.

## XBMC Advanced Settings

### CPU Temp
GPU temps are reported without having to install anything extra, but CPU temperature monitoring requires lm-sensors. Run the following and follow the prompts.

    sudo apt-get install lm-sensors
    sudo sensors-detect

### advancedsettings.xml

There are lots of settings that aren't configurable via the GUI. These are set in `.xbmc/userdata/advancedsettings.xml`. 

Here is a link to mine for reference: http://gist.github.com/724740

### Scraping and Anime

When settings a source make sure to configure the scraper (TheTVDB). Set it to prefer posters and for Anime select absolute numbering.
