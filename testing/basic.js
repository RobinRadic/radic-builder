var b = require('nodeunit-b');
var assert = require('assert-plus');


// you'll want to use __dirname to pin root relative to your test file.
// arguments to setRequireRoot are run through path.join.
b.setInjectRoot(__dirname);
// front-end dependencies to inject into the DOM.
b.inject([
    // relative to where you set inject root
    // Note that these files will be checked for syntax errors.
    'dist/jquery.js'
]);

function assertTest(type, object, message) {
    try {
        assert[type](object, message);
    }
    catch (e) {
        return false;
    }
    return true;
}

function dummyObject() {
    return {
        first: 'hai',
        second: 'bai'
    }
}

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
    testJquery: function (test, w, $) {
        $('<span/>').appendTo('body').addClass('foo');
        test.ok(typeof $ === 'function', '$ is a function');
        test.done();
    },
    testAsync: function (test, w, $) {

        test.ok(assertTest('object', $.async, '$.async'));
        test.ok(assertTest('func', $.async.each, '$.async.each'));
        test.ok(assertTest('func', $.async.waterfall, '$.async.waterfall'));

        $.async.each(dummyObject(), function (obj, cb) {
            test.ok(true, 'async each loop');
            cb();
        });


        test.done();
    },
    testGithub: function (test, w, $) {
        test.ok(assertTest('object', $.github, '$.github'));
        $.github.user('RobinRadic', function(user){
            test.ok(assertTest('object', user, '$.github.user return object'));
            test.ok(user.login === 'RobinRadic', 'user login data');
            test.done()
        })
    }

});
