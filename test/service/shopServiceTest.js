const shopService = require('../../src/service/shopService.js');
const sinon = require('sinon');

describe('shopService: When buyItem is called', function() {
    describe('And item is not found', function() {
        it('Throws error with correct message');
    });
    describe('And item is found', function() {
        describe('And player does not have enough money', function() {
            it('Throws error with correct message');
        });
        describe('And player has enough money', function() {
            describe('And player is not online', function() {
                it('Throws error with correct message');
            });
            describe('And player is online', function() {
                it('Charges player');
                it('Gives player items');
            });
        });
    });
});