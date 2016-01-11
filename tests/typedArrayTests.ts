'use strict';

import chai = require('chai');
import {deserialize, dataMember, typedArray} from '../index';

var expect = chai.expect;

describe("@typedArray(MyClass)", () => {
    it("deserializes array of numbers", function(){
        class A {
            @dataMember()
            @typedArray(Number)
            numberArray: number[];
        };
        
        var source = { numberArray: [5, 6, 7] };

        var result = deserialize(source, A);
        
        expect(result.numberArray).to.not.equal(source.numberArray);
        expect(result.numberArray).to.deep.equal(source.numberArray);
    });
    
    it("deserializes array of strings", function(){
        class A {
            @dataMember()
            @typedArray(String)
            stringArray: string[];
        };
        
        var source = { stringArray: ["sss", "aaa"] };

        var result = deserialize(source, A);
        
        expect(result.stringArray).to.not.equal(source.stringArray);
        expect(result.stringArray).to.deep.equal(source.stringArray);
    });
    
    it("deserializes array of booleans", function(){
        class A {
            @dataMember()
            @typedArray(Boolean)
            booleanArray: boolean[];
        };
        
        var source = { booleanArray: [true, false] };

        var result = deserialize(source, A);
        
        expect(result.booleanArray).to.not.equal(source.booleanArray);
        expect(result.booleanArray).to.deep.equal(source.booleanArray);
    });
    
    it("deserializes array of objects", function(){
        class A {
            @dataMember()
            @typedArray(Object)
            objectArray: Object[];
        };
        
        var source = { objectArray: [{ foo: "bar" }] };

        var result = deserialize(source, A);
        
        expect(result.objectArray).to.not.equal(source.objectArray);
        expect(result.objectArray).to.deep.equal(source.objectArray);
    });
    
    it("deserializes array of constructor functions", function(){
        class B {
            @dataMember()
            foo: string;
            
            prototypeExists: boolean;
        };
        
        class A {
            @dataMember()
            @typedArray(B)
            objectArray: B[];
        };
        
        B.prototype.prototypeExists = true;
        
        var source = { objectArray: [{ foo: "bar" }] };

        var result = deserialize(source, A);
        
        expect(result.objectArray).to.not.equal(source.objectArray);
        expect(result.objectArray.length).to.equal(1);
        expect(result.objectArray[0].foo).to.equal("bar");
        expect(result.objectArray[0].prototypeExists).to.be.true;
    });
});