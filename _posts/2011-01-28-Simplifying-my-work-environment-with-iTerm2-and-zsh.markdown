---
layout: post
title: Simplifying my work environment with iTerm2 and zsh
---

After watching [PeepCode's](www.peepcode.com) latest screencast called Play by Play (great cast btw), I really liked how Gary Bernhardt kept things simple by really only using one terminal window, taking full advantage of `^z` with `fg`. I decided to make a few changes to my prompt in an attempt to simplify coding setup, taking inspiration from Gary's setup. Up until now I had actually been using MacVim for most of my coding, using `⌘Tab` to switch between it and the Terminal. I also used lots of tabs in Terminal to separate tasks, though this often made it hard to find a particular session.

## iTerm2

The first thing I did was drop Terminal. [iTerm2](http://code.google.com/p/iterm2/) is a great [alternative](http://sites.google.com/site/iterm2home/iterm2-vs-terminal-app) to Terminal. The main reason I chose iTerm2 though, was because it has a fullscreen option. This resonated with the idea of a single window to work in.

## oh-my-zsh

I was already using zsh for my shell, in addition to using the great scripts provided by [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh). I have made my changes to get my prompt looking like the following so feel free to use my [fork](https://github.com/Soliah/oh-my-zsh). My theme slightly extends the default git information shown on the prompt, taking inspiration from Gary's time indicator. 

<img src="/images/posts/2011-01-28-001.png" width="95%" />

I got rid of the fatal error and added hours instead of just minutes. I've also made the color neutral when the working directory is clean.

<img src="/images/posts/2011-01-28-002.png" width="95%" />

All of this is available at my [fork](https://github.com/Soliah/oh-my-zsh).
