var NodeunitAsync = require('nodeunit-async');
module.exports = new NodeunitAsync({
    globalSetup: function(callback) {
        console.log('global setup -- called before each test');
        callback();
    },
    globalTeardown: function(callback) {
        console.log('global teardown -- called after each test');
        callback();
    },
    fixtureSetup: function(callback) {
        console.log('fixture setup -- called once before all tests');
        callback();
    },
    fixtureTeardown: function() {
        console.log('fixture teardown -- called once after all tests');
    }
});