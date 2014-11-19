this.suite1 = {
    'jQuery and $ is accessible': function (test) {
        test.ok(typeof $ === 'function');
        test.ok(typeof jQuery === 'function');
        test.equals($, jQuery);
        test.done();

        //nodeunit.assert.defined($);
        //test.ok(true, 'everythings ok');


    },
    'apples and oranges': function (test) {
        test.ok();
        dest.done();
    }
};
