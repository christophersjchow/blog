---
title: Rails with RVM on OSX
date: 2011-02-16
---

I realise that there are plenty of tutorials online that show how to get Rails
setup on OSX. A lot of them are very brief and don't explain much about what's
going on. I've decided to write a guide that will flesh out your typical Rails
setup guide.

Almost all of the stuff performed in this guide is done inside Terminal.app.
Note that I will assume knowledge of the command line and basic nix commands.

## Apple Developer Tools

The Apple Developer tools are required to get a working development
environment. This can be downloaded and installed from
[ADC](http://connect.apple.com/). An ADC (free) account is required to download
the tools (which is quite a large download @ ~3.5GB).

## Homebrew

Before even getting to Ruby or Rails we need to install the git version control
system. This is required by RVM. There are a [number of
ways](http://help.github.com/mac-git-installation/) of installing git on OSX,
though I recommend using a package manager like
[Homebrew](http://mxcl.github.com/homebrew) or
[Macports](http://www.macports.org/). I went with Homebrew. Install Homebrew by
following the instructions on
[Github](https://github.com/mxcl/homebrew/wiki/installation). I chose to
install it into `/usr/local` and haven't had any negative side effects after
taking ownership of it.

Once Homebrew is installed run the following command to install `git`:

    $ brew install git

Might as well install a few other packages as well:

    $ brew install wget sqlite postgresql

Then run the following to initialise the postgres database.

    $ initdb /usr/local/var/postgres

## Ruby Version Manager

RVM provides the ability to switch between multiple versions of Ruby as well as
providing an added feature called gemsets. Gemsets allow you to create specific
sets of gems, preventing you from polluting your gem environment and also
preventing gems from conflicting (eg. Rails 2 and Rails 3 can be placed in
separate gemsets).

Install RVM in the recommended fashion:

    $ bash < <( curl http://rvm.beginrescueend.com/releases/rvm-install-head )

The following then needs to be placed after any `$PATH` declarations in your shell's RC file.

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

Now either close and reopen Terminal or `source` your shell's rc file. In my
case that was my `.zshrc` file. Once this is done `rvm notes` should work and
display some notes regarding RVM. We can now use RVM to get the appropriate
versions of Ruby. RVM will install Ruby to `~/.rvm`, providing a nice sandboxed
Ruby install for development.

Create a `.gemrc` file to prevent the rdocs from being installed with gems as I
never use them.

    $ echo "gem: --no-ri --no-rdoc" >> .gemrc

Then install Ruby 1.9.2:

    $ rvm install 1.9.2

RVM will download the Ruby source, compile it and install it to
`~/.rvm/rubies/ruby-1.9.2-pXXX`. Switch to the newly installed version by
running:

    $ rvm use 1.9.2
    $ ruby -v
    ruby 1.9.2p136 (2010-12-25 revision 30365) [x86_64-darwin10.6.0]

We can set a default version to use by running:

    rvm --default use 1.9.2

Switching back to the system Ruby by using:

    $ rvm use system
    Now using system ruby.

## Gems and gemsets

Gems can be installed in the standard manner using the `gem` command. Make sure
not to use `sudo` as this will use the system Ruby and install gems into
`/Library/Ruby/Gems/1.8`.

As mentioned earlier, RVM allows for things called gemsets. Gemsets allows for
multiple groups of gems on a per Ruby basis. RVM also provides a global gemset.
This is set of gems that is available to all _other_ gemsets in a particular
Ruby. Gems that are appropriate for the global gemset are gems like wirble,
rake, bundler and rdoc. Let's create the global gemset and install these gems
in it.

First make sure the gem environment is correctly setup:

    $ gem env | sed '10,12!d'
    - GEM PATHS:
     - /Users/Soliah/.rvm/gems/ruby-1.9.2-p136
     - /Users/Soliah/.rvm/gems/ruby-1.9.2-p136@global

This is the output when no particular gemset is chosen. Note that there are two
paths that are searched for gems. Let's switch to the global gemset and install
some gems.

    $ rvm gemset use global
    Now using gemset 'global'
    $ gem install wirble bundler rake rdoc

If we run `gem list`:

    *** LOCAL GEMS ***

    bundler (1.0.10)
    rake (0.8.7)
    rdoc (3.5.3)
    wirble (0.1.3)

Now, no matter what gemset we are using those four gems will be available.
Let's make a rails3 gemset.

    $ rvm gemset use rails3
    $ gem install rails

This will install the 20 or so gems that rails depends on in the rails3 gemset.
If we look at the gem path we can see that the global gemset is always there.
This is how the global gemset works.

    $ gem env | sed '10,12!d'
    - GEM PATHS:
     - /Users/Soliah/.rvm/gems/ruby-1.9.2-p136@rails3
     - /Users/Soliah/.rvm/gems/ruby-1.9.2-p136@global

To make a particular gemset a default for a particular directory, RVM requires
a `.rvmrc` file in that directory. To create one we can use the following
command:

    rvm use 1.9.2@rails3 --rvmrc

The next time you switch to this directory RVM will prompt you to confirm if
the `.rvmrc` is to be trusted or not. Just follow the prompts to trust it. From
then on if you switch to this directory, RVM will automatically switch to the
rails3 gemset.

For other gemset commands (creating, deleting, listing etc) refer to the RVM
manual [here](http://rvm.beginrescueend.com/gemsets/).

## Closing

If I missed anything please let me know.
