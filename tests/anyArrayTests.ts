'use strict';

import chai = require('chai');
import {deserialize, dataMember, anyArray} from '../index';

var expect = chai.expect;

describe("@anyArray()", () => {
    it("deserializes array of anything", function(){
        class A {
            @dataMember()
            @anyArray()
            array: any[];
        };
        
        var source = { array: ["5", 6, 7, { foo: "bar" }] };

        var result = deserialize(source, A);
        
        expect(result.array).to.not.equal(source.array);
        expect(result.array).to.deep.equal(source.array);
    });
});