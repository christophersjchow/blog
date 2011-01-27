---
layout: post
title: Jekyll, Compass & SASS, Disqus
---

## Jekyll

After a minor trial with Posterous I decided that I didn't particularly like the web management interface nor did I want to post via email. I also found my blog to be quite slow and unresponsive at times. I did a bit of research and decided to take advantage of github's [pages](http://pages.github.com) functionality using [Jekyll](https://github.com/mojombo/jekyll). Jekyll is a static site generator that converts the posts I write in markdown into a complete static HTML website. github takes the master branch of a repository named `username.github.com` and serves the content. If github detects the prescence of a Jekyll website, it will perform the necessary conversion into static HTML. (github looks for folders and files prefixed with an `_` to determine if the repository is a Jekyll site).

github pages also allows for custom domains. Create a file called `CNAME` in your repository and add a line with the name of your domain in it. Then create a `CNAME` record for your domain pointing to `username.github.com`. Commit and after the DNS record propogates the blog should be accessible at the custom domain.

## Compass & SASS

I've always hated how there was so much code repetition in CSS and [Compass](http://compass-style.org/) addresses that problem with [SASS](http://sass-lang.com/), an extensions of CSS3. SASS provides nested selectors, variables, mixins and a bunch of other cool stuff. The way it works is as you're writing SASS styles, Compass watches your site directory and automatically "compiles" your SASS into standard CSS. Compass also has built in Rails and Blueprint support.

I should mention that SASS actually has two syntax options for writing styles (this confused me at first). There is the default option, "Sassy CSS" (file extensions `.scss`) which is a superset of CSS. All standard CSS styles will work without any changes if you choose this syntax. The alternative is just called "SASS" (file extensions `.sass`) and is an indented oriented syntax inspired by HAML. I found the latter to be much more concise and clear than Sassy CSS.

## Disqus

[Disqus](http://disqus.com) has been around for ages now and is pretty much the go to for a comment system if one doesn't want to roll their own (and in this case, not possible as I wanted to use github pages). There wasn't anything tricky with setting up Disqus. Just had to follow the instructions after signing up.

## To Do

I still have more to do though:
 - Create a custom 404 page.
 - Add navigation of some sort.
 - Date for the posts would be nice.
 - RSS feed.
 - Come up with a name. (My name in Japanese doesn't cut it).
 - Google Analytics maybe?
