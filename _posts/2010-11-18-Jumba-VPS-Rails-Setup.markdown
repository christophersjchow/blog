---
layout: post
title: Jumba VPS Rails Setup
---

The [Jumba VPS'](http://www.jumba.com.au/vps) are a great affordable way to get a VPS for testing and basic hosting. However, setting up a VPS is not easy and I ran into a few road blocks getting Rails running on my server. I decided to document what I did to get Rails running in the context of a Jumba VPS so that others can get up and running, but also because I actually started to forget what I had done.

## DNS Records ##

After purchasing a VPS (and a domain if you don't already have one) you'll need to create an A record pointing to the IP of your VPS. You can manage your domains with Jumba at their [domain management](http://domains.jumba.com.au) page.

## Users and sudo ##

The default Ubuntu image that is given on Jumba's VPS is configured a little differently from a standard Ubuntu install. This is specifically to do with the handling of sudo. Ubuntu handles root privileges by disabling the root account and giving users in the admin groups the ability to run tasks with root permissions. However, the Jumba Ubuntu image doesn't have this group, has the root account enabled (this is required for Parallels) and the corresponding configuration in the `/etc/sudoers` file also doesn't reflect this. Let's change this to regular Ubuntu behaviour.

First, SSH in as root and create the admin group. The group ID of `106` is Ubuntu's default group ID for the admin group.

    groupadd -g 106 admin

Next create a user for yourself and follow the prompts. Pick a reasonably strong password, as that will be the password used with sudo (it won't be used for SSH as we'll setup key authentication later).

    adduser 

Now add your user to the admin group.

    adduser admin

Next the `/etc/sudoers` file needs to be edited. 

    visudo

Make sure this line `%sudo ALL=NOPASSWD: ALL` remains commented out. This line allows users with sudo access to execute `sudo` without a password. This is bad from a security standpoint so make sure it's commented out. Add the following to the bottom of the file to enable sudo access to users in the admin group.

    %admin ALL=(ALL) ALL

Now try to SSH into the machine with the newly created user account and password.

## System ##

We can now use sudo to run anything that is required as root. Let's update the VPS and set the default locale.

    sudo apt-get update
    sudo apt-get upgrade

Whilst I was setting up webmin (I'll get to that later) I ran into a locale issue. The default locale is not setup on the Jumba VPS. First edit the `/var/lib/locales/supported.d/local`. Create this if it doesn't exist and add the following line, and any others that you wish to have enabled.

    sudo vim /var/lib/locales/supported.d/local
    en_AU UTF-8

Then run the following to generate the locales.

    sudo dpkg-reconfigure locales

Edit `/etc/default/locale` to setup your VPS' default locale.

    sudo vim /etc/default/locale
    LANG="en_AU:UTF-8"

Reboot the container and the locale should be correctly set.

Let's also install ntp to keep the time accurate.

    sudo apt-get install ntp ntpdate

## SSH ##

An unsecure SSH daemon is probably the most common way a server gets rooted. Locking down the SSH server is very important when running an unmanaged VPS so it's strongly recommended that you do something similar. The following should be a good starting point to getting SSH secure on *any* VPS.

### Disable root logins ###

This is an obvious one, and I think anyone who has any experience with administering a server would tell you to do this. There is no reason to login as root as almost any task that needs to be run as root can be done via `sudo`.

To disable root logins edit the `/etc/ssh/sshd_config` file and add:

    PermitRootLogin no

Reload the SSH daemon configuration by calling `sudo /etc/init.d/ssh reload`

### Key Authentication ###

Key authentication is an alternative to the traditional username and password method of authentication. Rather than using a username and password, users can create a matched private and public key pair. The public key resides on the server and the private key is kept by the user. When ever an authentication request is made the user must present his/her private key to the server.

To create a public/private key pair on Linux/OSX, run the following on your local machine.

    ssh-keygen -t rsa

It's *strongly* recommended you pick a paraphrase. This will create public and private keys `~/.ssh/id_rsa.pub` and `~/.ssh/id_rsa`. Now, the public key needs to be placed on the server. We can use the `scp` command to upload the public key.

    scp ~/.ssh/id_rsa.pub username@yourdomain:.

Now SSH into your VPS and run the following to place your public key in the appropriate place:

    cat id_rsa.pub &gt;&gt; ~/.ssh/authorized_keys2

Logout of your VPS and try to SSH in again.

    ssh username@yourdomain

You should be able to login without any password requests. *Only* if this works should you proceed with the following: Edit the `/etc/ssh/sshd_config` file again and add:

    PasswordAuthentication no
    ChallengeResponseAuthentication no

This will disable password logins and only allow key based authentication.

### Changing Port ###

This is an optional step but it's also a very easy way to stop the standard script kiddies from port scanning your server and detecting that SSH is enabled. By changing the default port of 22 to something uncommon the number of attacks that you'll see will most likeley drop significantly. Just change the line `Port 22` to something else:
    
    Port xxxx

## Webmin and Virtualmin ##

### Webmin ###

Webmin is a web based administrative tool for Linux/Unix based servers. It allows you to manage almost anything you could do from the command line from a nice web interface.

First install webmin dependancies.

    sudo apt-get install perl libnet-ssleay-perl openssl libauthen-pam-perl libpam-runtime libio-pty-perl libmd5-perl

Then download the latest webmin debian package:

    wget -O webmin-current.deb http://www.webmin.com/download/deb/webmin-current.deb

Then use dpkg to install:
    
    sudo dpkg -i webmin-current.deb 

This will now allow you to go to `https://:10000`. You can login with the `root` account.

### Virtualmin ###

Virtualmin is a tool to manage multiple virtual servers. It makes managing multiple websites on one server extremely easy.

First install ProFTPd.

    sudo apt-get install proftpd

Then follow the instructions at `http://www.webmin.com/vdownload.html` to install virtualmin. You may want to edit the default Virtual Host template under Virtualmin -&gt; System Settings -&gt; Server Templates -&gt; Apache website (Dropdown)

For example, I dislike the `www` in front of my domains so I added this to the template:

    RewriteEngine on 
    RewriteCond %{HTTP_HOST} ^www.${DOM} [NC] 
    RewriteRule ^/(.*)$ http://${DOM}/$1 [R=301] 

I also added some log file locations

    ErrorLog ${HOME}/logs/error_log
    CustomLog ${HOME}/logs/access_log combined

## Ruby on Rails ##

Now that the system is properly locked down we can move on to getting Rails working. This will be a full setup of Rails, including how to deploy Rails apps using Capistrano. Make sure you have followed the key authentication section above, as that is required to get all this working.

First thing is to install ruby and some dependancies for RubyGems.

    sudo apt-get install ruby build-essential libopenssl-ruby ruby1.8-dev

Next we have to install RubyGems. The recommended method of doing this is to not use the package management system. Instead it's best to install it from source. The latest version as of this article is 1.3.7.

    wget http://rubyforge.org/frs/download.php/70696/rubygems-1.3.7.tgz

Extract and run the setup.rb

    tar xvzf rubygems-1.3.7.tgz
    cd rubygems-1.3.7
    sudo ruby setup.rb

Once this is done you can delete the tgz and the rubygems-1.3.7 folder. RubyGems installs the standard scripts with a `1.8` suffix. We'll have to create symlinks:

    sudo ln -s /usr/bin/gem1.8 /usr/local/bin/gem
    sudo ln -s /usr/bin/ruby1.8 /usr/local/bin/ruby
    sudo ln -s /usr/bin/rdoc1.8 /usr/local/bin/rdoc
    sudo ln -s /usr/bin/ri1.8 /usr/local/bin/ri
    sudo ln -s /usr/bin/irb1.8 /usr/local/bin/irb

Now we can install rails. On a VPS it's probably a good idea to not install ri/rdoc. You may also want to include some other gems as needed.

    sudo gem install rails --no-rdoc --no-ri

Next we can install the passenger gem. This is recommended over using apt-get as the version available in apt is rather old.

    sudo gem install passenger --no-rdoc --no-ri

After the gem is installed you'll have a new command available to compile the passenger module for Apache2. Run:

    sudo passenger-install-apache2-module

Follow the instructions that the install presents. There a number of dependancies that are required. The installer will tell you which ones are needed. Once this is done all that's left is to create virtual hosts for your Rails apps.

Here is an example of a virtual host for a Rails app. The `DocumentRoot` should point to the `public` directory of your Rails app. Passenger will then take care of the rest.

    ServerName example.com

    DocumentRoot /var/www/public
        AllowOverride all
        Options -MultiViews
    LogLevel warn
 
So thats it for now. There are some other things I might add later on.
