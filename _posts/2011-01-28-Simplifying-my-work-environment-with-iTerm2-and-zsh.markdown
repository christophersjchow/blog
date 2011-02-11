---
layout: post
title: Simplifying my work environment with iTerm2 and zsh
---

After watching [PeepCode](http://www.peepcode.com)'s latest screencast called [Play by Play](http://peepcode.com/products/play-by-play-bernhardt) (great cast btw), I really liked how Gary Bernhardt kept things simple by really only using one terminal window, taking full advantage of `^z` with `fg`. I decided to make a few changes to my prompt in an attempt to simplify my coding setup, taking inspiration from Gary's setup. Up until now I had actually been using MacVim for most of my coding, `⌘Tab`ing to switch between code and the Terminal. I also used lots of tabs in Terminal to separate tasks, though this often made it hard to find a particular session.

## iTerm2

The first thing I did was drop Terminal. [iTerm2](http://code.google.com/p/iterm2/) is a great [alternative](http://sites.google.com/site/iterm2home/iterm2-vs-terminal-app) to Terminal. The main reason I chose iTerm2 though, was because it has a fullscreen option. This resonated with the idea of a single window to work in. `⌘↵` allows me to switch between fullscreen and window mode.

## oh-my-zsh

I was already using zsh for my shell, in addition to using the great scripts provided by [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh). I have made my changes to get my prompt looking like the following so feel free to use my [fork](https://github.com/Soliah/oh-my-zsh). My theme slightly extends the default git information shown on the prompt, taking inspiration from Gary's time indicator. 

The `*` indicates dirty and `?` indicates untracked changes.

<img src="/images/posts/2011-01-28-001.png" />

As time goes by the colour of the time changes from green to yellow to red. I got rid of the fatal error and changed the time since last commit to include days and hours instead of just minutes. I've also made the color neutral when the working directory is clean.

All of this is available at my [fork](https://github.com/Soliah/oh-my-zsh).

## vim

This process wouldn't be complete without some modifications to my `.vimrc`. I really liked the current line highlighting and the tab completion, so I added it to mine. I also made a few colour changes to the completion menu. I've put my `.vimrc` up on [github](https://github.com/Soliah/dotfiles). For those that aren't familiar with vim, Henrik Nyh has a great introduction on his [blog](http://henrik.nyh.se/2011/01/textmate-to-vim-with-training-wheels).
