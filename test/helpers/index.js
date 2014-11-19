
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

module.exports = {
    assert: assertTest,
    dummy: dummyObject
};