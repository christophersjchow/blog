---
title: True colour (24 bit) with Neovim, tmux and iTerm2
date: 2015-04-19
---

_**This post is extremely old and contains outdated information. It is being kept only for historical purposes.**_

---

Neovim [recently](https://github.com/neovim/neovim/pull/2198) added 24 bit true
colour support so I thought I'd get the rest of my environment setup with true
colour. First thing is to download and intall the [latest nightly build of
iTerm2](https://iterm2.com/nightly/latest).

Next let's install the latest version of Neovim:

```shell
brew tap neovim/homebrew-neovim
brew install --HEAD neovim
```

If you've already installed it:

```shell
brew reinstall neovim
```

Next for convenience I've updated my aliases for starting up vim to set the
environment variable required to enable true colour in Neovim:

    # .zshrc
    alias v='NVIM_TUI_ENABLE_TRUE_COLOR=1 nvim'
    alias vim='NVIM_TUI_ENABLE_TRUE_COLOR=1 nvim'

I also symlink my `.vimrc` to `.nvimrc` for convenience:

```shell
ln -nfs ~/.vimrc ~/.nvimrc
```

If you were using 256 colours with vim before, say with the
[base16](https://github.com/chriskempson/base16-vim) colour schemes, you'll
want to remove the 256 colour space setting:

    " .nvimrc
    " let base16colorspace=256

Starting Neovim now should give you true colours. Here's a screenshot of Macvim
and Neovim side by side:

<img src="https://cloud.githubusercontent.com/assets/141213/7218166/9ad7fbf6-e6a0-11e4-9481-39a5eb095c5e.png">

Last thing is to install a patched version of tmux that has true colour
support. [Christian Hopps](https://github.com/choppsv1) has a repository of
homebrew recipes with patched versions of tmux, vim and emacs. Let's install
tmux from his repo:

```shell
brew uninstall tmux
brew install https://raw.githubusercontent.com/choppsv1/homebrew-term24/master/tmux.rb
```

Now make sure to exit all existing tmux sessions and you should have true
colour support.

Last thing I've noticed is git doesn't seem to pickup the aliases and launches
regular vim. Add the following to your `~/.gitconfig` under `[core]` to make
sure nvim gets launched for commit messages:

    editor = "NVIM_TUI_ENABLE_TRUE_COLOR=1 nvim"
