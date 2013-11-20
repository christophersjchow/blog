require "redcarpet"

Time.zone = "Australia/Sydney"

activate :syntax,
  :linenos => "inline",
  :anchorlinenos => true,
  :linenostart => 2

activate :blog do |blog|
  # blog.prefix = "blog"
  # blog.permalink = ":year/:month/:day/:title.html"
  blog.sources = "/posts/:year-:month-:day-:title.html"
  # blog.taglink = "tags/:tag.html"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = ":year.html"
  # blog.month_link = ":year/:month.html"
  # blog.day_link = ":year/:month/:day.html"
  # blog.default_extension = ".markdown"

  # blog.tag_template = "tag.html"
  # blog.calendar_template = "calendar.html"

  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/:num"
end

set :haml, :format => :html5
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true, :footnotes => true, :autolink => true

set :css_dir, "stylesheets"
set :js_dir, "javascripts"
set :images_dir, "images"

# Pretty URLs.
activate :directory_indexes

after_configuration do
  sprockets.append_path Modernizr.path
end

# page "/feed.xml", :layout => false
page "/sitemap.xml", :layout => false
page "/index.html", :layout => :application
with_layout :post do
  page "/posts/*"
end

# Build-specific configuration
configure :build do

  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end
