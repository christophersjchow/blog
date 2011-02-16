---
layout: post
title: Username in Rails routes
---

This seems to be a popular question on #rubyonrails on Freenode. I decided to give it a go in a dummy app and this is what I ended up with in my routes.rb.
{% highlight ruby %}
Routes::Application.routes.draw do
  resources :users, :only => [:index, :create, :new]

  match ":username/edit", :to => "users#edit",
                          :as => "edit_user",
                          :via => :get
  
  match ":username",      :to => "users#show",
                          :as => "user",
                          :via => :get
  
  match ":username",      :to => "users#update",
                          :as => "user",
                          :via => :put
  
  match ":username",      :to => "users#destroy",
                          :as => "user",
                          :via => :delete
end
{% endhighlight %}
All references to `:id` are replaced with `:username` instead. I also had to add this to the model to change resource identifier that Rails uses.

{% highlight ruby %}
def to_param
    username
end
{% endhighlight %}
   
This makes AR use the username instead of the id. In the controller every occurence of

{% highlight ruby %}
User.find(params[:id])
{% endhighlight %}

had to be changed to 

{% highlight ruby %}
User.where(:username => params[:username]).first
{% endhighlight %}

This needs to be done as the controller now receives `params[:username]` instead of `params[:id]`. This works for me though I'm not sure if this is the right way to do this. I wonder if there's a cleaner way of doing this.
