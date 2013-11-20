---
layout: post
title: grokking Chef
---

At work, I've begun the arduous task of migrating off a managed host onto AWS,
and as such have started investigating how to setup configuration management.
I've tried a few times to get my head around Chef (probably the fifth time) and
I think I've finally had an epiphany of how all the different things in Chef
fit together.

## Too many ingredients

The hardest part I found about Chef was understanding the vocabulary of Chef
and how the different pieces fit together in practice. Conceptually I
understood that cookbooks were a way to encapsulate configuration, but I
didn't completely grok how they fitted together with the rest of the pieces in
the Chef landscape - environments, roles, databags, attributes etc.

The way to setup all these things with the appropriate tools in practice was
also an enigma. One tutorial would say "install librarian-chef". Another would
say "just clone the cookbooks" and a third would say "use berkshelf".[^1]
Then there's vagrant and it's plugins (berkshelf, ec2), the differences between
Chef Solo and Chef Server, which lead to differences in the version of knife
(solo, ec2, vanilla) to use.

## Cookbooks

I'm going to define a cookbook as a single encapsulated piece of configuration,
typically represented by a defined need[^2], installing MySQL for example. A
cookbook is composed of one or more recipes, each recipe describing a
*variation* of the configuration. Again, using the MySQL example, the default
recipe could install MySQL via `apt` and a second recipe that would install it
by compiling from source.

A recipe typically has some generic configuration, so in the case of MySQL this
could be the root password. Default attributes are typically provided for each
recipe and can be overriden when a recipe is being used. How cookbook recipes
are used I'll get to later.

Getting this far was all well and good, however I still didn't understand how
cookbooks related to roles.

## Environments, Roles, Attributes

I didn't go down the Chef Solo route so I'm not sure what differences there
would be compared to Chef Server.

Initially, I created a bunch of cookbooks with roles in them. I'd configure
knife in each cookbook repo, and upload both the roles and the cookbooks to the
Chef Server before bootstrapping a node with knife and specifying the roles on
the command line.

So for example, I created
[one](https://github.com/kinesisptyltd/cookbook-rails) to bootstrap a server
that would serve a Rails app. Originally I had a `rails` role in this cookbook.

This became problematic as I was confused as to where to put the attributes to
override the defaults in the recipes when bootstraping a node with that role.
Do I put them in an `override_attributes` call in the role?  But then the role
in the cookbook would no longer be generic. Specifying attributes at the
environment level wouldn't make sense either as that would mean that anything
with that role in that environment would inherit the same attributes.

## Realisation 1 - Cookbooks shoudn't have Roles

This made me realise that I shouldn't be placing roles in my cookbooks. Roles
are a description of **what recipes to run** and aren't as generic as
cookbooks. Roles are also uploaded to the Chef Server, _in parallel_ with
cookbooks. They're related but orthogonal to cookbooks.

## Realisation 2 - Cookbooks should be generic as possible

This is easily achievable by exposing overridable default attributes for
anything that should be customisable by the consumer of that recipe.

A cookbook's dependancies can be managed using the afformentioned tools.
Berkshelf and libraian-chef are like bundler for cookbooks. Both of these tools
integrate with knife to inform it of where the cookbooks are located. The
differences between them are how they manage cookbooks in conjunction with the
_central chef-repo_.

## Realisation 3 - Create a chef-repo to encapsulate a Chef setup

This is what the central **chef-repo** is. By Chef setup I mean everything that
is specific to your configuration needs. Things like roles, environments,
databags. In addition this is also where you specify what cookbooks your setup
requires to be configured.

The way I picture this is to imagine manging different clients' infrastructure.
Each clients infrastructure would be different, with different Chef roles,
environments and databags.  You would have a separate central chef-repo for
_each_ client, describing the specifics of each clients infrastructure.

## Realisation 4 - Berkshelf / librarian-chef are used in both the chef-repo and cookbooks

This is part of the reason why the management of all this in practice is
confusing. Berkshelf and librarian-chef manage cookbook dependancies. So in the
main chef-repo, you have a `Cheffile` or `Berksfile` to specify which cookbooks
are required. But you would also do this in a cookbook itself, as an individual
cookbook could depend on a number of others.

Though they do the same thing, the purpose of these tools in each of this
contexts is different. In the cookbook context, these tools are just use for
_dependancy management_. However in the chef-repo context they're used to
specify what cookbooks are _available_ for a particular infrastructure
deployment.

## Realisation 5 - knife is the key to the kingdom

knife is used to manage and actually "use" Chef. It is the CLI interface to Chef and can

- Can create users in Chef Server
- Can list node information
- Create new nodes
- Upload roles, databags, environments, cookbooks
- Execute commands across nodes

plus [more](http://docs.opscode.com/knife.html). An example would be `knife ssh
"environment:staging" "sudo chef-client"` which will execute `sudo chef-client`
on all nodes that are in the `staging` Chef environment.

# tl;dr

- Cookbooks don't have roles
- Make cookbooks generic, use default attributes
- A central chef-repo describes a set of infrastructure specific for a particular use case and should include
  - Environments like staging, uat, production
  - Roles like web, db, app, elb
  - Databags for credentials, certificates etc
- Berkshelf, librarian-chef et. al are used for multiple purposes:
  - For cookbooks, they are used strictly for dependancy management
  - For central chef-repos, they are used to specify what cookbooks are available for a particular infrastructure setup
- knife is main tool to "use" Chef. It is the main interface to Chef.

I'll be posting guides on how to actually get all this working soon.

[^1]: The official docs use berkshelf, and it seems to be the recommended method of managing cookbooks, but there's no mentioning of why.
[^2]: A "defined need" is clearly open for interpretation. Obviously composing cookbooks is completey fine and I think the best approach, but I think that things like application deployment shouldn't be in cookbooks.
