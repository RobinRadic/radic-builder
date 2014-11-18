Custom Jquery Build
===================

#### Purpose:

- Personal project. Just playing around and learning some new stuff
- To better understand jQuery inner workings
- To build a smaller sizes jQuery library, by removing all unneeded stuff for certain projjects
- Add some features by extending jQuery

#### Current modules:
- cookie
- crypt
- etag
- github


#### Small example:
```javascript
var crypted = $.crypt.md5('MD5MEPLZZZ');
var encoded = $.crypt.utf8.encode('ENCDOEMEPLZZZ');
var decoded = $.crypt.utf8.decode('ENCDOEMEPLZZZ');
```


Building is similiar to how jquery is build, check out [http://github.com/jquery/jquery]. In my Gruntfile.js:
```javascript
var modulesToBuild =  "custom"; //'build:*:+core:+github';
```

#### How it works
`/node_modules/jquery/src` is copied to `/.tmp`
`/src` is copied to `/.tmp`, overiding all
`Gruntfile.js` includes jQuery's `grunt-jquery/2.1.1/build.js` which combines it all
The resulting `jquery.js` goes into the `dist` folder and `.tmp` will be cleaned.
Can do a `grunt uglify` afterwards if wanted

License
--------------
Copyright 2014 Robin Radic - [MIT Licensed](http://radic.mit-license.org/) - [My Github.io page](https://robinradic.github.io/)