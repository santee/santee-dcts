'use strict';

import chai = require('chai');
import {deserialize, dataMember, anyArray} from '../index';

var expect = chai.expect;

describe("@anyArray()", () => {
    it("deserializes arrays by deep clonning it", () => {
        class A {
            @dataMember()
            @anyArray()
            public objArray: any[];

            @dataMember()
            @anyArray()
            public numbersArray: number[];
        };

        var source = { objArray: ["aa", {}, 30], numbersArray: [20, 30, 40] };
        var result = deserialize(source, A);

        expect(result.objArray).not.equal(source.objArray);
        expect(result.objArray).is.deep.equal(source.objArray);
        expect(result.numbersArray).not.equal(source.numbersArray);
        expect(result.numbersArray).is.deep.equal(source.numbersArray);
    });
});