---
layout: page
title: Radic builder
---
[![Build Status](https://secure.travis-ci.org/RobinRadic%2Fradic-builder.svg?branch=master)](https://travis-ci.org/RobinRadic%2Fradic-builder)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fradic-builder.svg)](http://badge.fury.io/gh/robinradic%2Fradic-builder)
[![Goto documentation](http://img.shields.io/badge/goto-documentation-orange.svg)](http://robinradic.github.io/radic-builder)
[![Goto repository](http://img.shields.io/badge/goto-repository-orange.svg)](https://github.com/robinradic/radic-builder)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)


#### Purpose:
Create a library based on jQuery with custom added modules. Both jQuery and the custom modules can be picked by altering the config.yml file. This results in either a smaller or bigger script file.

This way it's possible to customise it for individual project requirements.

Smallest build is around 12kb (4kb minified, 1kb gzip)


#### Todo
- Make it less opinionated, more configurable and more usefull for other developer
- Need to clean up folders, code, my desk... and probably my room aswell


#### Custom modules:
- async (each/waterfall)
- cookie
- crypt (md5, utf8)
- etag
- github (api)
- github-extra (bunch of utility and helper funcs)
- lodash (where, bind, keys, omit, pick, values, cloneDeep)
- widget factory (jquery-ui)
- sprintf
- lodash templates


#### Testing
Some tests have been created in /test. Need more work

#### How to use
`_config.yml` contains all configuration options. The modules for a custom jQuery can be picked like that.

{% highlight yaml %}
# - jQuery modules: core, selector,  traversing, callbacks,  deferred, core/ready, data,  queue, queue/delay,
#                 attributes,  event, event/alias, manipulation,  manipulation/_evalUrl, wrap,  css, css/hiddenVisibleSelectors,
#                 serialize,  ajax, ajax/xhr, ajax/script, ajax/jsonp, ajax/load, effects,  effects/animatedSelector, offset,  dimensions, deprecated,  exports/amd, exports/global"
# core and selector are mandatory
# -Radic modules: async, cookie, crypt, etag, github, github-extra, lodash, lotemplates, sprintf, widgets

build:
  filename: jquery.custom
  modules:
    jquery: core, selector
    radic: widgets, async, github, sprintf



# Some file sizes as example: (remember, gzip/deflate makes it even smaller)
# default jquery-1.11.1.min.js = 93kb
#-------------------------------
#    jquery: core
#    radic: widgets
#    size: 12.8kb / 4.0kb (minified)
#-------------------------------
#    jquery: core
#    radic: github
#    size: 31kb / 14kb (minified)
#-------------------------------
#    jquery: core, selector, traversing, event, ajax
#    radic: github, async, lodash, lotemplates
#    size: 236kb / 64kb (minified)
{% endhighlight %}

Installing etc as usual
{% highlight bash %}
npm install -g grunt-cli # If you haven't got it already
npm install
grunt dist # creates a normal and minified version in /dist folder with only the configured modules
grunt radicbuild # Creates a version with all modules (jquery + radic). Run uglify:dist afterwards for minification
{% endhighlight %}

#### File sizes
Highly depends on what modules you use. Remember, some modules depend on each other and will auto-include themselfs.


#### The following authors shared (MIT licensed) code have been either been fully included, partially copied or inspired this project.
- [@Benvie](https://github.com/Benvie/fat-grabby-hands): fat-grabby-hands (+1 for naming)
- [jQuery and jQuery UI](https://github.com/jquery)
- lodash
- asyncWaterfall
- [@alexei](https://github.com/alexei/sprintf.js): sprintf
- [PHPJS](http://phpjs.com)
- [@piotrl](https://github.com/piotrl/github-profile-widget) Inspired the profile widget (re-written it completely, apart from the CSS)



License
--------------
Copyright 2014 Robin Radic - [MIT Licensed](http://radic.mit-license.org/)

