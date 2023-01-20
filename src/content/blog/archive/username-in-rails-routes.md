---
title: Username in Rails routes
description:
date: 2011-02-17
---

This seems to be a popular question on #rubyonrails@Freenode IRC channel. I
decided to give it a go in a dummy app and this is what I ended up with in my
`routes.rb`.

```ruby
Routes::Application.routes.draw do
  resources :users, :only => [:index, :create, :new]
  match ":username/edit", :to => "users#edit", :as => "edit_user", :via => :get
  match ":username", :to => "users#show", :as => "user", :via => :get
  match ":username", :to => "users#update", :as => "user", :via => :put
  match ":username", :to => "users#destroy", :as => "user", :via => :delete
end
```

All references to `:id` are replaced with `:username` instead. I also had to
add this in the model to change the resource identifier that Rails uses in urls
from the number id to the username.

```ruby
def to_param
  username
end
```

In the controller every occurence of `User.find(params[:id])` had to be changed
to `User.where(:username => params[:username]).first`. This needs to be done as
the controller now receives `params[:username]` instead of `params[:id]`. Even
though this works, I wonder if there's a cleaner way of doing this.
