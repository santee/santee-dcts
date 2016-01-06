'use strict';

import chai = require('chai');
import {deserialize, dataMember} from '../index';

var expect = chai.expect;

describe("deserialize(obj, constructorFunction)", () => {
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
    
    it("assigns primitive values from sourceObject", () => {
        class A {
            @dataMember()
            public foo: string;
            
            @dataMember()
            public bar: number;
            
            @dataMember("goo")
            public gaz: number;
        }
        
        var source = { foo: "test", bar: 5, goo: 10 };
        
        var result = deserialize(source, A);
        
        expect(result.foo).to.equal("test");
        expect(result.bar).to.equal(5);
        expect(result.gaz).to.equal(10);
    });
});


describe("deserialize(obj, MyClass)", () => {
    it("returns new instance of MyClass", () => {
        class A {
            public bar: string;
        }
        
        var obj = { bar: "space bar" };
        
        var result = deserialize(obj, A);
        
        expect(result).to.be.instanceof(A);
    });
})