Custom JS Library builder
===================

##### Status: Development


#### Purpose:

- **Personal project**. Just playing around and learning some new stuff
- To better understand jQuery inner workings
- To build a smaller sizes jQuery library, by removing all unneeded stuff for certain projjects
- Add some features by extending jQuery
- Using LoDash build tools to integrate into jQuery
- Everything should be configurable in the _config.yml file.

Main goal is to create a process that makes it possible to only include features that are usefull for any project so the result will be as small as possible.

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

```yaml
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
```

Installing etc as usual
```sh
$ npm install -g grunt-cli # If you haven't got it already
$ npm install
$ grunt dist # creates a normal and minified version in /dist folder with only the configured modules
$ grunt radicbuild # Creates a version with all modules (jquery + radic). Run uglify:dist afterwards for minification
```

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
Copyright 2014 Robin Radic - [MIT Licensed](http://radic.mit-license.org/) - [My Github.io page](https://robinradic.github.io/)