'use strict';

import chai = require('chai');
import {deserialize, dataMember, deserializeArray} from '../index';

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
    
    it("throws exception if primitive type passed while target type is constructor function", () => {
        
        class B {
        }
        
        class A {
            @dataMember()
            public foo: B;
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
    
    it("deserializes 'any' fields if plain javascript object passed by deep clonning it", () => {
        class A {
            @dataMember()
            public obj: any;
        };
        
        var source = { obj: { val: "value" } };
        var result = deserialize(source, A);
        
        expect(result.obj).not.equal(source.obj);
        expect(result.obj).is.deep.equal(source.obj);
    });
    
    it("deserializes 'any' fields if primitive object passed by assigning it", () => {
        class A {
            @dataMember()
            public obj: any;
        };
        
        var source = { obj: 5 };
        var result = deserialize(source, A);
        
        expect(result.obj).to.equal(5);
    });
    
    it("deserializes 'Object' fields if plain javascript object passed by deep clonning it", () => {
        class A {
            @dataMember()
            public obj: Object;
        };
        
        var source = { obj: { val: "value" } };
        var result = deserialize(source, A);
        
        expect(result.obj).not.equal(source.obj);
        expect(result.obj).is.deep.equal(source.obj);
    });
    
    it("deserializes explicitly class-typed fields if plain javascript object passed", () => {
        class B {
            @dataMember()
            public foo: string;
            
            @dataMember()
            public boo: number;
        }
        
        class A {
            @dataMember()
            public obj: B;
        };
        
        var source = { obj: { foo: "a", boo: 10 } };
        var result = deserialize(source, A);
        
        expect(result.obj).not.equal(source.obj);
        expect(result.obj).is.deep.equal(source.obj);
        
        expect(result.obj).to.be.instanceof(B);
    });
    
    it("calls constructor for a explicitly class-typed fields", () => {
        var constructorWasCalledTimes = 0;
        
        class B {
            constructor() {
                constructorWasCalledTimes++;
            }
        }
        
        class A {
            @dataMember()
            public obj: B;
        };
        
        var source = { obj: { foo: "a", boo: 10 } };
        var result = deserialize(source, A);
        
        expect(constructorWasCalledTimes).to.equal(1);
        expect(result.obj).to.be.instanceof(B);
    });
    
    it("deserializes interface-typed fields if plain javascript object passed by deep clonning it", () => {
        interface IObj {
            val: string;
        }
        
        class A {
            @dataMember()
            public obj: IObj;
        };
        
        var source = { obj: { val: "value" } };
        var result = deserialize(source, A);
        
        expect(result.obj).not.equal(source.obj);
        expect(result.obj).is.deep.equal(source.obj);
    });
    
    it("deserializes arrays by deep clonning it", () => {
        class A {
            @dataMember()
            public objArray: any[];
            
            @dataMember()
            public numbersArray: number[];
        };
        
        var source = { objArray: ["aa", {}, 30], numbersArray: [20, 30, 40] };
        var result = deserialize(source, A);
        
        expect(result.objArray).not.equal(source.objArray);
        expect(result.objArray).is.deep.equal(source.objArray);
        expect(result.numbersArray).not.equal(source.numbersArray);
        expect(result.numbersArray).is.deep.equal(source.numbersArray);
    });
    
    it("throws error if object passed for array field", () => {
        class A {
            @dataMember()
            public objArray: any[];
        };
        
        var source = { objArray: {foo: "bar"} };
        expect(() => deserialize(source, A)).to.throw(Error);
    });
    
    it("throws error if primitive object passed for array field", () => {
        class A {
            @dataMember()
            public objArray: any[];
        };
        
        var source = { objArray: 5 };
        expect(() => deserialize(source, A)).to.throw(Error);
    });
});


describe("deserialize(obj, MyClass)", () => {
    it("returns new instance of MyClass", () => {
        class A {
            @dataMember()
            public bar: string;
        };
        
        var obj = { bar: "space bar" };
        
        var result = deserialize(obj, A);
        
        expect(result).to.be.instanceof(A);
    });
});


describe("deserializeArray(objArray, MyClass)", () => {
    it ("returns array of MyClass objects", () => {
        class A {
            @dataMember()
            public bar: string;
        };
        
        var array = [ { bar: "space bar" }, { bar: "xxxx"} ];
        
        var result = deserializeArray(array, A);
        
        expect(result.length).to.equal(2);
        expect(result[0]).to.be.instanceof(A);
        expect(result[0].bar).to.equal("space bar");
        expect(result[1]).to.be.instanceof(A);
        expect(result[1].bar).to.equal("xxxx");
    });
});