---
title: prezto, tmux, tmuxinator and vim
date: 2013-09-02
---

It's been a long time since I've made a post, so to ease back into regular
posting I thought I'd start with a post on what's changed with my current
working environment.

## prezto

[Previously](http://chris.chowie.net/2011/01/28/Simplifying-my-work-environment-with-iTerm2-and-zsh/)
I was using oh-my-zsh with iTerm2. I haven't stopped using iTerm2 (as it just
keeps on getting better), but have ditched oh-my-zsh for the much cleaner and
well maintained [prezto](https://github.com/sorin-ionescu/prezto). It's fast,
stable and _extremely_ well documented. Just have a look around in the
[modules](https://github.com/sorin-ionescu/prezto/tree/master/modules)
directory of the source. I can't thank
[Sorin](https://github.com/sorin-ionescu) enough for his hard and rigorous
work.

## vim

I've now got a more full featured [vim
setup](https://github.com/Soliah/dotfiles) now, and feel like I've progressed
with my vim-fu significantly. (I recommend having a look at the [Practical
Vim](http://pragprog.com/book/dnvim/practical-vim) book if you're looking to
improve your vim skills). I now use
[base16](https://github.com/chriskempson/base16) in both iTerm2 and vim. The
setup is actually a bit tricky for the 256 colour variant. You have to:

1. Load the [iTerm2](https://github.com/chriskempson/base16-iterm2) colour
   pallete into your iTerm2 profile
2. Make sure the appropriate [shell script] is run at shell load to change the
   256 colour space. I've done this by placing the script in
   `~/.bin/base16-tomorrow.sh` and running `source ~/.bin/base16-tomorrow.sh`
   in my `.zshrc`
3. Use [vundle](https://github.com/gmarik/vundle) or
   [pathogen](https://github.com/tpope/vim-pathogen) to install
   [base16-vim](https://github.com/chriskempson/base16-vim)
4. Make sure your `.vimrc` has the following:

```
" Access colors present in 256 colorspace
let base16colorspace=256

" Change this to the them you're using
colorscheme base16-tomorrow
```

With the base16-tomrrow theme, it ends up looking like this:

<img class="img-responsive" src="http://f.cl.ly/items/442u0j3b35331l391X0e/Screen%20Shot%202013-09-02%20at%209.32.53%20PM.png">

## tmux + tmuxinator

I've been using tmux now for over a year and it has been amazing for
productivity. It helps to isolate separate work environments and allows for
extremely easy pairing.

[tmuxinator](https://github.com/aziz/tmuxinator) is a project that I am
currently maintaining. It is used to manage the creation of complex tmux
sessions easily, describing the pane and window layouts in YAML. The gem was
deemed dead for quite awhile, but I've completely rewritten it and I believe it
is now quite stable.
