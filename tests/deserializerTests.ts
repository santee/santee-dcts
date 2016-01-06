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
            public trueValue: boolean;
            
            @dataMember()
            public falseValue: boolean;
        };
        
        var source = { foo: "test", bar: 5, goo: true, falseValue: false };
        
        var result = deserialize(source, A);
        
        expect(result.foo).to.equal("test");
        expect(result.bar).to.equal(5);
        expect(result.trueValue).to.be.true;
        expect(result.falseValue).to.be.false;
    });
    
    it("throws exception if primitive type is not the same as in target object", () => {
        class A {
            @dataMember()
            public foo: string;
        };
        
        var source = { foo: 5 };
        
        expect(() => deserialize(source, A)).to.throw(Error);
    });
    
    it("assigns undefined if property does not exist and no @required decorator specified", () => {
        class A {
            @dataMember()
            public foo: string;
        };
        
        var source = { bar: 5 };
        
        expect(deserialize(source, A).foo).to.be.undefined;
    });
    
    it("allows nulls to be assigned to primitive types", () => {
        class A {
            @dataMember()
            public foo: string;
        };
        
        var source = { foo: <any>null };
        
        var result = deserialize(source, A);
        expect(result.foo).to.equal(null);
    });
    
    it("deserializes simple object fields", () => {
        class A {
            
        };
        
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