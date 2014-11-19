var b = require('nodeunit-b');

// you'll want to use __dirname to pin root relative to your test file.
// arguments to setRequireRoot are run through path.join.
b.setInjectRoot(__dirname);

// front-end dependencies to inject into the DOM.
b.inject([
    // relative to where you set inject root
    // Note that these files will be checked for syntax errors.
    'dist/jquery.js'
]);

// wrap your test object
exports.testAllTheThings = b({
    // make these properties of window conveniently available to tests
    provide: ['$'],
    // html to bootstrap sandbox DOM with
    html: 'test.html',
    setUp: function (cb, w, b) {
        // w is a window object with a document attached
        // b is still b

        // mock out jquery.ajax
        w.$.ajax = function () {
        };
        cb();
    },
    tearDown: function (cb, w, b) {
        // another chance to mutate b, w
        // (though w will be reset in setUp)
        cb();
    },
    testThing: function (test, w, $) {
        $('<span/>').appendTo('body').addClass('foo');
        test.ok(typeof $ === 'function', '$ is a function');
        $.

        test.ok(typeof $.github.user === 'function', '$ is a function');


        test.done();
    }
});

