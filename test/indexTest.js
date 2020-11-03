describe('index: When GET Items request is received', function() {
    describe('And shop service returns a list of items', function() {
        it('Should return the list');
    });
    describe('And shop service fails', function() {
        it('Should return 500 error');
        it('Should return error code');
    });
});

describe('index: When Search Items request is received', function() {
    describe('And shop service returns a list of items', function() {
        it('Should return the list');
    });
    describe('And shop service fails', function() {
        it('Should return 500 error');
        it('Should return error code');
    });
});

describe('index: When Buy Item request is received', function() {
    describe('And shop service succeeds', function() {
        it('Should return HTTP 200');
    });
    describe('And shop service fails', function() {
        describe('Because item not found', function() {
            it('Should return 404 error');
            it('Should return error code');
        });
        describe('For any other reason', function() {
            it('Should return 500 error');
            it('Should return error code');
        });
    });
});

describe('index: When Sell Item request is received', function() {
    describe('And shop service succeeds', function() {
        it('Should return HTTP 200');
    });
    describe('And shop service fails', function() {
        describe('Because item not found', function() {
            it('Should return 404 error');
            it('Should return error code');
        });
        describe('For any other reason', function() {
            it('Should return 500 error');
            it('Should return error code');
        });
    });
});