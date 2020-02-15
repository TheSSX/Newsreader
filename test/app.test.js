const describe = require('mocha').describe;
const it = require('mocha').it;
const { expect } = require('chai');
const { should } = require('chai');
const { assert } = require('chai');

describe('App', function () {
    it('Should be true', function () {
        expect(true).to.equal(true);
    })
});