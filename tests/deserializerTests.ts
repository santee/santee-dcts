'use strict';

import chai = require('chai');
import {deserialize} from '../index';

var expect = chai.expect;

describe("deserialize function", () => {
    it("throws exception if object passed is not an object", () => {
        expect(() => deserialize("whoops", Object)).to.throw(Error);
    });

    it("throws exception if object passed is null", () => {
        expect(() => deserialize(null, Object)).to.throw(Error);
    });

    it("throws exception if constructor function passed is null", () => {
        expect(() => deserialize({}, null)).to.throw(Error);
    });

    it("throws exception if constructor function passed is undefined", () => {
        expect(() => deserialize({}, undefined)).to.throw(Error);
    });
});