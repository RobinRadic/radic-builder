var th = require('./asyncTestHelper');
var b = require('nodeunit-b');
var util = require('util');
var $ = require('./../dist/jquery');

console.log($.async);

exports.testAsync = function (test) {

    b.setInjectRoot(__dirname);
    b.inject(['dist/jquery.js']);
    console.log(util.inspect(b, { colors: true, hidden: true }));

    var $;
    b({
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
        }
    });



    test.ok(assert('object', $.async, '$.async'));
    test.ok(assert('func', $.async.each, '$.async.each'));
    test.ok(assert('func', $.async.waterfall, '$.async.waterfall'));
    test.done();
    return;
    $.async.each(dummyObject(), function (obj, cb) {
        test.ok(true, 'async each loop');
        cb();
    });

    $.async.waterfall([
        function (done) {
            console.log('fu')
            done(null, dummyObject())

        },
        function (data, done) {
            console.log('fu2')
            test.ok(assert('object', data, 'waterfall second function data'));
            test.ok(assert('string', data.first, 'waterfall second function dummy is string'));

            done(null, data);
        }
    ], function (err, data) {

        test.ok(assert('object', data, 'waterfall second function data'));
        test.ok(assert('string', data.first, 'waterfall second function dummy is string'));
        test.ok(data.first === 'hai', 'dummy data is correct');

        test.done();
    });

    test.done();
};
